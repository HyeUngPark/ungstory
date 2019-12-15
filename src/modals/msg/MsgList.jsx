import React from 'react';
import {Button, 
        Modal, 
        ModalBody,
        Card, 
        CardHeader,
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

import { confirmAlert } from 'react-confirm-alert'; // Import
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
    // this.goPage = this.props.callbackFromParent;    
    // this.imgDrop = React.createRef();
    this.msgList();
  }
  toggle = (e) => {
    // if(!this.state.firstCd){
    //   this.frdInfo();
    // }
    this.setState({
        msgModal: !this.state.msgModal
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  cancel =()=>{

  }

  goPages = (page)=>{
    if(page){
      this.props.history.push(page);
      this.toggle();
    }
  }
 
  allSelect = ()=>{
    if(!this.state.allCd){
      // 전체 선택
      this.setState({
        allCd : true
      });
    }else{
      // 전체 해제
      this.setState({
        allCd : false
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
      this.setState({
        deleteCd : false
      });
    }
  }

  delEvent =(cd) =>{
    if(cd === 'd'){
      console.log('메시지 삭제');
    }else if(cd === 'c'){
      this.msgDelete(false);
    }

  }
//   openPost =(e, pstPk) =>{
//     this.imgClick.current.props.pstPk = pstPk;
//     this.imgClick.current.toggle();
//   }
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
    msgList[msgIdx] ? msgList[msgIdx] = false : msgList[msgIdx] = true;
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
                <Row className="justify-content-center modal-center form-control-cursor"> 
                  <Col lg="2">
                    <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                    {this.state.deleteCd ?
                      <span>
                        <Label check>
                          <Input type="radio" 
                                name="radio1"
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
                        </CardHeader>
                  </Col>
                  <Col lg="3">
                        {msg._id}
                  </Col>
                  <Col lg="4">
                        {msg.msgContent}
                  </Col>
                  <Col lg="1">
                        {msg.msgNot>0 ? msg.msgNot : ''}
                  </Col>
                  <Col lg="2">
                        {msg.msgDate}
                  </Col>
              </Row>
                <hr className="chat-hr"/>
            </Card>
          </FormGroup>
            )})
        :''
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