/* 
    난수 생성 모듈
*/
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var random = {
    getRandomPw : function(){
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var spChars = "!@#$%^&*()[]-=_+";
        var string_length = 12;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
            if(i!==string_length-1){
                let rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum,rnum+1);
            }else{
                let rnum = Math.floor(Math.random() * spChars.length);
                randomstring += spChars.substring(rnum,rnum+1);
            }
        }
        return randomstring;
    },
    getPk : function(pkLength){
        var cmtPk = '';
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var now = moment().format('YYYYMMDDHHmmss');
        for (var i=0; i<pkLength; i++) {
            let rnum = Math.floor(Math.random() * chars.length);
            cmtPk += chars.substring(rnum,rnum+1);
        }
        return now+cmtPk;
    }
}

module.exports = random;