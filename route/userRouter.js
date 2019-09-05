/*
    일반 유저 라우팅
*/
    var express = require('express');
    var router = express.Router();
    var schema = require('../schema/commonSchema');
    var postSchema = require('../schema/postSchema');
    var postCmtSchema = require('../schema/postCmtSchema');
    var jwt = require('jsonwebtoken');
    var env = require('dotenv');
    var date = require('../myUtils/dateUtils');
    var random = require('../myUtils/randomUtils');

    env.config();

    router.get('/index',function(req,res){
        console.log('/user/index');
        res.redirect('../index.html');
    });

    router.post('/loginCk',function(req, res){
        let params = req.body;
        if(params.usrToken){
            jwt.verify(params.usrToken,process.env.tokenKey,function(err, decoded){
                if(decoded){
                    console.log('★★★ LOGIN CHECK SUCCESS ★★★');
                    res.json({
                        reCd : '01'
                    });
                }else if(err && err.name === "TokenExpiredError"){
                    console.log('★★★ Token 유효기간 만료 ★★★\n');
                    if(!params.autoLoginCd){
                        // autoLogin false일 경우 로그아웃 처리
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

    router.post('/post',function(req, res){
        let params = req.body;
        
        // 사용자 이름으로 id 검색 후 입력
        schema.find({
            wkCd: 'USR',
            wkDtCd : 'USR',
            "subSchema.usrName": params.usrName
        }, function(err, result) {
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            if (result.length > 0) {
                console.log("★★★ login history search result ★★★ \n",result[0]);
                let usrId = result[0].subSchema.usrId;
                postSchema.usrName = params.usrName;
                postSchema.usrId = usrId;
                postSchema.pstPts = params.pstPts;
                postSchema.pstCt  = params.pstCt;
                postSchema.pstHt = params.pstHt;
                postSchema.pstCmt = [];
                postSchema.pstPubYn = params.pstPubYn;
                schema.create({
                    wkCd: 'PST'
                    ,wkDtCd : "PST"
                    ,fstWrDt: date.getDate() // 최초 작성일
                    ,lstWrDt: date.getDate() // 최종 작성일
                    ,subSchema: postSchema
                }).then((result)=>{
                    console.log("★★post success★★\n",result);
                    res.json({
                        reCd: '01'
                    });
                }).catch((err)=>{
                    console.log("★★post fail★★\n",err);
                    res.json({
                        reCd: '02'
                    });
                }); // post close
            }
        }); // find close
    });

    router.post('/postList',function(req, res){

        schema.find({
            wkCd : 'PST',
            wkDtCd : 'PST',
            "subSchema.usrId" : 'phu8460@naver.com'
        }
        , function(err, result) {
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            if (result.length > 0) {
                let postList = [];                

                for(var i=0; i<result.length; i++){
                    let tempPhoto = [];
                    if(result[i].subSchema.pstPts 
                        && result[i].subSchema.pstPts.length >0 ){
                            for(var j=0; j<result[i].subSchema.pstPts.length; j++){
                                let tp = {
                                    // 'src': "require('"+result[i].subSchema.pstPts[j]+"')",
                                    'src': result[i].subSchema.pstPts[j],
                                    'width': 1,
                                    'height': 1 
                                }
                                tempPhoto.push(tp);
                            }
                    }

                    let post ={
                        usrName : result[i].subSchema.usrName
                        ,wrDt : date.getWriteDate(result[i].lstWrDt)
                        ,pstPts : tempPhoto
                        ,pstCt : result[i].subSchema.pstCt
                        ,pstHt : result[i].subSchema.pstHt
                        ,pstCmt : result[i].subSchema.pstCmt
                    };
                    postList.push(post);
                }
                
                res.json({
                    reCd : '01'
                    ,pstList : postList
                });
            }else{
                res.json({
                    reCd : '02'
                });
            }
        });

    });

    router.post('/postCmtWt',function(req, res){
        // var newPw = random.getPk(4);
        
    });

module.exports = router;
