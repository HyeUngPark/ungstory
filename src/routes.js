import Index from "views/Index.jsx";
import Profile from "views/user/Profile.jsx";
import FriendSearch from "views/user/FriendSearch.jsx";
import PostSearch from "views/user/PostSearch.jsx";
import ActiveSearch from "views/user/ActiveSearch.jsx";
import MsgSend from "views/user/MsgSend.jsx";
// import Icons from "views/user/Icons.jsx";

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
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-planet text-blue",
  //   component: Icons,
  //   layout: "/user"
  // },
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
  if(localStorage.getItem('usrInfo') && JSON.parse(localStorage.getItem('usrInfo')).usrToken){
  routes.push(
    {
      path: "/user-profile",
      name: "User Profile",
      icon: "ni ni-single-02 text-yellow",
      component: Profile,
      layout: "/user"
    });
  routes.push(
    {
      path: "/post-search",
      name: "Post Search",
      icon: "ni ni-archive-2",
      component: PostSearch,
      layout: "/user"
    });
  routes.push(
    {
      path: "/active-search",
      name: "Active Search",
      icon: "ni ni-like-2 text-blue",
      component: ActiveSearch,
      layout: "/user"
    });
  routes.push(
    {
      path: "/msg-send",
      name: "Msg Send",
      icon: "ni ni-chat-round",
      component: MsgSend,
      layout: "/user"
    });
  }else{
/* 
  비회원 전용 메뉴
*/
  routes.push(
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  });
  routes.push(
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth"
  });
}

export default routes;
