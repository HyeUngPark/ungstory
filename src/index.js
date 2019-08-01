import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import UserLayout from "layouts/User.jsx";
import AuthLayout from "layouts/Auth.jsx";


ReactDOM.render(
  <BrowserRouter>
      <Switch>
        <Route path="/user" render={props => <UserLayout {...props} />} />
        <Route path="/auth" render={props => <AuthLayout {...props} />} />
        <Redirect from="/" to="/user/index" />
      </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

