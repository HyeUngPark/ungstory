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
  // 세션 체크
  var param={
    usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
  }
  api.apiSend('post','postList',param,this.getPostListCallback);
}

componentDidMount(){
    if(!this.state.pstStSuCd){
        this.getPostList();
    }
}


  render() {
    /* 
    const photos = [
      { 
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
     */
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
