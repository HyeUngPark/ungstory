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

module.exports = router;