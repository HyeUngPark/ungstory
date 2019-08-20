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

    schema.create({
        wkCd: 'USR'
        ,WkDtCd : "USR"
        ,fstWrDt: date.getDate() // 최초 작성일
        ,lstWrDt: date.getDate() // 최종 작성일
        ,subSchema: userSchema
    }).then((result)=>{
        console.log("★★join success★★\n",result);
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
        ,WkDtCd : "USR"
        ,"subSchema.usrId": params.usrId
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }if (result.length > 0) {
            console.log("★★★ result ★★★ \n",result[0]);
            
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
        "subSchema.usrName": params.usrName
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        console.log("★★★nameCheck★★★\n",result);
        if (result.length > 0) {
            res.json({ 
                svCd : params.svCd
               ,reCd : "02" 
            })
        } else {
            res.json({
                svCd : params.svCd
               ,reCd : '01' 
        });
        }
    });
});

router.post('/login', function(req, res) {
    var params = req.body;

    schema.find({
        wkCd: 'USR',
        WkDtCd :'USR',
        "subSchema.usrId": params.usrId,
        "subSchema.usrPwd": encrypt.getEncrypt(params.usrPwd)
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        console.log("★★★ login ★★★\n",result);
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
                    // expiresIn: '5m'    // 유효 시간은 5분
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
                    ,WkDtCd : "LOGIN"
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
    var params = req.body;
    // if(session.usrToken && session.usrToken === params.usrToken){
    if(jwt.verify(params.usrToken,process.env.tokenKey)){
        console.log('★★★ LOGIN CHECK SUCCESS ★★★');
        res.json({
            reCd : '01'
        })
    }else{
        console.log('★★★ LOGIN CHECK FAIL ★★★');
        res.json({
            reCd : '02'
        })
    }
})

router.post('/logout',function(req,res){
    let session = req.session;
    console.log("★★★logout★★★\n",session.usrToken);
    if(session.usrToken){
        schema.find({
            wkCd: 'USR',
            WkDtCd : 'LOGIN',
            "subSchema.loginToken": session.usrToken
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
                        req.session.destroy();
                        res.clearCookie('sid');
                        res.json({
                            reCd : '01'
                        })
                    } else {
                        console.log("★★★ fail ★★★ \n",result.n);
                    }
                });
            } else {
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
        WkDtCd : 'USR',
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