import React from "react";

// reactstrap components
import {Container } from "reactstrap";

import authContainer from 'containers/authContainer';

class Header extends React.Component {
  render() {
    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">

            </div>
          </Container>
          <authContainer />
        </div>
      </>
    );
  }
}

export default Header;
