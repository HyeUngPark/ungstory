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

router.msgNotAdd = (msgInfo) =>{
    ntSchema.usrName = msgInfo[1];
    ntSchema.noticeCt = msgInfo[0];
    ntSchema.readYn=false;
    ntSchema.delYn=false;

    schema.create({
        wkCd: 'NOT'
        ,wkDtCd : "MSG"
        ,fstWrDt: date.getDate() // 최초 작성일
        ,lstWrDt: date.getDate() // 최종 작성일
        ,subSchema: ntSchema
    }).then((result)=>{
        console.log("★★ msgNotAdd success ★★\n",result);
        return 01;
        
    }).catch((err)=>{
        console.log("★★ msgNotAdd fail ★★\n",err);
        return 02;
    }); 

};

router.frdNotAdd = (frdInfo) =>{
    ntSchema.readYn=false;
    ntSchema.noticeCt=frdInfo.frdReq;
    ntSchema.usrName=frdInfo.frdRes;
    ntSchema.delYn=false;

    schema.create({
        wkCd: 'NOT'
        ,wkDtCd : "FRDY"
        ,fstWrDt: date.getDate() // 최초 작성일
        ,lstWrDt: date.getDate() // 최종 작성일
        ,subSchema: ntSchema
    }).then((result)=>{
        console.log("★★ frdNotAdd success ★★\n",result);
        return 01;
    }).catch((err)=>{
        console.log("★★ frdNotAdd fail ★★\n",err);
        return 02;
    }); 
};

router.pstNotAdd = (frdList, usrName) =>{
    var insertList = [];
    for(let i=0; i<frdList.length; i++){
        let frdTemp = {
            wkCd: 'NOT'
            ,wkDtCd : "PST"
            ,fstWrDt: date.getDate() // 최초 작성일
            ,lstWrDt: date.getDate() // 최종 작성일
            ,subSchema: {
                readYn : false,
                delYn : false,
                noticeCt : usrName, // 친구
                usrName : frdList[i] // 친구들
            }
        }
        insertList.push(frdTemp);
    }
    schema.create(insertList).then((result)=>{
        console.log("★★ pstNotAdd success ★★\n",result);
        return 01;
    }).catch((err)=>{
        console.log("★★ pstNotAdd fail ★★\n",err);
        return 02;
    }); 
};

router.actNotAdd = (activeInfo) =>{
    ntSchema.readYn=false;
    ntSchema.noticeCt=activeInfo.noticeCt; // 좋아요/댓글 작성자
    ntSchema.usrName=activeInfo.usrName; // 게시글 작성자
    ntSchema.delYn=false;

    schema.create({
        wkCd: 'NOT'
        ,wkDtCd : activeInfo.wkDtCd // COMM(댓글), LIKE(좋아요)
        ,fstWrDt: date.getDate() // 최초 작성일
        ,lstWrDt: date.getDate() // 최종 작성일
        ,subSchema: ntSchema
    }).then((result)=>{
        console.log("★★ actNotAdd success ★★\n",result);
        return 01;
    }).catch((err)=>{
        console.log("★★ actNotAdd fail ★★\n",err);
        return 02;
    }); 
};

router.getNotice = (usrName, callback) =>{
    schema.aggregate([
        {$facet:{    
            frdNotice : [
                {$match : {
                    wkCd : 'NOT'
                    ,wkDtCd : "FRD"
                    ,"subSchema.usrName" :  usrName
                    ,"subSchema.readYn" : false
                }}
                ,{ $project: { 
                    _id: 1 
                    ,"subSchema.readYn" : 1
                    ,"subSchema.delYn" : 1
                    ,"wkDtCd" : 1
                    ,"subSchema.usrName" : 1
                    ,"subSchema.noticeCt" : 1
                }}
                ,{ $group: { 
                    _id: '$_id'
                    ,'delYn' : {"$first" : "$subSchema.delYn"}
                    ,'readYn' : {"$first" : "$subSchema.readYn"}
                    ,'wkDtCd' : {"$first" : "$wkDtCd"}
                    ,'usrName' : {"$first" : "$subSchema.usrName"}
                    ,'noticeCt' : {"$first" : "$subSchema.noticeCt"}
                }}
            ]
            ,msgNotice : [
                {$match : {
                    wkCd : 'NOT'
                    ,wkDtCd : "MSG"
                    ,"subSchema.usrName" :  usrName
                    ,"subSchema.readYn" : false
                }}
                ,{ $project: { 
                    _id: 1 
                    ,"subSchema.readYn" : 1
                    ,"subSchema.delYn" : 1
                    ,"wkDtCd" : 1
                    ,"subSchema.usrName" : 1
                    ,"subSchema.noticeCt" : 1
                }}
                ,{ $group: { 
                    _id: '$_id'
                    ,'delYn' : {"$first" : "$subSchema.delYn"}
                    ,'readYn' : {"$first" : "$subSchema.readYn"}
                    ,'wkDtCd' : {"$first" : "$wkDtCd"}
                    ,'usrName' : {"$first" : "$subSchema.usrName"}
                    ,'noticeCt' : {"$first" : "$subSchema.noticeCt"}
                }}
            ]
            ,actNotice : [
                 {$match : {
                    wkCd : 'NOT'
                    ,wkDtCd : {$in : ['COMM','LIKE',"PST", "FRDY"]}
                    ,"subSchema.usrName" :  usrName
                    ,"subSchema.readYn" : false
                }}
                ,{ $project: { 
                    _id: 1 
                    ,"subSchema.readYn" : 1
                    ,"subSchema.delYn" : 1
                    ,"wkDtCd" : 1
                    ,'lstWrDt' : 1
                    ,"subSchema.usrName" : 1
                    ,"subSchema.noticeCt" : 1
                }}
                ,{ $group: { 
                    _id: '$_id'
                    ,'delYn' : {"$first" : "$subSchema.delYn"}
                    ,'readYn' : {"$first" : "$subSchema.readYn"}
                    ,'wkDtCd' : {"$first" : "$wkDtCd"}
                    ,'usrName' : {"$first" : "$subSchema.usrName"}
                    ,'noticeCt' : {"$first" : "$subSchema.noticeCt"}
                    ,'lstWrDt' : {"$first" : "$lstWrDt"}
                }}
                ,{$sort:{
                    'lstWrDt' : -1
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
            console.log('★★★ 알람 목록 조회 성공 ★★★ \n');
            let noticeCount = {};
            result[0].frdNotice.length> 0 ? noticeCount.frdNotice = result[0].frdNotice.length : noticeCount.frdNotice =0;
            result[0].msgNotice.length> 0 ? noticeCount.msgNotice = result[0].msgNotice.length : noticeCount.msgNotice =0;
            if(result[0].actNotice.length> 0 ){
                noticeCount.actNotice = result[0].actNotice.length;
                resultList.actNotice = result[0].actNotice;
            }else{
                noticeCount.actNotice =0;
            }
            resultList.noticeCount = noticeCount;

        }
        callback(resultList);
    });
}

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
                ,{ $project: { 
                    _id: 1 
                    ,"subSchema.readYn" : 1
                    ,"subSchema.delYn" : 1
                    ,"wkDtCd" : 1
                    ,"subSchema.usrName" : 1
                    ,"subSchema.noticeCt" : 1
                }}
                ,{ $group: { 
                    _id: '$_id'
                    ,'delYn' : {"$first" : "$subSchema.delYn"}
                    ,'readYn' : {"$first" : "$subSchema.readYn"}
                    ,'wkDtCd' : {"$first" : "$wkDtCd"}
                    ,'usrName' : {"$first" : "$subSchema.usrName"}
                    ,'noticeCt' : {"$first" : "$subSchema.noticeCt"}
                }}
            ]
            ,msgNotice : [
                {$match : {
                    wkCd : 'NOT'
                    ,wkDtCd : "MSG"
                    ,"subSchema.usrName" :  params.usrName
                    ,"subSchema.readYn" : false
                }}
                ,{ $project: { 
                    _id: 1 
                    ,"subSchema.readYn" : 1
                    ,"subSchema.delYn" : 1
                    ,"wkDtCd" : 1
                    ,"subSchema.usrName" : 1
                    ,"subSchema.noticeCt" : 1
                }}
                ,{ $group: { 
                    _id: '$_id'
                    ,'delYn' : {"$first" : "$subSchema.delYn"}
                    ,'readYn' : {"$first" : "$subSchema.readYn"}
                    ,'wkDtCd' : {"$first" : "$wkDtCd"}
                    ,'usrName' : {"$first" : "$subSchema.usrName"}
                    ,'noticeCt' : {"$first" : "$subSchema.noticeCt"}
                }}
            ]
            ,actNotice : [
                 {$match : {
                    wkCd : 'NOT'
                    ,wkDtCd : {$in : ['COMM','LIKE',"PST", "FRDY"]}
                    ,"subSchema.usrName" :  params.usrName
                    ,"subSchema.readYn" : false
                }}
                ,{ $project: { 
                    _id: 1 
                    ,"subSchema.readYn" : 1
                    ,"subSchema.delYn" : 1
                    ,"wkDtCd" : 1
                    ,'lstWrDt' : 1
                    ,"subSchema.usrName" : 1
                    ,"subSchema.noticeCt" : 1
                }}
                ,{ $group: { 
                    _id: '$_id'
                    ,'delYn' : {"$first" : "$subSchema.delYn"}
                    ,'readYn' : {"$first" : "$subSchema.readYn"}
                    ,'wkDtCd' : {"$first" : "$wkDtCd"}
                    ,'usrName' : {"$first" : "$subSchema.usrName"}
                    ,'noticeCt' : {"$first" : "$subSchema.noticeCt"}
                    ,'lstWrDt' : {"$first" : "$lstWrDt"}
                }}
                ,{$sort:{
                    'lstWrDt' : -1
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
            let noticeCount = {};
            result[0].frdNotice.length> 0 ? noticeCount.frdNotice = result[0].frdNotice.length : noticeCount.frdNotice =0;
            result[0].msgNotice.length> 0 ? noticeCount.msgNotice = result[0].msgNotice.length : noticeCount.msgNotice =0;
            if(result[0].actNotice.length> 0 ){
                noticeCount.actNotice = result[0].actNotice.length;
                resultList.actNotice = result[0].actNotice;
            }else{
                noticeCount.actNotice =0;
            }
            resultList.noticeCount = noticeCount;
        }else{
            resultList.reCd = '02';
        }
        res.json(resultList);
    });
});

    router.post('/msgNotAdd', function(req, res){
        var params = req.body;
        ntSchema.noticeCt = params.notCt;
        ntSchema.usrName = params.usrName;
        ntSchema.readYn = false;
        ntSchema.delYn=false;

        schema.create({
            wkCd: 'NOT'
            ,wkDtCd : "MSG"
            ,fstWrDt: date.getDate() // 최초 작성일
            ,lstWrDt: date.getDate() // 최종 작성일
            ,subSchema: ntSchema
        }).then((result)=>{
            console.log("★★★★ 메시지 알람 추가 성공 ★★★★\n",result);
            res.json({
                reCd: '01'
            });
        }).catch((err)=>{
            console.log("★★★★ 메시지 알람 추가 실패 ★★★★\n",err);
            res.json({
                reCd : '02'
            });
        });

    });

module.exports = router;