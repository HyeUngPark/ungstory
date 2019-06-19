var express = require('express');
var app = express();
var serveStatic = require('serve-static');
var path = require('path');
var port = process.env.PORT || 5000;
var db = require('./mongo');
/* 
router module
*/
var commonRouter = require('./route/commonRouter');

app.use(serveStatic(path.join(__dirname, '/build')));
app.use('/', commonRouter);
// app.use('/member', memberRouter);

var server = app.listen(port, function() {
    console.log("★★★ Server Started ★★★");
});

app.use((req, res, next) => { // 404 처리 부분
    console.log("/404");
    res.status(404).redirect('/');
  });
 
module.exports = app;