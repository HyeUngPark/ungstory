import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import * as api from "utils/api";

var passwordValidator = require('password-validator');

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state =  {
      usrName : ''
      ,usrId : ''
      ,usrPw1 : ''
      ,usrPw2 : ''
      ,pwSameCd : 0
      ,pwSafeCd : 0
      ,usrNameCk : 0
      ,usrIdCk : 0
      ,usrArg01 : false
      ,usrBirth : new Date()
    };
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
      if(result.svCd==='e'){
        this.setState({
          usrIdCk : 1
        });
      }else if(result.svCd==='n'){
        this.setState({
          usrNameCk : 1
        });
      }
    }else if(result.reCd === '02'){
      alert('사용할 수 없는 '+rsMsg+' 입니다.');
      if(result.svCd==='e'){
        this.setState({
          usrIdCk : 0
        });
      }else if(result.svCd==='n'){
        this.setState({
          usrNameCk : 0
        });
      }
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
        ,usrIdCk : 0
      });
    }else if(sep==='n'){
      this.setState({
        usrName : e.target.value
        ,usrNameCk : 0
      });
    }else if(sep==='a'){
      this.setState({
        usrArg01 : !this.state.usrArg01
      });
    }else if(sep==='b'){
      this.setState({
        usrBirth :e
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
    }else if(pw1 === pw2){
      this.setState({
        pwSameCd : 1
      });
    }else if(pw1 !== pw2){
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
    if(prevState.usrPw1 !== this.state.usrPw1 || 
       prevState.usrPw2 !== this.state.usrPw2 ){
      this.pwCheck();
      this.pwValidCheck();
    }
  }

  joinCallback = (result) =>{
    if(result.reCd==="01"){
      alert('회원가입 성공');
      this.props.history.push('/');
    }else{
      alert('회원가입 실패');
    }
  }

  join = () => {
    // validation check
    // 닉네임
    if(this.state.usrNameCk === 0 || this.state.usrName ===''){
      alert('닉네임을 확인해주세요');
      return;
    }
    // 아이디
    if(this.state.usrIdCk === 0 || this.state.usrId === ''){
      alert('아이디를 확인해주세요');
      return;
    }
    var rightNow = new Date();
    var today = rightNow.toISOString().slice(0,10);
    var birth = this.state.usrBirth.toISOString().slice(0,10);
    if(today === birth){
      alert("생일을 선택해주세요.");
      return;
    }
    // 비밀번호
    if(this.state.pwSameCd !== 1 || this.state.pwSafeCd !== 1){
      alert('비밀번호를 확인해주세요');
      return;
    }
    // 약관체크
    if(!this.state.usrArg01){
      alert('약관에 동의해주셔야 가입이 가능합니다.');
      return;
    }
    // 회원가입 API
    let param={
       usrId : this.state.usrId
      ,usrName : this.state.usrName
      ,usrPwd : this.state.usrPw1
      ,usrBirth : this.state.usrBirth
    };
    api.apiSend('post','join',param,this.joinCallback);

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
                        color="primary"
                        onClick={e=>{this.overCheck('e')}}
                        >
                        이메일 중복체크
                      </Button>
                  </InputGroup>
                  <div 
                    className="text-warning font-weight-700"
                    >
                    입력하신 이메일로 인증 후 가입이 진행됩니다.<br/>
                    반드시 사용하시는 이메일을 입력해주세요.
                  </div>
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
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText >
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <span className="form-control">
                    <DatePicker
                      selected={this.state.usrBirth}
                      onChange={date => this.valChange(date,'b')}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="yyyy/MM/dd"
                      className="form-control-border-none form-control-cursor"
                    />
                    </span>
                    </InputGroup>
                </FormGroup>

                <Row className="my-4">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id="customCheckRegister"
                        type="checkbox"
                        value={this.state.usrArg01}
                        onClick ={e=>this.valChange(e,'a')}
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
                  <Button 
                    className="mt-4" 
                    color="primary" 
                    type="button"
                    onClick={this.join}
                  >
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
