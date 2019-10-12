import Index from "views/Index.jsx";
import Profile from "views/user/Profile.jsx";
import Tables from "views/user/Tables.jsx";
import FriendSearch from "views/user/FriendSearch.jsx";
import Icons from "views/user/Icons.jsx";

import Register from "views/auth/Register.jsx";
import Login from "views/auth/Login.jsx";

var routes =[
  {
    path: "/index",
    name: "Main",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/user"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: Icons,
    layout: "/user"
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth"
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/user"
  },
  {
    path: "/friend-Search",
    name: "Friend Search",
    icon: "ni ni-single-02",
    component: FriendSearch,
    layout: "/user"
  },
];
/* 
  회원 전용 메뉴
*/
// 프로필 페이지
  if(localStorage.getItem('usrInfo')){
  routes.push(
    {
      path: "/user-profile",
      name: "User Profile",
      icon: "ni ni-single-02 text-yellow",
      component: Profile,
      layout: "/user"
    });
  }

/* 
  비회원 전용 메뉴
*/

export default routes;
