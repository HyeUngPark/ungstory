/* 
    공통 라우팅
*/
var express = require('express');
var router = express.Router();
var schema = require('../schema/commonSchema');

router.get('/', function(req, res) {
    console.log("/");

    res.redirect('./index.html');
    // schema.find({
    //     workSection: 'APP'
    // }, function(err, result) {
    //     if (err) {
    //         console.log('error \n', err);
    //         return res.status(500).send("select error >> " + err)
    //     }
    //     if (result.length > 0) {
    //         res.json({ "returnCode": '01', app_version: result[0].subSchema.app_version });
    //     } else {
    //         res.json({ "returnCode": "02" })
    //     }
    // });

});

// router.get('/googlec9bbba10a3ea94c1.html', function(req, res) {
//     console.log("/호출!!!");
//     fs.readFile('googlec9bbba10a3ea94c1.html',function(err, data){
//         res.writeHead(200, {'content-Type':'text/html'});
//         res.end(data)
//     });
// });

module.exports = router;