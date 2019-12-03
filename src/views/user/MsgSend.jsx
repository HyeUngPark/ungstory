import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
// core components

import Header from "components/Headers/Header.jsx";

import * as api from "utils/api";
import * as popup from "utils/popup";

import FrdInfo from '../../modals/frd/FrdInfo';

import socketIoClient from 'socket.io-client';

var socket;

class MsgSend extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchName : ''
      ,searchList : []
      ,searchCd : false 
      ,selectCd : false 
      ,wrMsg : ''
      ,selectInfo : {}
    }
  }
  friendSearchCallback =(rs) =>{
    if(rs.reCd === '01'){
      this.setState({
        searchList : rs.frdList
        ,searchCd : true
      });
      this.dropToggle();
    }else{
      this.setState({
        searchCd : false
      });
    }
  }

  friendSearch =(e)=>{
    let searchName = e.target.value;

    this.setState({
        searchName : searchName
    });
    
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    
    if(special_pattern.test(searchName) === true ){
      alert('특수문자는 사용할 수 없습니다.');
      return;
    }

    if(searchName !== ''){
      let param={
        usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
        ,searchName : searchName
      };
      api.apiSend('post','/frd/frendSearch',param,this.friendSearchCallback);      
    }else{
      this.dropClear();
    }
  }
  selectFrd=(frdIdx)=>{
    console.log(frdIdx,'번째 친구 선택');
    // 해당하는 친구 메시지 조회
    let select ={
      usrName : this.state.searchList[frdIdx].usrName
      ,usrPt : this.state.searchList[frdIdx].usrPt
    };
    this.setState({
      selectCd : true
      ,selectInfo : select
    });
    this.dropClear();
  }

  dropClear = () =>{
    this.setState({
      searchList : []
      ,searchName : ''
    });
    this.dropToggle();
  }

  dropToggle = ()=>{
    this.setState({
      searchCd : !this.state.searchCd
    })
  }

  msgChnage = (e) =>{
    this.setState({
      wrMsg : e.target.value
    });
  }

  msgSend = () =>{
    // 메시지 전송 => 전송 후 메시지 받아오기
    // const socket = socketIoClient(window.location.origin);
    socket.emit('chat message'
                ,JSON.parse(localStorage.getItem('usrInfo')).usrName
                  +"###"
                  + this.state.selectInfo.usrName
                  +"###"
                  +this.state.wrMsg
                );
    this.setState({
      wrMsg : ''
    });
  }

  componentDidMount(){
    socket = socketIoClient(window.location.origin);
    socket.emit('usrName',JSON.parse(localStorage.getItem('usrInfo')).usrName);
    socket.on('reMsg', data=>{
      console.log(data);
      // socket.emit('chat message','클라이언트 소켓 테스트');
    });
  }

  componentWillUnmount(){
    socket.off('chat message');
    socket.off('reMsg');
  }

  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">메시지 작성</h3>
                </CardHeader>
                <div>
                <Row className="text-center justify-content-center">
                  <Col lg="8">
                    <div>
                      <input className="form-control form-input-left-margin" 
                              placeholder="검색할 닉네임을 입력하세요."
                              // style={{width:"50%"}} 
                              value={this.state.searchName}
                              onChange={e=>{this.friendSearch(e)}}
                              onKeyPress={e=>{
                                if(e.key === 'Enter' && 
                                this.state.searchList.length>0){
                                  this.selectFrd(0);
                                }
                              }}
                      />
                      <Dropdown isOpen={(!this.state.searchCd
                                  && this.state.searchList.length>0
                                  )}
                                  toggle={e=>this.dropToggle()}
                        className="form-control form-input-left-margin border-none"            
                      >
                          <DropdownToggle 
                              tag="span"
                              data-toggle="dropdown"
                              aria-expanded={(!this.state.searchCd
                                  && this.state.searchList.length>0
                                  )}
                          >
                          &nbsp;
                          </DropdownToggle>
                          <DropdownMenu 
                             modifiers={{
                                setMaxHeight: {
                                  enabled: true,
                                  order: 890,
                                  fn: (data) => {
                                    return {
                                      ...data,
                                      styles: {
                                        ...data.styles,
                                        overflow: 'auto',
                                        // maxHeight: 100,
                                        transform : '',
                                      },
                                    };
                                  },
                                },
                              }}
                            >
                              {this.state.searchList.map((search, frdIdx)=>{
                                  return(
                                  (search.usrName !== JSON.parse(localStorage.getItem('usrInfo')).usrName)?
                                      <div
                                          className="form-control-cursor"
                                          onClick = {e=>{this.selectFrd(frdIdx)}}
                                      >
                                          <img
                                              alt="..."
                                              className="avatar avatar-sm rounded-circle"
                                              src={(
                                              search.usrPt !== ''
                                              ? search.usrPt
                                              : require("assets/img/theme/no-profile-130x130.png"))}
                                          />
                                          &nbsp;&nbsp;
                                          {search.usrName}
                                      </div>
                                      :''
                                  );
                              })}                      
                          </DropdownMenu>
                      </Dropdown>
                      </div>
                  </Col>
                </Row>
                </div>
                {this.state.selectCd ?
                  <div>
                    <Row className="">
                      <Col lg="12">
                        <hr/>
                        &nbsp;&nbsp;
                        <span className="avatar avatar-sm rounded-circle">
                        <a href="javascript:void(0)" 
                           onClick={e => popup.openImg(this.state.selectInfo.usrPt)}>
                            <img
                              alt="..."
                              src={this.state.selectInfo.usrPt !== ''  
                              ? this.state.selectInfo.usrPt
                              : require("assets/img/theme/no-profile-130x130.png")}
                            />
                          </a>
                        </span>
                          &nbsp;
                        <span>
                            <FrdInfo frdName={this.state.selectInfo.usrName}/>
                        </span>
                        <hr/>
                      </Col>
                    </Row>
                    <Row className="text-center justify-content-center align-items-center">
                      <hr/>
                        <Col lg="1"/>
                        <Col lg="2" className="">
                          <span className="avatar avatar-sm rounded-circle">
                            <img
                              alt="..."
                              src={(localStorage.getItem('usrInfo') 
                              && JSON.parse(localStorage.getItem('usrInfo')).usrPt !== '')  
                              ? JSON.parse(localStorage.getItem('usrInfo')).usrPt
                              : require("assets/img/theme/no-profile-130x130.png")}
                            />
                          </span>
                        </Col>
                        <Col lg="6" className="form-padding-left-2 form-padding-right-0"> 
                          <textarea 
                            className="form-control " 
                            rows="3" 
                            placeholder="보낼 메시지를 입력하세요" 
                            onChange = {e=>{this.msgChnage(e)}}
                            value = {this.state.wrMsg}
                            ref={(textarea) => { this.textarea = textarea; }}
                            onKeyPress={e=>{if(e.key==='Enter'){
                              this.msgSend();
                            }}}
                          >
                          </textarea>
                        </Col>
                        <Col lg="2">
                          <button type="button" 
                                  className="btn btn-primary"
                                  onClick = {e=>{this.msgSend()}}
                          >
                            작성
                          </button>
                      </Col>
                      <Col lg="1"/>
                    </Row>
                  </div>
                :''
                }
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default MsgSend;
