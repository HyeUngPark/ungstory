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
                return res.status(500).send("mewssage state select error >> " + err)
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
                    console.log("★★★ msg state save success ★★★\n",result);
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
        {$match : {
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
        }}
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

router.post('/msgList',function(req,res){
    var params = req.body;
    schema.aggregate([
        {$match:{
            wkCd:'MSG'
            ,wkDtCd:'STA'
            ,'subSchema.usrName' : params.usrName
        }}
        ,{$project:{
            _id : 1,
            'subSchema.msgPartner' : 1
            ,'subSchema.msgDelDate' : {
                $cond : [
                    {$or : [
                        {$eq : ['$subSchema.msgDelDate' , '']}
                        ,{$lte : [
                            {$toDate : '$subSchema.msgDelDate'}
                            ,date.getDate()
                        ]}
                    ]}
                    ,"$subSchema.msgDelDate"
                    ,"$unset"
                ]
            }
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
                        ,{$sort:{
                            'msgDate' : -1
                        }}
                        ,{$group:{
                            _id : "$msgPartner"
                            ,'msgPartner' : {'$first':'$msgPartner'}
                            ,'msgSend' : {'$first':'$subSchema.msgSend'}
                            ,'msgDate' : {'$first' : '$fstWrDt'}
                            ,'msgRecv' : {'$first':'$subSchema.msgRecv'}
                            ,'msgContent' : {'$first' : '$subSchema.msgContent'}
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
                                    ,false
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
                    var msgList = msgResult[0].msgList;
                    var usrInfo = msgResult[0].usrInfo;
                    var msgNot = msgResult[0].msgNot;

                    for(let ii=0; ii<msgList.length; ii++){
                        for(let jj=0; jj<usrInfo.length; jj++){
                            if(msgList[ii]._id === usrInfo[jj].usrName){
                                let temp = msgList[ii];
                                temp.usrPt = usrInfo[jj].usrPt;
                                msgList[ii] = temp;
                            }
                        }
                        for(let kk = 0; kk<msgNot.length; kk++){
                            if(msgList[ii]._id === msgNot[kk]._id){
                                let temp = msgList;
                                temp.msgNot = msgNot[kk].notCount;
                                msgList = temp;
                            }
                        }
                        let temp = msgList[ii];
                        temp.checked = false;
                        temp.msgDate = date.getWriteDate(temp.msgDate);
                        msgList[ii] = temp;
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

module.exports = router;