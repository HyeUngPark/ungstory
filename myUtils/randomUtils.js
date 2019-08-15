/* 
    난수 생성 모듈
*/

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
    }
}

module.exports = random;