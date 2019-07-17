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
var userRouter = require('./route/userRouter');
var authRouter = require('./route/authRouter');
var bodyParser = require('body-parser');
// var flash = require('req-flash');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// app.use(flash());

app.use(serveStatic(path.join(__dirname, '/build')));
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/', commonRouter);

var server = app.listen(port, function() {
    console.log("★★★ Server Started ★★★");
});

app.use((req, res, next) => { // 404 처리 부분
    console.log("/404\n");
    res.status(404).redirect('/');
  });
 
module.exports = app;