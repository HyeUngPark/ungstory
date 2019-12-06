/*
    메시지 관련 라우팅
*/

var express = require('express');
var router = express.Router();

var schema = require('../schema/commonSchema');
var msgSchema = require('../schema/messageSchema');

var date = require('../myUtils/dateUtils');

var env = require('dotenv');
env.config();

router.msgSend = (msgInfo) =>{
    // msg 저장
    msgSchema.msgSend.usrName = msgInfo[0];
    msgSchema.msgSend.delDate = '';
    msgSchema.msgRecv.usrName = msgInfo[1];
    msgSchema.msgRecv.delDate = '';
    msgSchema.msgConent = msgInfo[2];
    msgSchema.msgDate = date.getDate();
    schema.create({
        wkCd: 'MSG'
        ,wkDtCd : "MSG"
        ,fstWrDt: date.getDate() // 최초 작성일
        ,lstWrDt: date.getDate() // 최종 작성일
        ,subSchema: msgSchema
    }).then((result)=>{
        console.log("★★ msg send save success ★★\n");
        /*
        ntSchema.noticeCt = '친구 요청';
        ntSchema.usrName = params.frdRes;
        ntSchema.readYn = false;

        schema.create({
            wkCd: 'NOT'
            ,wkDtCd : "FRD"
            ,fstWrDt: date.getDate() // 최초 작성일
            ,lstWrDt: date.getDate() // 최종 작성일
            ,subSchema: ntSchema
        }).then((result)=>{
            console.log("★★ friend notice adding success ★★\n");
            res.json({
                reCd: '01'
            });
        }).catch((err)=>{
            console.log("★★★ friend request fail ★★★\n",err);
            res.json({
                reCd: '02'
            });
        });
        */
        return '01';
    }).catch((err)=>{
        console.log("★★★ msg send save fail ★★★\n",err);
        return '02';
    });
}

router.post('/msgSearch',function(req, res){
    var params = req.body;
    

});
module.exports = router;