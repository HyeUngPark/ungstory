/* 
    친구 관련 라우팅
*/

var express = require('express'); 
var router = express.Router();

var schema = require('../schema/commonSchema');
var frdSchema = require('../schema/friendSchema');
var ntSchema =  require('../schema/noticeSchema');

var notRouter = require('./noticeRouter');

var date = require('../myUtils/dateUtils');

var env = require('dotenv');
env.config();

router.post('/friendSearch',function(req, res){
    var params = req.body;
    if(params.searchCd === 'MY'){
        // 1.내 친구 목록 조회
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
            if (fResult.length > 0) {
                console.log('★★★ 메시지 작성 내 친구 조회 1차 성공 ★★★');
                let myFrd = fResult[0].myFrd;
                schema.aggregate([
                    {$match:{
                        wkCd:'USR'
                        ,wkDtCd:'USR'
                        ,"subSchema.usrName" : {
                            $in  : myFrd
                        }
                    }}
                    ,{$project:{
                       _id : 1
                       ,"subSchema.usrPt" : 1
                       ,"subSchema.usrName" : 1
                    }}
                    ,{$group:{
                        _id : "$_id"
                        ,"usrPt" : {$first : "$subSchema.usrPt"}
                        ,"usrName" : {$first : "$subSchema.usrName"}
                    }}
                    ,{$sort:{
                        "usrName" : 1
                    }}
                ],function(pError, pResult){
                    if (fError) {
                        console.log('error \n', pError);
                        return res.status(500).send("내 친구 프로필 조회 실패 >> " + fError)
                    }
                    if (pResult.length > 0) {
                        console.log('★★★메시지 작성 내 친구 조회 최종 성공★★★ ',pResult.length);
                        res.json({
                            reCd : '01'
                            ,myFrd : pResult
                        });
                    }
                });
            }else{
                // 친구 없음
                res.json({
                    reCd : '03'
                });
            }
        });
    }else if(params.usrName){
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
                        "frdYn" : -1
                        ,"withFrd" : -1
                        ,"usrName" : 1
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
    }else{ // 비회원
        let matchQuery = ".*"+params.searchName+".*";

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
                withFrd : 0
                ,frdYn : false
            }}
            ,{$sort:{
                "frdYn" : -1
                ,"withFrd" : -1
                ,"usrName" : 1
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
        ntSchema.delYn = false;

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

                                // 3. 친구 상태 업데이트
                                schema.updateOne({
                                    wkCd : 'FRD'
                                    ,wkDtCd : 'FRD'
                                    ,"subSchema.frdReq" : params.frdReq
                                    ,"subSchema.frdRes" : params.frdRes
                                }
                                , { $set: {
                                    lstWrDt : date.getDate()
                                    ,'subSchema.frdSt': 'Y'
                                }}
                                , function(err, result) {
                                    if (err) {
                                        console.log('error \n', err);
                                        return res.status(500).send("친구 수락 - 상태 업데이트 실패\n" + err)
                                    }
                                    if (result.n) {
                                        console.log("★★★ 친구 수락 - 상태 업데이트 성공 result ★★★ \n",result.n);
                                        // 4. 친구 수락 알림 추가
                                        let friendInfo = {
                                            frdReq : params.frdReq
                                            ,frdRes : params.frdRes
                                        }
                                        notRouter.frdNotAdd(friendInfo);
                                        
                                        res.json({
                                            reCd : '01'
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
                    ,withFrdCount : 1
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
                   ,"withFrdCount" : {"$sum" : "$withFrdCount"}
                   ,"frdCount" : {"$sum" : "$frdCount"}
                   ,"usrFrds" : {"$first":"$subSchema.usrFrds"}
                   ,"pstPts" : {'$push' : "$subSchema.pstPts"}
                   ,"usrMsg" : {'$max' : "$subSchema.usrMsg"}
                }}    
                ,{$addFields: {
                    frdCount : {
                        $size: "$usrFrds"
                    },    
                    withFrdCount : {
                        $size:{
                            $setIntersection:["$usrFrds",myFrd]
                        }
                    },
                    withFrd : {
                        $setIntersection:["$usrFrds",myFrd]
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
                    var profileData = {
                        usrName : iResult[0].usrName
                        ,usrPt : iResult[0].usrPt
                        ,frdYn : iResult[0].frdYn
                        ,withFrd : iResult[0].withFrd
                        ,withFrdCount : (iResult[0].withFrdCount && iResult[0].withFrdCount >0) ? iResult[0].withFrdCount : 0
                        ,frdCount : (iResult[0].frdCount && iResult[0].frdCount > 0) ? iResult[0].frdCount : 0
                        ,pstPts : iResult[0].pstPts.length
                        ,usrMsg : iResult[0].usrMsg
                    };
                    console.log('친구 정보 조회 성공 \n');
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

router.post('/frdPtView',function(req, res){
    var params = req.body;
    
    if(params.frdReq === params.frdRes){ // 1. 본인(전체)
        console.log('★★★ 본인 포스트 사진 조회 ★★★');
        schema.aggregate([
            {$match:{
                wkCd : 'PST'
                ,wkDtCd : 'PST'
                ,"subSchema.usrName" : params.frdRes
                ,"subSchema.pstPubYn" : {$ne : '04'}
            }}
            ,{$project:{
                _id :1
                ,"fstWrDt" : 1
                ,"subSchema.pstPts" : 1
                ,"subSchema.pstPk" : 1
            }}
            ,{$unwind:{
                path: "$subSchema.pstPts",
                preserveNullAndEmptyArrays: true
            }}
            ,{$group:{
                "_id" : "$_id"
                ,"fstWrDt" : {"$first":"$fstWrDt"}
                ,"pstPts" : {"$push":"$subSchema.pstPts"}
                ,"pstPk" : {"$first":"$subSchema.pstPk"}
            }}
            ,{$sort:{
                fstWrDt : -1
            }}
        ],function(fErr, fRs){
            if (fErr) {
                console.log('error \n', fErr);
                return res.status(500).send("유저 사진 목록 조회 실패 >> " + fErr)
            }
            if (fRs.length > 0) {
                let frdPtList =[];
                for(let i=0; i<fRs.length; i++){
                    if(fRs[i].pstPts && fRs[i].pstPts.length>0){
                        for(let j=0; j<fRs[i].pstPts.length; j++){
                            let tempList ={
                                fstWrDt : fRs[i].fstWrDt   
                                ,pstPts : fRs[i].pstPts[j]
                                ,pstPk : fRs[i].pstPk   
                            }
                            frdPtList.push(tempList);
                        }
                    }
                }

                res.json({
                    reCd : '01'
                    ,frdPtList : frdPtList
                });
            }else{
                res.json({
                    reCd : '03'
                });
            }
        });
    }else if(params.frdReq && params.frdYn){ // 2. 친구(전체공개, 친구공개)
        console.log('★★★ 친구 포스트 사진 조회 ★★★');
        schema.aggregate([
            {$match:{
                wkCd : 'PST'
                ,wkDtCd : 'PST'
                ,$and : [
                    {"subSchema.usrName" : {$eq: params.frdRes}}, 
                    {"subSchema.pstPubYn" : {$in: ['01','02']}} 
                ]
            }}
            ,{$project:{
                _id :1
                ,"fstWrDt" : 1
                ,"subSchema.pstPts" : 1
                ,"subSchema.pstPk" : 1
            }}
            ,{$unwind:{
                path: "$subSchema.pstPts",
                preserveNullAndEmptyArrays: true
            }}
            ,{$group:{
                "_id" : "$_id"
                ,"fstWrDt" : {"$first":"$fstWrDt"}
                ,"pstPts" : {"$push":"$subSchema.pstPts"}
                ,"pstPk" : {"$first":"$subSchema.pstPk"}
            }}
            ,{$sort:{
                fstWrDt : -1
            }}
        ],function(fErr, fRs){
            if (fErr) {
                console.log('error \n', fErr);
                return res.status(500).send("유저 사진 목록 조회 실패 >> " + fErr)
            }
            if (fRs.length > 0) {
                let frdPtList =[];
                for(let i=0; i<fRs.length; i++){
                    if(fRs[i].pstPts && fRs[i].pstPts.length>0){
                        for(let j=0; j<fRs[i].pstPts.length; j++){
                            let tempList ={
                                fstWrDt : fRs[i].fstWrDt   
                                ,pstPts : fRs[i].pstPts[j]
                                ,pstPk : fRs[i].pstPk   
                            }
                            frdPtList.push(tempList);
                        }
                    }
                }
                res.json({
                    reCd : '01'
                    ,frdPtList : frdPtList
                });
            }else{
                res.json({
                    reCd : '03'
                });
            }
        });
    }else{ // 3. 비회원(전체공개 게시물만)
        console.log('★★★ 비회원 포스트 사진 조회 ★★★');
        schema.aggregate([
            {$match:{
                wkCd : 'PST'
                ,wkDtCd : 'PST'
                ,"subSchema.usrName" : {$eq: params.frdRes} 
                ,"subSchema.pstPubYn" : '01'
            }}
            ,{$project:{
                _id :1
                ,"fstWrDt" : 1
                ,"subSchema.pstPts" : 1
                ,"subSchema.pstPk" : 1
            }}
            ,{$unwind:{
                path: "$subSchema.pstPts",
                preserveNullAndEmptyArrays: true
            }}
            ,{$group:{
                "_id" : "$_id"
                ,"fstWrDt" : {"$first":"$fstWrDt"}
                ,"pstPts" : {"$push":"$subSchema.pstPts"}
                ,"pstPk" : {"$first":"$subSchema.pstPk"}
            }}
            ,{$sort:{
                fstWrDt : -1
            }}
        ],function(fErr, fRs){
            if (fErr) {
                console.log('error \n', fErr);
                return res.status(500).send("유저 사진 목록 조회 실패 >> " + fErr)
            }
            if (fRs.length > 0) {
                let frdPtList =[];
                for(let i=0; i<fRs.length; i++){
                    if(fRs[i].pstPts && fRs[i].pstPts.length>0){
                        for(let j=0; j<fRs[i].pstPts.length; j++){
                            let tempList ={
                                fstWrDt : fRs[i].fstWrDt   
                                ,pstPts : fRs[i].pstPts[j]
                                ,pstPk : fRs[i].pstPk   
                            }
                            frdPtList.push(tempList);
                        }
                    }
                }
                res.json({
                    reCd : '01'
                    ,frdPtList : frdPtList
                });
            }else{
                res.json({
                    reCd : '03'
                });
            }
        });
    }
});
router.post('/getFrdList',function(req, res){
    var params = req.body;
    // 1.내 친구 목록 조회
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
        if (fResult.length > 0) {
            console.log('★★★ 내 친구 조회 성공 ★★★');
            let myFrd = fResult[0].myFrd;
            schema.aggregate([
                {$match:{
                    wkCd : 'USR'
                    ,wkDtCd : 'USR'
                    ,'subSchema.usrName' : {$in :myFrd}
                }}
                ,{$project:{
                    _id : 1
                    ,"subSchema.usrName" : 1
                    ,"subSchema.usrFrds" : {
                        $size : "$subSchema.usrFrds"
                    }
                    ,"subSchema.usrPt" : 1
                }}
                ,{$group:{
                    _id : "$subSchema.usrName"
                    ,"usrFrds" : {"$first" : "$subSchema.usrFrds"}
                    ,"usrPt" : {"$first" : "$subSchema.usrPt"}
                }}
                ,{$sort:{
                    "_id" : 1
                }}
            ],function(pError, pResult){
                if (fError) {
                    console.log('error \n', pError);
                    return res.status(500).send("내 친구 목록 조회 실패 >> " + fError)
                }
                if (pResult.length > 0) {
                    console.log('★★★ 내프로필 내 친구 목록 조회 최종 성공★★★');
                    res.json({
                        reCd : '01'
                        ,myFrd : pResult
                    });
                }
            });
        }else{
            // 친구 없음
            res.json({
                reCd : '03'
            });
        }
    });
});

router.post('/frdCutOff',function(req, res){
    var params = req.body;

    var cutOffFrd = [];
    cutOffFrd.push(params.usrName);
    cutOffFrd.push(params.frdName);

    // 1. 각각 친구 목록에서 삭제
    schema.updateMany({
        wkCd:'USR'
        ,wkDtCd:'USR'
        ,"subSchema.usrName" : {$in : cutOffFrd}    
    }
    ,{$pull: { "subSchema.usrFrds": { $in: cutOffFrd }} }
    ,{multi:true}
    , function(fErr, fResult) {
        if (fErr) {
            console.log('error \n', fErr);
            return res.status(500).send("친구 끊기 처리 실패 " + fErr)
        }
        if (fResult.n) {

        }
        // 2. 각각 메시지 상태 삭제 날짜 변경
        schema.updateMany({
            wkCd:'MSG'
            ,wkDtCd:'STA'
            ,$or:[
                {$and : [
                    {"subSchema.usrName" : cutOffFrd[0]}       
                    ,{"subSchema.msgPartner" : cutOffFrd[1]}
                ]}
                ,{$and : [
                    {"subSchema.usrName" : cutOffFrd[1]}       
                    ,{"subSchema.msgPartner" : cutOffFrd[0]}
                ]}
            ]
        }
        ,{$set:{
            lstWrDt : date.getDate()
            ,"subSchema.msgDelDate" : date.getDate()
        }}
        , function(fsErr, fsResult) {
            if (fsErr) {
                console.log('error \n', fsErr);
                return res.status(500).send("친구 끊기 처리 실패 " + fsErr)
            }
            if (fsResult.n) {
                console.log('★★★ 친구 끊기 - 메시지 주고 받은 삭제 처리 ★★★');
            }else{
                console.log('★★★ 친구 끊기 - 메시지 주고 받은 내역 없음 ★★★');
            }
            res.json({
                reCd : '01'
                ,frdName : params.frdName
            });          
        });

    });


});

module.exports = router;
