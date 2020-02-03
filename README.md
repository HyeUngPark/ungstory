# 웅스토리

## 소개
```
React.js와 Node.js, MongoDB 학습을 위해 개발한 SNS 웹사이트 입니다.

프로젝트 기간 : 2019.06.17 ~ 2020.02.03
프로젝트 인원 : 1인
```
![메인화면](https://user-images.githubusercontent.com/45528487/73654219-777b5480-46ce-11ea-8811-ce48e1ae5520.PNG)


## 결과물

[웅스토리](https://ungstory.herokuapp.com/ "클릭 시 페이지 이동")

## 목표

```
1. RestAPI를 활용한 통신
2. npm의 다양한 모듈 활용
3. react.js에 대한 이해와 활용
4. node.js에 대한 이해와 활용
5. No-SQL에 대한 이해와 MongoDB 활용
```
## 개발환경

```
- Node.js version : 10.4.1
- React.js : 16.3.2
- Mongo DB version : 4.0.4
- 화면 template : argon-dashboard-react 1.0.0
- 개발 tool : Visual Studio Code 1.41.1 
- DB tool : Robo 3T 1.2
- Server : Node : local node server / DB : local DB Server
- 형상관리 : Git / Github
```
## 운영환경

```
- Node.js version : 10.4.1
- React.js : 16.3.2
- Mongo DB version : 3.6.9
- Server : Node : heroku / DB : mlab
```
## 프로젝트 트리
```
┌── myutils
│   ├── dateUtils.js
│   ├── encryptUtils.js
│   ├── mainUtils.js
│   ├── randomUtils.js
├── public
│   ├── apple-icon.png
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── route
│   ├── authRouter.js
│   ├── commonRouter.js
│   ├── friendRouter.js
│   ├── messageRouter.js
│   ├── noticeRouter.js
│   └── userRouter.js
├── schema
│   ├── commonSchema.js
│   ├── friendSchema.js
│   ├── loginSchema.js
│   ├── messageSchema.js
│   ├── messageStateSchema.js
│   ├── noticeSchema.js
│   ├── postCmtSchema.js
│   ├── postSchema.js
│   └── userSchema.js
├── .gitignore
├── hlog.bat
├── LICENSE
├── mongo.js
├── server.js
├── README.md
├── package.json
└── src
    ├── assets
    │   ├── css
    │   │   ├── argon-dashboard-react.css
    │   │   ├── argon-dashboard-react.css.map
    │   │   └── argon-dashboard-react.min.css
    │   ├── fonts
    │   │   └── nucleo
    │   ├── img
    │   │   ├── brand
    │   │   ├── icons
    │   │   │   └── common
    │   │   └── theme
    │   ├── scss
    │   │   ├── argon-dashboard-react.scss
    │   │   ├── my.scss
    │   │   ├── bootstrap
    │   │   │   ├── mixins
    │   │   │   └── utilities
    │   │   ├── core
    │   │   │   ├── alerts
    │   │   │   ├── avatars
    │   │   │   ├── badges
    │   │   │   ├── buttons
    │   │   │   ├── cards
    │   │   │   ├── charts
    │   │   │   ├── close
    │   │   │   ├── custom-forms
    │   │   │   ├── dropdowns
    │   │   │   ├── footers
    │   │   │   ├── forms
    │   │   │   ├── headers
    │   │   │   ├── icons
    │   │   │   ├── list-groups
    │   │   │   ├── maps
    │   │   │   ├── masks
    │   │   │   ├── mixins
    │   │   │   ├── modals
    │   │   │   ├── navbars
    │   │   │   ├── navs
    │   │   │   ├── paginations
    │   │   │   ├── popovers
    │   │   │   ├── progresses
    │   │   │   ├── separators
    │   │   │   ├── tables
    │   │   │   ├── type
    │   │   │   ├── utilities
    │   │   │   └── vendors
    │   │   ├── custom
    │   │   └── react
    │   └── vendor
    │       ├── @fortawesome
    │       │   └── fontawesome-free
    │       │       ├── LICENSE.txt
    │       │       ├── css
    │       │       ├── js
    │       │       ├── less
    │       │       ├── scss
    │       │       ├── sprites
    │       │       ├── svgs
    │       │       │   ├── brands
    │       │       │   ├── regular
    │       │       │   └── solid
    │       │       └── webfonts
    │       └── nucleo
    │           ├── css
    │           └── fonts
    ├── components
    │   ├── Footers
    │   │   ├── AdminFooter.jsx
    │   │   └── AuthFooter.jsx
    │   ├── Headers
    │   │   ├── Header.jsx
    │   │   └── UserHeader.jsx
    │   ├── Loadings
    │   │   └── Loading.jsx
    │   ├── Navbars
    │   │   ├── AdminNavbar.jsx
    │   │   └── AuthNavbar.jsx
    │   └── Sidebar
    │       └── Sidebar.jsx
    ├── layouts
    │   ├── Auth.jsx
    │   └── User.jsx
    ├── modals
    │   ├── auth
    │   │   ├── PostImmgList.jsx
    │   │   ├── ProfileChange.jsx
    │   │   ├── ProfileMsgChange.jsx
    │   │   ├── PwFindModal.jsx
    │   │   ├── UsrPostImgList.jsx
    │   │   └── UsrProfileCheck.jsx
    │   ├── frd
    │   │   ├── FrdInfo.jsx
    │   │   ├── FrdReqList.jsx
    │   │   └── FriendList.jsx
    │   ├── msg
    │   │   └── MsgList.jsx
    │   ├── not
    │   │   └── NoticeList.jsx
    │   ├── user
    │   │   ├── PostDetailModal.jsx
    │   │   ├── PostModifyModal.jsx
    │   │   └── PostWriteModal.jsx
    │   ├── Auth.jsx
    │   └── User.jsx
    ├── views
    │   ├── auth
    │   │   ├── Login.jsx
    │   │   ├── LoginProfile.jsx
    │   │   └── Register.jsx
    │   ├── user
    │   │   ├── ActiveSearch.jsx
    │   │   ├── FriendSearch.jsx
    │   │   ├── MsgSend.jsx
    │   │   ├── PostSearch.jsx
    │   │   └── Profile.jsx
    │   └── index.jsx
    ├── utils
    │   ├── apis.js
    │   ├── date.js
    │   └── popup.js
    ├── index.js
    └── routes.js
```


## 사용한 모듈

```
## Backend

"cross-env" : "5.2.0"
"crypto" : "1.0.1"
"dotenv": "6.0.0"
"express" : "4.17.1"
"jsonwebtoken": "8.5.1"
"moment": "2.24.0"
"moment-timezone": "0.5.26"
"mongoose" : "5.6.0"
"node-cron" : "2.0.3"
"password-validator" : "4.1.1"
"socket.io": "2.3.0"
"socket.io-adapter": "1.1.2"
"socket.io-client": "2.3.0"

## Front

"axios" : "0.19.0"
"reactstrap" : "7.1.0"
"react-bootstrap-modal" : "4.2.0"
"react-confirm-alert" : "2.4.1"
"react-datepicker" : "2.9.6"
"react-photo-gallery " : "7.0.2"
"react-router-dom" : "4.3.1"
"react-spinners" : "0.7.2"
"socket.io-client": "2.3.0"
```
