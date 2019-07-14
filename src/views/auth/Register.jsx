import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

import * as api from "api/api";

var passwordValidator = require('password-validator');

class Register extends React.Component {
  state ={
    usrName : ''
    ,usrId : ''
    ,usrPw1 : ''
    ,usrPw2 : ''
    ,pwSameCd : 0
    ,pwSafeCd : 0
  }

  checkCallback = (result) =>{
    let rsMsg;
    if(result.svCd === 'e'){
      rsMsg="이메일";
    }else if(result.svCd === 'n'){
      rsMsg="닉네임";
    }
    if(result.reCd === '01'){
      alert('사용 가능한 '+rsMsg+' 입니다.');
    }else if(result.reCd === '02'){
      alert('사용할 수 없는 '+rsMsg+' 입니다.');
    }
  };

  overCheck = (sep) => {
    if(sep === 'e'){
      let idVal = this.state.usrId;
      if(idVal===''){
        alert('이메일을 입력해 주세요.');
      }else if(idVal.indexOf('@')<0 || idVal.indexOf('.')<0){ // 이메일 형식 체크
        alert("이메일 형식을 지켜주세요\nex)test@test.com");
      }else{
        let param ={
          usrId : idVal
          ,svCd : 'e'
        };
        api.apiSend('get','idCheck',param,this.checkCallback);
      }
    }else if(sep==='n'){
      if(this.state.usrName !==''){
        let param ={
          usrName : this.state.usrName
          ,svCd : 'n'
        };
        api.apiSend('get','nameCheck',param,this.checkCallback);
      }else{
        alert('닉네임을 입력해주세요.');
      }
    }
  }

  valChange = (e,sep) =>{
    if(sep === 'e'){
      this.setState({
        usrId : e.target.value
      });
    }else if(sep==='n'){
      this.setState({
        usrName : e.target.value
      });
    }
  }

  pwChange =(e,sep) =>{
    if(sep==='p1'){
      this.setState({
        usrPw1 : e.target.value
      });
      
    }else if(sep==='p2'){
      this.setState({
        usrPw2 : e.target.value
      });
    }
  }

  pwCheck = () =>{
    let pw1 = this.state.usrPw1;
    let pw2 = this.state.usrPw2;
    if(pw1 === '' || pw2 ===''){
      this.setState({
        pwSameCd : 0
        ,pwSafeCd : 0
      });
    }else if(pw1 == pw2){
      this.setState({
        pwSameCd : 1
      });
    }else if(pw1 != pw2){
      this.setState({
        pwSameCd : 2
        });
    }
  }

  pwValidCheck=()=>{
    let pwValid = new passwordValidator();
    // Add properties to it
    pwValid
    .is().min(8)                                    // Minimum length 8
    .is().max(15)                                  // Maximum length 100
    // .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
    
    if(pwValid.validate(this.state.usrPw1)){
      this.setState({
        pwSafeCd : 1
      })
    }else{
      this.setState({
        pwSafeCd : 2
      })
    }
  }

  componentDidUpdate = (prevProps, prevState)=>{
    if(prevState.usrPw1 != this.state.usrPw1 || 
       prevState.usrPw2 != this.state.usrPw2 ){
      this.pwCheck();
      this.pwValidCheck();
    }
  }
  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-3">
              <div className="text-muted text-center mt-2 mb-4">
                <small>Sign up with</small>
              </div>
              <div className="text-center">
                <Button
                  className="btn-neutral btn-icon mr-4"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/github.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Github</span>
                </Button>
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/google.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Google</span>
                </Button>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Or sign up with credentials</small>
              </div>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input 
                        placeholder="Name" 
                        type="text"
                        value ={this.state.usrName}
                        onChange = {e=>{this.valChange(e,'n')}}
                    />
                    <Button
                        href="javascript:void(0)"
                        color="primary"
                        onClick={e=>{this.overCheck('n')}}                        
                    >
                        닉네임 중복체크
                      </Button>
                  </InputGroup>
                 <FormGroup>
                  <InputGroup className="input-group-alternative mb-3" lg="12">
                    <InputGroupAddon addonType="prepend" lg="2">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                      <Input 
                        placeholder="Email" 
                        type="email"  
                        onChange = {e=>{this.valChange(e,'e')}}
                      />
                      <Button
                        href="javascript:void(0)"
                        color="primary"
                        onClick={e=>{this.overCheck('e')}}
                        >
                        이메일 중복체크
                      </Button>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input 
                      placeholder="Password" 
                      type="password" 
                      value ={this.state.usrPw1}
                      onChange = {e=>{this.pwChange(e,'p1')}}
                      />
                  </InputGroup>
                  <br/>
                  <div className="text-muted">
                  <small>
                    <div 
                      className="text-warning font-weight-700"
                      style={{ display: (this.state.pwSameCd === 2 ? 'block' : 'none') }}
                      >
                      패스워드가 일치하지 않습니다.
                    </div>
                    <div 
                      className="text-success font-weight-700"
                      style={{ display: (this.state.pwSameCd === 1 ? 'block' : 'none') }}
                    >
                      패스워드가 일치합니다.
                    </div>
                  </small>
                  {
                    (this.state.pwSameCd === 1 || this.state.pwSameCd === 2) ? <br/> : ''
                  }
                </div>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input 
                      placeholder="Password Confirm" 
                      type="password" 
                      value ={this.state.usrPw2}
                      onChange = {e=>{this.pwChange(e,'p2')}}
                    />
                  </InputGroup>
                </FormGroup>
                <div className="text-muted">
                  <small>
                    <div 
                      className="text-success font-weight-700"
                      style={{display:(this.state.pwSafeCd === 1 ? 'block' : 'none')}}
                    >
                      사용 가능한 비밀번호 입니다.
                    </div>
                    <div
                      className="text-warning font-weight-700"
                      style={{display:(this.state.pwSafeCd === 2 ? 'block' : 'none')}}
                    >
                      사용할 수 없는 비밀번호 입니다.
                      문자, 숫자 포함 8~15자리 비밀번호를 사용해주세요
                    </div>
                  </small>
                </div>
                <Row className="my-4">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id="customCheckRegister"
                        type="checkbox"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheckRegister"
                      >
                        <span className="text-muted">
                          [필수]약관{" "}
                          <a href="#pablo" onClick={e => e.preventDefault()}>
                            약관 보기
                          </a>
                        </span>
                      </label>
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="button">
                    회원가입
                  </Button>
                </div>
{/*               </Form> */}
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default Register;
