/* 
    날짜 모듈
*/
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var date = {
    getDate : function(){
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }
}

module.exports = date;