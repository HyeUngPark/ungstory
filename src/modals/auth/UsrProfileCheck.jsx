import React from 'react';
import { Button, Modal, ModalBody,ModalHeader, Card , Row, Col, Input} from 'reactstrap';

import * as api from "utils/api";
var passwordValidator = require('password-validator');

export default class UsrProfileCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal : false
      ,usrPw : ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.profilePwCheck = this.props.callbackFromParent;
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
      usrPw : ''
    });
    
    this.toggle();
  }

  pwCheckCallback = (result)=>{
    if(result.reCd==="01"){
      alert('확인 되었습니다.');
      this.profilePwCheck(true);
      this.cancel();
    }else if(result.reCd ==='02'){
      alert('비밀번호가 올바르지 않습니다.');
    }else{
      alert('서버오류');
    }
    return;
  }

  valChange = (e,sep) =>{
    if(sep === 'p'){
      this.setState({
        usrPw : e.target.value
      });
    }
  }

  pwCheck =() =>{
    let pwVal = this.state.usrPw;
    let pwValid = new passwordValidator();
    // Add properties to it
    
    pwValid
    .is().min(8)                                    // Minimum length 8
    .is().max(15)                                  // Maximum length 100
    // .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
    if(pwVal===''){
      alert('비밀번호를 입력해 주세요.');
      return;
    }else if(pwValid.validate(pwVal)){
      let param={
        usrPwd : pwVal
        ,usrToken : JSON.parse(localStorage.getItem('usrInfo')).usrToken
      };
      api.apiSend('post','profilePwCheck',param,this.pwCheckCallback);
    }else{
      alert('비밀번호 형식을 확인해주세요.');
    }
  }

  render() {
    return (
        <div>
            <a 
                href="javascript:void(0)"
                onClick={this.toggle}
            >
                <small className="btn btn-info">프로필 수정</small>
          </a>
          <Modal isOpen={this.state.modal} backdrop={false} onKeyUp={(e)=>{
            if(e.key === "Escape"){
              this.cancel();
            }
          }}>
          <form className="card shadow" onSubmit={this.handleSubmit}>
          <Card className="bg-secondary shadow border-0">

            <h5 className="display-4">&nbsp;비밀번호 확인</h5>
 
            <ModalBody>
              <Row>
                <Col lg="7">
                  <Input 
                      placeholder="비밀번호를 입력하세요"
                      type="password" 
                      value={this.state.usrPw}
                      onChange={e=>{this.valChange(e,'p')}}
                      onKeyPress={e=>{if(e.key==='Enter'){
                        this.pwCheck();
                      }}}
                    />

                </Col>
                <Col lg="5">
                  <input type="button" 
                         color="primary" 
                         className="btn btn-primary" 
                         value="확인"
                         onClick={e=>{this.pwCheck()}}
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