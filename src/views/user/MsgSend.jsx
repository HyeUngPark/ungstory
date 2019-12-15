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
import * as date from "utils/date";

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
      ,msgList : []
      ,myFrdList : []
      ,msgMemList : []
    }
    this.myFrdSelect();
  }

  myFrdSelectCallback =(rs)=>{
    if(rs.reCd ==='01'){
      // 내친구 조회 성공
      this.setState({
        myFrdList : rs.myFrd
      });
    }else if(rs.reCd === '03'){
      // 친구 없음
      this.setState({
        myFrdList : []
      });
    }else{
      // 조회 실패
      this.setState({
        myFrdList : []
      });
    }
  }

  myFrdSelect = ()=>{
    let param={
      usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
      ,searchCd : 'MY'
    };
    api.apiSend('post','/frd/frendSearch',param,this.myFrdSelectCallback);      
  }

  friendSearch =(e)=>{
    var searchName = e.target.value;
    this.setState({
      searchName : searchName
    });
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    let special = special_pattern.test(searchName);
    if(special){
      alert('특수문자는 사용할 수 없습니다.');
      return;
    }else if(searchName !== ''){
      var searchList =[];
      var namePattern = new RegExp(searchName);
      var myFrd = this.state.myFrdList;
      var firstIdxs = [];
      if(myFrd.length>0){
        for(let i=0; i<myFrd.length; i++){
          if(myFrd[i].usrName.startsWith(searchName)
          || myFrd[i].usrName === searchName 
          ){
            searchList.push(myFrd[i]);
            firstIdxs.push(i);
          }
        }
        for(let j=0; j<myFrd.length; j++){
          let search = namePattern.test(myFrd[j].usrName);
          if(firstIdxs.indexOf(j) < 0 && search){
            searchList.push(myFrd[j]);
          }
        }
        if(searchList.length >0){
          this.setState({
            searchList : searchList
          });
          this.dropOpen();
        }else{
          this.setState({
            searchList : searchList
            ,searchCd : false
          });
          // this.dropClear();
        }
      }
    }else{
      this.setState({
        searchList : []
        ,searchCd : false
      });
    }
  }

  msgSearchCallback =(rs) =>{
    if(rs.reCd==='01'){
      // 메시지 조회 성공
      this.setState({
        msgList : rs.msgList
      });
    }else if(rs.reCd ==='03'){
      // 주고받은 메시지 없음
      this.setState({
        msgList : []
      });
    }else{
      // 메시지 조회 실패
      this.setState({
        msgList : []
      });
    }
  }
  selectFrd=(frdIdx, selectName)=>{
    // 해당하는 친구 메시지 조회
    var select ={};
    var searchList = this.state.searchList;
    var frdList = this.state.myFrdList;
    if(frdIdx >-1){
      select.usrName = searchList[frdIdx].usrName;
      select.usrPt = searchList[frdIdx].usrPt;
      this.dropClear();
    }else{
      const itemToFind = frdList.find(function(item) {
        return item.usrName === selectName
      });
      const idx = frdList.indexOf(itemToFind) 
      if (idx > -1){
        select.usrName = frdList[idx].usrName;
        select.usrPt = frdList[idx].usrPt;
      } 
    }

    let memList = this.state.msgMemList;
    const itemToFind = memList.find(function(item) {
      return item.usrName === select.usrName
    });
    const idx = memList.indexOf(itemToFind) 
    if (idx < 0){
      let temp={
        usrName : select.usrName
        ,msgNot : 0
      }
      memList.push(temp);
    }else{
      let temp={
        usrName : memList[idx].usrName
        ,msgNot : 0
      }
      memList[idx] = temp;
    } 
    this.setState({
      selectCd : true
      ,selectInfo : select
      ,msgMemList : memList
      ,msgList : []
    });

    let param={
      usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
      ,searchName : select.usrName
    };
    api.apiSend('post','/msg/msgSearch',param,this.msgSearchCallback);      

  }

  dropClear = () =>{
    this.setState({
      searchList : []
      ,searchName : ''
      ,searchCd : false
    });
    // this.dropToggle();
  }

  dropToggle = ()=>{
    this.setState({
      searchCd : !this.state.searchCd
    })
  }

  dropOpen =() =>{
    this.setState({
      searchCd : true
    });
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
    var msgList = this.state.msgList;
    let sendMsg ={
      msgSend : JSON.parse(localStorage.getItem('usrInfo')).usrName
      ,msgContent : this.state.wrMsg
      ,msgDate : date.getDate('yyyy-MM-dd hh:mm:ss')
    };
    msgList.push(sendMsg);
    this.setState({
      wrMsg : ''
      ,msgList : msgList
    });
  }

  componentDidMount(){
    socket = socketIoClient(window.location.origin);
    socket.emit('usrName',JSON.parse(localStorage.getItem('usrInfo')).usrName);
    socket.on('reMsg', data=>{
      // console.log("나한테 온 메시지 \n",data);
      if(this.state.selectInfo.usrName === data[0]){
        let reMsg ={
          msgRecv : data[1]
          ,msgContent : data[2]
          ,msgDate : data[3]
        };
        let msgList = this.state.msgList;
        msgList.push(reMsg);
        this.setState({
          msgList : msgList
        });
      }else{
        let memList = this.state.msgMemList;
        const itemToFind = memList.find(function(item) {
          return item.usrName === data[0]
        });
        const idx = memList.indexOf(itemToFind) 
        if (idx > -1){
          let temp ={
            usrName : memList[idx].usrName
            ,msgNot : memList[idx].msgNot+1
          };
          memList[idx]=temp;
        } 
        this.setState({
          msgMemList : memList
        });
      }
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
                      <Dropdown isOpen={(this.state.searchCd
                                  && this.state.searchList.length>0
                                  )}
                                  toggle={e=>this.dropToggle()}
                        className="form-control form-input-left-margin border-none"            
                      >
                          <DropdownToggle 
                              tag="span"
                              data-toggle="dropdown"
                              aria-expanded={(this.state.searchCd
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
                {
                  this.state.msgMemList.length > 0 ? 
                  <Row>
                    <Col lg="12">
                      <span>&nbsp;대화한 상대 : </span>
                      {this.state.msgMemList.map((mem, memIdx)=>{
                        return(
                          <span>
                            <a href="javascript:void(0)"
                               style={{
                                  position: "relative"
                               }}
                               onClick={e=>{this.selectFrd(-1, mem.usrName)}}
                            >{mem.usrName}
                              {mem.msgNot > 0? 
                                <span className="form-control-notice"
                                        // value={index} 
                                        style ={{
                                          position:'absolute',
                                          right:'-5px',
                                          top:'-5px',
                                        }}
                                  >
                                  {mem.msgNot}
                                </span>
                                :''
                              }
                            </a>&nbsp;&nbsp;
                          </span>
                        )})
                      }
                    </Col>
                  </Row>
                  :''
                }
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
                      </Col>
                    </Row>
                  <div>
                  <hr/>
                  {this.state.msgList && this.state.msgList.length>0 ?
                    this.state.msgList.map((msg, msgIdx)=>{
                      return(
                      <div> 
                        {msg.msgRecv === JSON.parse(localStorage.getItem('usrInfo')).usrName ?
                          <Row className="">
                            <Col lg="12">
                              <div className="chat-recv float-left chat-left-margin">
                                {msg.msgContent}
                                <hr className="chat-hr"/>
                                <div className="text-right">
                                  {msg.msgDate}
                                </div>
                              </div>
                            </Col>
                          </Row> : ''
                        }
                        {msg.msgSend === JSON.parse(localStorage.getItem('usrInfo')).usrName ?
                          <Row className="chat-msg">
                            <Col lg="12">
                              <div className="chat-send float-right chat-right-margin">
                                {msg.msgContent}
                                <hr className="chat-hr"/>
                                <div className="text-right">
                                  {msg.msgDate}
                                </div>
                              </div>
                            </Col>
                          </Row>:''
                        }
                        </div>
                      )})
                    :
                    <Row className="justify-center text-center">
                      <Col lg="12">
                        주고받은 메시지가 없습니다.
                      </Col>
                    </Row>
                  }
                    <hr/>
                  </div>
                    <Row className="text-center justify-content-center align-items-center">
                      <hr/>
                        <Col lg="1"/>
                        <Col lg="2" className="text-right">
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
