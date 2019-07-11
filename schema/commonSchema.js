/* 
    commonSchema.js
*/
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    wkCd: { // 업무 구분 USR(회원) PST(포스팅) COM(공통)
        type: String,
        required: true
    }
    ,WkDtCd:{  // 업무 상세코드 UM(회원관리) PM(포스팅관리)
        type : String 
        ,required :false
    }
    ,fstWrDt: { // 최초작성일
        type: Date,
        required: true
    },
    lstWrDt: { // 최근수성일
        type: Date,
        default: Date.now
    },
    subSchema: { // 업무별 하위 스키마
        type: mongoose.Schema.Types.Mixed
    }
});

mongoose.model('UngStory', schema);

module.exports = mongoose.model('UngStory');