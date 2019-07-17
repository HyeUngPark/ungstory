/* 
    암호화 모듈
*/
const crypto = require('crypto');

var encrypt = {
    getEncrypt : function(param){
        return crypto.createHash('sha512').update(param).digest('hex');
    }
}

module.exports = encrypt;