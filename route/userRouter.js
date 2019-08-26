/*
    일반 유저 라우팅
*/
    var express = require('express');
    var router = express.Router();
    var schema = require('../schema/commonSchema');
    var jwt = require('jsonwebtoken');
    var env = require('dotenv');
    var date = require('../myUtils/dateUtils');

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
                        WkDtCd : 'LOGIN',
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
        /*
        var params = req.body;
        let session = req.session;
        // console.log('params token ', params.usrToken);
        // console.log('session token ', session.usrToken);
        if(session.usrToken && session.usrToken === params.usrToken){
            console.log("★★★login Session Check LOGIN★★★");
            res.json({
                reCd : '01'
            })
        }else{
            console.log("★★★login Session Check NOT LOGIN★★★");
            res.json({
                reCd : '02'
            })
        }   
*/
    });

module.exports = router;
