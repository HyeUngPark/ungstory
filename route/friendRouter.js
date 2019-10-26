/* 
    친구 관련 라우팅
*/

var express = require('express'); 
var router = express.Router();

var schema = require('../schema/commonSchema');
var frdSchema = require('../schema/friendSchema');
var ntSchema =  require('../schema/noticeSchema');

var date = require('../myUtils/dateUtils');

var env = require('dotenv');
env.config();

router.post('/frendSearch',function(req, res){
    var params = req.body;
    schema.aggregate([
        {$match : {
            wkCd : 'USR'
            ,wkDtCd : 'USR'
            ,"subSchema.usrName" : params.usrName
        }}
        ,{$project:{
            _id : 1
           ,"subSchema.usrFrds" : 1
        }}
        ,{$group:{
           _id : "$_id"
           ,"myFrd" : {"$first":"$subSchema.usrFrds"}
        }}
    ],function(fError, fResult){
        if (fError) {
            console.log('error \n', fError);
            return res.status(500).send("내 친구 목록 조회 실패 >> " + fError)
        }
        let matchQuery = ".*"+params.searchName+".*";
        let myFrd = fResult[0].myFrd;
        let myName = [];
        myName.push(params.usrName);

        if (fResult.length > 0) {
            schema.aggregate([
                {$match : {
                    wkCd : 'USR'
                    ,wkDtCd : 'USR'
                    ,"subSchema.usrName" :  {$regex:matchQuery}
                }}
                ,{$project:{
                    _id : 1,
                    "subSchema.usrName" : 1
                    ,"subSchema.usrPt" : 1
                    ,"subSchema.usrFrds" : 1
                    ,frdYn : 1
                    ,withFrd : 1
                }}
                ,{$group:{
                   _id : "$_id"
                   ,"usrName" : {"$max":"$subSchema.usrName"}
                   ,"usrPt" : {"$first":"$subSchema.usrPt"}
                   ,"frdYn" : {"$sum" : "$frdYn"}
                   ,"withFrd" : {"$sum" : "$withFrd"}
                   ,"usrFrds" : {"$first":"$subSchema.usrFrds"}
                }}
                ,{$addFields: {
                    withFrd : {
                        $size:{
                            $setIntersection:["$usrFrds",myFrd]
                        }
                    }
                    ,frdYn : {
                        $cond:
                            [{$gt:[
                                {$size:{
                                    $setIntersection:["$usrFrds",myName]}
                                }
                                ,0]}
                                ,true
                                ,false
                            ]
                    }
                }}
                ,{$sort:{
                    "withFrd" : -1
                    ,"frdYn" : -1
                }}
            ],function(err, result) {
                if (err) {
                    console.log('error \n', err);
                    return res.status(500).send("친구 검색 실패 >> " + err)
                }
                if (result.length > 0) {
                    res.json({
                        reCd : '01'
                        ,frdList : result 
                    });
                }else{
                    res.json({
                        reCd : '02'
                    });
                }
            });
        }
    });
});            

router.post('/friendRequest',function(req,res){
    var params = req.body;
    frdSchema.frdReq = params.frdReq;
    frdSchema.frdRes = params.frdRes;
    frdSchema.frdSt = 'S';
    
    schema.create({
        wkCd: 'FRD'
        ,wkDtCd : "FRD"
        ,fstWrDt: date.getDate() // 최초 작성일
        ,lstWrDt: date.getDate() // 최종 작성일
        ,subSchema: frdSchema
    }).then((result)=>{
        console.log("★★ friend request success ★★\n");
        
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
       
    }).catch((err)=>{
        console.log("★★★ friend request fail ★★★\n",err);
        res.json({
            reCd: '02'
        });
    });
});

router.post('/frdReqList',function(req, res){
    var params = req.body;
    
    // 1. 내 친구 목록 조회
    schema.aggregate([
        {$match : {
            wkCd : 'USR'
            ,wkDtCd : 'USR'
            ,"subSchema.usrName" : params.usrName
        }}
        ,{$project:{
            _id : 1
           ,"subSchema.usrFrds" : 1
        }}
        ,{$group:{
           _id : "$_id"
           ,"myFrd" : {"$first":"$subSchema.usrFrds"}
        }}
    ],function(fError, fResult){
        if (fError) {
            console.log('error \n', fError);
            return res.status(500).send("내 친구 목록 조회 실패 >> " + fError)
        }
        let matchQuery = ".*"+params.searchName+".*";
        let myFrd = [];

        if (fResult.length > 0) {
            console.log('내 친구 목록 조회 성공');
            myFrd = fResult[0].myFrd;
        }

        // 2. 친구 신청목록 조회
        schema.aggregate([
            {$match : {
                wkCd : 'FRD'
                ,wkDtCd : "FRD"
                ,"subSchema.frdRes" : params.usrName
                ,"subSchema.frdSt" : 'S'
            }}
            ,{ $project: { 
                _id : null,
                "subSchema.frdReq" :1
            }}
            ,{$group:{
                _id : "$_id"
                ,"frdReq" : {"$push" : "$subSchema.frdReq"}
            }}
        ],function(rError, rResult){
            if (fError) {
                console.log('error \n', rError);
                return res.status(500).send("친구 신청 목록 조회 실패 >> " + fError)
            }
            if (rResult.length > 0) {
                let frdReq =  rResult[0].frdReq;
                // 3. 해당 하는 친구 정보 조회
                schema.aggregate([
                    {$match : {
                        wkCd : 'USR'
                        ,wkDtCd : "USR"
                        ,$and : [
                            {"subSchema.usrName" : {$ne: params.usrName}}, 
                            {"subSchema.usrName" : {$in: frdReq}} 
                        ]
                    }}
                    ,{$project: { 
                        _id : 1
                        ,"subSchema.usrName"  : 1
                        ,"subSchema.usrPt"  : 1
                        ,"subSchema.usrFrds" :1
                    }}
                    ,{$group : {
                        _id : "$_id"
                        ,"usrFrds" : {"$first":"$subSchema.usrFrds"}
                        ,"usrName" : {"$max":"$subSchema.usrName"}
                        ,"usrPt" : {"$first":"$subSchema.usrPt"}
                    }}
                    ,{$addFields: {
                        withFrd : {
                            $size:{
                                $setIntersection:["$usrFrds",myFrd]
                            }
                        }
                    }}
                ],function(lError, lResult){
                    if (lError) {
                        console.log('error \n', lError);
                        return res.status(500).send("최종 친구 신청 목록 조회 실패 >> " + fError)
                    }
                    if (lResult.length > 0) {
                        res.json({
                            reCd : '01'
                            ,frdReqList : lResult
                        });
                    }
                });
            }else{
                console.log('★★★ 친구 신청 내역 없음 ★★★');
                res.json({
                    reCd : '03'
                });
            }
        });

    });

});            

module.exports = router;
