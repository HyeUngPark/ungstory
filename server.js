var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var serveStatic = require('serve-static');
var path = require('path');
var port = process.env.PORT || 5000;
var db = require('./mongo');
var date = require('./myUtils/dateUtils');

var request = require('request'); 
var url = require('url'); 

// mongoose local debugging setting
app.use(function(req,res,next){
  if(req.headers && req.headers.host === 'localhost:5000'){
      db.setDebug(false);
  }
  next();
});

/* 
router module
*/
var commonRouter = require('./route/commonRouter');
var userRouter = require('./route/userRouter');
var authRouter = require('./route/authRouter');
var frdRouter = require('./route/friendRouter');
var notRouter = require('./route/noticeRouter');
var msgRouter = require('./route/messageRouter');

var bodyParser = require('body-parser');
var session = require('express-session');
// var cookieParser =require('cookie-parser');

// app.use(express.cookieParser());
app.use(bodyParser.urlencoded({
    limit : '100mb'
    ,extended:true
}));
app.use(bodyParser.json({
    limit : '100mb'
    ,extended:true
}));
// app.use(cookieParser());

app.use(session({
  key: 'sid', 
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));

app.use(serveStatic(path.join(__dirname, '/build')));

app.use('/', commonRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/frd', frdRouter);
app.use('/not', notRouter);
app.use('/msg', msgRouter);

var usrList =[];

io.on('connection', (socket) => {
  socket.on('usrName', (usrName)=>{
    console.log('★★★ user ',usrName,'connected ★★★\n');
    let usrInfo = {
      usrName : usrName
      ,socketId : socket.id
    };
    usrList.push(usrInfo);
  });
  socket.on('chat message', (msg) => {
    console.log(msg);
    let msgInfo = msg.split('###');
    
    // msgInfo[0] 발신자
    // msgInfo[1] 수신자
    // msgInfo[2] 메시지

    // 유저 접속 여부 확인
    var usrConCd ;
    for(let i=0; i<usrList.length; i++){
      if(usrList[i].usrName === msgInfo[1]){
        // 메시지 실시간 전송
        let now = date.getDate();
        msgInfo.push(date.dateFormat(now,'YYYY-MM-DD hh:mm:ss'));
        usrConCd = io.sockets.to(usrList[i].socketId).emit('reMsg',msgInfo);
      }
    }

    if(!usrConCd){
      // 소켓 접속중이 아니면 알람등록
      notRouter.msgNotAdd(msgInfo);
    }
    // 디비 저장
    msgRouter.msgSend(msgInfo);
  });
  socket.on('disconnect', () => {
    console.log('★★★ user disconnected ★★★');
    const itemToFind = usrList.find(function(item) {
      return item.socketId === socket.id
    });
    const idx = usrList.indexOf(itemToFind) 
    if (idx > -1){
      usrList.splice(idx, 1);
    } 
  });
});

var server = http.listen(port, function() {
  console.log("★★★ Server Started ★★★");
  console.log("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★");
  
  console.log("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★");
});

app.use(function(req,res,next){
  throw new Error(req.url + ' not Found');
});

app.use((err, req, res, next) => { // 404 처리 부분
  console.log("★★★ 404 error ★★★\n",err);
  res.status(404).redirect('/');
});

module.exports = app;