/*
    회원가입 관련 라우팅
*/
var express = require('express');
var router = express.Router();
var schema = require('../schema/commonSchema');
var userSchema = require('../schema/userSchema');
var random = require('../myUtils/randomUtils');
var mail = require('../myUtils/mailUtils');

router.get('nameCheck', function(req,res){
    let params = req.body;
    console.log('/join() \n',params);
    
});

router.post('/join', function(req, res) {
    var params = req.body;
    console.log('/join() \n',params);
    userSchema.usrId = params.usrId;
    // 암호화 필요
    userSchema.usrPwd = params.usrPwd; 
    userSchema.usrName = params.usrName;
    userSchema.usrSep = "01";
    userSchema.usrPt = "";
    userSchema.usrFrds = [];

    // console.log(userSchema);

    schema.create({
        wkCd: 'USR'
        ,WkDtCd : "USR"
        ,fstWrDt: new Date() // 최초작성일
        ,lstWrDt: new Date() // 최초작성일
        ,subSchema: userSchema
    }).then((result)=>{
        console.log("★★join success★★\n",result);
        res.json({
            reCd: '01'
        });
    }).catch((err)=>{
        console.log("★★join fail★★\n",err);
        res.json({
            reCd: '02'
        });
    });
});
router.get('/idCheck', function(req, res) {
    var params = req.query;
    schema.find({
        "wkCd": 'USR',
        "subSchema.usrId": params.usrId
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        console.log("★★★idCheck★★★\n",result);
        if (result.length > 0) {
            res.json({ 
                svCd : params.svCd
                ,reCd : "02"     
            })
        } else {
            res.json({
                svCd : params.svCd
                ,reCd : "01" 
            });
        }
    });
});
router.get('/nameCheck', function(req, res) {
    var params = req.query;
    schema.find({
        "wkCd": 'USR',
        "subSchema.usrName": params.usrName
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        console.log("★★★nameCheck★★★\n",result);
        if (result.length > 0) {
            res.json({ 
                svCd : params.svCd
               ,reCd : "02" 
            })
        } else {
            res.json({
                svCd : params.svCd
               ,reCd : '01' 
        });
        }
    });
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

router.post('/login', function(req, res) {
    console.log("/login");
    var params = req.query;

    schema.find({
        workSection: 'USR',
        "subSchema.mem_id": params.loginId,
        "subSchema.mem_pw": params.password
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        if (result.length > 0) {
            res.json({ "returnCode": '01', name: result[0].subSchema.mem_name });
        } else {
            res.json({ "returnCode": "02" })
        }
    });
});

router.post('/idSearch',function(req,res){
    var params = req.query;
    console.log('/idSearch() \n',params);
    schema.find({
        workSection: 'USR',
        "subSchema.mem_phone": params.phoneNumber,
        "subSchema.mem_name": params.name
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        if (result.length > 0) {
            console.log("★★★ result ★★★ \n",result[0]);
            res.json({ "returnCode": '01', "loginId": result[0].subSchema.mem_id });
        } else {
            res.json({ "returnCode": "02" })
        }
    });
});

router.post('/pwSearch',function(req,res){
    var params = req.query;
    var phoneNubmer = params.phoneNumber;
    var loginId = params.loginId;
    var _id;
    schema.find({
        workSection: 'USR',
        "subSchema.mem_id": loginId,
        "subSchema.mem_phone": phoneNubmer
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        console.log(result);
        if (result.length > 0) {
            _id = result[0]._id;
            var newPw = random.getRandom();
            console.log('pwSearch || ',newPw);
            
            let emailParam = {
                toEmail : loginId
                ,subject  : 'MyRentCar 비밀번호 초기화'
                ,text : '초기화 된 비밀번호는 '+newPw+' 입니다. 로그인 후 변경하시기 바랍니다.'
            };
            mail.sendGmail(emailParam);
            // 비밀번호 업데이트
            schema.updateOne({
                "_id" : _id
            }
            , { $set: {'subSchema.mem_pw': newPw } }
            , function(err, result) {
                if (err) {
                    console.log('error \n', err);
                    return res.status(500).send("select error >> " + err)
                }
                if (result.n) {
                    console.log("★★★ result ★★★ \n",result.n);
                    // res.json({ "returnCode": '01', "loginId": result[0].subSchema.mem_id });
                } else {
                    console.log("★★★ fail ★★★ \n",result.n);
                    // res.json({ "returnCode": "02" })
                }
            });

            res.json({ "returnCode": '01' });
        } else {
            res.json({ "returnCode": "02" })
        }
    });
});

/*
router.get('/pwChange',function(req,res){
    // let parms = req.query;
    // let loginId = parms.id;
    // let phoneNumber = parms.phoneNumbmer;
    var newPw = random.getRandom();
    console.log('/pwChange');

    schema.updateOne({
        workSection: 'USR'
        ,"subSchema.mem_id": "*"
        ,"subSchema.mem_phone": '*'
    }
    , { $set: {'subSchema.mem_pw': newPw } }
    , function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        if (result.n) {
            console.log("★★★ result ★★★ \n",result.n);
            // res.json({ "returnCode": '01', "loginId": result[0].subSchema.mem_id });
        } else {
            console.log("★★★ fail ★★★ \n",result.n);
            // res.json({ "returnCode": "02" })
        }
    });
});
*/

module.exports = router;