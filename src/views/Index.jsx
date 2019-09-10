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
    ,writeComment : ''
    ,updateComment : ''
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
  commentWrite = (pstPk) => {
    if(this.state.writeComment === ''){
      alert('댓글 내용을 입력해주세요.');
      return;
    }else{
      let param ={
        usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
        ,pstPk : pstPk
        ,pstCmtCt : this.state.writeComment
      };
      api.apiSend('post','postCmtWt',param,this.commentWriteCallback);
    }
  }

  commentWriteCallback = (result)=>{
    if(result.reCd==='01'){
      alert('댓글 등록 성공!');
    }else{
      alert('댓글 등록 실패');
    }
    this.setState({
      writeComment : ''
    });
    this.getPostList();
  }
  commentChnage = (e) =>{
    this.setState({
      writeComment : e.target.value
    });
  }

  commentUtChnage =(e)=>{
    this.setState({
      updateComment : e.target.value
    });
  }

  commentUpdateCallback = (result) =>{
    if(result.reCd==='01'){
      alert('댓글 수정 성공!');
    }else{
      alert('댓글 수정 실패');
    }
    this.setState({
      updateComment : ''
    });
    this.getPostList();
  }
  commentUpdate = (cd, postIdx, commentIdx) =>{
    let postList = this.state.postList;
    console.log('commentUpdate () ',cd , "\n",postList);
    if(postList){
      if(cd === 'v'){
        postList[postIdx].pstCmt[commentIdx].pstCmtUd = true;
        this.setState({
          postList : postList
        });
      }else if(cd === 'c'){
        postList[postIdx].pstCmt[commentIdx].pstCmtUd = false;
        this.setState({
          postList : postList
          ,updateComment : ''
        });
      }else if(cd === 'e'){
        console.log('댓글 수정 버튼 클릭 ]n',this.state.updateComment 
                    , '\n',postList[postIdx].pstCmt[commentIdx].pstCmtPk);
        let param = {
          pstCmtCt : this.state.updateComment
          ,pstCmtPk : postList[postIdx].pstCmt[commentIdx].pstCmtPk
        };
        api.apiSend('post','postCmtUd',param,this.commentUpdateCallback);
      }
    }
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
          this.state.postList.map((post, postIdx)=>{
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
                     <Row className="align-items-center avatar-padding">
                      <Col lg="12">
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
                          <br/>
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
                          value = {this.state.writeComment}
                        >
                        </textarea>
                      </Col>
                      <Col lg="2">
                        <button type="button" 
                                className="btn btn-primary"
                                onClick = {e=>{this.commentWrite(post.pstPk)}}
                        >
                          작성
                        </button>
                      </Col>
                      </Row>
                    <br/>
                    {/* 댓글 내용 */}
                      {
                      (post.pstCmt && post.pstCmt.length >0 ) ?
                      post.pstCmt.map((comment, commentIdx)=>{
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
                        <Col lg="11">
                          {(comment.pstCmtSep == '02' ) ? 
                            <i className="ni bold-right" />
                            : ''}
                          <div className="card shadow">
                            <div className="card-body">
                                <div className="tab-content" id="myTabContent">
                                    <div className="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                        <p className="description">
                                          {
                                            (!comment.pstCmtUd) ?  comment.pstCmtCt  : 
                                              <textarea 
                                                className="form-control " 
                                                rows="3" 
                                                placeholder="수정할 댓글을 입력하세요" 
                                                onChange = {e=>{this.commentUtChnage(e)}}
                                                value = {this.state.updateComment}
                                              />
                                          }
                                        </p>
                                    </div>
                                </div>
                              </div>
                          </div>
                        </Col>
                        {(comment.pstCmtUd) ? 
                          <Col lg="11">
                            <br />
                            <div className="col text-right avatar-padding-right-none">
                                <button type="button" 
                                        className="btn-sm btn-info form-control-cursor"
                                        onClick = {e=>{this.commentUpdate('e', postIdx, commentIdx)}}
                                >
                                  수정하기
                                </button>&nbsp;
                                <button type="button" 
                                        className="btn-sm btn-danger form-control-cursor"
                                        onClick = {e=>{this.commentUpdate('c',postIdx, commentIdx)}}
                                >
                                  취소
                                </button> &nbsp;
                            </div>
                          </Col>
                          : ''}
                      </Row> 
                      {(!comment.pstCmtUd) ? 
                        <Col lg="11">
                        <br></br>
                        <div className="col text-right avatar-padding-right-none form-control-cursor">
                            {/* 내 댓글일 경우에만 수정/삭제 */}
                            <button type="button" 
                                    className="btn-sm btn-info form-control-cursor"
                                    onClick ={e=>{this.commentUpdate('v',postIdx, commentIdx)}}
                            >
                              수정
                            </button>&nbsp;
                            <button type="button" className="btn-sm btn-danger">삭제</button> &nbsp;

                            <button type="button" className="btn-sm btn-info">답글</button>
                        </div>
                        </Col>  
                        : ''}
                      </div> 
                      )}) : ''
                      }
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
