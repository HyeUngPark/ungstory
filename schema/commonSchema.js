/* 
    commonSchema.js
*/
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    workSection: { // 업무 구분 PRODUCT(상품) ORDER(주문) MEMBER(회원)
        type: String,
        required: true
    }
    // ,workDetailCode:{  // 업무 상세코드 PM(상품관리) OM(주문관리) MM(회원관리)
    //     type : String 
    //     ,required :true
    // }
    ,
    firstWriteDate: { // 최초작성일
        type: Date,
        required: true
    },
    lastUpdateDate: { // 최근수성일
        type: Date,
        default: Date.now
    },
    subSchema: { // 업무별 하위 스키마
        type: mongoose.Schema.Types.Mixed
    }
});

mongoose.model('UngStory', schema);

module.exports = mongoose.model('UngStory');