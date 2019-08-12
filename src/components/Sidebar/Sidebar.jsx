/*eslint-disable*/
import React from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Button
} from "reactstrap";

import PostWriteModal from '../../modals/PostWriteModal';
import * as api from "api/api";

class Sidebar extends React.Component {
  state = {
    collapseOpen: false
    ,isModalOpen : false
    ,dropdownOpen : false
    ,loginYn : false
  };
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
  }

  componentDidMount(){
    if(localStorage.getItem('usrInfo')){
      this.sessionCheck();
    }
  }

  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  // toggles collapse between opened and closed (true/false)
  toggleCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  // closes the collapse
  closeCollapse = () => {
    this.setState({
      collapseOpen: false
    });
  };
  // creates the links that appear in the left menu / Sidebar
  createLinks = routes => {
    return routes.map((prop, key) => {
      return (
        <NavItem key={key}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={this.closeCollapse}
            activeClassName="active"
          >
            <i className={prop.icon} />
            {prop.name}
          </NavLink>
        </NavItem>
      );
    });
  };
  
  modalOpen =(e)=>{
    console.log("Nav's modalOpen()");
    this.setState(prevState=>({
      isModalOpen:!prevState.isModalOpen
    }));
  }
  
  modalClose =(e)=>{
    console.log("Nav's, modalClose()");
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen
      ,dropdownOpen: true
    }));
  }

  loginCkCallback= (result) =>{
    if(result.reCd==="01"){
      console.log('login 상태 \n');
      this.setState({
        loginYn : true
      });
    }else if(result.reCd ==='02'){
      console.log('비 login 상태 \n');
      this.setState({
        loginYn : false
      });
    }
  }

  sessionCheck =()=>{
    // 세션 체크
    console.log('sidebar session check');
    var param={
      usrToken : JSON.parse(localStorage.getItem('usrInfo')).usrToken
    }
    api.apiSend('post','loginCk',param,this.loginCkCallback);
  }

  toggle = (e) =>{
    console.log("Nav's toggle()");
    if (!this.state.isModalOpen){
      this.setState(prevState => ({
        dropdownOpen: !prevState.dropdownOpen
      }));
    }
  }

  logoutCallback = (result) =>{
    if(result.reCd==='01'){
      console.log("로그아웃 성공");
      // local storage 파기
      localStorage.removeItem('usrInfo');

      this.props.history.push('/');
    }else{
      console.log('로그아웃 실패');
    }
  }

  logout = () =>{
    // logoutapi 호출
    let param={};
    api.apiSend('post','/auth/logout',param,this.logoutCallback);
  }

  render() {
    const { bgColor, routes, logo } = this.props;
    let navbarBrandProps;
    if (logo && logo.innerLink) {
      navbarBrandProps = {
        to: logo.innerLink,
        tag: Link
      };
    } else if (logo && logo.outterLink) {
      navbarBrandProps = {
        href: logo.outterLink,
        target: "_blank"
      };
    }
    return (
      <Navbar
        className="navbar-vertical fixed-left navbar-light bg-white"
        expand="md"
        id="sidenav-main"
      >
        <Container fluid>
          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={this.toggleCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>
          {/* Brand */}
          {logo ? (
            <NavbarBrand className="pt-0" {...navbarBrandProps}>
              <img
                alt={logo.imgAlt}
                className="navbar-brand-img"
                src={logo.imgSrc}
              />
            </NavbarBrand>
          ) : null}
          {/* User */}
          <Nav className="align-items-center d-md-none">
 
          <Form
          
           >
          {/* 비 회원 */}
          <div
            style={{ display: (!this.state.loginYn ? 'inherit' : 'none') }}
          >
              <FormGroup className="mb-0 form-control-cursor">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                      <Link
                        // className="input-group-text"
                              to="/auth/login"
                              tag={Link}
                            >
                            <Button
                              color="primary" 
                              type="button"
                            >
                              <i className="ni ni-key-25" />
                              <span
                                className="nav-link-inner--text"
                              >
                                Login
                              </span>  
                            </Button>
                        </Link> 
                    </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </div>
            </Form>

          {/* 회원 */}
          <div
             style={{ display: (this.state.loginYn ? 'inherit' : 'none') }}
          >
              {/* <Nav className="align-items-center d-none d-md-flex" navbar> */}
                <UncontrolledDropdown nav 
                isOpen={this.state.dropdownOpen} toggle={this.toggle}
                >
                  <DropdownToggle className="pr-0" nav>
                    <Media className="align-items-center">
                      <span className="avatar avatar-sm rounded-circle">
                        <img
                          alt="..."
                          src={require("assets/img/theme/team-4-800x800.jpg")}
                        />
                      </span>
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold">
                          박혜웅
                        </span>
                      </Media>
                    </Media>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-arrow" right>
                    <DropdownItem className="noti-title" header tag="div">
                      <h6 className="text-overflow m-0">Welcome!</h6>
                    </DropdownItem>
                    <a href="javascript:void(0)" onClick={this.modalOpen}>
                      <PostWriteModal callbackFromParent={this.modalClose}/>
                    </a>
                    <DropdownItem to="/admin/user-profile" tag={Link}>
                        <i className="ni ni-single-02" />
                        <span>내 프로필</span>
                    </DropdownItem>
                    <DropdownItem to="/admin/user-profile" tag={Link}>
                      <i className="ni ni-support-16" />
                      <span>Support</span>
                    </DropdownItem>
                    <DropdownItem to="/admin/user-profile" tag={Link}>
                      <i className="ni ni-settings-gear-65" />
                      <span>설정</span>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem href="#" onClick={this.logout}>
                      <i className="ni ni-user-run" />
                      <span>Logout</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              {/* </Nav> */}
            </div>
          {/* 
          
            <UncontrolledDropdown nav>
              <DropdownToggle nav className="nav-link-icon">
                <i className="ni ni-bell-55" />
              </DropdownToggle>
              <DropdownMenu
                aria-labelledby="navbar-default_dropdown_1"
                className="dropdown-menu-arrow"
                right
              >
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          
          */}
            <UncontrolledDropdown nav>
{/*
            <DropdownToggle nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <h1>여기!!</h1>
                    <img
                      alt="..."
                      src={require("assets/img/theme/team-1-800x800.jpg")}
                    />
                  </span>
                </Media>
              </DropdownToggle> 
            */}

              {/* 
                Sidebar menu
              */}
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={e => e.preventDefault()}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav> 
           {/* Collapse */}
          <Collapse navbar isOpen={this.state.collapseOpen}>
            {/* Collapse header */}
            <div className="navbar-collapse-header d-md-none">
              <Row>
                {logo ? (
                  <Col className="collapse-brand" xs="6">
                    {logo.innerLink ? (
                      <Link to={logo.innerLink}>
                        <img alt={logo.imgAlt} src={logo.imgSrc} />
                      </Link>
                    ) : (
                      <a href={logo.outterLink}>
                        <img alt={logo.imgAlt} src={logo.imgSrc} />
                      </a>
                    )}
                  </Col>
                ) : null}
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={this.toggleCollapse}
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            {/* Form */}
            <Form className="mt-4 mb-3 d-md-none">
              <InputGroup className="input-group-rounded input-group-merge">
                <Input
                  aria-label="Search"
                  className="form-control-rounded form-control-prepended"
                  placeholder="Search"
                  type="search"
                />
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <span className="fa fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Form>
            {/* Navigation */}
            <Nav navbar>{this.createLinks(routes)}</Nav>
            {/* Divider */}
            <hr className="my-3" />
            {/* Heading */}
            <h6 className="navbar-heading text-muted">Documentation</h6>
            {/* Navigation */}
            <Nav className="mb-md-3" navbar>
              <NavItem>
                <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/documentation/overview?ref=adr-admin-sidebar">
                  <i className="ni ni-spaceship" />
                  Getting started
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/documentation/colors?ref=adr-admin-sidebar">
                  <i className="ni ni-palette" />
                  Foundation
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/documentation/alerts?ref=adr-admin-sidebar">
                  <i className="ni ni-ui-04" />
                  Components
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

Sidebar.defaultProps = {
  routes: [{}]
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired
  })
};

export default Sidebar;
