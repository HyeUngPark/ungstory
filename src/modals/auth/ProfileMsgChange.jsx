import React from 'react';
import { Button, Modal, ModalBody, FormGroup, Input, Card , Row, Col} from 'reactstrap';

import * as api from "api/api";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default class ProfileMsgChange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal : false
      ,usrMsg  : ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.modalClose = this.props.callbackFromParent;
  }
  
  toggle = (e) => {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  cancel=()=>{
    this.setState({
      usrMsg : ''
    });
    this.modalClose();
    this.toggle();
  }
  
  profileMsgModifyCallback = (result)=>{
    if(result.reCd==="01"){
      alert('프로필 대화명 변경 성공');
    }else if(result.reCd ==='02'){
      alert('프로필 대화명 변경 실패');
    }
    
    this.cancel();
    this.modalClose();
  }
  profileMsgModify = ()=>{
      let param={
        usrId : this.props.usrId
        ,usrMsg : this.state.usrMsg
        ,changeCd : 'msg'
      }
      api.apiSend('put','profileChange',param, this.profileMsgModifyCallback);
  }
  msgChange =(e)=>{
    this.setState({
      usrMsg : e.target.value
    }); 
  }
  confirmAlert =() =>{
    confirmAlert({
      title: '대화명 수정 확인',
      message: '정말 대화명을 변경하시겠습니까?',
      buttons: [
        {
          label: '변경하기',
          onClick: () => this.profileMsgModify()
        },
        {
          label: '취소',
          onClick: () => {}
        }
      ],
    });
  }

  render() {
    return (
        <div>
          <Button
            className="float-right"
            color="info"
            href="javascript:void(0)"
            onClick={e=>{this.toggle()}}
            size="sm"
          >
            프로필 대화명 수정
          </Button>
          <Modal isOpen={this.state.modal} 
                 zIndex = "90"
                 backdrop={false} 
                 onKeyUp={(e)=>{
                  if(e.key === "Escape"){
                    this.cancel();
                  }
                }
          }>
          <form className="card shadow" onSubmit={this.handleSubmit}>
          <Card className="bg-secondary shadow border-0">
            <h5 className="display-4">&nbsp;프로필 대화명 변경</h5>
            <ModalBody>
              <Row lg="12">
                <Col lg="12">
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-email"
                    >
                      이전 대화명
                    </label>
                    <Input
                      className=" form-control-noCursor"
                      //form-control-alternative
                      id="input-email"
                      type="text"
                      value={this.props.usrMsg}
                    />
                  </FormGroup>
                </Col>
                <hr className="my-4" />
              </Row>
              <Row>
                <Col lg="12">
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-email"
                    >
                      바꿀 대화명
                    </label>
                    <Input
                      className="form-control-alternative"
                      id="input-email"
                      type="text"
                      placeholder="바꿀 대화명을 입력해주세요"
                      onChange = {e=>{this.msgChange(e)}}
                      value={this.state.usrMsg}
                    />
                  </FormGroup>
                </Col>
                <hr className="my-4" />
              </Row>
              <Row>
                <Col lg="12" className="text-center">
                    {/* 확인 */}
                    <input type="button" 
                          color="primary" 
                          className="btn btn-primary" 
                          value="확인"
                          onClick={e=>{this.confirmAlert()}}       
                    />
                    {/* 취소 */}
                    <Button color="danger" onClick={this.cancel}>취소</Button>
                </Col>
              </Row>
            </ModalBody>
            </Card>
            </form>
          </Modal>
        </div>
      
    );
  }
}