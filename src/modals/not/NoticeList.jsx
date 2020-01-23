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

import FrdInfo from '../frd/FrdInfo';
import PostDetailModal from '../user/PostDetailModal';

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class NoticeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        notModal : false
        ,noticeList : []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.ntClick = React.createRef();
    this.frdClick = React.createRef();
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
    this.setState({
      notModal: false
    });
  }

  notClear = (cd) =>{
    if(cd === 'c'){
      // 알람 읽기
      
      var unReadNot = [];
      var noticeList = this.state.noticeList;
      if(noticeList.length === 0 ){
        alert('알람이 없습니다.');
        return;
      }
      for(var i=0; i<noticeList.length; i++){
        if(!noticeList[i].readYn){
          unReadNot.push(noticeList[i]._id);
        }
      }
      if(unReadNot.length>0){
        let param={
          usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
          ,clearNot : unReadNot
          ,readCd : 'all'
        };
        api.apiSend('put','/not/notRead',param,this.notClearCallback);
      }else{
        alert('클리어 할 알림이 없습니다.');
      }
    }else if(cd === 'd'){
      // 알람 삭제
      var delNot = [];
      var noticeList = this.state.noticeList;
      if(noticeList.length === 0 ){
        alert('삭제할 알림이 없습니다.');
        return;
      }
      for(var i=0; i<noticeList.length; i++){
        delNot.push(noticeList[i]._id);
      }
      if(delNot.length>0){
        let param={
          usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
          ,clearDel : delNot
        };
        api.apiSend('put','/not/notDel',param,this.notDelCallback);
      }
    }
  }

  noticeListCallback = (rs) =>{
    console.log('noticeList CB \n',rs);
    if(rs.reCd ==='01'){
      // 알람 리스트 조회 성공
      this.setState({
        noticeList : rs.noticeList
      });
    }else if(rs.reCd ==='03'){
      // 알람 없음
      this.setState({
        noticeList : []
      });
    }else{
      // 알람 조회 실패
      this.setState({
        noticeList : []
      });

    }
  }

  noticeList =() =>{
    if(localStorage.getItem('usrInfo')){
      let param={
        usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
      };
      api.apiSend('post','/not/getActNotice',param,this.noticeListCallback);
    }
  }


  notClearCallback = (rs) =>{
    if(rs.reCd ==='01'){
      // 알람 클리어 성공
      // 알람 재조회
      this.noticeList();
      if(rs.readCd === 'all'){
        alert('알람 클리어 성공');
      }
    }else if(rs.reCd ==='02'){
      // 알람 클리어 실패
    }
  }
  notDelCallback = (rs) =>{
    if(rs.reCd ==='01'){
      // 알람 삭제 성공
      alert('알람 삭제 성공');
      this.noticeList();
    }else if(rs.reCd ==='02'){
      // 알람 삭제 실패
      alert('알람 삭제 실패');
    }
  }

  notClick = (not) =>{
    if(localStorage.getItem('usrInfo')){
      if(not.wkDtCd === 'FRDY'){
        // 친구 상세 보기
        this.frdClick.current.toggle();
      }else{
        // 포스트 상세 팝업
        this.ntClick.current.props.pstPk = not.noticeCt.split("###")[1];
        this.ntClick.current.toggle();
      }
      // 읽기처리
        let param={
          usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
          ,clearNot : not._id
        };
        api.apiSend('put','/not/notRead',param,this.notClearCallback);
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
              </Col>
              <Col lg="6" className="text-right">
                  <span>
                  <button type="button" 
                    className="btn btn-primary"
                    onClick = {e=>{this.notClear('c')}}
                    >
                    알림 전체 읽기
                  </button>
                  <Button color="danger" 
                    onClick = {e=>{this.notClear('d')}}
                  >
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
                    {/* 여기 */}
                    {not.wkDtCd === 'FRDY'
                     ? <div>
                        <FrdInfo 
                          ref={this.frdClick}
                          frdName={this.state.noticeList[notIdx].noticeCt}
                        /> <span
                          onClick = {e=>{
                            this.notClick(not)
                          }}
                        >
                          님이 친구를 수락했습니다.
                          </span>
                       </div>
                     : 
                     not.wkDtCd ?
                     <div>
                      <PostDetailModal 
                        ref={this.ntClick}
                        pstPk={not.noticeCt.split("###")[1]}
                        style={false}
                      />
                      <FrdInfo 
                        frdName = {not.noticeCt.split("###")[0]}
                      /> 님이
                      {not.wkDtCd === 'PST' ?
                        <span
                        onClick = {e=>{
                          this.notClick(not)
                        }}
                        >&nbsp;새 포스팅을 작성했습니다.</span>
                      : not.wkDtCd === 'COMM' ? 
                      <span
                        onClick = {e=>{
                          this.notClick(not)
                         }}
                      >&nbsp;회원님의 포스팅에 댓글을 남겼습니다.</span> 
                      : not.wkDtCd === 'LIKE' ?
                      <span
                          onClick = {e=>{
                            this.notClick(not)
                          }}
                        >&nbsp; 회원님의 포스팅을 좋아합니다.</span>
                      : ''
                      }
                     </div>
                     :''
                    }
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