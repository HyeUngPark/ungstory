/*
    일반 유저 라우팅
*/
    var express = require('express');
    var router = express.Router();
    var commonSchema = require('../schema/commonSchema');
    var userSchema = require('../schema/userSchema');
    var random = require('../myUtils/randomUtils');
    var mail = require('../myUtils/mailUtils');

    router.get('/index',function(req,res){
        console.log('/user/index');
        res.redirect('../index.html');
    });

    router.post('/loginCk',function(req, res){
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
    })
module.exports = router;
