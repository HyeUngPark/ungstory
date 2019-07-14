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
        console.log('/index');
        res.redirect('./index.html');
    });

module.exports = router;
