/*
    회원가입 관련 라우팅
*/
var express = require('express');
var router = express.Router();

var schema = require('../schema/commonSchema');
var userSchema = require('../schema/userSchema');
var loginSchema = require('../schema/loginSchema');
var random = require('../myUtils/randomUtils');
var mail = require('../myUtils/mailUtils');
var encrypt = require('../myUtils/encryptUtils');
var date = require('../myUtils/dateUtils');
let jwt = require("jsonwebtoken");

var env = require('dotenv');
env.config();

// router.use(express.cookieParser());

router.post('/join', function(req, res) {
    var params = req.body;
    console.log('/join() \n',params);
    userSchema.usrId = params.usrId;
    // 암호화 필요
    userSchema.usrPwd = encrypt.getEncrypt(params.usrPwd); 
    userSchema.usrName = params.usrName;
    userSchema.usrSep = "01";
    userSchema.usrPt = "";
    userSchema.usrFrds = [];
    userSchema.usrCert = '00'
    userSchema.usrLikePst = [];
    userSchema.usrBirth = params.usrBirth;

    schema.create({
        wkCd: 'USR'
        ,wkDtCd : "USR"
        ,fstWrDt: date.getDate() // 최초 작성일
        ,lstWrDt: date.getDate() // 최종 작성일
        ,subSchema: userSchema
    }).then((result)=>{
        console.log("★★join success★★\n");
        // 인증메일 발송
        let mailParam={
            toEmail: userSchema.usrId,
            subject: '[웅스토리] 회원가입 인증 메일',
            text: "<html><body>"
                +"<h3>웅스토리 가입 인증 메일입니다.<br></h3>"
                // +"<a href='http://localhost:5000/auth/joinResponse?usrId="+userSchema.usrId+"'><button>인증완료</button></a>"
                +"<a href='https://ungstory.herokuapp.com/auth/joinResponse?usrId="+userSchema.usrId+"'><button>인증완료</button></a>"
                +"</body></html>"
        };
        mail.sendGmail(mailParam);

        res.json({
            reCd: '01'
        });
    }).catch((err)=>{
        console.log("★★join fail★★\n",err);
        res.json({
            reCd: '02'
        });
    });
});

router.get('/joinResponse',function(req, res){
    var params = req.query;
    schema.find({
        wkCd: 'USR'
        ,wkDtCd : "USR"
        ,"subSchema.usrId": params.usrId
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }if (result.length > 0) {
            console.log("★★★ result ★★★ \n");
            
            schema.updateOne({
                "_id" : result[0]._id
            }
            , { $set: {'subSchema.usrCert': '01' } }
            , function(err, result) {
                if (err) {
                    console.log('error \n', err);
                    return res.status(500).send("select error >> " + err)
                }
                if (result.n) {
                    console.log("★★★ 회원가입 인증 result ★★★ \n",result.n);
                    res.send('<script type="text/javascript">'
                             +'alert("회원가입 인증 완료");'
                             +'self.close();'
                             +'</script>');
                } else {
                    console.log("★★★ 회원가입 인증 fail ★★★ \n",result.n);
                    res.send('<script type="text/javascript">'
                            +'alert("회원가입 인증 실패");'
                            +'self.close();'
                            +'</script>');
                        }
                    });
            } else {
            res.send('<script type="text/javascript">'
                    +'alert("회원가입 인증 실패");'
                    +'self.close();'
                    +'</script>');
        }
    });

    

});

router.get('/idCheck', function(req, res) {
    var params = req.query;
    schema.find({
        "wkCd": 'USR',
        "subSchema.usrId": params.usrId
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        console.log("★★★idCheck★★★\n",result);
        if (result.length > 0) {
            res.json({ 
                svCd : params.svCd
                ,reCd : "02"     
            })
        } else {
            res.json({
                svCd : params.svCd
                ,reCd : "01" 
            });
        }
    });
});
router.get('/nameCheck', function(req, res) {
    var params = req.query;
    schema.find({
        "wkCd": 'USR',
        "wkDtCd": 'USR',
        "subSchema.usrName": params.usrName
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        console.log("★★★nameCheck★★★ >> ",result.length ,"\n");
        if (result.length > 0) {
            res.json({ 
                svCd : params.svCd ? params.svCd : ''
               ,reCd : "02" 
            })
        } else {
            res.json({
                svCd : params.svCd ? params.svCd : ''
               ,reCd : '01' 
        });
        }
    });
});

router.post('/login', function(req, res) {
    var params = req.body;

    schema.find({
        wkCd: 'USR',
        wkDtCd :'USR',
        "subSchema.usrId": params.usrId,
        "subSchema.usrPwd": encrypt.getEncrypt(params.usrPwd)
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        console.log("★★★ login ★★★\n");
        if (result.length > 0) {
            if(result[0].subSchema.usrCert === '00'){
                // 미인증 아이디
                console.log('★★★ 인증되지 않은 아이디 ★★★');
                res.json({ "reCd": "03" });
            }else{
                // 성공
                // res.json({ "reCd": '01'});
                let token = jwt.sign({
                    usrId : result[0].subSchema.usrId
                }
                ,process.env.tokenKey ,    // 비밀 키
                {
                    expiresIn: '1h'    // 유효 시간은 5분
                });

                // 로그인 세션처리
                // let session = req.session;
                // session.usrToken = token;
                // console.log('★★★ 로그인 성공 ★★★\n',session);

                // 접속 IP
                var ipAddress;
                var forwardedIpsStr = req.header('x-forwarded-for');
                if(forwardedIpsStr){
                    var forwardedIps = forwardedIpsStr.split(',');
                    ipAddress = forwardedIps[0];
                }else{
                    ipAddress = req.connection.remoteAddress;
                }

                loginSchema.loginToken = token;
                loginSchema.usrId = result[0].subSchema.usrId;
                loginSchema.connIp = ipAddress;
                loginSchema.loginDate = date.getDate();
                // 로그인 내역 추가
                schema.create({
                    wkCd: 'USR'
                    ,wkDtCd : "LOGIN"
                    ,fstWrDt: date.getDate() // 최초 작성일
                    ,lstWrDt: date.getDate() // 최종 작성일
                    ,subSchema: loginSchema
                }).then((loginResult)=>{
                    console.log("★★로그인 내역 등록 성공★★\n",loginResult);
                    res.json({
                        "reCd" : '01',
                        "usrToken" : token,
                        "usrInfo" :{
                            "usrName" : result[0].subSchema.usrName
                            ,"usrPt" : result[0].subSchema.usrPt
                            ,"usrLikePst" : result[0].subSchema.usrLikePst
                        }
                    });       
                }).catch((err)=>{
                    console.log("★★join fail★★\n",err);
                    res.json({
                        reCd: '02'
                    });
                });
            }
        } else {
            res.json({ "reCd": "02" })
        }
    });
});
router.post('/loginCk',function(req, res){
    let params = req.body;
    if(params.usrToken){
        jwt.verify(params.usrToken,process.env.tokenKey,function(err, decoded){
            if(decoded){
                console.log('★★★ LOGIN CHECK SUCCESS ★★★');
                
                // 알람 목록 가져오기
                schema.aggregate([
                    {$match : {
                        wkCd : 'USR'
                        ,wkDtCd : 'USR'
                        ,"subSchema.usrName" :  {$regex:matchQuery}
                    }}
                    ,{$project:{
                        _id : 1
                        ,"subSchema" : 1
                    }}
                ],function(err, result) {
                    let resultList ={
                        reCd : '01'
                    };
                    if (err) {
                        console.log('error \n', err);
                        // return res.status(500).send("알람 조회 실패 >> " + err)
                    }
                    if (result.length > 0) {
                        console.log('★★★ 알람 목록 조회 성공 ★★★');
                        let noticeList = [];
                        noticeList = result;
                        resultList.noticeList = noticeList;
                    }
                    res.json(resultList);
                });

            }else if(err && err.name === "TokenExpiredError"){
                console.log('★★★ Token 유효기간 만료 ★★★\n');
                if(!params.autoLoginCd){
                // autoLogin false일 경우 로그아웃 처리
                    console.log('Token 만료 후 로그아웃 처리');
                    res.json({
                        reCd : '04'
                    });
                }else{
                // token 재생성
                let newToken = jwt.sign({
                    usrName : params.usrName
                    ,mkDate : new Date()
                },process.env.tokenKey ,    // 비밀 키
                {expiresIn: '1h' });
                console.log('★★★ Token 재생성 ★★★\n',newToken);
                
                // 로그인 이력 업데이트
                schema.find({
                    wkCd: 'USR',
                    wkDtCd : 'LOGIN',
                    "subSchema.loginToken": params.usrToken
                }, function(err, result) {
                    if (err) {
                        console.log('error \n', err);
                        return res.status(500).send("select error >> " + err)
                    }
                    if (result.length > 0) {
                        console.log("★★★ login history search result ★★★ \n",result[0]);
                        var _id = result[0]._id;
                        schema.updateOne({
                            "_id" : _id
                        }
                        , { $set: {
                            lstWrDt : date.getDate()
                            ,'subSchema.loginToken': newToken
                        }}
                        , function(err, result) {
                            if (err) {
                                console.log('error \n', err);
                                return res.status(500).send("select error >> " + err)
                            }
                            if (result.n) {
                                console.log("★★★ 토큰 업데이트 성공 result ★★★ \n",result.n);
                                res.json({
                                    reCd : '03'
                                    ,usrToken : newToken
                                });
                            } else {
                                console.log("★★★ 토큰 업데이트 실패 ★★★ \n",result.n);
                            }
                        }); // update close
                    }else{
                        console.log('로그인 내역에 등록되지않은 Token');                            
                    }
                }); // find close
             }
            }
            });
        }else{
        console.log('★★★ 변조되거나 잘못된 Token ★★★');
        res.json({
            reCd : '02'
        });
    }
});

router.post('/logout',function(req,res){
    var params = req.body;
    console.log("★★★logout★★★\n",params.usrToken);
    if(params.usrToken){
        schema.find({
            wkCd: 'USR',
            wkDtCd : 'LOGIN',
            "subSchema.loginToken": params.usrToken
        }, function(err, result) {
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            if (result.length > 0) {
                console.log("★★★ login history search result ★★★ \n",result[0]);
    
                var _id = result[0]._id;

                schema.updateOne({
                    "_id" : _id
                }
                , { $set: {
                    lstWrDt : date.getDate()
                    ,'subSchema.logoutDate': date.getDate()
                }}
                , function(err, result) {
                    if (err) {
                        console.log('error \n', err);
                        return res.status(500).send("select error >> " + err)
                    }
                    if (result.n) {
                        console.log("★★★ 로그아웃 성공 result ★★★ \n",result.n);
                        // 세션파기
                        // req.session.destroy();
                        // res.clearCookie('sid');
                        
                        res.json({
                            reCd : '01'
                        })
                    } else {
                        console.log("★★★ fail ★★★ \n",result.n);
                    }
                });
            } else {
                console.log("★★★ 로그아웃 실패 result ★★★ \n");
                res.json({
                    reCd : '02'
                })
            }
        });
    }
});

router.post('/pwFind',function(req,res){
    var params = req.body;
    var usrId = params.usrId;
    var _id;
    schema.find({
        wkCd: 'USR',
        wkDtCd : 'USR',
        "subSchema.usrId": usrId
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        console.log(result);
        if (result.length > 0) {
            _id = result[0]._id;
            var newPw = random.getRandomPw();
            console.log('pwSearch || ',newPw);
            
            let mailParam={
                toEmail : usrId
                ,subject  : '웅스토리 비밀번호 초기화'
                ,text: "<html><body>"
                    +'초기화 된 비밀번호는 '+newPw+' 입니다. 로그인 후 변경하시기 바랍니다.'
                    +"</body></html>"
            };
            mail.sendGmail(mailParam);
            // 비밀번호 업데이트
            schema.updateOne({
                "_id" : _id
            }
            , { $set: {'subSchema.usrPwd': encrypt.getEncrypt(newPw) } }
            , function(err, result) {
                if (err) {
                    console.log('error \n', err);
                    return res.status(500).send("select error >> " + err)
                }
                if (result.n) {
                    console.log("★★★ result ★★★ \n",result.n);
                    res.json({ "reCd": '01'});
                } else {
                    console.log("★★★ fail ★★★ \n",result.n);
                    res.json({ "reCd": "02" })
                }
            });
        } else {
            res.json({ "reCd": "03" });
        }
    });
});


module.exports = router;