import React from 'react';
import { Button, Modal, ModalBody,ModalHeader, Card , Row, Col} from 'reactstrap';

import * as api from "utils/api";

export default class PwFindModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal : false
      ,usrId : ''
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
      usrId : ''
    });
    this.toggle();
  }

  pwFindCallback = (result)=>{
    if(result.reCd==="01"){
      alert('임시 비밀번호가 발급되었습니다. 이메일을 확인해주세요');
      this.cancel();
    }else if(result.reCd ==='02'){
      alert('비밀번호 찾기를 실패했습니다.')
    }else if(result.reCd === '03'){
      alert('유효하지 않은 아이디입니다.');
    }
    return;
  }

  valChange = (e,sep) =>{
    if(sep === 'e'){
      this.setState({
        usrId : e.target.value
      });
    }
  }

  pwFind =() =>{
    let idVal = this.state.usrId;
    if(idVal===''){
      alert('이메일을 입력해 주세요.');
      return;
    }else if(idVal.indexOf('@')<0 || idVal.indexOf('.')<0){ // 이메일 형식 체크
      alert("이메일 형식을 지켜주세요\nex)test@test.com");
      return;
    }

    let param={
      usrId : this.state.usrId
   };
   api.apiSend('post','pwFind',param,this.pwFindCallback);
  }

  render() {
    return (
        <div>
            <a  className="text-light"
                href="javascript:void(0)"
                onClick={this.toggle}
            >
                <small>비밀번호 찾기</small>
          </a>
          <Modal isOpen={this.state.modal} backdrop={false} onKeyUp={(e)=>{
            if(e.key === "Escape"){
              this.cancel();
            }
          }}>
          <form className="card shadow" onSubmit={this.handleSubmit}>
          <Card className="bg-secondary shadow border-0">

            <h5 className="display-4">&nbsp;비밀번호 찾기</h5>
 
            <ModalBody>
              <Row>
                <Col lg="7">
                  <input 
                    className="form-control " 
                    id="PostContent" 
                    rows="3" 
                    autoFocus={true} 
                    type="email" 
                    value={this.state.usrId}
                    placeholder="이메일을 입력하세요"
                    onChange={e=>{this.valChange(e,'e')}}
                  />

                </Col>
                <Col lg="5">
                  <input type="button" 
                         color="primary" 
                         className="btn btn-primary" 
                         value="전송"
                         onClick={this.pwFind}
                  />
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