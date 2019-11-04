import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Container,
} from "reactstrap";

import LoginProfile from '../../views/auth/LoginProfile';
import FrdReqList from '../../modals/frd/FrdReqList';
import * as api from "api/api";

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
  noticeClearCallback = (rs) => {
    if(rs.reCd === '01'){
      console.log('친구 알람 클리어 성공');
    }else{
      console.log('친구 알람 클리어 실패');
    }
    if(rs.noticeList){
      this.setState({
        noticeList : rs.noticeList
      });
    }
  }
  
  noticeClear = () => {
    // notice clear callback
    if(localStorage.getItem('usrInfo')){
      let param={
        usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
      };
      api.apiSend('post','/not/getNoticeList',param,this.noticeClearCallback);
    }
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
              <FormGroup className="mb-0 form-control-cursor">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                  <InputGroupText
                        style={{
                          position: "relative"
                        }}
                      >
                          <FrdReqList callbackFromParent={this.noticeClear}/>
                            {this.state.noticeList && this.state.noticeList.frdNotice > 0 ?
                              <span className="form-control-notice"
                                    // value={index} 
                                    style ={{
                                      position:'absolute',
                                      right:'0px',
                                      top:'0px',
                                    }}
                              >
                                {this.state.noticeList.frdNotice}
                              </span>
                            : ''
                            }
                        </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              &nbsp;&nbsp;&nbsp;

              {/* 메시지 알림 */}
              <FormGroup className="mb-0 form-control-cursor">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                  <InputGroupText
                        style={{
                          position: "relative"
                        }}
                      >
                          <a href="javascript:void(0)" 
                            className="form-control-cursor"
                          //  onClick={e=>{this.imgView(index,e)}}
                          >
                          <i className=" ni ni-chat-round"></i>
                          &nbsp;
                          </a>
                            {this.state.noticeList && this.state.noticeList.msgNotice > 0 ?
                              <span className="form-control-notice"
                                    // value={index} 
                                    style ={{
                                      position:'absolute',
                                      right:'0px',
                                      top:'0px',
                                    }}
                              >
                                {this.state.noticeList.msgNotice}
                              </span>
                            : ''
                            }
                        </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              &nbsp;&nbsp;&nbsp;

              {/* 게시글 알림 */}
              <FormGroup className="mb-0 form-control-cursor" href="#">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                  <InputGroupText
                        style={{
                          position: "relative"
                        }}
                      >
                          <a href="javascript:void(0)" 
                            className="form-control-cursor"
                          //  onClick={e=>{this.imgView(index,e)}}
                          >
                          <i className=" ni ni-bulb-61"></i>
                          &nbsp;
                          </a>
                            {this.state.noticeList && this.state.noticeList.pstNotice > 0 ?
                              <span className="form-control-notice"
                                    // value={index} 
                                    style ={{
                                      position:'absolute',
                                      right:'0px',
                                      top:'0px',
                                    }}
                              >
                                {this.state.noticeList.pstNotice}
                              </span>
                            : ''
                            }
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
