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

import LoginProfile from '../../views/auth/LoginProfile';

class UserNavbar extends React.Component {
  state ={
    loginYn : false
    ,noticeList : {}
  };
  constructor(props){
    super(props);
  }
  sessionCheck =()=>{
    // 세션 체크
    let usrToken = JSON.parse(localStorage.getItem('usrInfo')).usrToken
    if(usrToken){
      this.setState({
        loginYn : true
      });
    }else{
      this.setState({
        loginYn : false
      });
    }
  }
  componentDidMount(){
    if(localStorage.getItem('usrInfo')){
        this.sessionCheck();
    }
}

  // closes the collapse
  noticeClick = (e, index) => {
    console.log("noticeClick >> ", index);
  };

  getNotice = (result)=>{
    this.setState({
      noticeList : result    
    });
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
              <LoginProfile isMobile = "N" callbackFromParent={this.getNotice}/>
          </Form>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default UserNavbar;
