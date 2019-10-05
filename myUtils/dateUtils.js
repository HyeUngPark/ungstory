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
    ,getWriteDate : function(time){
        let now = moment();
        let times = moment(time).format('YYYY-MM-DD HH:mm:ss');
        if(moment.duration(now.diff(times)).asHours()<=5){
            return '방금 전';
        }else if(moment.duration(now.diff(times)).asDays() <1){
            return Math.floor(moment.duration(now.diff(times)).asHours())+'시간 전('+moment(time).format('YYYY-MM-DD HH:mm')+')';
        }else{
            return Math.floor(moment.duration(now.diff(times)).asDays())+'일 전('+moment(time).format('YYYY-MM-DD HH:mm')+')';
        }
    }

}

module.exports = date;