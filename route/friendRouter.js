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

router.put('/frdYn',function(req, res){
    let params = req.body;
        // 1.frdSchema 상태 변경 
        console.log('★★★ 친구 요청 응답 ★★★\n',params);
        schema.update({
            wkCd : 'FRD'
            ,wkDtCd : 'FRD'
            ,"subSchema.frdReq": params.frdReq
            ,"subSchema.frdRes" : params.frdRes
            ,"subSchema.frdSt" : 'S'
        }
        , { $set: {
            lstWrDt : date.getDate()
            ,'subSchema.frdSt': params.ynCd
        }}
        , function(fErr, fResult) {
            if (fErr) {
                console.log('error \n', fErr);
                return res.status(500).send("친구 수락 실패 " + fErr)
            }
            if (fResult.n) {
                console.log('★★★ 친구수락 - frdSchema 변경 완료 ★★★');
                
                if(params.ynCd === 'N'){ // 친구 거절이면 종료
                    res.json({
                        reCd : '01'
                        ,ynCd : params.ynCd
                    });
                    return;
                }else if(params.ynCd ==='Y'){ // 친구 수락
                // 2. 요청, 수신자 친구목록에 친구 추가
                // 2-1. 요청자 친구 목록에 추가
                schema.update({
                    wkCd : 'USR'
                    ,wkDtCd : 'USR'
                    ,"subSchema.usrName" : params.frdReq
                }
                ,{ $push : 
                    {"subSchema.usrFrds" : params.frdRes}
                }
                , function(uErr1, uResult1) {
                    if (uErr1) {
                        console.log('error \n', uErr1);
                        return res.status(500).send("친구 수락 실패 " + uErr1)
                    }
                    if (uResult1.n) {
                        console.log('★★★ 친구수락 - 요청자 친구목록 추가 완료 ★★★');
                        // 2-2. 수신자 친구 목록에 추가
                        schema.update({
                            wkCd : 'USR'
                            ,wkDtCd : 'USR'
                            ,"subSchema.usrName" : params.frdRes
                        }
                        ,{ $push : 
                            {"subSchema.usrFrds" : params.frdReq}
                        }
                        , function(uErr2, uResult2) {
                            if (uErr2) {
                                console.log('error \n', uErr2);
                                return res.status(500).send("친구 수락 실패 " + uErr2)
                            }
                            if (uResult2.n) {
                                console.log('★★★ 친구수락 - 수신자 친구목록 추가 완료 ★★★');
                                res.json({
                                    reCd : '01'
                                    ,ynCd : params.ynCd
                                });
                            }else{
                                res.json({
                                    reCd : '02'
                                    ,ynCd : params.ynCd
                                });
                            }
                        });
                    }else{
                        res.json({
                            reCd : '02'
                            ,ynCd : params.ynCd
                        });
                    }
                });
            }
        }else{
            res.json({
                reCd:'02'
                ,ynCd : params.ynCd
            });
        }
    });
});

router.post('/frdInfo',function(req, res){
    var params = req.body;
    if(params.usrName){ // 회원
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
            let myFrd = [];
            if (fResult.length > 0) {
                console.log('내 친구 목록 조회 성공');
                myFrd = fResult[0].myFrd;
            }
            let myName = [];
            myName.push(params.usrName);
            schema.aggregate([
                {$match : {
                    "subSchema.usrName" : params.frdName
                }}
                ,{$project:{
                    _id : 0,
                    "subSchema.usrName" : 1
                    ,"subSchema.usrPt" : 1
                    ,"subSchema.usrFrds" : 1
                    ,"subSchema.usrMsg" : 1
                    ,"subSchema.pstPts" : 1
                    ,"subSchema.pstPts" : {
                         $cond : [
                           {$and:[
                               {$ne: ["$subSchema.pstPubYn" , "04"]}
                           ]}//and
                           ,"$subSchema.pstPts"
                           ,"$unset"]
                    }
                    ,frdYn : 1
                    ,withFrd : 1
                    ,frdCount : 1
                }}
                ,{$unwind : {
                    path: "$subSchema.pstPts",
                    preserveNullAndEmptyArrays: true
                }}
                ,{$group:{
                   _id : "$_id"
                   ,"usrName" : {"$max":"$subSchema.usrName"}
                   ,"usrPt" : {"$first":"$subSchema.usrPt"}
                   ,"frdYn" : {"$sum" : "$frdYn"}
                   ,"withFrd" : {"$sum" : "$withFrd"}
                   ,"frdCount" : {"$sum" : "$frdCount"}
                   ,"usrFrds" : {"$first":"$subSchema.usrFrds"}
                   ,"pstPts" : {'$push' : "$subSchema.pstPts"}
                   ,"usrMsg" : {'$max' : "$subSchema.usrMsg"}
                }}    
                ,{$addFields: {
                    frdCount : {
                        $size: "$usrFrds"
                    },    
                    withFrd : {
                        $size:{
                            $setIntersection:["$usrFrds",myFrd]
                        }
                    },
                    frdYn : {
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
                   fstWrDt : -1     
                }} 
            ],function(iError, iResult){
                if (iError) {
                    console.log('error \n', iError);
                    return res.status(500).send("내 친구 목록 조회 실패 >> " + fError)
                }
                if (iResult.length > 0) {
                    console.log('내 친구 정보 조회 성공');
                    var profileData = {
                        usrName : iResult[0].usrName
                        ,usrPt : iResult[0].usrPt
                        ,frdYn : iResult[0].frdYn
                        ,withFrd : iResult[0].withFrd
                        ,frdCount :iResult[0].frdCount
                        ,pstPts : iResult[0].pstPts.length
                        ,usrMsg : iResult[0].usrMsg
                    };
                    res.json({
                        reCd : '01'
                        ,profileData : profileData
                    });
                }else{
                    res.json({
                        reCd : '02'
                    });
                }
            });
        });
    }else{ // 비회원
        let myName = [];
        let myFrd = [];
        schema.aggregate([
            {$match : {
                "subSchema.usrName" : params.frdName
            }}
            ,{$project:{
                _id : 0,
                "subSchema.usrName" : 1
                ,"subSchema.usrPt" : 1
                ,"subSchema.usrFrds" : 1
                ,"subSchema.usrMsg" : 1
                ,"subSchema.pstPts" : 1
                ,"subSchema.pstPts" : {
                     $cond : [
                       {$and:[
                           {$ne: ["$subSchema.pstPubYn" , "04"]}
                       ]}//and
                       ,"$subSchema.pstPts"
                       ,"$unset"]
                }
                ,frdYn : 1
                ,withFrd : 1
                ,frdCount : 1
            }}
            ,{$unwind : {
                path: "$subSchema.pstPts",
                preserveNullAndEmptyArrays: true
            }}
            ,{$group:{
               _id : "$_id"
               ,"usrName" : {"$max":"$subSchema.usrName"}
               ,"usrPt" : {"$first":"$subSchema.usrPt"}
               ,"frdYn" : {"$sum" : "$frdYn"}
               ,"withFrd" : {"$sum" : "$withFrd"}
               ,"frdCount" : {"$sum" : "$frdCount"}
               ,"usrFrds" : {"$first":"$subSchema.usrFrds"}
               ,"pstPts" : {'$push' : "$subSchema.pstPts"}
               ,"usrMsg" : {'$max' : "$subSchema.usrMsg"}
            }}    
            ,{$addFields: {
                frdCount : {
                    $size: "$usrFrds"
                },    
                withFrd : {                    
                    $size:{
                        $setIntersection:["$usrFrds",myFrd]
                    }
                },
                frdYn : {
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
               fstWrDt : -1     
            }} 
        ],function(iError, iResult){
            if (iError) {
                console.log('error \n', iError);
                return res.status(500).send("내 친구 목록 조회 실패 >> " + fError)
            }
            if (iResult.length > 0) {
                console.log('내 친구 정보 조회 성공');
                var profileData = {
                    usrName : iResult[0].usrName
                    ,usrPt : iResult[0].usrPt
                    ,frdYn : false
                    ,withFrd : 0
                    ,frdCount :iResult[0].frdCount
                    ,pstPts : iResult[0].pstPts.length
                    ,usrMsg : iResult[0].usrMsg
                };
                res.json({
                    reCd : '01'
                    ,profileData : profileData
                });
            }else{
                res.json({
                    reCd : '02'
                });
            }
        });
    }
});

module.exports = router;
