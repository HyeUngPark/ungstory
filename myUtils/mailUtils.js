/* 
    메일 발송 모듈(gmail)
*/
var env = require('dotenv');
env.config();
var email = process.env.email;
var mailPw = process.env.mailPw;

var nodemailer = require('nodemailer');

var mailSender = {
    sendGmail : function(param){
        var transporter = nodemailer.createTransport({
            service: 'gmail'
            ,prot : 587
            ,host :'smtp.gmlail.com'
            ,secure : false
            ,requireTLS : true
            , auth: {
              user: email
              ,pass: mailPw
            }
        });
        var mailOptions = {
            from: email,
            to: param.toEmail,
            subject: param.subject,
            html: param.text,
            // text: param.text
        };
            
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        
    }
}

module.exports = mailSender;