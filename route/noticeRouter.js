/* 
    알람 관련 라우팅
*/

var express = require('express'); 
var router = express.Router();

var schema = require('../schema/commonSchema');
var ntSchema =  require('../schema/noticeSchema');

var date = require('../myUtils/dateUtils');

var env = require('dotenv');
env.config();

router.put('/frdNotClear',function(req,res){
    var params = req.body;
    // 0. 클릭 시점 친구 알림 0으로 변경
    schema.updateMany({
        wkCd : 'NOT'
        ,wkDtCd : 'FRD'
        ,fstWrDt:{"$lte":date.getDate()}
        ,"subSchema.usrName" : params.usrName
    }
    , { $set: {
        lstWrDt : date.getDate()
        ,'subSchema.readYn': true
    }}
    , function(uErr, uResult) {
        if (uErr) {
            console.log('error \n', uErr);
            return res.status(500).send("친구 목록 클릭 시 알림 변경 실패 " + uErr)
        }
        if (uResult.n) {
            console.log('★★★ 알람 0으로 변경 성공 ★★★');
        }else{
            console.log('★★★ 알람 변경 대상 없음 ★★★');
        }
        res.json({
            reCd : '01'
        });
    });
});

router.post('/getNoticeList',function(req, res){
     // 알람 목록 가져오기
     var params = req.body;
     console.log('★★★ 알람 목록 다시 가져오기 ★★★');
     schema.aggregate([
        {$facet:{    
            frdNotice : [
                {$match : {
                    wkCd : 'NOT'
                    ,wkDtCd : "FRD"
                    ,"subSchema.usrName" :  params.usrName
                    ,"subSchema.readYn" : false
                }}
                ,{ $group: { 
                    _id: null, 
                    count: { $sum: 1 } 
                }}
                ,{ $project: { 
                    _id: 0 
                }}
                ]
            ,pstNotice : [
                {$match : {
                    wkCd : 'NOT'
                    ,wkDtCd : "PST"
                    ,"subSchema.usrName" :  params.usrName 
                    ,"subSchema.readYn" : false
                }}
                ,{ $group: { 
                    _id: null, 
                    count: { $sum: 1 } 
                }}
                ,{ $project: { 
                    _id: 0 
                }}
            ]
            ,msgNotice : [
                {$match : {
                    wkCd : 'NOT'
                    ,wkDtCd : "MSG"
                    ,"subSchema.usrName" :  params.usrName 
                    ,"subSchema.readYn" : false
                }}
                ,{ $group: { 
                    _id: null, 
                    count: { $sum: 1 } 
                }}
                ,{ $project: { 
                    _id: 0 
                }}
            ]
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
            console.log('★★★ 알람 목록 조회 성공 ★★★ \n',result.length);
            let noticeList = {};
            result[0].frdNotice.length> 0 ? noticeList.frdNotice = result[0].frdNotice[0].count : noticeList.frdNotice =0;
            result[0].pstNotice.length> 0 ? noticeList.pstNotice = result[0].pstNotice[0].count : noticeList.pstNotice =0;
            result[0].msgNotice.length> 0 ? noticeList.msgNotice = result[0].msgNotice[0].count : noticeList.msgNotice =0;
            resultList.noticeList = noticeList;
        }else{
            resultList.reCd = '02';
        }
        res.json(resultList);
    });

});

module.exports = router;