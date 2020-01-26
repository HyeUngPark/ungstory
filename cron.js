const cron = require('node-cron'); 
const request = require('request'); 
const url = require('url'); 
// 3분 주기로 해당 웹서버에 요청 

// var task = cron.schedule('*/3 * * * *', () => { 
//     console.log(request);
//     request(url, function (error, response, body) {
//          if (response && response.statusCode == 200) { 
//             console.log(url + ' connected successfully'); 
//             return; 
//     } console.error(url + ' fail to connect'); 
//     }); 
//     }, 
//     { scheduled: false }); 
//     task.start(); 
//     console.log('task start');
