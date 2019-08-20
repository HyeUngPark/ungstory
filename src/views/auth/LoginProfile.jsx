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
  Button
} from "reactstrap";

import PostWriteModal from '../../modals/user/PostWriteModal';
import * as api from "api/api";

class LoginProfile extends React.Component {
 
    state ={
        loginYn : false
        ,usrName : ''
        ,dropdownOpen:false
        ,isModalOpen:false
    }

    toggle = (e) =>{
        console.log("Nav's toggle()");
        if (!this.state.isModalOpen){
          this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
          }));
        }
    }

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
        }else if(result.reCd === '03'){
            let usrInfo = JSON.parse(localStorage.getItem('usrInfo'));
            usrInfo.usrToken = result.usrToken;
            localStorage.setItem('usrInfo',JSON.stringify(usrInfo));
            this.sessionCheck();
        }else if(result.reCd === '04'){
            this.logout();
        }
      }
  
    sessionCheck =()=>{
      // 세션 체크
      var param={
        usrToken : JSON.parse(localStorage.getItem('usrInfo')).usrToken
        ,usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
        ,autoLoginCd : JSON.parse(localStorage.getItem('usrInfo')).autoLoginCd
      }
      api.apiSend('post','loginCk',param,this.loginCkCallback);
    }

    logoutCallback = (result) =>{
        if(result.reCd==='01'){
          console.log("로그아웃 성공");
          // local storage 파기
          localStorage.removeItem('usrInfo');
          window.location.reload();

        //   this.props.history.push('/');
        }else{
          console.log('로그아웃 실패');
        }
    }
    
    logout = () =>{
        // logoutapi 호출
        let param={
            usrToken : JSON.parse(localStorage.getItem('usrInfo')).usrToken
        };
        api.apiSend('post','/auth/logout',param,this.logoutCallback);
    }

    componentDidMount(){
        if(localStorage.getItem('usrInfo')){
            this.sessionCheck();
        }
    }

    render() {
        let loginButton, profile= null;
        if(this.props.isMobile === 'N'){ // PC
            loginButton = <>
                <Link
                    className="input-group-text"
                    to="/auth/login"
                    tag={Link}
                >
                    <i className="ni ni-key-25" /><span className="nav-link-inner--text">&nbsp;Login&nbsp;</span>
                </Link> 
            </>;
            profile = <>
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
            </>;
        }else{ // Mobile
            loginButton = <>
                <Link
                    to="/auth/login"
                    tag={Link}
                >
                    <Button color="primary" type="button"><i className="ni ni-key-25" /><span className="nav-link-inner--text">Login</span></Button>
                </Link>
            </>;
            profile = <>
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
            </>;            
        }
        return (
          <>
            {/* 비 회원 */}
            <div
             style={{ display: (!this.state.loginYn ? 'inherit' : 'none') }}
            >
            <FormGroup className="mb-0 form-control-cursor">
            <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                    {loginButton}
                </InputGroupAddon>
            </InputGroup>
            </FormGroup>
            </div>
            {/* 회원 */}
            <div
                style={{ display: (this.state.loginYn ? 'inherit' : 'none') }}
            >
                {profile}
            </div>
        </>
    );
  }
}

export default LoginProfile;
