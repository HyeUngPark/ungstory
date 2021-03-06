/*
    메시지 관련 라우팅
*/

var express = require('express');
var router = express.Router();

var schema = require('../schema/commonSchema');
var msgSchema = require('../schema/messageSchema');
var msgStateSchema = require('../schema/messageStateSchema');

var date = require('../myUtils/dateUtils');

var env = require('dotenv');
env.config();

router.msgSend = (msgInfo) =>{
    // msg 저장
    var msgSend = msgInfo[0];
    var msgRecv = msgInfo[1];
    var msgContent = msgInfo[2];

    msgSchema.msgSend = msgSend;
    msgSchema.msgRecv = msgRecv;
    msgSchema.msgContent = msgContent;
    schema.create({
        wkCd: 'MSG'
        ,wkDtCd : "MSG"
        ,fstWrDt: date.getDate() // 최초 작성일
        ,lstWrDt: date.getDate() // 최종 작성일
        ,subSchema: msgSchema
    }).then((result)=>{
        console.log("★★ msg send save success ★★\n");
        // 메시지 상태가 존재하지 않을 경우 발신자 수신자 상태추가

        schema.find({
            wkCd:'MSG'
            ,wkDtCd:'STA'
            ,'subSchema.usrName': msgSend
            ,'subSchema.msgPartner': msgRecv
        },function(fErr, fResult){
            if (fErr) {
                console.log('error \n', err);
                return res.status(500).send("message state select error >> " + err)
            }
            if (fResult.length === 0) {
                var msgStateSchema1 = {};
                var msgStateSchema2 = {};
                //1. 발신자
                msgStateSchema.usrName = msgSend;
                msgStateSchema.msgPartner = msgRecv;
                msgStateSchema.msgDelDate = '';
                msgStateSchema1 = JSON.parse(JSON.stringify(msgStateSchema));
                //2. 수신자
                msgStateSchema.usrName = msgRecv;
                msgStateSchema.msgPartner = msgSend;
                msgStateSchema.msgDelDate = '';
                msgStateSchema2 = JSON.parse(JSON.stringify(msgStateSchema));
                schema.insertMany([
                {
                    wkCd: 'MSG'
                    ,wkDtCd : "STA"
                    ,fstWrDt: date.getDate() // 최초 작성일
                    ,lstWrDt: date.getDate() // 최종 작성일
                    ,subSchema: msgStateSchema1
                }
                ,{
                    wkCd: 'MSG'
                    ,wkDtCd : "STA"
                    ,fstWrDt: date.getDate() // 최초 작성일
                    ,lstWrDt: date.getDate() // 최종 작성일
                    ,subSchema: msgStateSchema2
                }
                ]).then((result)=>{
                    console.log("★★★ msg state save success ★★★\n");
                    return '01';
                }).catch((err)=>{
                    console.log("★★★ msg state save fail ★★★\n",err);
                    return '02';
                });
            }else{
                return '01';
            }
        });
        
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
    }).catch((err)=>{
        console.log("★★★ msg send save fail ★★★\n",err);
        return '02';
    });
}

router.post('/msgSearch',function(req, res){
    var params = req.body;
    schema.aggregate([
        {$match:{
            wkCd:'MSG'
            ,wkDtCd:'STA'
            ,'subSchema.usrName' : params.usrName
            ,'subSchema.msgPartner' : params.searchName
        }}
        ,{$project:{
            _id : 1,
            'subSchema.msgPartner' : 1
            ,'subSchema.msgDelDate' : 1    
        }}
        ,{$group:{
            _id : '$_id',
            'msgPartner' : {'$first' : '$subSchema.msgPartner'}
            ,'msgDelDate' : {'$first' : '$subSchema.msgDelDate'}
        }}
    ],function(stErr, stResult){
        if (stErr) {
            console.log('error \n', stErr);
            return res.status(500).send("메시지 조회 실패 >> " + err)
        }

        var matchQuery = {
            wkCd : 'MSG'
            ,wkDtCd : 'MSG'
            ,$or:[
                {$and:[
                    {"subSchema.msgSend" : params.usrName}
                    ,{"subSchema.msgRecv" : params.searchName}
                ]}
                ,{$and:[
                    {"subSchema.msgRecv" : params.usrName}
                    ,{"subSchema.msgSend" : params.searchName}
                ]}
            ]
        }
        if (stResult.length > 0) {
            if(stResult[0].msgDelDate !==''){
                // matchQuery['fstWrDt'] = {$gte : {$toDate:stResult[0].msgDelDate}};
                matchQuery['fstWrDt'] = {$gte : new Date(stResult[0].msgDelDate)};
            }
        }
        // matchQuery = JSON.parse(matchQuery);

        schema.updateMany({
            wkCd : 'NOT'
            ,wkDtCd : 'MSG'
            ,fstWrDt:{"$lte":date.getDate()}
            ,"subSchema.usrName" : params.usrName
            ,"subSchema.noticeCt" : params.searchName
            ,'subSchema.readYn' : false
        }
        , { $set: {
            lstWrDt : date.getDate()
            ,'subSchema.readYn': true
        }}
        , function(uErr, uResult) {
            if (uErr) {
                console.log('error \n', uErr);
                return res.status(500).send("메시지 읽기 처리 실패 " + uErr)
            }
            if (uResult.n) {
                console.log('★★★ 메시지 읽기 처리 성공 ★★★');
            }else{
                console.log('★★★ 메시지 읽기 처리할 대상 없음 ★★★');
            }
            schema.aggregate([
                {$match : 
                  matchQuery 
                }
                ,{$project:{
                    _id : 1
                    ,"subSchema.usrFrds" : 1
                    ,"subSchema.msgSend" : 1
                    ,"subSchema.msgRecv" : 1
                    ,"subSchema.msgContent" : 1
                    ,"subSchema.msgDate" : 1
                    ,"fstWrDt" :1
                }}
                ,{$group:{
                    _id : "$_id"
                    ,"msgSend" : {"$first":"$subSchema.msgSend"}
                    ,"msgRecv" : {"$first":"$subSchema.msgRecv"}
                    ,"msgContent" : {"$first":"$subSchema.msgContent"}
                    ,"msgDate" : {"$max":"$fstWrDt"}
                }}
                ,{$sort:{
                    'msgDate' : 1
                }}
            ],function(err, result){
                if (err) {
                    console.log('error \n', err);
                    return res.status(500).send("내 메시지 리스트 조회 실패 >> " + err)
                }
                console.log(result);
                if (result.length > 0) {
                    for(let i=0; i<result.length; i++){
                        let temp=result[i];
                        temp.msgDate = date.dateFormat(result[i].msgDate,'YYYY-MM-DD hh:mm:ss');
                        result[i] = temp;
                    }
                    res.json({
                        reCd : '01'
                        ,msgList : result
                    }); 
                }else{
                    // 메시지 없음
                    res.json({
                        reCd : '03'
                    });
                }
            });
        });
    });
});

router.post('/msgList',function(req,res){
    var params = req.body;

    var stRs;
    schema.aggregate([
        {$match:{
            wkCd:'MSG'
            ,wkDtCd:'STA'
            ,'subSchema.usrName' : params.usrName
        }}
        ,{$project:{
            _id : 1,
            'subSchema.msgPartner' : 1
            ,'subSchema.msgDelDate' : 1    
        }}
        ,{$group:{
            _id : '$_id',
            'msgPartner' : {'$first' : '$subSchema.msgPartner'}
            ,'msgDelDate' : {'$first' : '$subSchema.msgDelDate'}
        }}
    ],function(stErr, stResult){
        if (stErr) {
            console.log('error \n', stErr);
            return res.status(500).send("메시지 조회 실패 >> " + err)
        }
        if (stResult.length > 0) {
            stRs = stResult;
            var msgPartner =[];
            for(let i=0; i<stResult.length; i++){
                msgPartner.push(stResult[i].msgPartner);
            }

            schema.aggregate([
                {$facet:{
                    usrInfo : [
                        {$match:{
                            wkCd : 'USR'
                            ,wkDtCd : 'USR'
                            ,'subSchema.usrName' : {$in:msgPartner}
                        }}
                        ,{$project:{
                            _id : 1
                            ,'subSchema.usrName' : 1
                            ,'subSchema.usrPt' : 1
                        }}
                        ,{$group:{
                            _id : "$_id"
                            ,'usrName' : {'$first':'$subSchema.usrName'}
                            ,'usrPt' : {'$first':'$subSchema.usrPt'}
                        }}
                    ]
                    ,msgList : [
                        {$match:{
                            wkCd : 'MSG'
                            ,wkDtCd : 'MSG'
                            ,$or:[
                                {$and:[
                                  {"subSchema.msgRecv" : params.usrName}
                                  ,{"subSchema.msgSend" : {$in : msgPartner}}
                                ]}
                                ,{$and:[
                                  {"subSchema.msgSend" : params.usrName}
                                  ,{"subSchema.msgRecv" : {$in : msgPartner}}
                                ]}
                            ]
                        }}
                        ,{$addFields: {
                            msgPartner : {
                                $cond:
                                    [{$eq:['$subSchema.msgSend',params.usrName]}
                                        ,'$subSchema.msgRecv'
                                        ,'$subSchema.msgSend'
                                    ]
                            }
                        }}
                        ,{$project:{
                            _id : 0
                            ,'msgPartner' : 1
                            ,"subSchema.msgSend" :1
                            ,"subSchema.msgRecv" :1
                            ,"subSchema.msgContent" :1
                            ,"fstWrDt" :1
                        }}
                        ,{$group:{
                            _id : "$msgPartner"
                            ,'msgPartner' : {'$first':'$msgPartner'}
                            ,'msgSend' : {'$first':'$subSchema.msgSend'}
                            ,'msgDate' : {'$max' : '$fstWrDt'}
                            ,'msgRecv' : {'$first':'$subSchema.msgRecv'}
                            ,'msgContent' : {'$last' : '$subSchema.msgContent'}
                        }}
                        ,{$sort:{
                            'msgDate' : -1
                        }}
                    ]
                    ,msgNot : [
                        {$match:{
                            wkCd : 'NOT'
                            ,wkDtCd : 'MSG'
                            ,"subSchema.usrName" : params.usrName
                            ,"subSchema.noticeCt" : {$in : msgPartner}
                            ,"subSchema.readYn" : false
                        }}
                        ,{$project:{
                            _id : 1
                            ,"fstWrDt" :1
                            ,'subSchema.noticeCt' : 1
                            ,"subSchema.usrName" : 1
                            ,"subSchema.readYn" : {
                                $cond:[
                                    "$subSchema.readYn"
                                    ,0
                                    ,1
                                ]
                            }
                        }}
                        ,{$sort:{
                            'fstWrDt' : -1
                        }}
                        ,{$group:{
                            _id : "$subSchema.noticeCt"
                            ,'noticeCt' : {'$first':'$subSchema.noticeCt'}
                            ,'usrName' : {'$first':'$subSchema.usrName'}
                            ,'notDate' : {'$first' : '$fstWrDt'}
                            ,'notCount' : {'$sum':'$subSchema.readYn'}
                        }}
                    ]
                }}
            ],function(msgErr, msgResult){
                if (msgErr) {
                    console.log('error \n', msgErr);
                    return res.status(500).send("메시지 리스트 조회 실패 >> " + err)
                }
                if (msgResult.length > 0) {
                    console.log('메시지 리스트 조회 성공 >> ',stRs);
                    var msgList = msgResult[0].msgList;
                    var usrInfo = msgResult[0].usrInfo;
                    var msgNot = msgResult[0].msgNot;

                    var delList = [];
                    for(let ii=0; ii<msgList.length; ii++){
                        for(let ll=0; ll<stRs.length; ll++){
                            if(stRs[ll].msgDelDate 
                                && stRs[ll].msgPartner === msgList[ii]._id
                                && new Date(stRs[ll].msgDelDate) > new Date(msgList[ii].msgDate)
                            ){
                                if(delList.indexOf(ii) <0){
                                    console.log(ii,' 마지막 메시지 날짜 >> ', new Date(msgList[ii].msgDate));
                                    console.log(ii,' 메시지 숨김 처리 >> ',msgList[ii].msgContent);
                                    console.log(ii,' 삭제 날짜 >> ', new Date(stRs[ll].msgDelDate));
                                    delList.indexOf(ii) <0 ?  delList.push(ii) : '';
                                }
                            }
                        }

                        for(let jj=0; jj<usrInfo.length; jj++){
                            if(msgList[ii]._id === usrInfo[jj].usrName){
                                let temp = msgList[ii];
                                temp.usrPt = usrInfo[jj].usrPt;
                                msgList[ii] = temp;
                            }
                        }
                        for(let kk = 0; kk<msgNot.length; kk++){
                            if(msgList[ii]._id === msgNot[kk]._id){
                                let temp = msgList[ii];
                                temp.msgNot = msgNot[kk].notCount;
                                msgList[ii] = temp;
                            }
                        }
                        let temp = msgList[ii];
                        temp.checked = false;
                        temp.msgDate = date.getWriteDate(temp.msgDate);
                        msgList[ii] = temp;
                    }
                    if(delList.length>0){
                        delList.sort(function(a, b){
                            return b - a;
                        });
                        for(var i=0; i<delList.length; i++){
                            let temp = msgList;
                            temp.splice(delList[i],1);
                            msgList = temp;
                        }
                    }
                    
                    res.json({
                        reCd : '01'
                        ,msgList : msgList
                    });

                }else{
                    res.json({
                        reCd : '01'
                    });
                }
            });            


        }else{
            console.log('★★★ 메시지 없음 ★★★');
            res.json({
                reCd : '03'
            });
        }
    });
});

router.put('/msgDelete',function(req, res){
    let params = req.body;

    schema.update({
        wkCd : 'MSG'
        ,wkDtCd : 'STA'
        ,'subSchema.usrName' : params.usrName
        ,'subSchema.msgPartner' : {$in : params.delMsg}
    }
    , { $set: {
        lstWrDt : date.getDate()
        ,'subSchema.msgDelDate': date.getDate()
    }}
    , function(fErr, fResult) {
        if (fErr) {
            console.log('message delete error \n', fErr);
            return res.status(500).send("메시지 삭제 실패 " + fErr)
        }
        if (fResult.n) {
            console.log(params.delMsg.length,'명 메시지 삭제 완료');
            res.json({
                reCd : '01'
            });
        }else{
            res.json({
                reCd : '02'
            });
        }
    });
});

module.exports = router;