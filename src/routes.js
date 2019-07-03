import Index from "views/Index.jsx";
import Profile from "views/user/Profile.jsx";
import Tables from "views/user/Tables.jsx";
import Icons from "views/user/Icons.jsx";

import Register from "views/auth/Register.jsx";
import Login from "views/auth/Login.jsx";

var routes = [
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
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/user"
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
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
  }
];
export default routes;
