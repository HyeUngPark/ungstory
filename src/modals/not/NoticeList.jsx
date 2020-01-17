import React from 'react';
import {Button, 
        Modal, 
        ModalBody,
        Card, 
        Row, 
        Col, 
        FormGroup,
      } from 'reactstrap';

import * as api from "utils/api";
import * as popup from "utils/popup";
import { withRouter } from 'react-router-dom';

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class NoticeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        notModal : false
        ,noticeList : []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  toggle = (e) => {
    if(!this.state.notModal){
      this.noticeList();
    }
    this.setState({
      notModal: !this.state.notModal
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  cancel =()=>{

  }

  goPages = (page,param)=>{
    var nowPage = window.location.pathname;
    if(nowPage !== '/user/msg-send' && page){
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
    }else if(nowPage === '/user/msg-send'){
      this.toggle();
    }
  }
 
  notClear = (yn) =>{
    if(yn){
      // 1. 관리 아이콘, 새메시지 버튼 숨기기
      // 2. 라디오버튼, 삭제하기 버튼 보여주기
    }else{
    
    }
  }

  noticeListCallback = (rs) =>{
    if(rs.reCd ==='01'){
      // 메시지 리스트 조회 성공
      this.setState({
        noticeList : rs.noticeList
      });
    }else if(rs.reCd ==='03'){
      // 메시지 없음

    }else{
      // 메시지 리스트 조회 실패

    }
  }

  noticeList =() =>{
    if(localStorage.getItem('usrInfo')){
      let param={
        usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
      };
      // api.apiSend('post','/msg/msgList',param,this.noticeListCallback);
    }
  }

  render() {
    return (
        <div>
            <a 
                className= "form-control-cursor"
                href="javascript:void(0)"
                onClick={this.toggle}
            >
            <i className=" ni ni-bulb-61"></i>
            &nbsp;
          </a>
          <Modal 
            isOpen={this.state.notModal} 
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
            <h5 className="display-4">&nbsp;알림 리스트</h5>
            <ModalBody>
            <Row className="align-items-center" lg="12">
              <Col lg="6">
                {/* <FrdInfo callbackFromParent={this.goPage} frdName={post.usrName}/> */}
              </Col>
              <Col lg="6" className="text-right">
                  <span>
                  <button type="button" 
                    className="btn btn-primary"
                    // onClick = {e=>{this.goPages('/user/msg-send')}}
                  >
                    알림 전체 읽기
                  </button>
                  <Button color="danger" onClick={this.cancel}>
                    알림 전체 삭제
                  </Button>
                  </span>
              </Col>
            </Row>
            <br/>
        {/* <Row className="align-items-center" lg="12"> */}
          {this.state.noticeList.length > 0 ? 
            this.state.noticeList.map((not, notIdx)=>{ 
              return(
            <FormGroup check>
              <Card className="card-profile shadow">
                <Row 
                  lg="12"
                  className = {` modal-center `}
                  className = {`justify-content-center modal-center 
                  ${!not.readYn ? 'chat-unread' : 'chat-read'}
                  `}
                  >
                  <Col lg="1" className="form-padding-left-2">
                    <span className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                      <div className="avatar avatar-sm rounded-circle">
                        <a href="javascript:void(0)" 
                          onClick={e => popup.openImg(not.usrPt)}
                        >
                          <img
                            alt="..."
                            className="rounded-circle"
                            src={(not.usrPt && not.usrPt !=="") 
                            ? not.usrPt
                            : require("assets/img/theme/no-profile-130x130.png")}
                          />
                        </a>
                      </div>
                    </span>
                  </Col>
                  <Col 
                    lg="11"
                    className ="form-control-cursor"
                  >
                    {(not)=>{switch(not.wkDtCd){
                      case 'FRDY':
                        return '님이 메시지를 보냈습니다.'
                      case "PST" :
                        return '님이 새 포스팅을 작성했습니다.'
                      case "COMM" :
                        return '님이 회원님의 포스팅에 댓글을 남겼습니다.'
                      case "LIKE" :
                          return '님이 회원님의 포스팅을 좋아합니다.'
                      default :
                        break;
                  }}}
                        
                  </Col>
              </Row>
                <hr className="chat-hr-none"/>
            </Card>
          </FormGroup>
          )})
       : <Card className="card-profile shadow">
          <Row className="justify-content-center modal-center form-control-cursor"> 
            <Col lg="12">
              새로운 알림이 없습니다.
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


export default withRouter(NoticeList);