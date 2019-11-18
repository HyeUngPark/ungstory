/*
    일반 유저 라우팅
*/
    var express = require('express');
    var router = express.Router();
    var schema = require('../schema/commonSchema');
    var postSchema = require('../schema/postSchema');
    var postCmtSchema = require('../schema/postCmtSchema');
    var env = require('dotenv');
    env.config();

    var date = require('../myUtils/dateUtils');
    var random = require('../myUtils/randomUtils');
    var encrypt = require('../myUtils/encryptUtils');

    router.get('/index',function(req,res){
        console.log('/user/index');
        res.redirect('../index.html');
    });

    router.post('/post',function(req, res){
        let params = req.body;
        // 사용자 이름으로 id 검색 후 입력
        schema.find({
            wkCd: 'USR',
            wkDtCd : 'USR',
            "subSchema.usrName": params.usrName
        }, function(err, result) {
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            if (result.length > 0) {
              //  console.log("★★★ login history search result ★★★ \n",result[0]);
                let usrId = result[0].subSchema.usrId;

                postSchema.pstPk = random.getPk(4);
                postSchema.usrName = params.usrName;
                postSchema.usrId = usrId;
                postSchema.pstPts = params.pstPts;
                postSchema.pstCt  = params.pstCt;
                postSchema.pstHt = params.pstHt;
                postSchema.pstCmt = [];
                postSchema.pstPubYn = params.pstPubYn;
                postSchema.pstLike = 0;
                schema.create({
                    wkCd: 'PST'
                    ,wkDtCd : "PST"
                    ,fstWrDt: date.getDate() // 최초 작성일
                    ,lstWrDt: date.getDate() // 최종 작성일
                    ,subSchema: postSchema
                }).then((result)=>{
                    // console.log("★★post success★★\n",result);
                    res.json({
                        reCd: '01'
                    });
                }).catch((err)=>{
                    console.log("★★post fail★★\n",err);
                    res.json({
                        reCd: '02'
                    });
                }); // post close
            }
        }); // find close
    });

    router.put('/postModify',function(req, res){
        let params = req.body;
        console.log("★★★"+params.pstPk+"★★★");
        console.log("★★★"+params.pstCt+"★★★");
        console.log("★★★"+params.pstHt+"★★★");
        console.log("★★★"+params.pstpubYn+"★★★");
        schema.update({
            wkCd : 'PST',
            wkDtCd : 'PST',
            "subSchema.pstPk" : params.pstPk
            }
            ,{$set:{
                "subSchema.pstPts" : params.pstPts
                ,"subSchema.pstCt" : params.pstCt
                ,"subSchema.pstHt" : params.pstHt
                ,"subSchema.pstPubYn" : params.pstPubYn
                ,"lstWrDt" :  date.getDate()
            }}
            , function(err, result) {
                if (err) {
                    console.log('error \n', err);
                    return res.status(500).send("포스트 수정 실패 >> " + err)
                }
                console.log(result)
                if (result.n) {
                    console.log('★★★ 포스트 수정 성공 ★★★');
                    res.json({
                        reCd : '01'
                    });
                } else {
                    console.log("★★★ 포스트 수정 실패 ★★★ \n",result.n);
                    res.json({
                        reCd : '02'
                    });
                }
            });
    });

    router.post('/postList',function(req, res){

    var params = req.body;
    if(params.usrName !==''){ // 회원
        schema.find({
            wkCd : 'USR'
            ,wkDtCd : 'USR'
            ,"subSchema.usrName" : params.usrName
        }
        ,{
            _id : 0    
            ,"subSchema.usrFrds" :1
        }, function(fErr, fResult) {
            if (fErr) {
                console.log('error \n', fErr);
                return res.status(500).send("select error >> " + fErr)
            }
            let myFrds=[];
            if (fResult.length > 0) {
                myFrds = fResult[0].subSchema.usrFrds;
            }
            schema.aggregate([
                {$facet:{    
                    myPst : [
                        {$match:{
                            wkCd : 'PST'
                            ,wkDtCd : 'PST'
                            ,"subSchema.usrName" : params.usrName
                            ,"subSchema.pstPubYn" : {$ne : '04'}
                        }}
                    ]
                    ,allPst : [
                        {$match:{
                            wkCd : 'PST'
                            ,wkDtCd : 'PST'
                            ,"subSchema.pstPubYn" : '01'
                        }}
                    ]
                    ,frdPst : [
                        {$match:{
                            wkCd : 'PST'
                            ,wkDtCd : 'PST'
                            ,"subSchema.usrName" : {$in:myFrds}
                            ,"subSchema.pstPubYn" : '02'
                        }}
                    ]
                }}
                ,{$project: {
                    activity:{
                        $setUnion:['$myPst','$allPst','$frdPst']
                    }
                }}
                ,{$unwind : 
                    '$activity'
                }
                ,{$replaceRoot: { 
                    newRoot: "$activity" 
                }}
                ,{$unwind:{
                    path: "$subSchema.pstCmt",
                    preserveNullAndEmptyArrays: true
                }}
                ,{$project:{
                     "subSchema.pstCmt" : { 
                         $cond : [{$ne: [ "$subSchema.pstCmt.pstCmtSep" , "04"]},"$subSchema.pstCmt","$unset"]
                     }
                     ,_id :1
                     ,"wkCd" :  1
                     ,"wkDtCd" : 1
                     ,"fstWrDt" : 1
                     ,"lstWrDt" : 1
                     ,"subSchema.usrName" : 1
                     ,"subSchema.usrId" : 1
                     ,"subSchema.pstPts" : 1
                     ,"subSchema.pstCt" : 1
                     ,"subSchema.pstHt" : 1
                     ,"subSchema.pstPubYn" : 1
                     ,"subSchema.pstPk" : 1
                     ,"subSchema.pstLike" : 1    
                }}
                ,{$sort:{
                    "subSchema.pstCmt.pstCmtGp" : 1
                }}
                ,{$group:{
                     "_id" : "$_id"
                     ,"wkCd" : {"$first":"$wkCd"}
                     ,"wkDtCd" : {"$first":"$wkDtCd"}
                     ,"fstWrDt" : {"$first":"$fstWrDt"}
                     ,"lstWrDt" : {"$first":"$lstWrDt"}
                     ,"usrName" : {"$first":"$subSchema.usrName"}
                     ,"usrId" : {"$first":"$subSchema.usrId"}
                     ,"pstPts" : {"$first":"$subSchema.pstPts"}
                     ,"pstCt" : {"$first":"$subSchema.pstCt"}
                     ,"pstHt" : {"$first":"$subSchema.pstHt"}
                     ,"pstCmt" : {"$push":"$subSchema.pstCmt"}
                     ,"pstPubYn" : {"$first":"$subSchema.pstPubYn"}
                     ,"pstPk" : {"$first":"$subSchema.pstPk"}
                     ,"pstLike" : {"$first":"$subSchema.pstLike"}
                }}
                ,{$sort:{
                    lstWrDt : -1
                }}
            ],function(err, result) {
                    if (err) {
                        console.log('error \n', err);
                        return res.status(500).send("select error >> " + err)
                    }
                    if (result.length > 0) {
                        let postList = [];                
                        for(var i=0; i<result.length; i++){
                            var tempPhoto = [];
                            if(result[i].pstPts 
                                && result[i].pstPts.length >0 ){
                                    for(var j=0; j<result[i].pstPts.length; j++){
                                        let tp = {
                                            // 'src': "require('"+result[i].subSchema.pstPts[j]+"')",
                                            'src': result[i].pstPts[j],
                                            'width': 1,
                                            'height': 1 
                                        }
                                        tempPhoto.push(tp);
                                    }
                            }
        
                            let post ={
                                pstPk : result[i].pstPk
                                ,usrName : result[i].usrName
                                ,wrDt : date.getWriteDate(result[i].lstWrDt)
                                ,pstPts : tempPhoto
                                ,pstCt : result[i].pstCt
                                ,pstHt : result[i].pstHt
                                ,pstCmt : result[i].pstCmt
                                ,pstPubYn : result[i].pstPubYn
                                ,pstLike : result[i].pstLike
                            };
        
                            // 내 게시물
                            if(params.usrName === result[i].usrName){
                                post.myPst = true;
                            }else{
                                post.myPst = false;
                            }
        
                            postList.push(post); 
                        }
                        /* 댓글 프로필 사진 조회 */
                        let cmtUsrList = [];
                        for(var j=0; j<postList.length; j++){
                            if(postList[j].pstCmt.length>0){
                                for(var k=0; k<postList[j].pstCmt.length; k++){
                                    cmtUsrList.indexOf(postList[j].pstCmt[k].usrName)<0 ? 
                                    cmtUsrList.push(postList[j].pstCmt[k].usrName) : '';
                                }
                            }
                        }
                        console.log('★★★★★',cmtUsrList.length,'명 프로필 사진 조회 시작 ★★★★★');
                        schema.aggregate([
                            {$match:{
                                wkCd : 'USR',
                                wkDtCd : 'USR',
                                "subSchema.usrName" : {$in:cmtUsrList}
                            }},
                            {$project : {
                                "subSchema.usrName" : 1
                                ,"subSchema.usrPt" : 1
                            }},
                            {$group :{
                                "_id" : "$_id"
                                ,"usrName" : {"$first"  : "$subSchema.usrName"}
                                ,"usrPt" : {"$first"  : "$subSchema.usrPt"}
                            }}
                        ],function(profileErr, profileResult){
                            if (profileErr) {
                                console.log('error \n', profileErr);
                                return res.status(500).send("select error >> " + profileErr);
                            }
                            if (profileResult.length > 0) {
                                for(var jj=0; jj<postList.length; jj++){
                                    if(postList[jj].pstCmt.length>0){
                                        for(var kk=0; kk<postList[jj].pstCmt.length; kk++){
                                            for(var ii =0; ii<profileResult.length; ii++){
                                                if(profileResult[ii].usrName === postList[jj].pstCmt[kk].usrName){
                                                    postList[jj].pstCmt[kk].usrPt = profileResult[ii].usrPt;
                                                    // console.log(profileResult[ii].usrName,' 이미지 등록\n');
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            res.json({
                                reCd : '01'
                                ,pstList : postList
                            });
                        });
                        
                    }else{
                        res.json({
                            reCd : '02'
                        });  
                    }     
            });
        });
    }else{ // 비회원
    schema.aggregate([
        {$match:{
            wkCd : 'PST'
            ,wkDtCd : 'PST'
            ,"subSchema.pstPubYn" : '01'
        }}
        ,{$unwind:{
            path: "$subSchema.pstCmt",
            preserveNullAndEmptyArrays: true
        }}
        ,{$project:{
             "subSchema.pstCmt" : { 
                 $cond : [{$ne: [ "$subSchema.pstCmt.pstCmtSep" , "04"]},"$subSchema.pstCmt","$unset"]
             }
             ,_id :1
             ,"wkCd" :  1
             ,"wkDtCd" : 1
             ,"fstWrDt" : 1
             ,"lstWrDt" : 1
             ,"subSchema.usrName" : 1
             ,"subSchema.usrId" : 1
             ,"subSchema.pstPts" : 1
             ,"subSchema.pstCt" : 1
             ,"subSchema.pstHt" : 1
             ,"subSchema.pstPubYn" : 1
             ,"subSchema.pstPk" : 1
             ,"subSchema.pstLike" : 1    
        }}
        ,{$group:{
             "_id" : "$_id"
             ,"wkCd" : {"$first":"$wkCd"}
             ,"wkDtCd" : {"$first":"$wkDtCd"}
             ,"fstWrDt" : {"$first":"$fstWrDt"}
             ,"lstWrDt" : {"$first":"$lstWrDt"}
             ,"usrName" : {"$first":"$subSchema.usrName"}
             ,"usrId" : {"$first":"$subSchema.usrId"}
             ,"pstPts" : {"$first":"$subSchema.pstPts"}
             ,"pstCt" : {"$first":"$subSchema.pstCt"}
             ,"pstHt" : {"$first":"$subSchema.pstHt"}
             ,"pstCmt" : {"$push":"$subSchema.pstCmt"}
             ,"pstPubYn" : {"$first":"$subSchema.pstPubYn"}
             ,"pstPk" : {"$first":"$subSchema.pstPk"}
             ,"pstLike" : {"$first":"$subSchema.pstLike"}
        }} 
        ,{$sort:{
            lstWrDt : -1
        }} 
        ],function(err, result) {
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            if (result.length > 0) {
                // console.log(result.length+'건 조회');
                let postList = [];                
                for(var i=0; i<result.length; i++){
                    var tempPhoto = [];
                    if(result[i].pstPts 
                        && result[i].pstPts.length >0 ){
                            for(var j=0; j<result[i].pstPts.length; j++){
                                let tp = {
                                    // 'src': "require('"+result[i].subSchema.pstPts[j]+"')",
                                    'src': result[i].pstPts[j],
                                    'width': 1,
                                    'height': 1 
                                }
                                tempPhoto.push(tp);
                            }
                    }
                    let post ={
                        pstPk : result[i].pstPk
                        ,usrName : result[i].usrName
                        ,wrDt : date.getWriteDate(result[i].lstWrDt)
                        ,pstPts : tempPhoto
                        ,pstCt : result[i].pstCt
                        ,pstHt : result[i].pstHt
                        ,pstCmt : result[i].pstCmt
                        ,pstPubYn : result[i].pstPubYn
                        ,pstLike : result[i].pstLike
                    };

                    // 내 게시물
                    if(params.usrName === result[i].usrName){
                        post.myPst = true;
                    }else{
                        post.myPst = false;
                    }

                    postList.push(post); 
                }
                /* 댓글 프로필 사진 조회 */
                let cmtUsrList = [];
                for(var j=0; j<postList.length; j++){
                    if(postList[j].pstCmt.length>0){
                        for(var k=0; k<postList[j].pstCmt.length; k++){
                            cmtUsrList.indexOf(postList[j].pstCmt[k].usrName)<0 ? 
                            cmtUsrList.push(postList[j].pstCmt[k].usrName) : '';
                        }
                    }
                }
                console.log('★★★★★',cmtUsrList.length,'명 프로필 사진 조회 시작 ★★★★★');
                schema.aggregate([
                    {$match:{
                        wkCd : 'USR',
                        wkDtCd : 'USR',
                        "subSchema.usrName" : {$in:cmtUsrList}
                    }},
                    {$project : {
                        "subSchema.usrName" : 1
                        ,"subSchema.usrPt" : 1
                    }},
                    {$group :{
                        "_id" : "$_id"
                        ,"usrName" : {"$first"  : "$subSchema.usrName"}
                        ,"usrPt" : {"$first"  : "$subSchema.usrPt"}
                    }}
                ],function(profileErr, profileResult){
                    if (profileErr) {
                        console.log('error \n', profileErr);
                        return res.status(500).send("select error >> " + profileErr);
                    }
                    if (profileResult.length > 0) {
                        for(var jj=0; jj<postList.length; jj++){
                            if(postList[jj].pstCmt.length>0){
                                for(var kk=0; kk<postList[jj].pstCmt.length; kk++){
                                    for(var ii =0; ii<profileResult.length; ii++){
                                        if(profileResult[ii].usrName === postList[jj].pstCmt[kk].usrName){
                                            postList[jj].pstCmt[kk].usrPt = profileResult[ii].usrPt;
                                            // console.log(profileResult[ii].usrName,' 이미지 등록\n');
                                        }
                                    }
                                }
                            }
                        }
                    }
                    res.json({
                        reCd : '01'
                        ,pstList : postList
                    });
                });
                
            }else{
                res.json({
                    reCd : '02'
                });  
            }     
        });
    }
});

    router.post('/postCmtWt',function(req, res){
        let params = req.body;
        
        schema.find({
            wkCd : 'PST',
            wkDtCd : 'PST',
            "subSchema.pstPk" : params.pstPk
        },function(err, result){
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            if (result.length > 0) {
                var comments = result[0].subSchema.pstCmt;
                if(comments && comments.length > 0){
                    postCmtSchema.pstCmtGp = '0'+(result[0].subSchema.pstCmt[comments.length-1].pstCmtGp*1 + 1);
                }else{
                    postCmtSchema.pstCmtGp = '01';
                }

                var _id = result[0]._id;
                let commentList = result[0].subSchema.pstCmt;
                postCmtSchema.pstCmtPk = random.getPk(4);
                postCmtSchema.usrName = params.usrName;
                postCmtSchema.pstCmtCt = params.pstCmtCt;
                postCmtSchema.pstCmtSep = '01';
                postCmtSchema.pstCmtWtDate = date.getDate();
                postCmtSchema.pstCmtLtDate = date.getDate();
                commentList.push(postCmtSchema);
                schema.updateOne({
                    "_id" : _id
                }
                , { $set: {
                    'subSchema.pstCmt': commentList
                }}
                , function(err, result) {
                    if (err) {
                        console.log('error \n', err);
                        return res.status(500).send("select error >> " + err)
                    }
                    if (result.n) {
                        console.log("★★★ 댓글 등록 성공 result ★★★ \n",result.n);
                        res.json({
                            reCd : '01'
                        });
                    } else {
                        console.log("★★★ 댓글 등록 실패 ★★★ \n",result.n);
                        res.json({
                            reCd : '02'
                        });
                    }
                }); // update close
            }
        });
    });

    router.post('/postCmtUd',function(req, res){
        let params = req.body;
        console.log('댓글 업데이트 \n', params);
        schema.update({
            wkCd : 'PST',
            wkDtCd : 'PST',
            "subSchema.pstCmt.pstCmtPk" : params.pstCmtPk
            }
            ,{$set:{
                "subSchema.pstCmt.$.pstCmtCt" : params.pstCmtCt // 댓글내용
                ,"subSchema.pstCmt.$.pstCmtLtDate" : date.getDate() // 댓글 작성일자 
            }}
            , function(err, result) {
                console.log("댓글 업데이트 result \n",result);
                if (err) {
                    console.log('error \n', err);
                    return res.status(500).send("댓글 업데이트 실패 >> " + err)
                }
                
                if (result.n) {
                    console.log('★★★ 댓글 업데이트 성공 ★★★');
                    res.json({
                        reCd : '01'
                    });
                } else {
                    console.log("★★★ 댓글 업데이트 실패 ★★★ \n",result.n);
                    res.json({
                        reCd : '02'
                    });
                }
            });
    });

    router.post('/postCmtDel',function(req, res){
        let params = req.body;
        console.log('댓글 삭제 \n', params);
        schema.update({
            wkCd : 'PST',
            wkDtCd : 'PST',
            "subSchema.pstCmt.pstCmtPk" : params.pstCmtPk
            }
            ,{$set:{
                "subSchema.pstCmt.$.pstCmtSep" : params.pstCmtDcd
                ,"subSchema.pstCmt.$.pstCmtLtDate" : date.getDate() // 댓글 최종 수정일자 
            }}
            , function(err, result) {
                if (err) {
                    console.log('error \n', err);
                    return res.status(500).send("댓글 업데이트 실패 >> " + err)
                }
                
                if (result.n) {
                    console.log('★★★ 댓글 삭제 성공 ★★★');
                    res.json({
                        reCd : '01'
                    });
                } else {
                    console.log("★★★ 댓글 삭제 실패 ★★★ \n",result.n);
                    res.json({
                        reCd : '02'
                    });
                }
            });
    });

    router.post('/postCmtRp',function(req, res){
        let params = req.body;
        
        schema.find({
            wkCd : 'PST',
            wkDtCd : 'PST',
            "subSchema.pstPk" : params.pstPk
        },function(err, result){
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            if (result.length > 0) {
                var _id = result[0]._id;
                let commentList = result[0].subSchema.pstCmt;
                postCmtSchema.pstCmtGp = params.pstCmtGp;
                postCmtSchema.pstCmtPk = random.getPk(4);
                postCmtSchema.usrName = params.usrName;
                postCmtSchema.pstCmtCt = params.pstCmtCt;
                postCmtSchema.pstCmtSep = '02';
                postCmtSchema.pstCmtWtDate = date.getDate();
                postCmtSchema.pstCmtLtDate = date.getDate();
                commentList.push(postCmtSchema);
                schema.updateOne({
                    "_id" : _id
                }
                , { $set: {
                    'subSchema.pstCmt': commentList
                }}
                , function(err, result) {
                    if (err) {
                        console.log('error \n', err);
                        return res.status(500).send("select error >> " + err)
                    }
                    if (result.n) {
                        console.log("★★★ 답글 등록 성공 result ★★★ \n",result.n);
                        res.json({
                            reCd : '01'
                        });
                    } else {
                        console.log("★★★ 답글 등록 실패 ★★★ \n",result.n);
                        res.json({
                            reCd : '02'
                        });
                    }
                }); // update close
            }else{
                console.log("★★★ 답글 등록 실패 ★★★ \n",result.n);
                res.json({
                    reCd : '02'
                });
            }
        });
    });

    router.post('/postDel',function(req, res){
        var params = req.body;
        schema.update({
            wkCd : 'PST',
            wkDtCd : 'PST',
            "subSchema.pstPk" : params.pstPk
            }
            ,{$set:{
                "subSchema.pstPubYn" : '04'
                ,"lstWrDt" : date.getDate() // 댓글 최종 수정일자 
            }}
            , function(err, result) {
                if (err) {
                    console.log('error \n', err);
                    return res.status(500).send("포스트 삭제 실패 >> " + err)
                }
                
                if (result.n) {
                    console.log('★★★ 포스트 삭제 성공 ★★★');
                    res.json({
                        reCd : '01'
                    });
                } else {
                    console.log("★★★ 포스트 삭제 실패 ★★★ \n",result.n);
                    res.json({
                        reCd : '02'
                    });
                }
            });
    });


    router.put('/postLike',function(req, res){
        var params = req.body;
        var likeInc = 0;
        if(params.myLike){
            likeInc = -1;
        }else{
            likeInc = 1;
        }
        schema.update({
                wkCd : 'PST',
                wkDtCd : 'PST',
                "subSchema.pstPk" : params.pstPk
            }
            ,{$inc: { "subSchema.pstLike" : likeInc }}
            ,{$set: {
                "lstWrDt" : date.getDate()
            }}
            , function(err, uResult) {
                if (err) {
                    console.log('error \n', err);
                    return res.status(500).send("포스트 좋아요 실패 >> " + err)
                }
                
                if (uResult.n) {
                    console.log('★★★ 포스트 좋아요 성공 ★★★\n');
                    schema.find({
                        wkCd : 'USR',
                        wkDtCd : 'USR',
                        "subSchema.usrName" : params.usrName
                    },function(err, fResult){
                        if (err) {
                            console.log('error \n', err);
                            return res.status(500).send("포스트 좋아요 실패 >> " + err)
                        }
                        if (fResult.length>0) {
                            console.log("★★★ 포스트 좋아요 유저 조회 성공 ★★★\n");
                            let tempLikePst = fResult[0].subSchema.usrLikePst;
                            if(likeInc>0
                                && tempLikePst.indexOf(params.pstPk)< 0){
                                let pstLike = {
                                    pstPk : params.pstPk
                                    ,pstLikeDt : date.getDate()
                                };
                                tempLikePst.push(pstLike);
                            }else{
                                // 제거 
                                for(var i=0; i<tempLikePst.length; i++){
                                    if(tempLikePst[i].pstPk.indexOf(params.pstPk)>-1){
                                        tempLikePst.splice(i,1);
                                    }
                                }
                            }
        
                            schema.update({
                                wkCd : 'USR',
                                wkDtCd : 'USR',
                                "subSchema.usrName" : params.usrName
                            },{$set:{
                                "subSchema.usrLikePst": tempLikePst
                            }},function(err, result){
                                if (err) {
                                    console.log('error \n', err);
                                    return res.status(500).send("select error >> " + err)
                                }
                                if (result.n) {
                                    console.log('★★★ 포스트 좋아요 user update 성공 ★★★');
                                    let myLikePst = [];
                                    
                                    for(let i=0; i<tempLikePst.length; i++){
                                        myLikePst.push(tempLikePst[i].pstPk);
                                    }
                                    res.json({
                                        reCd : '01'
                                        ,usrLikePst : myLikePst
                                    });
                                }else{
                                    console.log('★★★ 포스트 좋아요 user update 실패 ★★★');
                                    res.json({
                                        reCd : '02'
                                    });
                                }
                            });
                        }
                    });
                }else {
                    console.log("★★★ 포스트 좋아요 실패 ★★★ \n",result.n);
                    res.json({
                        reCd : '02'
                    });
                }
            });
    });

    router.post('/profilePwCheck',function(req, res){
        var params = req.body;
        console.log('/profilePwCheck');
        schema.aggregate([
            {$match:{
                wkCd : 'USR'
                , wkDtCd : 'LOGIN'
                ,"subSchema.loginToken" : params.usrToken
            }},
            {$project : {
               _id : 1
               ,"subSchema.usrId" : 1
            }},
        ],function(aErr, aResult){
            if (aErr) {
                console.log('error \n', aErr);
                return res.status(500).send("select error >> " + aErr);
            }
            if (aResult.length > 0) {
                console.log('★★★profilePwCheck usrId 조회 성공★★★');
                var usrId = aResult[0].subSchema.usrId;
                schema.find({
                    wkCd : 'USR'
                    ,wkDtCd : 'USR'
                    ,"subSchema.usrId" : usrId
                    ,"subSchema.usrPwd" : encrypt.getEncrypt(params.usrPwd)
                }, function(fErr, fResult){
                    if (fErr) {
                        console.log('error \n', fErr);
                        return res.status(500).send("select error >> " + fErr);
                    }
                    if (fResult.length > 0) {
                        console.log('★★★profilePwCheck pw 검증 성공★★★');
                        res.json({
                            reCd : '01'
                        });
                    }else{
                        res.json({
                            reCd : '02'
                        });
                    }
                });
            }else{
                res.json({
                    reCd : '02'
                });
            }  
        });

    });

    router.post('/getProfile',function(req, res){
        var params = req.body;
        // console.log('★★★getProfile usrToken★★★\n',params.usrToken);
        schema.find({
            wkCd : 'USR',
            wkDtCd : 'LOGIN',
            "subSchema.loginToken" : params.usrToken
        },function(err, result){
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            if (result.length > 0) {
                var usrId = result[0].subSchema.usrId;
                schema.aggregate([
                    {$match:{
                      "subSchema.usrId" : usrId
                    }},
                    {$unwind : {
                          path: "$subSchema.pstCmt",
                          preserveNullAndEmptyArrays: true
                    }},
                    {$unwind : {
                          path: "$subSchema.pstPts",
                          preserveNullAndEmptyArrays: true
                    }},
                    {$project : {
                        "_id" : 0
                        ,"subSchema.usrName" : 1
                        ,"subSchema.usrId" : 1
                        ,"subSchema.usrPt" :1
                        ,"subSchema.usrMsg" : 1
                        ,"subSchema.pstPts" : {
                                 $cond : [
                                   {$and:[
                                       {$ne: ["$subSchema.pstPubYn" , "04"]}
                                   ]}//and
                                   ,"$subSchema.pstPts"
                                   ,"$unset"]
                         }
                        ,"subSchema.pstCmt" : { 
                                       $cond : [
                                           {$and:[
                                               {$ne: ["$subSchema.pstCmt.pstCmtSep" , "04"]}
                                              ,{$eq: ["$subSchema.pstCmt.usrName","$subSchema.usrName"]}
              
                                           ]}//and
                                           ,"$subSchema.pstCmt"
                                           ,"$unset"]
                          }// pstCmt
                        ,"subSchema.usrLikePst" : {
                              $size : {"$ifNull":["$subSchema.usrLikePst",[]]}
                        }
                        ,"subSchema.loginDate" : 1
                        ,"subSchema.usrFrds" : 1
                    }},
                    {$lookup:{
                      from : "subSchema.pstCmt"
                      ,localField : 'usrName'
                      ,foreignField : 'subSchema.usrName'
                      ,as : 'pstCmt'
                    }},
                    {$sort : {
                        "subSchema.loginDate" : -1
                    }},
                    {$group:{
                        "_id" : "$_id"
                        ,"usrName" : {"$max":"$subSchema.usrName"}
                        ,"usrId" : {"$first":"$subSchema.usrId"}
                        ,"usrMsg" : {"$max":"$subSchema.usrMsg"}
                        ,"pstPts" : {"$push":"$subSchema.pstPts"}
                        ,"usrPt" : {"$max":"$subSchema.usrPt"}
                        ,"pstCmt" : {"$push":"$subSchema.pstCmt"}
                        ,"usrLikePst" : {"$max":"$subSchema.usrLikePst"}
                        ,"loginDate" : {"$push":"$subSchema.loginDate"}
                        ,"usrFrds" : {"$push":"$subSchema.usrFrds"}
                    }},
            ],function(aErr, aResult){
                if (aErr) {
                    console.log('error \n', aErr);
                    return res.status(500).send("select error >> " + aErr)
                }
                // console.log(result);
                if (aResult.length > 0) {
                    // console.log("★★★getProfile data★★★\n",aResult);
                    var profileData = {
                        loginDate : aResult[0].loginDate.length >3 ? aResult[0].loginDate.slice(0,3) : aResult[0].loginDate
                        ,usrActive : aResult[0].usrLikePst + aResult[0].pstCmt.length
                        // ,pstCmt : aResult.pstCmt.length
                        ,usrFrds : aResult[0].usrFrds.length
                        ,pstPts : aResult[0].pstPts.length
                        ,usrPt : aResult[0].usrPt
                        ,usrId : aResult[0].usrId
                        ,usrName :aResult[0].usrName
                        ,usrMsg : aResult[0].usrMsg
                    };
                    res.json({
                        reCd : '01'
                        ,profileData : profileData
                    })
                }else{
                    res.json({reCd:'02'});
                }
              });
            }
        });
    });

    router.post('/getPostImgList',function(req, res){
    var params = req.body;

    schema.aggregate([
        {$match:{
            wkCd : 'PST'
            ,wkDtCd : 'PST'
            ,"subSchema.usrId" : params.usrId
        }},
        {$unwind : {
              path: "$subSchema.pstPts",
              preserveNullAndEmptyArrays: true       
        }},
        {$project : {
            "_id" : 0
            ,"subSchema.pstPts" :{
              $cond : [{$and:[
                  {$ne: ["$subSchema.pstPts" , []]}
                  ,{$ne: ["$subSchema.pstPubYn","04"]}
              ]}//and
              ,"$subSchema.pstPts","$unset"]//codition
            }
        }},
        {$sort : {
            "lstWrDt" : -1
        }},
        {$group:{
            "_id" : "$_id"
            ,"pstPts" : {"$push":"$subSchema.pstPts"}
        }}
       ],function(err, result) {
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            // console.log(result);
            if (result.length > 0) {
                console.log('★★★ 포스팅 이미지 리스트',result[0].pstPts.length, '건 조회 성공 ★★★\n');
                res.json({
                    reCd : '01'
                    ,postImgList : result[0].pstPts
                });
            }else if(result.length === 0){
                console.log('★★★ 포스팅 이미지 리스트 없음 ★★★\n');
                res.json({ 
                    reCd : '03'
                });
            }else{
                console.log('★★★ 포스팅 이미지 리스트 조회 실패 ★★★\n');
                res.json({
                    reCd : '02'
                });
            }
        });
    });

    router.put('/profileChange',function(req, res){
        let params = req.body;
        // console.log('/profileChange\n',params);
        if(params.changeCd === 'img'){
            schema.update({
                wkCd : 'USR',
                wkDtCd : 'USR',
                "subSchema.usrId" : params.usrId
                }
                ,{$set:{
                    "subSchema.usrPt" : params.usrPt
                    ,"lstWrDt" :  date.getDate()
                }}
                , function(err, result) {
                    if (err) {
                        console.log('error \n', err);
                        return res.status(500).send("프로필 수정 실패 >> " + err)
                    }
                    if (result.n) {
                        res.json({
                            reCd:'01'
                            ,usrPt : params.usrPt
                        });
                    }else{
                        res.json({
                            reCd:'02'
                        });
                    }
            });
        }else if(params.changeCd === 'pwd'){
            schema.find({
                wkCd : 'USR'
                ,wkDtCd : 'USR'
                ,"subSchema.usrId" : params.usrId
                ,"subSchema.usrPwd" : encrypt.getEncrypt(params.usrPw)
            },function(err,result){
                if (err) {
                    console.log('error \n', err);
                    return res.status(500).send("비밀번호 수정 실패 >> " + err);
                }
                if (result.length > 0) {
                    console.log("★★★기존 비밀번호★★★");
                    res.json({
                        reCd : '03' // 이미 사용하는 패스워드
                        ,svCd : params.changeCd
                    });
                    return;
                }else{
                    schema.update({
                        wkCd : 'USR',
                        wkDtCd : 'USR',
                        "subSchema.usrId" : params.usrId
                        }
                        ,{$set:{
                            "subSchema.usrPwd" :  encrypt.getEncrypt(params.usrPw)
                            ,"lstWrDt" :  date.getDate()
                        }}
                        , function(err, result) {
                            if (err) {
                                console.log('error \n', err);
                                return res.status(500).send("비밀번호 수정 실패 >> " + err);
                            }
                            if (result.n) {
                                console.log("★★★비밀번호 수정 성공★★★");
                                res.json({
                                    reCd : '01'
                                    ,svCd : params.changeCd
                                });
                            }else{
                                console.log("★★★비밀번호 수정 실패★★★");
                                res.json({
                                    reCd : '02'
                                });
                            }
                    });
                }
            });
        }else if(params.changeCd === 'name'){
                //1.유저 닉네임 업데이트
                schema.update({
                    wkCd : 'USR',
                    wkDtCd : 'USR',
                    "subSchema.usrId" : params.usrId
                    }
                    ,{$set:{
                        "subSchema.usrName" : params.changeName
                        ,"lstWrDt" :  date.getDate()
                    }}
                    , function(nameErr, nameResult) {
                        if (nameErr) {
                            console.log('error \n', nameErr);
                            return res.status(500).send("유저 닉네임 수정 실패 >> " + nameErr);
                        }
                        if (nameResult.n) {
                            console.log('★★★ 유저 닉네임 수정 성공 ★★★');
                            // 2. 친구 목록 닉네임 업데이트
                            schema.updateMany({
                                wkCd : 'USR'
                                ,wkDtCd : 'USR'
                                ,"subSchema.usrFrds" : params.usrName
                            }
                            ,{$set: {
                                "subSchema.usrFrds.$": params.changeName
                            }}
                            , function(frdErr, frdResult) {
                                if (frdErr) {
                                    console.log('error \n', frdErr);
                                    return res.status(500).send("친구 닉네임 수정 실패 >> " + frdErr);
                                }
                                if (frdResult.n) {
                                    //3. 포스팅 닉네임 업데이트
                                    schema.updateMany({
                                        wkCd : 'PST',
                                        wkDtCd : 'PST',
                                        "subSchema.usrId" : params.usrId
                                        }
                                        ,{$set:{
                                            "subSchema.usrName" : params.changeName
                                            // ,"lstWrDt" :  date.getDate()
                                        }}
                                        ,{multi:true}
                                        , function(postErr, postResult) {
                                            if (postErr) {
                                                console.log('error \n', postErr);
                                                return res.status(500).send("유저 닉네임 수정 실패 >> " + postErr);
                                            }
                                            if (postResult.n) {
                                                console.log('★★★ 포스트 닉네임 수정 성공 ★★★');
                                                // 4. 댓글 닉네임 업데이트
                                                schema.update({
                                                    wkCd : 'PST',
                                                    wkDtCd : 'PST',
                                                    "subSchema.pstCmt.usrName" : params.usrName
                                                }
                                                ,{$set:{
                                                    "subSchema.pstCmt.$[].usrName" : params.changeName
                                                    // ,"lstWrDt" :  date.getDate()
                                                }}
                                                ,{multi:true}
                                                , function(cmtErr, cmtResult) {
                                                    if (cmtErr) {
                                                        console.log('error \n', cmtErr);
                                                        return res.status(500).send("포스트 닉네임 수정 실패 >> " + cmtErr);
                                                    }
                                                    if (cmtResult.n) {
                                                        console.log('★★★ 댓글 닉네임 수정 성공 ★★★');
                                                        res.json({
                                                            reCd : '01'
                                                            ,svCd : params.changeCd
                                                        });
                                                    }else{
                                                        console.log('일치하는 댓글 없음');
                                                        res.json({
                                                            reCd : '01'
                                                            ,svCd : params.changeCd
                                                        });
                                                    }
                                                }); // 댓글 닉네임 업데이트
                                            }else{
                                                console.log('일치하는 포스팅 없음');
                                                res.json({
                                                    reCd : '01'
                                                    ,svCd : params.changeCd
                                                });
                                            }
                            }); // 포스팅 닉네임 업데이트
                        }
                    }); // 친구 목록 닉네임 업데이트
                }else{
                    console.log('유저 닉네임 업데이트 실패');
                    res.json({
                        reCd : '02'
                    });
                }
            }); // 닉네임 업데이트
        }else if(params.changeCd === 'np'){
            schema.find({
                wkCd : 'USR'
                ,wkDtCd : 'USR'
                ,"subSchema.usrId" : params.usrId
                ,"subSchema.usrPwd" : encrypt.getEncrypt(params.usrPw)
            },function(err,result){
                if (err) {
                    console.log('error \n', err);
                    return res.status(500).send("비밀번호 수정 실패 >> " + err);
                }
                if (result.length > 0) {
                    console.log("★★★기존 비밀번호★★★");
                    res.json({
                        reCd : '03' // 이미 사용하는 패스워드
                        ,svCd : params.changeCd
                    });
                    return;
                }else{
                    schema.update({
                        wkCd : 'USR',
                        wkDtCd : 'USR',
                        "subSchema.usrId" : params.usrId
                        }
                        ,{$set:{
                            "subSchema.usrPwd" :  encrypt.getEncrypt(params.usrPw)
                            ,"lstWrDt" :  date.getDate()
                        }}
                        , function(err, result) {
                            if (err) {
                                console.log('error \n', err);
                                return res.status(500).send("비밀번호 수정 실패 >> " + err);
                            }
                            if (result.n) {
                                console.log("★★★비밀번호 수정 성공★★★");
                                //1.유저 닉네임 업데이트
                                schema.update({
                                    wkCd : 'USR',
                                    wkDtCd : 'USR',
                                    "subSchema.usrId" : params.usrId
                                    }
                                    ,{$set:{
                                        "subSchema.usrName" : params.changeName
                                        ,"lstWrDt" :  date.getDate()
                                    }}
                                    , function(nameErr, nameResult) {
                                        if (nameErr) {
                                            console.log('error \n', nameErr);
                                            return res.status(500).send("유저 닉네임 수정 실패 >> " + nameErr);
                                        }
                                        if (nameResult.n) {
                                            console.log('★★★ 유저 닉네임 수정 성공 ★★★');
                                            
                                            // 2. 친구 목록 닉네임 업데이트
                                            schema.updateMany({
                                                wkCd : 'USR'
                                                ,wkDtCd : 'USR'
                                                ,"subSchema.usrFrds" : params.usrName
                                            }
                                            ,{$set: {
                                                "subSchema.usrFrds.$": params.changeName
                                            }}
                                            , function(frdErr, frdResult) {
                                                if (frdErr) {
                                                    console.log('error \n', frdErr);
                                                    return res.status(500).send("친구 닉네임 수정 실패 >> " + frdErr);
                                                }
                                                if (frdResult.n) {
                                                    //3. 포스팅 닉네임 업데이트
                                                    schema.update({
                                                        wkCd : 'PST',
                                                        wkDtCd : 'PST',
                                                        "subSchema.usrId" : params.usrId
                                                    }
                                                    ,{$set:{
                                                        "subSchema.usrName" : params.changeName
                                                    }}
                                                    ,{multi:true}
                                                    , function(postErr, postResult) {
                                                        if (postErr) {
                                                            console.log('error \n', postErr);
                                                            return res.status(500).send("유저 닉네임 수정 실패 >> " + postErr);
                                                        }
                                                        if (postResult.n) {
                                                            console.log('★★★ 포스트 닉네임 수정 성공 ★★★');
                                                            // 4. 댓글 닉네임 업데이트
                                                            schema.update({
                                                                wkCd : 'PST',
                                                                wkDtCd : 'PST',
                                                                "subSchema.pstCmt.usrName" : params.usrName
                                                            }
                                                            ,{$set:{
                                                                "subSchema.pstCmt.$[].usrName" : params.changeName
                                                                // ,"lstWrDt" :  date.getDate()
                                                            }}
                                                            ,{multi:true}
                                                            , function(cmtErr, cmtResult) {
                                                                if (cmtErr) {
                                                                    console.log('error \n', cmtErr);
                                                                    return res.status(500).send("포스트 닉네임 수정 실패 >> " + cmtErr);
                                                                }
                                                                if (cmtResult.n) {
                                                                    console.log('★★★ 댓글 닉네임 수정 성공 ★★★');
                                                                    res.json({
                                                                        reCd : '01'
                                                                        ,svCd : params.changeCd
                                                                    });
                                                                }else{
                                                                    console.log('일치하는 댓글 없음');
                                                                    res.json({
                                                                        reCd : '01'
                                                                        ,svCd : params.changeCd
                                                                    });
                                                                }
                                                            });
                                                            }else{
                                                                console.log('일치하는 포스팅 없음');
                                                                res.json({
                                                                    reCd : '01'
                                                                    ,svCd : params.changeCd
                                                                });
                                                                }
                                                            });
                                                    }
                                                });
                                            }else{
                                                console.log('유저 닉네임 업데이트 실패');
                                                res.json({
                                                    reCd : '02'
                                                });
                                            }
                                            });
                                        }else{
                                            console.log("★★★비밀번호 수정 실패★★★");
                                            res.json({
                                                reCd : '02'
                                            });
                                        }
                                    });
                                }
                            });
            }else if(params.changeCd === 'msg'){
                schema.updateOne({
                    wkCd :'USR'
                    ,wkDtCd : 'USR'
                    ,"subSchema.usrId" : params.usrId
                },{$set:{
                    lstWrDt : date.getDate()
                    ,"subSchema.usrMsg" : params.usrMsg
                }}
                ,function(err, result){
                    if (err) {
                        console.log('error \n', err);
                        return res.status(500).send("프로필 대화명 수정 실패 >> " + err);
                    }
                    if (result.n) {
                        console.log("★★★프로필 대화명 수정 성공★★★");
                        res.json({
                            reCd : '01'
                            ,svCd : params.changeCd
                        });
                    }else{
                        console.log("★★★프로필 대화명 수정 성공★★★");
                        res.json({
                            reCd : '02'
                            ,svCd : params.changeCd
                        });
                    }
                });
            }

        });
router.post('/myPostList',function(req, res){
    var params = req.body;
    console.log('★★★ 내 포스팅 리스트 ★★★ \n',params);
    schema.aggregate([
        {$match:{
            wkCd : 'PST'
            ,wkDtCd : 'PST'
            ,"subSchema.usrName" : params.usrName
            ,"subSchema.pstPubYn" : {$ne : '04'}
            , $and : [{"fstWrDt" : {$gte: new Date(params.beforeDate)}},
                      {"fstWrDt" : {$lt: new Date(params.afterDate)}}]
        }}
        ,{$project:{
            _id :1
            ,"fstWrDt" : 1
            ,"subSchema.pstPk" : 1
            ,"subSchema.pstCt" : 1
            ,"subSchema.pstLike" : 1
            ,"subSchema.pstPubYn" : 1
            ,"subSchema.pstPts" : 1
            ,"subSchema.pstCmt" : { 
                $size:{
                    $cond : [{$ne: [ "$subSchema.pstCmt.pstCmtSep" , "04"]},"$subSchema.pstCmt","$unset"]
                }
            }
            ,"subSchema.pstHt" : 1
        }}
        ,{$group:{
            "_id" : "$_id"
            ,"fstWrDt" : {"$first":"$fstWrDt"}
            ,"pstCt" :  {"$first":"$subSchema.pstCt"}
            ,"pstPk" : {"$first":"$subSchema.pstPk"}
            ,"pstLike" : {"$first":"$subSchema.pstLike"}
            ,"pstPubYn" : {"$first":"$subSchema.pstPubYn"}
            ,"pstCmt" : {"$sum":"$subSchema.pstCmt"}
            ,"pstHt" : {"$push":"$subSchema.pstHt"}
            ,"pstPts" : {"$push":"$subSchema.pstPts"}
        }}
        ,{$unwind:{
            path: "$subSchema.pstPts"
            ,preserveNullAndEmptyArrays: true
        }}
        ,{$unwind:{
            path: "$subSchema.pstHt",
            preserveNullAndEmptyArrays: true
        }}
        ,{$unwind:{
            path: "$subSchema.pstCmt",
            preserveNullAndEmptyArrays: true
        }} 
        ,{$sort:{
            fstWrDt : -1
        }}  
    ],function(err, result){
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("내 포스팅 리스트 조회 실패 >> " + err)
        }
        if (result.length > 0) {
            let myPstList =[];
            for(let i=0; i<result.length; i++){
                let tmepList = {
                    fstWrDt : date.dateFormat(result[i].fstWrDt,'YYYY/MM/DD')
                    ,pstCt : result[i].pstCt
                    ,pstPk : result[i].pstPk
                    ,pstLike : result[i].pstLike
                    ,pstPubYn : result[i].pstPubYn
                    ,pstCmt : result[i].pstCmt
                    ,pstHt : result[i].pstHt[0].length>0? result[i].pstHt[0] : []
                    ,pstPts : result[i].pstPts[0].length>0? result[i].pstPts[0] : []
                };
                myPstList.push(tmepList);
            }
            res.json({
                reCd : '01'
                ,myPstList : myPstList
            });
        }else{
            console.log('조회 결과 없음');
            res.json({
                reCd : '03'
            });
        }
    });

});

router.post('/getPostInfo', function(req, res){
    var params = req.body;

    schema.aggregate([
        {$match : {
            wkCd : 'PST'
            ,wkDtCd : 'PST'
            ,"subSchema.pstPk" : params.pstPk
        }}
        ,{$unwind : {
            path: "$subSchema.pstCmt",
            preserveNullAndEmptyArrays: true
        }}
        ,{$project:{
            "subSchema.pstCmt" : { 
                 $cond : [{$ne: [ "$subSchema.pstCmt.pstCmtSep" , "04"]},"$subSchema.pstCmt","$unset"]
             }
             ,_id :1
             ,"wkCd" :  1
             ,"wkDtCd" : 1
             ,"fstWrDt" : 1
             ,"lstWrDt" : 1
             ,"subSchema.usrName" : 1
             ,"subSchema.usrId" : 1
             ,"subSchema.pstPts" : 1
             ,"subSchema.pstCt" : 1
             ,"subSchema.pstHt" : 1
             ,"subSchema.pstPubYn" : 1
             ,"subSchema.pstPk" : 1
             ,"subSchema.pstLike" : 1
        }}
        ,{$sort:{
            "subSchema.pstCmt.pstCmtGp" : 1
        }}
        ,{$group:{
            "_id" : "$_id"
            ,"pstPk" : {"$first":"$subSchema.pstPk"}
            ,"usrName" : {"$first":"$subSchema.usrName"}
            ,"pstPts" : {"$first":"$subSchema.pstPts"}
            ,"pstHt" : {"$first":"$subSchema.pstHt"}
            ,"pstCt" : {"$first":"$subSchema.pstCt"}
            ,"pstCmt" : {"$push":"$subSchema.pstCmt"}
            ,"pstPubYn" : {"$first":"$subSchema.pstPubYn"}
            ,"pstLike" : {"$first":"$subSchema.pstLike"}
        }} 
    ],function(err, result){
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("포스팅 상세 조회 목록 조회 실패 >> " + err)
        }
        if (result.length > 0) {
          // 내 게시물
          
            let pstInfo = result[0];
            
            pstInfo.wrDt = date.getWriteDate(pstInfo.lstWrDt);
            pstInfo.detailCd = true;

            if(params.usrName === pstInfo.usrName){
                pstInfo.myPst = true;
            }else{
                pstInfo.myPst = false;
            }
             /* 포스팅,댓글 프로필 사진 조회 */
             let cmtUsrList = [];
             if(pstInfo.pstCmt.length>0){
                for(var j=0; j<pstInfo.pstCmt.length; j++){
                    cmtUsrList.indexOf(pstInfo.pstCmt[j].usrName)<0 ? 
                    cmtUsrList.push(pstInfo.pstCmt[j].usrName) : '';
                 }
             }
             console.log('★★★★★',cmtUsrList.length,'명 프로필 사진 조회 시작 ★★★★★');
             schema.aggregate([
                {$facet:{
                    cmtUsrPt :[
                        {$match:{
                            wkCd : 'USR',
                            wkDtCd : 'USR',
                            "subSchema.usrName" : {$in:cmtUsrList}
                        }},
                        {$project : {
                            "subSchema.usrName" : 1
                            ,"subSchema.usrPt" : 1
                        }},
                        {$group :{
                            "_id" : "$_id"
                            ,"usrName" : {"$first"  : "$subSchema.usrName"}
                            ,"usrPt" : {"$first"  : "$subSchema.usrPt"}
                        }}
                    ]
                    ,pstUsrPt : [
                        {$match:{
                            wkCd : 'USR',
                            wkDtCd : 'USR',
                            "subSchema.usrName" : pstInfo.usrName
                        }},
                        {$project : {
                            "subSchema.usrName" : 1
                            ,"subSchema.usrPt" : 1
                        }},
                        {$group :{
                            "_id" : "$_id"
                            ,"usrName" : {"$first"  : "$subSchema.usrName"}
                            ,"usrPt" : {"$first"  : "$subSchema.usrPt"}
                        }}
                    ]
                }}
             ],function(profileErr, profileResult){
                 if (profileErr) {
                     console.log('error \n', profileErr);
                     return res.status(500).send("select error >> " + profileErr);
                 }
                 if (profileResult.length > 0){
                    // 포스팅 작성자 이미지
                    pstInfo.usrPt = profileResult[0].pstUsrPt[0].usrPt;
    
                     // 댓글 이미지
                     if(profileResult[0].cmtUsrPt.length>0){
                        let cmtList = pstInfo.pstCmt;
                        for(let jj=0; jj<profileResult[0].cmtUsrPt.length; jj++){
                            for (kk=0; kk<cmtList.length; kk++){
                                if(profileResult[0].cmtUsrPt[jj].usrName===cmtList[kk].usrName ){
                                    cmtList[kk].usrPt = profileResult[0].cmtUsrPt[jj].usrPt;
                                }
                            }
                        }
                        pstInfo.pstCmt = cmtList;
                     }
                     res.json({
                        reCd : '01'
                        ,postInfo : pstInfo
                    });
                 }else{
                    res.json({
                        reCd : '02'
                    });
                 }
            });
        }else{
            res.json({
                reCd : '02'
            });
        }
    });

});

module.exports = router;
