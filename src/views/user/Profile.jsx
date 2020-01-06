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
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.jsx";
import * as api from "utils/api";
import * as popup from "utils/popup";
import ProfileChange from "../../modals/auth/ProfileChange";
import ProfileMsgChange from "../../modals/auth/ProfileMsgChange";
import FriendList from "../../modals/frd/FriendList";

var passwordValidator = require('password-validator');

class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state =  {
        profileCk : false
        ,getProfile : false
        ,profileData : {}
        ,name : {
          nameCk : false
          ,nameCd : false
          ,usrName : ''
        }
        ,pw : {
          pw1: ''
          ,pw2 : ''
        }
    };
  }
  profilePwCheck =(rs)=>{
    if(rs){
      this.setState({
        profileCk : true
      });
    }
  }
  getProfileCallback  = (result) =>{
    if(result.reCd === '01'){
      // console.log('프로필 조회 성공\n',result);
      let name = this.state.name;
      name.usrName = result.profileData.usrName;
      this.setState({
        getProfile : true
        ,profileData : result.profileData
        ,name : name
      });
    }else{
      // console.log('프로필 조회 실패');
      this.setState({
        getProfile : true
      });
    }
  }
  getProfile =() =>{
    let param = {
      usrToken : JSON.parse(localStorage.getItem('usrInfo')).usrToken
      ,usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
    };
    api.apiSend('post','getProfile',param,this.getProfileCallback);
  }
  profileChangeCallback =(result) =>{
    // this.setState({
    //   profileCk : false
    // });
    if(result && result.reCd ==='01'){
      if(result.svCd === 'np' || result.svCd ==='pwd' || result.svCd ==='name'){
        alert('닉네임과 비밀번호를 수정한 경우 재로그인 필요합니다.');
        localStorage.removeItem('usrInfo');
        this.props.history.push('/');
      }
    }else if(result && result.reCd === '02'){
      alert('프로필 수정 실패');
    }else if(result && result.reCd === '03'){
      alert('이미 사용하는 패스워드 입니다.');
    }else{
      // alert('프로필 수정 성공');
      this.props.history.push('/user/user-profile');
      this.getProfile();
    }
  }

  profileChange = () =>{
    var param ={
      usrId : this.state.profileData.usrId
      ,usrPw : ''
    };
    // password 체크
    let changePw = this.state.pw;
    if(changePw.pw1 ==='' && changePw.pw2 === ''){
      // pass
    }else if(changePw.pw1 ==='' || changePw.pw2 === ''){
      alert('패스워드와 패스워드 확인을 입력해주세요.');
      return;
    }else if(changePw.pw1 !== changePw.pw2){
      alert('입력하신 패스워드가 다릅니다.');
      return;
    }else{
      let pwVal = changePw.pw1;
      let pwValid = new passwordValidator();
      pwValid
      .is().min(8)                                    // Minimum length 8
      .is().max(15)                                  // Maximum length 100
      // .has().uppercase()                              // Must have uppercase letters
      .has().lowercase()                              // Must have lowercase letters
      .has().not().spaces()                           // Should not have spaces
      .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
      if(pwValid.validate(pwVal)){
        param.usrPw = changePw.pw1;
        param.changeCd = 'pwd';
      }else{
        alert('비밀번호가 안전하지 않습니다.');
        return;
      }
    }
    
    // 닉네임 변경할 경우 
    let changeName = this.state.name;
    if(changeName.nameCd){
      let oldName = JSON.parse(localStorage.getItem('usrInfo')).usrName;
      if(oldName !==  changeName.usrName && !changeName.nameCk){
        alert('닉네임을 변경하시려면 닉네임 중복검사를 해주세요.');
        return;
      }else if(oldName !== changeName.usrName && changeName.nameCk){
        param.usrName = oldName;
        param.changeName = changeName.usrName;
        param.changeCd = 'name';
      }
    }

    if(changeName.nameCd &&  param.usrPw !== ''){
      param.changeCd = 'np';
    }
    api.apiSend('put','profileChange',param,this.profileChangeCallback);

  }
  valChange=(cd, e)=>{
    if(cd === 'p1'){
      let changePw = this.state.pw;
      changePw.pw1 = e.target.value;
      this.setState({
        pw : changePw
      });
    }else if(cd === 'p2'){
      let changePw = this.state.pw;
      changePw.pw2 = e.target.value;
      this.setState({
        pw : changePw
      });
    }else if(cd ==='n'){
      let name = this.state.name;
      name.usrName = e.target.value;
      name.nameCd = true;
      this.setState({
        name : name
      });
    }
  }
  checkCallback =(result) =>{
    if(result.reCd ==='01'){
      alert('사용 가능한 닉네임');
      let name = this.state.name;
      name.nameCk =true;
      this.setState({
        name : name
      });
    }else{
      alert('사용 불 가능한 닉네임');
    }
  }

  overCheck =() =>{
    if(this.state.name.usrName !=='' && 
    this.state.name.usrName !== JSON.parse(localStorage.getItem('usrInfo')).usrName){
      let param ={
        usrName : this.state.name.usrName
      };
      api.apiSend('get','/auth/nameCheck',param,this.checkCallback);
    }else if(this.state.name.usrName === JSON.parse(localStorage.getItem('usrInfo')).usrName){
      alert('기존 닉네임과 같습니다.');
      let name = this.state.name;
      name.nameCd = false;
      this.setState({
        name : name
      });
    }else{
      alert('닉네임을 입력해주세요.');
    }
  }

  cancel = () =>{
    let name = this.state.name;
    name.nameCd=false;
    name.nameCk=false;
    
    this.setState({
      profileCk:false
      ,name : name
    });
  }

  goPages = (page) => {
    if(page){
      this.props.history.push({
        pathname: page,
        search: '',
        state: {
        //
        }
      });  
    }
  }

  componentDidMount () {
    if(!this.state.getProfile && localStorage.getItem('usrInfo')){
        this.getProfile();
    }
  }
  render() {
    return (
      <>
        <UserHeader callbackFromParent={this.profilePwCheck} />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="javascript:void(0)" 
                         onClick={e => popup.openImg(this.state.profileData.usrPt)}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={this.state.profileData.usrPt !=="" 
                              ? this.state.profileData.usrPt
                              : require("assets/img/theme/no-profile-130x130.png")}
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <div className="d-flex justify-content-between">
                    <ProfileChange 
                      usrId={this.state.profileData.usrId}
                      usrPt = {this.state.profileData.usrPt}
                      callbackFromParent={this.profileChangeCallback}
                    />
                    <ProfileMsgChange 
                      usrId={this.state.profileData.usrId}
                      usrMsg = {this.state.profileData.usrMsg}
                      callbackFromParent={this.profileChangeCallback}
                    />
                  </div>
                </CardHeader>
                <CardBody className="pt-0 pt-md-4">
                  <Row>
                    <div className="col">
                      <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                        <div>
                          <span className="description">친구</span>
                          <span className="heading">
                          <FriendList frdCount = {this.state.profileData.usrFrds}/></span>
                        </div>
                        <div>
                          <span className="description">사진</span>
                          <span className="heading">{this.state.profileData.pstPts}</span>
                        </div>
                        <div>
                          <span className="description">활동(댓글, 좋아요)</span>
                          <span className="heading form-control-cursor"
                              onClick = {e=>{this.goPages('/user/active-search')}}
                          >
                            {this.state.profileData.usrActive}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Row>
                  <div className="text-center">
                    <h3>
                      {this.state.profileData.usrName}
                    </h3>
                    <hr className="my-4" />
                    <p>
                      <div className="d-flex justify-content-between">
                      <Button
                        className="float-left"
                        color="default"
                        href="jvascript:void(0)"
                        size="sm"
                      >
                        대화명
                      </Button>
                      </div>
                      {(this.state.profileData.usrMsg !== '') ? this.state.profileData.usrMsg : '대화명이 없습니다.'}
                    </p>
                    {/* <a href="#pablo" onClick={e => e.preventDefault()}>
                      Show more
                    </a> */}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">내 프로필</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      내 정보
                    </h6>
                    <div className="pl-lg-4">
                        { (this.state.profileCk) ? 
                    <div>
                      <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            아이디 (변경 불가)
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            type="text"
                            value={this.state.profileData.usrId}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                              >
                              닉네임
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-username"
                              type="text"
                              placeholder="닉네임 변경 시에만 입력"
                              value ={this.state.name.usrName}
                              onChange={e=>this.valChange('n',e)}
                            />
                          </FormGroup>
                          </Col>
                          <Col lg="3">
                            <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="profileNameCheck"
                            >
                              &nbsp;
                            </label>
                              <Button
                                  className = "form-button-marginTop"
                                  color="primary"
                                  id="profileNameCheck"
                                  onClick={e=>{this.overCheck()}}                        
                                  >
                                  닉네임 중복검사
                              </Button>
                            </FormGroup>
                           </Col> 
                           </Row> 
                           <Row>
                            <Col lg="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="profilePwd"
                                >
                                  비밀번호
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="profilePwd"
                                  placeholder="비밀번호 변경을 원하시면 입력해주세요"
                                  type="password"
                                  value={this.state.pw.pw1}
                                  onChange={e=>{this.valChange('p1',e)}}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="profilePwdConfirm"
                                >
                                  비밀번호 확인 
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="profilePwdConfirm"
                                  placeholder="비밀번호 변경을 원하시면 입력해주세요"
                                  type="password"
                                  value={this.state.pw.pw2}
                                  onChange={e=>{this.valChange('p2',e)}}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row lg="12">
                            <input type="button" 
                                color="primary" 
                                className="btn btn-primary" 
                                value="변경하기"
                                onClick={e=>{this.profileChange()}}
                            />
                            <Button color="danger" onClick={this.cancel}>취소</Button>
                          </Row>

                          </div>
                           :
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-email"
                                >
                                  아이디
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-email"
                                  type="text"
                                  value={this.state.profileData.usrId}
                                />
                              </FormGroup>
                             </Col>
                             <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-username2"
                                  >
                                  닉네임
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-username2"
                                  type="text"
                                  value ={JSON.parse(localStorage.getItem('usrInfo')).usrName}
                                />
                              </FormGroup>
                            </Col>   
                          </Row>
                        }
                     
                    </div>
                    <hr className="my-4" />
                    {/* 접속 정보 */}
                    <h6 className="heading-small text-muted mb-4">최근 접속 기록</h6>
                    <div className="pl-lg-4">
                      <FormGroup>
                        {
                          (this.state.profileData.loginDate
                        && this.state.profileData.loginDate.length >0 ) ?
                        this.state.profileData.loginDate.map((data, dataIdx)=>{
                        return(
                        <Input
                          className="form-control-alternative"
                          rows="4"
                          type="text"
                          value={data}
                        />
                        )})
                        :
                          <Input
                          className="form-control-alternative"
                          rows="4"
                          type="text"
                          value='최근 접속기록이 없습니다.'
                        />
                        }
                       </FormGroup>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Profile;
