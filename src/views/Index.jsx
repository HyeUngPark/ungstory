import React from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components

import Gallery from 'react-photo-gallery';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "variables/charts.jsx";

import Header from "components/Headers/Header.jsx";

class Index extends React.Component {
  render() {
     const photos = [
       {
         src: require('assets/img/theme/team-1-800x800.jpg'),
         width: 1,
         height: 1
        }
        ,{
         src: require('assets/img/theme/team-2-800x800.jpg'),
         width: 1,
         height: 1
       }
        ,{
         src: require('assets/img/theme/team-3-800x800.jpg'),
         width: 1,
         height: 1
       }
        ,{
         src: require('assets/img/theme/team-4-800x800.jpg'),
         width: 1,
         height: 1
       }
        ,{
         src: require('assets/img/theme/react.jpg'),
         width: 1,
         height: 1
        }
     ];
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--2" fluid>
        <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                        작성자 이름
                    </div>
                  </Row>
                </CardHeader>
                <Gallery photos={photos} />
                <br />
              {/* 게시글 내용 */}
              <Col lg="12">
              <div className="card shadow">
                    <div className="card-body">
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                <p className="description">
                                    게시글 내용~~~~~~~~~~~~~~~~<br />
                                    게시글 내용~~~~~~~~~~~~~~~~<br />
                                    게시글 내용~~~~~~~~~~~~~~~~<br />
                                    게시글 내용~~~~~~~~~~~~~~~~<br />
                                    게시글 내용~~~~~~~~~~~~~~~~<br />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
              </Col>
              <br />
              <Row className="align-items-center ">
                <Col lg="3" className="text-right">
                    {/* <i className=" ni ni-favourite-28"></i> */}
                    ♡ ♥ &nbsp;(200,000) 
                  </Col>
                <Col lg="8">
                  <div className="card shadow">
                    <div className="card-body">
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                <p className="description">
                                  <a href="#">
                                    #해시태그1
                                  </a> 
                                  <a href="#">
                                    #해시태그2
                                  </a> 
                                  <a href="#">
                                    #해시태그3
                                  </a> 
                                  <a href="#">
                                    #해시태그4
                                  </a> 
                                </p>
                            </div>
                        </div>
                      </div>
                  </div>
                  </Col>
                </Row>
                <br/>
                <Row className="align-items-center avatar-padding">
                  <Col lg="1" className="">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("assets/img/theme/team-4-800x800.jpg")}
                      />
                    </span>
                  </Col>
                  <Col lg="9">
                    <textarea className="form-control " id="exampleFormControlTextarea1" rows="3" placeholder="댓글을 입력하세요"></textarea>
                  </Col>
                  <Col lg="2">
                    <button type="button" className="btn btn-primary">작성</button>
                  </Col>
                </Row>
                <br/>
                {/* 댓글 내용 */}
                <Row className="align-items-center avatar-padding">
                  <Col lg="1">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("assets/img/theme/team-4-800x800.jpg")}
                      />
                    </span>
                  </Col>
                  <Col lg="5">
                      <a href="#">박혜웅</a> &nbsp;
                      2019/06/19 16:20
                  </Col>
                  <Col lg="11">
                  <div className="card shadow">
                    <div className="card-body">
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                <p className="description">
                                  댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 
                                  댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 
                                  댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 
                                  댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 
                                </p>
                            </div>
                        </div>
                      </div>
                  </div>
                  </Col>
                  <Col lg="11">
                    <br></br>
                    <div className="col text-right avatar-padding-right-none">
                        <button type="button" className="btn-sm btn-info">수정</button> &nbsp;
                        <button type="button" className="btn-sm btn-danger">삭제</button> &nbsp;
                        <button type="button" className="btn-sm btn-info">답글</button>
                    </div>
                  </Col>
                </Row>
                <Row className="align-items-center avatar-padding">
                  <Col lg="1">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("assets/img/theme/team-1-800x800.jpg")}
                      />
                    </span>
                  </Col>
                  <Col lg="5">
                      <a href="#">홍길동</a> &nbsp;
                      2019/06/19 16:20
                  </Col>
                  <Col lg="11">
                  <div className="card shadow">
                    <div className="card-body">
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                <p className="description">
                                  댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 
                                  댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 
                                </p>
                            </div>
                        </div>
                      </div>
                  </div>
                  </Col>
                  <Col lg="11">
                    <br />
                    <div className="col text-right avatar-padding-right-none">
                        {/* <button type="button" className="btn-sm btn-info">수정</button> &nbsp;
                        <button type="button" className="btn-sm btn-danger">삭제</button> &nbsp; */}
                        <button type="button" className="btn-sm btn-info">답글</button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Index;
