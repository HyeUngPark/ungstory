import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
  NavLink,
} from "reactstrap";

import PostWriteModal from '../../modals/PostWriteModal';
import * as api from "api/api";

class UserNavbar extends React.Component {
  state ={
    loginYn : false
    ,usrName : ''
    ,dropdownOpen:false
    ,isModalOpen:false
  };
  constructor(props){
    super(props);
  }
  
  componentDidMount(){
    if(localStorage.getItem('usrInfo')){
      this.sessionCheck();
    }
  }

  loginCkCallback= (result) =>{
      if(result.reCd==="01"){
        console.log('login 상태 \n',this.state.loginYn);
        this.setState({
          loginYn : true
        });

        let usrInfo = JSON.parse(localStorage.getItem('usrInfo'));
        if(usrInfo){
          this.setState({
            usrName : usrInfo.usrName
          });
        }
      }else if(result.reCd ==='02'){
        console.log('비 login 상태 \n',this.state.loginYn);
        this.setState({
          loginYn : false
        });
      }
    }

  sessionCheck =()=>{
    // 세션 체크
    var param={
      usrToken : JSON.parse(localStorage.getItem('usrInfo')).usrToken
    }
    api.apiSend('post','loginCk',param,this.loginCkCallback);
  }

  // closes the collapse
  noticeClick = (e, index) => {
    console.log("noticeClick >> ", index);
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
    return (
      <>
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container fluid>
            <Link
              className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
              to="/"
            >
              {this.props.brandText}
            </Link>
            <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            {/* 검색 */}
              <FormGroup className="mb-0">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Search" type="text" />
                </InputGroup>
              </FormGroup>
              &nbsp;&nbsp;&nbsp;

              <div
                style={{ display: (this.state.loginYn ? 'inherit' : 'none') }}
              >
              {/* 친구추가 알림 */}
              <FormGroup className="mb-0 form-control-cursor" onClick={e=>this.noticeClick(e,1)}>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className=" ni ni-single-02"/>
                        &nbsp;
                      </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              &nbsp;&nbsp;&nbsp;

              {/* 메시지 알림 */}
              <FormGroup className="mb-0 form-control-cursor" onClick={e=>this.noticeClick(e,2)}>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className=" ni ni-chat-round"></i>
                        &nbsp;
                      </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              &nbsp;&nbsp;&nbsp;

              {/* 게시글 알림 */}
              <FormGroup className="mb-0 form-control-cursor" onClick={e=>this.noticeClick(e,3)} href="#">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                          <i className=" ni ni-bulb-61"></i>
                          &nbsp;
                      </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              &nbsp;&nbsp;&nbsp;
              </div>
            {/* 비 회원 */}
            <div
              style={{ display: (!this.state.loginYn ? 'inherit' : 'none') }}
            >
              <FormGroup className="mb-0 form-control-cursor">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                      
                        <Link
                        className="input-group-text"
                              to="/auth/login"
                              tag={Link}
                            >
                            <i className="ni ni-key-25" />
                            <span
                              className="nav-link-inner--text"
                            >
                              &nbsp;Login&nbsp;
                            </span>
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
              <Nav className="align-items-center d-none d-md-flex" navbar>
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
                          {this.state.usrName} 님
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
                    <DropdownItem href="#pablo" onClick={this.logout}>
                      <i className="ni ni-user-run" />
                      <span>Logout</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </div>
        
          </Container>
        </Navbar>
      </>
    );
  }
}

export default UserNavbar;
