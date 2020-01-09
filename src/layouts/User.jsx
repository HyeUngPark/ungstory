import React from "react";
import { Route, Switch } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import UserNavbar from "components/Navbars/UserNavbar.jsx";
import UserFooter from "components/Footers/UserFooter.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import Loading from "components/Loadings/Loading.jsx";

import routes from "routes.js";

class User extends React.Component {

  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/user") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/",
            imgSrc: require("assets/img/brand/ungstory_logo.png"),
            imgAlt: "..."
          }}
        />
        <div className="main-content" ref="mainContent">
          <UserNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <div id="loadingUser"><Loading/></div>
          <Switch>{this.getRoutes(routes)}</Switch>
          <Container fluid>
            <UserFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default User;
