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
import MsgList from '../../modals/msg/MsgList';
import Index from '../../views/Index';

import * as api from "utils/api";

class UserNavbar extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      noticeList : {
        frdNotice : 0
        ,msgNotice : 0
        ,pstNotice : 0
      }
      ,searchText : ''
    };
  }
  
  handleSubmit = (event) =>{
    event.preventDefault();
  }

  searchChange = (e) =>{
    this.setState({
      searchText : e.target.value
    });
  }
  
  search = () =>{
    if(this.state.searchText){
      console.log(`'${this.state.searchText}' 검색`);
      var index = <Index/>;
      console.log(index);
      index.props.getPost();
    }else{
      alert('검색하시려면 검색어를 입력해주세요.');
    }
    return;
  }

  noticeClearCallback = (rs) =>{
    if(rs.reCd === '01' && rs.noticeList){
      // console.log('친구 알람 클리어 성공');
      console.log("userNavBar's noticeClear change state\n",rs);
      this.setState({
        noticeList : rs.noticeList
      });
    }else{
      // console.log('친구 알람 클리어 실패');
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
    UserNavbar.defaultProps = {
      ntClear: ()=>{
        if(localStorage.getItem('usrInfo')){
          let param={
            usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
          };
          api.apiSend('post','/not/getNoticeList',param,(rs)=>{
            if(rs.reCd === '01' && rs.noticeList){
              // console.log('친구 알람 클리어 성공');
              this.setState({
                noticeList : rs.noticeList
              });
            }else{
              console.log('친구 알람 클리어 실패');
            }
          });
        }
      }
    };
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
            <Form className="justify-content-center navbar-search navbar-search-dark form-inline mr-3 d-md-flex ml-lg-auto"
             onSubmit={this.handleSubmit}>
            {/* 검색 */}
              <FormGroup className="mb-0">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Search" 
                         type="text" 
                         onChange={e=>{this.searchChange(e)}}
                         value={this.state.searchText}
                         onKeyPress={e=>{if(e.key==='Enter'){
                          this.search();
                        }}}
                         />
                </InputGroup>
              </FormGroup>
              &nbsp;&nbsp;&nbsp;
              </Form>
              {/* d-none */}
              <Form className="justify-content-center navbar-search navbar-search-dark form-inline mr-3 d-md-flex ml-lg-auto">
              <div
                style={{ display: ((localStorage.getItem('usrInfo') && JSON.parse(localStorage.getItem('usrInfo')).usrToken) ? 'inherit' : 'none') }}
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
                            {this.state.noticeList.frdNotice > 0 ?
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
                      <MsgList/>
                          {this.state.noticeList.msgNotice > 0 ?
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
                            {this.state.noticeList.pstNotice > 0 ?
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

export default UserNavbar
