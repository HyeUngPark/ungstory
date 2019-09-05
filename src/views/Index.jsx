import React from "react";
import Gallery from 'react-photo-gallery';

import {
  Card,
  CardHeader,
  Container,
  Row,
  Col
} from "reactstrap";

import * as api from "api/api";
import Header from "components/Headers/Header.jsx";

class Index extends React.Component {
  state = {
    postList : []
    ,pstStSuCd : false
  };

  getPostListCallback= (result) =>{
    if(result.reCd==="01"){
      console.log('게시글 조회 성공 \n',result.pstList);
      this.setState({
        pstStSuCd : true
        ,postList : result.pstList
      });
      
    }else if(result.reCd ==='02'){
      console.log('게시글 조회 실패');
      this.setState({
        pstStSuCd : true
      });
      
    }
  }

  getPostList =()=>{
    let param ={};
    if(localStorage.getItem('usrInfo') &&
      JSON.parse(localStorage.getItem('usrInfo')).usrName){
      param.usrName = JSON.parse(localStorage.getItem('usrInfo')).usrName;
    }else{
      param.usrName = '';
    }
    api.apiSend('post','postList',param,this.getPostListCallback);
  }

  commentChnage = (e) =>{

  }


componentDidMount(){
    if(!this.state.pstStSuCd){
        this.getPostList();
    }
}


  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--2" fluid>
        {
          this.state.postList.map((post, index)=>{
            return(
              ////////////////////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////////////////////
              <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center" lg="12">
                    <Col lg="6">
                        {post.usrName}
                    </Col>
                    <Col lg="6" className="text-right">
                        {post.wrDt}
                    </Col>
                  </Row>
                </CardHeader>
                <Gallery photos={post.pstPts} />
                <br />
              {/* 게시글 내용 */}
              <Col lg="12">
              <div className="card shadow">
                    <div className="card-body">
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                <p className="description">
                                    {post.pstCt}
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
                                  {
                                    post.pstHt.map((tag, index)=>{
                                      return(
                                      <a href="#">
                                        #{tag}&nbsp;
                                      </a> 
                                      )
                                   })
                                  }
                                </p>
                            </div>
                        </div>
                      </div>
                  </div>
                  </Col>
                </Row>
                <br/>
              {/*////////////////////////////////
              ////////////// 댓글 //////////////  
              ////////////////////////////////*/}
              {
                (post.pstCmt && post.pstCmt.length == 0 ) ? 
                  <Row>
                    <Col lg="1"/>
                    <Col lg="11">
                    <div className="card shadow">
                    <div className="card-body">
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                <p className="description">
                                  댓글이 없습니다.
                                </p>
                            </div>
                        </div>
                      </div>
                    </div>
                    </Col>
                  </Row> 
                : ''
                }
                {/* 댓글 작성 */}
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
                    <textarea 
                      className="form-control " 
                      id="exampleFormControlTextarea1" 
                      rows="3" 
                      placeholder="댓글을 입력하세요" 
                      onChange = {e=>{this.commentChnage(e)}}
                    >

                    </textarea>
                  </Col>
                  <Col lg="2">
                    <button type="button" 
                            className="btn btn-primary"
                            onClick = {this.commentWrite()}
                    >
                      작성
                    </button>
                  </Col>
                </Row>
                <br/>
                {/* 댓글 내용 */}
                <Row>
                  {
                  (post.pstCmt && post.pstCmt.length >0 ) ?
                  post.pstCmt.map((comment, index)=>{
                    return(
                  <div>
                  <Row className = "align-items-center avatar-padding">
                    <Col lg="1">
                      <span className="avatar avatar-sm rounded-circle">
                        <img
                          alt="..."
                          src={require("assets/img/theme/team-4-800x800.jpg")}
                        />
                      </span>
                    </Col>
                    <Col lg="5">
                        <a href="#">{comment.usrName}</a> &nbsp;
                        {comment.pstWtDate}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="11">
                      {(comment.pstCmtSep == '02' ) ? 
                        <i className="ni bold-right" />
                        : ''}
                      <div className="card shadow">
                        <div className="card-body">
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                    <p className="description">
                                      {comment.pstCmtCt}
                                    </p>
                                </div>
                            </div>
                          </div>
                      </div>
                    </Col>
                  </Row> 
                  <Col lg="11">
                  <br></br>
                  <div className="col text-right avatar-padding-right-none form-control-cursor">
                      {/* 내 댓글일 경우에만 수정/삭제 */}
                      <button type="button" className="btn-sm btn-info">수정</button> &nbsp;
                      <button type="button" className="btn-sm btn-danger">삭제</button> &nbsp;

                      <button type="button" className="btn-sm btn-info">답글</button>
                  </div>
                  </Col>
                  </div> 
                   )}) : ''
                  }
                </Row>
              </Card>
            </Col>
          </Row>
              ////////////////////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////////////////////
            );
          })
        }
        </Container>
      </>
    );
  }
}

export default Index;
