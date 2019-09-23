/*
    일반 유저 라우팅
*/
    var express = require('express');
    var router = express.Router();
    var schema = require('../schema/commonSchema');
    var postSchema = require('../schema/postSchema');
    var postCmtSchema = require('../schema/postCmtSchema');
    var jwt = require('jsonwebtoken');
    var env = require('dotenv');
    var date = require('../myUtils/dateUtils');
    var random = require('../myUtils/randomUtils');

    env.config();

    router.get('/index',function(req,res){
        console.log('/user/index');
        res.redirect('../index.html');
    });

    router.post('/loginCk',function(req, res){
        let params = req.body;
        if(params.usrToken){
            jwt.verify(params.usrToken,process.env.tokenKey,function(err, decoded){
                if(decoded){
                    console.log('★★★ LOGIN CHECK SUCCESS ★★★');
                    res.json({
                        reCd : '01'
                    });
                }else if(err && err.name === "TokenExpiredError"){
                    console.log('★★★ Token 유효기간 만료 ★★★\n');
                    if(!params.autoLoginCd){
                        // autoLogin false일 경우 로그아웃 처리
                        res.json({
                            reCd : '04'
                        });
                    }else{
                    // token 재생성
                    let newToken = jwt.sign({
                        usrName : params.usrName
                        ,mkDate : new Date()
                    },process.env.tokenKey ,    // 비밀 키
                    {expiresIn: '1h' });
                    
                    // 로그인 이력 업데이트
                    schema.find({
                        wkCd: 'USR',
                        wkDtCd : 'LOGIN',
                        "subSchema.loginToken": params.usrToken
                    }, function(err, result) {
                        if (err) {
                            console.log('error \n', err);
                            return res.status(500).send("select error >> " + err)
                        }
                        if (result.length > 0) {
                            console.log("★★★ login history search result ★★★ \n",result[0]);
                            var _id = result[0]._id;
                            schema.updateOne({
                                "_id" : _id
                            }
                            , { $set: {
                                lstWrDt : date.getDate()
                                ,'subSchema.loginToken': newToken
                            }}
                            , function(err, result) {
                                if (err) {
                                    console.log('error \n', err);
                                    return res.status(500).send("select error >> " + err)
                                }
                                if (result.n) {
                                    console.log("★★★ 토큰 업데이트 성공 result ★★★ \n",result.n);
                                    res.json({
                                        reCd : '03'
                                        ,usrToken : newToken
                                    });
                                } else {
                                    console.log("★★★ 토큰 업데이트 실패 ★★★ \n",result.n);
                                }
                            }); // update close
                        }
                    }); // find close
                 }
                }
                });
            }else{
            console.log('★★★ 변조되거나 잘못된 Token ★★★');
            res.json({
                reCd : '02'
            });
        }
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
      // 친구 게시물

      // 내 게시물

      // 전체공개 게시물
       
      schema.aggregate([
        {$match:{
            wkCd : 'PST',
            wkDtCd : 'PST',
            "subSchema.usrId" : 'phu8460@naver.com',
            "subSchema.pstPubYn" : {"$ne": "04"}
        }},
        {$unwind : {
            path: "$subSchema.pstCmt",
            preserveNullAndEmptyArrays: true       
        }},
        {$project : {
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
        }},
        {$sort : {
            _id : 1
            ,"subSchema.pstCmt.pstCmtGp" : 1
        }},
        {$group:{
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
        ],function(err, result) {
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            // console.log(result);
            if (result.length > 0) {
                console.log(result.length+'건 조회');
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
                res.json({
                    reCd : '01'
                    ,pstList : postList
                });
            }else{
                res.json({
                    reCd : '02'
                });  
            }     
    });
        
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
        schema.update({
                wkCd : 'PST',
                wkDtCd : 'PST',
                "subSchema.pstPk" : params.pstPk
            }
            ,{$inc: { "subSchema.pstLike" : 1 }}
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
                            console.log("★★★ 포스트 좋아요 유저 조회 성공 ★★★\n",fResult[0]);
                            let tempLikePst = fResult[0].subSchema.usrLikePst;
                            let pstLike = {
                                pstPk : params.pstPk
                                ,pstLikeDt : date.getDate()
                            };
                            tempLikePst.push(pstLike);
        
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
                                    res.json({
                                        reCd : '01'
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
module.exports = router;
