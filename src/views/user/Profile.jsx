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
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.jsx";

class Profile extends React.Component {
  render() {
    return (
      <>
        <UserHeader />
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
                          src={require("assets/img/theme/team-4-800x800.jpg")}
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <div className="d-flex justify-content-between">
                    <Button
                      className="mr-4"
                      color="info"
                      href="#pablo"
                      onClick={e => e.preventDefault()}
                      size="sm"
                    >
                      Connect
                    </Button>
                    <Button
                      className="float-right"
                      color="default"
                      href="#pablo"
                      onClick={e => e.preventDefault()}
                      size="sm"
                    >
                      Message
                    </Button>
                  </div>
                </CardHeader>
                <CardBody className="pt-0 pt-md-4">
                  <Row>
                    <div className="col">
                      <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                        <div>
                          <span className="heading">22</span>
                          <span className="description">Friends</span>
                        </div>
                        <div>
                          <span className="heading">10</span>
                          <span className="description">Photos</span>
                        </div>
                        <div>
                          <span className="heading">89</span>
                          <span className="description">Comments</span>
                        </div>
                      </div>
                    </div>
                  </Row>
                  <div className="text-center">
                    <h3>
                      Jessica Jones
                      <span className="font-weight-light">, 27</span>
                    </h3>
                    <div className="h5 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      Bucharest, Romania
                    </div>
                    <div className="h5 mt-4">
                      <i className="ni business_briefcase-24 mr-2" />
                      Solution Manager - Creative Tim Officer
                    </div>
                    <div>
                      <i className="ni education_hat mr-2" />
                      University of Computer Science
                    </div>
                    <hr className="my-4" />
                    <p>
                      Ryan — the name taken by Melbourne-raised, Brooklyn-based
                      Nick Murphy — writes, performs and records all of his own
                      music.
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
                              value="test@gmail.com"
                            />
                          </FormGroup>
                        </Col>
                        {/* <Col lg="6">
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
                              value ="테스트 네임"
                            />
                          </FormGroup>
                        </Col>      */}
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
                              value ="테스트 네임"
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
                            {/* <span 
                              className="mt-4 btn btn-info" 
                            >
                            </span> */}
                            <Button
                                className = "form-button-marginTop"
                                color="primary"
                                id="profileNameCheck"
                                // onClick={e=>{this.overCheck('n')}}                        
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
                        <Input
                          className="form-control-alternative"
                          rows="4"
                          type="text"
                          value="2019.09.29 17:55"
                        />
                        <Input
                          className="form-control-alternative"
                          rows="4"
                          type="text"
                          value="2019.09.29 17:55"
                        />
                        <Input
                          className="form-control-alternative"
                          rows="4"
                          type="text"
                          value="2019.09.29 17:55"
                        />
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
