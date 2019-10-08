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
import * as api from "api/api";
import ProfileChange from "../../modals/auth/ProfileChange";
class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state =  {
        profileCk : false
        ,getProfile : false
        ,profileData : {}
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
      console.log('프로필 조회 성공');
      this.setState({
        getProfile : true
        ,profileData : result.profileData
      });
    }else{
      console.log('프로필 조회 실패');
      this.setState({
        getProfile : true
      });
    }
  }
  getProfile =() =>{
    let param = {
      usrToken : JSON.parse(localStorage.getItem('usrInfo')).usrToken
    };
    api.apiSend('post','getProfile',param,this.getProfileCallback);
  }
  profileChangeCallback =() =>{
    // this.setState({
    //   profileCk : false
    // });
    this.props.history.push('/user/user-profile');
    this.getProfile();
  }
  componentDidMount(){
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
                      <a href="#pablo" onClick={e => e.preventDefault()}>
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
                    {/* <Button
                      className="mr-4"
                      color="info"
                      href="#pablo"
                      onClick={e => e.preventDefault()}
                      size="sm"
                    >
                      Connect
                    </Button> */}
                    {/* <Button
                      className="float-right"
                      color="default"
                      href="#pablo"
                      onClick={e => e.preventDefault()}
                      size="sm"
                    >
                      프로필 사진 수정
                    </Button> */}
                    <ProfileChange 
                      usrId={this.state.profileData.usrId}
                      usrPt = {this.state.profileData.usrPt}
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
                          <span className="heading">22</span>
                        </div>
                        <div>
                          <span className="description">사진</span>
                          <span className="heading">{this.state.profileData.pstPts}</span>
                        </div>
                        <div>
                          <span className="description">활동(댓글, 좋아요)</span>
                          <span className="heading">{this.state.profileData.pstPts}</span>
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
                      {this.state.profileData.usrMsg}
                    </p>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      Show more
                    </a>
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
                              value ={this.state.profileData.usrName}
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
                                  // onClick={e=>{this.overCheck('n')}}                        
                                  >
                                  닉네임 중복검사
                              </Button>
                            </FormGroup>
                           </Col> </Row> :
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
                             <Col lg="6">
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
                                  value ={this.state.profileData.usrName}
                                />
                              </FormGroup>
                            </Col>   
                          </Row>
                        }
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
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* 접속 정보 */}
                    <h6 className="heading-small text-muted mb-4">최근 접속 기록</h6>
                    <div className="pl-lg-4">
                      <FormGroup>
                        <label>최근 접속 기록</label>
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
                        :''
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
