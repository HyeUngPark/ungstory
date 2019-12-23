import React from 'react';
import {Button, 
        Modal, 
        ModalBody,
        Card, 
        Label,
        Input,
        Row, 
        Col, 
        FormGroup,
        UncontrolledDropdown,
        DropdownToggle,
        DropdownMenu,
        DropdownItem,
      } from 'reactstrap';

import * as api from "utils/api";
import * as popup from "utils/popup";
import { withRouter } from 'react-router-dom';

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class MsgList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        msgModal : false
        ,searchName : ''
        ,searchList : []
        ,searchCd : false
        ,msgMg : false
        ,deleteCd : false
        ,allCd : false
        ,msgList : []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.imgDrop = React.createRef();
    // this.msgList();
  }
  toggle = (e) => {
    // if(!this.state.firstCd){
    //   this.frdInfo();
    // }
    if(!this.state.msgModal){
      this.msgList();
    }else{
      this.setState({
        msgMg : false
      });
    }
    this.setState({
        msgModal: !this.state.msgModal
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  cancel =()=>{

  }

  goPages = (page,param)=>{
    if(page){
      this.props.history.push({
        pathname: page,
        search: '',
        state: {
          frdName : param ? param : ''
        }
      });
      this.setState({
        msgMg : false
      });
      this.toggle();
    }
  }
 
  allSelect = ()=>{
    if(!this.state.allCd){
      // 전체 선택
      var msgList = this.state.msgList;
      for(var i=0; i<msgList.length; i++){
        msgList[i].checked = true;
      }
      
      this.setState({
        allCd : true
        ,msgList : msgList
      });
    }else{
      // 전체 해제
      var msgList = this.state.msgList;
      for(var i=0; i<msgList.length; i++){
        msgList[i].checked = false;
      }
      this.setState({
        allCd : false
        ,msgList : msgList
      });
    }
  }

  msgDelete = (yn) =>{
    if(yn){
      // 1. 관리 아이콘, 새메시지 버튼 숨기기
      // 2. 라디오버튼, 삭제하기 버튼 보여주기
      this.setState({
        deleteCd : true
        ,msgMg : false
      });
    }else{
      var msgList = this.state.msgList;
      for(var i=0; i<msgList.length; i++){
        msgList[i].checked = false;
      }
      this.setState({
        deleteCd : false
        ,allCd : false
        ,msgList : msgList
      });
    }
  }

  msgDelCallback = (rs) =>{
    if(rs.reCd ==='01'){
      // 메시지 삭제 성공
      alert('메시지 삭제 성공');
      this.setState({
        deleteCd : false
        ,msgList : []
      });
      this.msgList();
    }else{
      // 메시지 삭제 실패
      alert('메시지 삭제 실패');

    }
  }

  delEvent =(cd) =>{
    if(cd === 'd'){
      var delMsg =[];
      var msgList = this.state.msgList;
      for(var i=0; i<msgList.length; i++){
        if(msgList[i].checked){
          delMsg.push(msgList[i]._id);
        }
      }
      if(delMsg.length>0){
        let param={
          usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
          ,delMsg : delMsg
        };
        api.apiSend('put','/msg/msgDelete',param,this.msgDelCallback);
        
      }else{
        alert('삭제할 메시지를 선택해주세요.');
      }
    }else if(cd === 'c'){
      this.msgDelete(false);
    }

  }

  msgListCallback = (rs) =>{
    if(rs.reCd ==='01'){
      // 메시지 리스트 조회 성공
      this.setState({
        msgList : rs.msgList
      });
    }else if(rs.reCd ==='03'){
      // 메시지 없음

    }else{
      // 메시지 리스트 조회 실패

    }
  }

  msgList =() =>{
    if(localStorage.getItem('usrInfo')){
      let param={
        usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
      };
      api.apiSend('post','/msg/msgList',param,this.msgListCallback);
    }
  }

  checkChnage = (msgIdx)=>{
    var msgList = this.state.msgList;
    msgList[msgIdx].checked ? msgList[msgIdx].checked = false : msgList[msgIdx].checked = true;
    this.setState({
      msgList : msgList
    });
  }

  render() {
    return (
        <div>
            <a 
                className= "form-control-cursor"
                href="javascript:void(0)"
                onClick={this.toggle}
            >
            <i className=" ni ni-chat-round"></i>
            &nbsp;
          </a>
          <Modal 
            isOpen={this.state.msgModal} 
            backdrop="static" 
            zIndex = "80"
            onKeyUp={(e)=>{
              if(e.key === "Escape"){
                this.cancel();
              }
            }}
            size ="lg"
          >
        <form className="card shadow" onSubmit={this.handleSubmit}>
          <Card className="bg-secondary shadow border-0">
            <h5 className="display-4">&nbsp;메시지</h5>
            <ModalBody>
            {!this.state.deleteCd ? 
            <Row className="align-items-center" lg="12">
              <Col lg="6">
                {/* <FrdInfo callbackFromParent={this.goPage} frdName={post.usrName}/> */}
              </Col>
              <Col lg="6" className="text-right">
                  <span>
                  <button type="button" 
                    className="btn btn-primary"
                    onClick = {e=>{this.goPages('/user/msg-send')}}
                  >
                    새 메시지 작성
                  </button>
                  {
                  this.state.msgList.length > 0 ?
                    <UncontrolledDropdown
                      isOpen={this.state.msgMg}
                    >
                        <DropdownToggle 
                          className="pr-0" 
                          onClick={e=>{this.setState({
                              msgMg : !this.state.msgMg
                            })
                          }}
                          nav>
                          &nbsp;
                          <i className="ni ni-settings-gear-65 form-control-cursor"/>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow " right>
                          <DropdownItem
                            className="form-control-cursor"
                            onClick = {e=>{this.msgDelete(true)}}
                          >
                            <i className="ni ni-basket"/>
                              메시지 삭제
                          </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    :''
                  }
                  </span>
              </Col>
            </Row>
            : 
            <Row className="align-items-center" lg="12">
              <Col lg="4">
                {/* <FrdInfo callbackFromParent={this.goPage} frdName={post.usrName}/> */}
              </Col>
              <Col lg="8" className="text-right">
                  <span>
                    <a href="javascript:void(0)"
                      onClick = {e=>{
                        this.allSelect();                      
                      }}                  
                    >
                      {!this.state.allCd 
                      ? '전체 선택'
                      : '전체 해제'
                      }
                    </a>
                    &nbsp;&nbsp;&nbsp;
                  <button type="button" 
                    className="btn btn-primary"
                    onClick = {e=>{this.delEvent('d')}}
                    >
                    삭제하기
                  </button>
                  <Button 
                    color="danger" 
                    onClick = {e=>{this.delEvent('c')}}
                  >
                      취소하기
                  </Button>
                </span>
              </Col>
            </Row>
            }
          <br/>
          {this.state.msgList.length > 0 ? 
            this.state.msgList.map((msg, msgIdx)=>{
            return(
            <FormGroup check>
              <Card className="card-profile shadow">
                <Row 
                  lg="12"
                  className = {`justify-content-center modal-center ${msg.msgNot>0 ? 'chat-unread' : 'chat-read'}`}
                  >
                  <Col lg="1">
                    <span className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                    {this.state.deleteCd ?
                      <span>
                        <Label check>
                          <Input type="radio" 
                                name={"radio"+msgIdx}
                                checked={msg.checked} 
                                className="form-input-margin" 
                                onClick ={e=>{
                                  this.checkChnage(msgIdx)
                                }}
                          />{' '}
                        </Label>
                        &nbsp;
                      </span>
                      :''}
                      <div className="avatar avatar-sm rounded-circle">
                        <a href="javascript:void(0)" 
                          onClick={e => popup.openImg(msg.usrPt)}>
                          <img
                            alt="..."
                            className="rounded-circle"
                            src={(msg.usrPt && msg.usrPt !=="") 
                            ? msg.usrPt
                            : require("assets/img/theme/no-profile-130x130.png")}
                          />
                        </a>
                      </div>
                    </span>
                  </Col>
                  <Col 
                    lg="2"
                    className ="form-control-cursor"
                    onClick = {e=>{this.goPages('/user/msg-send',msg._id)}}
                  >
                        {msg._id}
                  </Col>
                  <Col 
                    lg="4"
                    className ="form-control-cursor"
                    onClick = {e=>{this.goPages('/user/msg-send',msg._id)}}
                  >
                        {msg.msgContent}
                  </Col>
                  <Col 
                    lg="1"
                    className ="form-control-cursor"
                    onClick = {e=>{this.goPages('/user/msg-send',msg._id)}}
                  >
                        {msg.msgNot>0 ? <b className="chat-notice">{msg.msgNot}</b> : ''}
                  </Col>
                  <Col 
                    lg="4"
                    className ="form-control-cursor"
                    onClick = {e=>{this.goPages('/user/msg-send',msg._id)}}
                  >
                        {msg.msgDate}
                  </Col>
              </Row>
                <hr className="chat-hr-none"/>
            </Card>
          </FormGroup>
            )})
        :
        <Card>
          <Row className="justify-content-center modal-center form-control-cursor"> 
            <Col lg="12">
              주고받은 메시지가 없습니다. 새 메시지 버튼을 눌러서 메시지를 주고받아보세요!
            </Col>
          </Row>
        </Card>
        }
        <br />
        <Row className="align-items-center justify-content-center"> 
          <Button 
            color="danger" 
            onClick={e=>{this.toggle()}}
          >
                닫기
          </Button>
        </Row>
      </ModalBody>
      </Card>
      </form>
    </Modal>
  </div>
      
    );
  }
}


export default withRouter(MsgList);