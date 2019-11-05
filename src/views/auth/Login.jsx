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

import PwFindModal from '../../modals/auth/PwFindModal';
import * as api from "utils/api";

class Login extends React.Component {
  state ={
    usrId : ''
    ,usrPw : ''
    ,remberCd : false
    ,loginYn : false
    ,isModalOpen : false
  };
  valChange = (e,sep) =>{
    if(sep === 'e'){
      this.setState({
        usrId : e.target.value
      });
    }else if(sep==='p'){
      this.setState({
        usrPw : e.target.value
      });
    }else if(sep==='r'){
      this.setState({
        remberCd : !this.state.remberCd
      });
    }
  }

  enterKeyEvent =(e)=>{
    if(e.key==="Enter"){
      // console.log('Enter Key');
      this.login();
    }
  }

  loginCallback = (result) =>{
    if(result.usrToken && result.reCd==="01"){
      // console.log('login 성공 \n');
      let usrInfo = JSON.parse(localStorage.getItem('usrInfo'));
      usrInfo.usrToken = result.usrToken;
      usrInfo.usrName = result.usrInfo.usrName;
      usrInfo.usrPt = result.usrInfo.usrPt;
      usrInfo.usrLikePst = result.usrInfo.usrLikePst;
      localStorage.setItem('usrInfo',JSON.stringify(usrInfo));
      // this.props.history.push('/');
      window.location.reload();
    }else if(result.reCd ==='02'){
      alert('아이디 또는 비밀번호를 확인해주세요');
    }else if(result.reCd ==='03'){
      alert('아직 이메일 인증이 완료되지 않았습니다.\n이메일 인증 후 로그인해주세요');
    }
  }

  login = () => {
    // validation check
    let idVal = this.state.usrId;
    if(idVal===''){
      alert('이메일을 입력해 주세요.');
      return;
    }else if(idVal.indexOf('@')<0 || idVal.indexOf('.')<0){ // 이메일 형식 체크
      alert("이메일 형식을 지켜주세요\nex)test@test.com");
      return;
    }
    // 비밀번호
    if(this.state.usrPw === ''){
      alert('비밀번호를 확인해주세요');
      return;
    }
    // 자동 로그인 여부 저장
    let usrInfo = {
      autoLoginCd : this.state.remberCd
    }
    localStorage.setItem('usrInfo',JSON.stringify(usrInfo));

    // 로그인 API
    let param={
       usrId : this.state.usrId
      ,usrPwd : this.state.usrPw
    };
    api.apiSend('post','login',param,this.loginCallback);
    // authActions.login(param);
  }

  modalOpen =(e)=>{
    // console.log("PwFind modalOpen()");
    this.setState(prevState=>({
      isModalOpen:!prevState.isModalOpen
    }));
  }
  
  modalClose =(e)=>{
    // console.log("PwFind modalClose()");
    this.setState(prevState => ({
        isModalOpen: !prevState.isModalOpen
    }));
  }

  render() {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
              </div>
              <div className="btn-wrapper text-center">
                <Button
                  className="btn-neutral btn-icon"
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
                <small>Or sign in with credentials</small>
              </div>
              <Form role="form"
                    onKeyPress={e=>this.enterKeyEvent(e)}
              >
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Email" 
                           type="email" 
                           value={this.state.usrId}
                           onChange={e=>{this.valChange(e,'e')}}
                    />
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
                      value={this.state.usrPw}
                      onChange={e=>{this.valChange(e,'p')}}
                    />
                  </InputGroup>
                </FormGroup>
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                    value={this.state.remberCd}
                    onClick ={e=>this.valChange(e,'r')}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div>
                <div className="text-center">
                  <Button 
                    className="my-4" 
                    color="primary" 
                    type="button"
                    onClick={this.login}
                  >
                    로그인
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
            <PwFindModal callbackFromParent={this.modalClose}/>
              {/* <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <small>비밀번호 찾기</small>
              </a> */}
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <small>회원가입</small>
              </a>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default Login;
