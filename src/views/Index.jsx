import React from "react";
import Gallery from 'react-photo-gallery';

import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from "reactstrap";

import * as api from "utils/api";
import * as popup from "utils/popup";

import Header from "components/Headers/Header.jsx";
import PostModifyModal from '../modals/user/PostModifyModal';
import FrdInfo from '../modals/frd/FrdInfo';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class Index extends React.Component {
  constructor(props){
    super(props);
    this.state =  {
        postList : []
        , replyComment : ''
        , searchText : ''
    };
    if(this.state.postList && this.state.postList.length === 0){
      this.getPostList();
    }
    // this.scrollElement = React.createRef();
  }

  getPostListCallback= (result) =>{
    let postList = [];
    if(result.reCd==="01"){
      postList = result.pstList;
    }else if(result.reCd ==='02'){
      // console.log('게시글 조회 실패');
    }
    this.setState({
      postList : postList
    });
  }

  getPostList =(searchCd, text)=>{
    let param ={};
    if(localStorage.getItem('usrInfo') &&
      JSON.parse(localStorage.getItem('usrInfo')).usrName){
      param.usrName = JSON.parse(localStorage.getItem('usrInfo')).usrName;
    }else{
      param.usrName = '';
    }
    if(searchCd && searchCd === 'search'){
      param.searchText=text;
      this.setState({
        searchText : text
      });
    }
    this.scrollTop();
    api.apiSend('post','postList',param,this.getPostListCallback);

  }

  commentWrite = (pstPk, postIdx) => {
    let postList = this.state.postList;
    if(postList[postIdx].wrComment === ''){
      alert('댓글 내용을 입력해주세요.');
      return;
    }else{
      let param ={
        usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
        ,pstPk : pstPk
        ,pstCmtCt : postList[postIdx].wrComment
      };
      postList[postIdx].wrComment = '';
      this.setState({
        postList : postList
      });

      api.apiSend('post','postCmtWt',param,this.commentWriteCallback);
    }
  }

  commentWriteCallback = (result)=>{
    if(result.reCd==='01'){
      alert('댓글 등록 성공!');
    }else{
      alert('댓글 등록 실패');
    }
    this.getPostList();
  }

  commentReply = (cd, postIdx, commentIdx) =>{
    let postList = this.state.postList;
    // console.log('commentReply () ',cd , "\n",postList);
    if(postList){
      if(cd === 'v'){
        for(var i=0; i< postList[postIdx].pstCmt.length; i++){
          if(i==commentIdx){
            postList[postIdx].pstCmt[commentIdx].pstCmtRp = true;
          }else{
            postList[postIdx].pstCmt[i].pstCmtRp = false;
          }
        }
        this.setState({
          postList : postList
        });
      }else if(cd === 'c'){
        postList[postIdx].pstCmt[commentIdx].pstCmtRp = false;
        this.setState({
          postList : postList
          ,replyComment : ''
        });
      }else if(cd === 'e'){
        let param = {
          usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
          ,pstPk : postList[postIdx].pstPk
          ,pstCmtCt : this.state.replyComment
          ,pstCmtPk : postList[postIdx].pstCmt[commentIdx].pstCmtPk
          ,pstCmtGp : postList[postIdx].pstCmt[commentIdx].pstCmtGp
        };
        api.apiSend('post','postCmtRp',param,this.commentReplyCallback);
      }
    }
  }

  commentReplyCallback = (result)=>{
    if(result.reCd==='01'){
      alert('답글 등록 성공!');
    }else{
      alert('답글 등록 실패');
    }
    this.setState({
      replyComment : ''
    });
    this.getPostList();
  }

  commentChnage = (e, postIdx) =>{
    let postList = this.state.postList;
    postList[postIdx].wrComment = e.target.value;

    this.setState({
      postList : postList
    });
  }

  commentUtChnage =(e, postIdx, commentIdx)=>{
    let postList = this.state.postList;
    postList[postIdx].pstCmt[commentIdx].updateComment = e.target.value;
    this.setState({
      postList : postList
    });
  }
  replyChange =(e)=>{
    this.setState({
      replyComment : e.target.value
    });
  }

  commentUpdateCallback = (result) =>{
    if(result.reCd==='01'){
      alert('댓글 수정 성공!');
    }else{
      alert('댓글 수정 실패');
    }
    
    this.getPostList();
  }
  commentUpdate = (cd, postIdx, commentIdx) =>{
    let postList = this.state.postList;
    // console.log('commentUpdate () ',cd , "\n",postList);
    if(postList){
      if(cd === 'v'){
        postList[postIdx].pstCmt[commentIdx].pstCmtUd = true;
        this.setState({
          postList : postList
        });
      }else if(cd === 'c'){
        postList[postIdx].pstCmt[commentIdx].pstCmtUd = false;
        postList[postIdx].pstCmt[commentIdx].updateComment = '';
        this.setState({
          postList : postList
        });
      }else if(cd === 'e'){
        let param = {
          pstCmtCt : postList[postIdx].pstCmt[commentIdx].updateComment
          ,pstCmtPk : postList[postIdx].pstCmt[commentIdx].pstCmtPk
        };
        postList[postIdx].pstCmt[commentIdx].updateComment= '';
        postList[postIdx].pstCmt[commentIdx].pstCmtUd = false;
        this.setState({
          postList : postList
        });
        api.apiSend('post','postCmtUd',param,this.commentUpdateCallback);
      }
    }
  }
  commentDeleteCallback = (result) => {
    if(result.reCd==='01'){
      alert('댓글 삭제 성공!');
    }else{
      alert('댓글 삭제 실패');
    }
    this.getPostList();
  }

  commentDelete = (postIdx, commentIdx)=>{
    let postList = this.state.postList;
    let pstCmtDcd;
    if(postList[postIdx].pstCmt.length === (commentIdx+1)
     ||postList[postIdx].pstCmt[commentIdx].pstCmtGp !== postList[postIdx].pstCmt[commentIdx+1].pstCmtGp
    ){
        pstCmtDcd = '04';
    }else if(commentIdx !==0 
      && postList[postIdx].pstCmt[commentIdx].pstCmtGp === postList[postIdx].pstCmt[commentIdx+1].pstCmtGp){
        pstCmtDcd = '03R';
    }else{
        pstCmtDcd = '03';
    }
    let param = {
      pstCmtPk : postList[postIdx].pstCmt[commentIdx].pstCmtPk
      ,pstCmtDcd : pstCmtDcd
    };
    api.apiSend('post','postCmtDel',param,this.commentDeleteCallback);
  }

  postMgToggle = (postIdx) =>{
    let postList = this.state.postList;
    postList[postIdx].postMg = true;
    this.setState({
      postList : postList
    });
  }
  
  postDeleteCallback=(result)=>{
    if(result.reCd === '01'){
      alert('게시글 삭제 완료');
    }else if(result.reCd === '02'){
      alert('게시글 삭제 실패');
    }
    window.location.reload();
  }
 
  postDelete =(postIdx)=>{
    let postList = this.state.postList;
    postList[postIdx].postMg = false;
    this.setState({
      postList : postList
    });
    let param = {
      pstPk : postList[postIdx].pstPk
    };
    api.apiSend('post','postDel',param, this.postDeleteCallback); 
  }

  postMg =(cd, postIdx) =>{
    if(cd === 'd'){
      confirmAlert({
        title: '포스트 삭제 확인',
        message: '정말 포스트를 삭제하시겠습니까?',
        buttons: [
          {
            label: '삭제하기',
            onClick: () => this.postDelete(postIdx)
          },
          {
            label: '취소',
            onClick: () => {
              let postList = this.state.postList;
              postList[postIdx].postMg = false;
              this.setState({
                postList : postList
              });
            }
          }
        ]
      });
    }
  }
  
  commentDeleteConfirm = (postIdx, commentIdx)=>{
    confirmAlert({
      title: '댓글 삭제 확인',
      message: '정말 삭제하시겠습니까?',
      buttons: [
        {
          label: '삭제하기',
          onClick: () => this.commentDelete(postIdx, commentIdx)
        },
        {
          label: '취소',
          onClick: () => {}
        }
      ]
    });
  }
  modalClose =(postIdx)=>{
    let postList = this.state.postList;
    postList[postIdx].postMg = false;
    this.setState(prevState => ({
      postList: postList
    }));
  }
  postLikeCallback = (result) =>{
    if(result.reCd === '01'){
      // console.log('좋아요 처리 성공');
      let usrInfo = JSON.parse(localStorage.getItem('usrInfo'));
      usrInfo.usrLikePst = result.usrLikePst;
      localStorage.setItem('usrInfo',JSON.stringify(usrInfo));
    }else{
      // console.log('좋아요 처리 실패');
    }
    this.getPostList();
  }
  postLike =(pstPk, e) => {
    if(pstPk && localStorage.getItem('usrInfo')){
      let myLike = false;
      if( JSON.parse(localStorage.getItem('usrInfo')).usrLikePst
         && JSON.parse(localStorage.getItem('usrInfo')).usrLikePst.indexOf(pstPk)>-1){
        myLike = true;
      }
      let param = {
        usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
        ,pstPk : pstPk
        ,myLike : myLike
      };
      api.apiSend('put','postLike',param,this.postLikeCallback);
    }else{
      alert('좋아요는 로그인 후 가능합니다.');
    }
  }
  postImgOpen = (e)=>{
    popup.openImg(e.currentTarget.currentSrc);
  }

  goPage = (page) =>{
    if(page){
      this.props.history.push(page);
    }
  }

  scrollTop = () => {
    window.scrollTo(0, 0);
  }

  render() {
    Index.defaultProps = {
      getPost: (searchText)=>{
        this.setState({
          searchText : searchText
        });
        let param ={
          usrName : (localStorage.getItem('usrInfo') &&
          JSON.parse(localStorage.getItem('usrInfo')).usrName) 
          ? JSON.parse(localStorage.getItem('usrInfo')).usrName
          : ''
          ,searchText : searchText
        };
        api.apiSend('post','postList',param, (result)=>{
          var pstList = [];
          if(result && result.reCd==="01"){
            pstList = result.pstList;
            this.setState({
              postList : pstList
            });
          }else if(result && result.reCd === '02'){
            this.setState({
              postList :[]
            });
          }
          window.scrollTo(0, 0);
        });
      }
    };

    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--2" fluid>
        {this.state.searchText 
        && this.state.postList 
        && this.state.postList.length>0?
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                '{this.state.searchText}'로 검색한 결과입니다. 
              </CardHeader>
            </Card>
          </Col>
        </Row> :''}
        {
          this.state.postList && this.state.postList.length>0?
          this.state.postList.map((post, postIdx)=>{
            return(
              <Row className="mt-5">
                <Col className="mb-5 mb-xl-0" xl="8">
                  <Card className="shadow">
                    <CardHeader className="border-0">
                      <Row className="align-items-center" lg="12">
                        <Col lg="6">
                          <FrdInfo callbackFromParent={this.goPage} frdName={post.usrName}/>
                        </Col>
                        <Col lg="6" className="text-right">
                            <span>
                            {post.wrDt}
                            {(post.myPst) ? 
                                  <UncontrolledDropdown
                                    isOpen={post.postMg}
                                  >
                                      <DropdownToggle 
                                        className="pr-0" 
                                        onClick={e=>{this.postMgToggle(postIdx)}}
                                        nav>
                                        &nbsp;
                                        <i className="ni ni-settings-gear-65 form-control-cursor"/>
                                      </DropdownToggle>
                                      <DropdownMenu className="dropdown-menu-arrow " right>
                                        <PostModifyModal callbackFromParent={e=>{this.modalClose(postIdx)}} post={post}/>
                                        <DropdownItem
                                          className="form-control-cursor"
                                          onClick = {e=>{this.postMg('d',postIdx)}}
                                        >
                                          <i className="ni ni-basket"/>
                                            포스트 삭제
                                        </DropdownItem>
                                      </DropdownMenu>
                                  </UncontrolledDropdown>
                            :''}
                            </span>
                        </Col>
                      </Row>
                    </CardHeader>
                    <Gallery 
                      photos={post.pstPts} 
                      onClick ={this.postImgOpen}
                    />
                    <br />
                    {/* 게시글 내용 */}
                    <Col lg="12">
                      <div className="card shadow">
                        <div className="card-body">
                            <div className="tab-content" id="postContent">
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
                    <Col lg="12">
                          <div className="card shadow">
                            <div className="card-body">
                                <Row className="tab-content" id="postLike">
                                    <Col lg="6" className="tab-pane fade show active" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                        <span className="description">
                                        <span onClick={e=>{this.postLike(post.pstPk, e)}}
                                              className="text-center ">
                                              <font className = "form-control-cursor"
                                                    style={{"font-size" : "large"}}>
                                                {localStorage.getItem('usrInfo')
                                                  && JSON.parse(localStorage.getItem('usrInfo')).usrLikePst
                                                  && JSON.parse(localStorage.getItem('usrInfo')).usrLikePst.indexOf(post.pstPk)>-1
                                                  ? <span name="like" value="1">♥</span> : <span name="like" value="2">♡</span>
                                                }
                                              </font>
                                              &nbsp;</span> {post.pstLike} 
                                        </span>
                                    </Col>
                                    <Col lg="6" className="tab-pane fade show active" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                        <span className="description">
                                        {
                                        (post.pstHt && post.pstHt.length >0 ) ?
                                          post.pstHt.map((tag, index)=>{
                                            return(
                                            <a href="javascript:void(0)" onClick={e=>{
                                              this.getPostList('search',tag);
                                            }}>
                                              #{tag}&nbsp;
                                            </a> 
                                            )
                                        }) : ''
                                        }
                                      </span>
                                    </Col>
                                  </Row>
                              </div>
                          </div>
                        </Col>
                      <br/>
                  {/*////////////////////////////////
                  ////////////// 댓글 //////////////  
                  ////////////////////////////////*/}
                  {
                    (post.pstCmt && post.pstCmt.length == 0 ) ? 
                      <Col lg="12">
                        <div className="card shadow">
                          <div className="card-body">
                              <div className="tab-content" id="notComment">
                                  <div className="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                      <p className="description">
                                        댓글이 없습니다.
                                      </p>
                                  </div>
                              </div>
                            </div>
                          </div>
                          <br/>
                        </Col>: ''
                    }
                    {/* 댓글 작성 */}
                    {(localStorage.getItem('usrInfo')
                    && JSON.parse(localStorage.getItem('usrInfo')).usrName ) ?
                    <Row className="align-items-center avatar-padding">
                      <Col lg="1" className="">
                        <span className="avatar avatar-sm rounded-circle">
                          <img
                            alt="..."
                            src={(localStorage.getItem('usrInfo') 
                            && JSON.parse(localStorage.getItem('usrInfo')).usrPt !== '')  
                            ? JSON.parse(localStorage.getItem('usrInfo')).usrPt
                            : require("assets/img/theme/no-profile-130x130.png")}
                          />
                        </span>
                      </Col>
                      <Col lg="9">
                        <textarea 
                          className="form-control " 
                          id="exampleFormControlTextarea1" 
                          rows="3" 
                          placeholder="댓글을 입력하세요" 
                          onChange = {e=>{this.commentChnage(e, postIdx)}}
                          value = {post.wrComment}
                          ref={(textarea) => { this.textarea = textarea; }}
                        >
                        </textarea>
                      </Col>
                      <Col lg="2">
                        <button type="button" 
                                className="btn btn-primary"
                                onClick = {e=>{this.commentWrite(post.pstPk, postIdx)}}
                        >
                          작성
                        </button>
                      </Col>
                      </Row> : ''}
                    <br/>
                    {/* 댓글 내용 */}
                      {
                      (post.pstCmt && post.pstCmt.length >0 ) ?
                      post.pstCmt.map((comment, commentIdx)=>{
                        return(
                      <div>
                        <Row className = "align-items-center avatar-padding"
                            lg="12"
                        >
                          {(comment.pstCmtSep === '02' ||  comment.pstCmtSep === '03R') ? 
                              <Col lg="1">
                                <img
                                  className=""
                                  alt="..."
                                  src={require("assets/img/icons/post/reply.png")}
                                  style ={{width:"36px"
                                          ,height:"36px"
                                          }}
                                    /> 
                              </Col>
                            : ''}
                        <Col lg="1">
                          <a
                              className="avatar avatar-sm"
                              href="#pablo"
                              id="tooltip806693074"
                              onClick={e => popup.openImg(comment.usrPt)}>
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={(comment.usrPt &&comment.usrPt !=="") 
                              ? comment.usrPt
                              : require("assets/img/theme/no-profile-130x130.png")}
                            />
                          </a>
                        </Col>
                        <Col lg="8">
                            <FrdInfo callbackFromParent={this.goPage} frdName={comment.usrName}/>
                            &nbsp;
                            {comment.pstCmtWtDate}
                        </Col>
                      </Row>
                      <Row className = "align-items-center avatar-padding">
                        <Col lg="11">
                          <div className="card shadow">
                            <div className="card-body">
                                <div className="tab-content" id="updateContents">
                                    <div className="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                        <p className="description">
                                          {
                                            (!comment.pstCmtUd) ? 
                                                ((comment.pstCmtSep === '03' || comment.pstCmtSep === '03R') ? '삭제된 댓글입니다.' 
                                                : comment.pstCmtCt)  
                                                : <textarea 
                                                    className="form-control " 
                                                    rows="3" 
                                                    placeholder="수정할 댓글을 입력하세요" 
                                                    onChange = {e=>{this.commentUtChnage(e,postIdx, commentIdx)}}
                                                    value = {comment.updateComment}
                                                   />
                                          }
                                        </p>
                                    </div>
                                </div>
                              </div>
                          </div>
                        </Col>
                        {/* 내 댓글일 경우에만 수정 */}
                        {(comment.pstCmtUd && 
                        (localStorage.getItem('usrInfo')
                          && JSON.parse(localStorage.getItem('usrInfo')).usrName === comment.usrName)) ? 
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
                      {(localStorage.getItem('usrInfo')
                        && JSON.parse(localStorage.getItem('usrInfo')).usrName
                        && !comment.pstCmtUd) ? 
                        <Col lg="11">
                        <br></br>
                        <div className="col text-right avatar-padding-right-none form-control-cursor">
                            {/* 내 댓글일 경우 & 내 게시글일 경우 삭제 */}
                            {( localStorage.getItem('usrInfo')
                              && JSON.parse(localStorage.getItem('usrInfo')).usrName === comment.usrName )
                              ? 
                              <span>
                              <button type="button" 
                                      className="btn-sm btn-info form-control-cursor"
                                      onClick ={e=>{this.commentUpdate('v',postIdx, commentIdx)}}
                              >
                                수정
                              </button> &nbsp;
                              <button type="button" 
                                      className="btn-sm btn-danger form-control-cursor"
                                      onClick={e=>{this.commentDeleteConfirm(postIdx, commentIdx)}}
                              >
                                삭제 
                              </button> &nbsp;
                              </span>
                            : (localStorage.getItem('usrInfo')
                              && JSON.parse(localStorage.getItem('usrInfo')).usrName === post.usrName )
                            ? 
                              <span>
                                <button type="button" 
                                  className="btn-sm btn-danger form-control-cursor"
                                  onClick={e=>{this.commentDeleteConfirm(postIdx, commentIdx)}}
                                >
                                  삭제 
                                </button> &nbsp;
                              </span>
                            : ''
                          }
                              <button type="button" 
                                      className="btn-sm btn-info form-control-cursor"
                                      onClick = {e=>{this.commentReply('v',postIdx, commentIdx)}}
                              >
                                답글
                              </button>
                        </div>
                          <br />
                        </Col>  
                        : <br/>}
                      {(comment.pstCmtRp) ? 
                      <div >
                      <Row className="align-items-center avatar-padding">
                        <br></br>
                      <Col lg="1" className="">
                        <span className="avatar avatar-sm rounded-circle">
                          <img
                            alt="..."
                            src={(localStorage.getItem('usrInfo') 
                            && JSON.parse(localStorage.getItem('usrInfo')).usrPt !== '')  
                            ? JSON.parse(localStorage.getItem('usrInfo')).usrPt
                            : require("assets/img/theme/no-profile-130x130.png")}
                          />
                        </span>
                      </Col>
                      <Col lg="8">
                        <textarea 
                          className="form-control " 
                          id="exampleFormControlTextarea1" 
                          rows="3" 
                          placeholder="답글을 입력하세요" 
                          onChange = {e=>{this.replyChange(e)}}
                          value = {this.state.replyComment}
                        >
                        </textarea>
                      </Col>
                      <Col lg="3">
                        <button type="button" 
                                className="btn btn-primary form-control-cursor"
                                onClick = {e=>{this.commentReply('e',postIdx, commentIdx, comment.pstCmtGp)}}
                                >
                          작성
                        </button>
                        <button type="button" 
                                className="btn btn-danger form-control-cursor"
                                onClick = {e=>{this.commentReply('c',postIdx, commentIdx)}}
                        >
                          취소
                        </button>
                      </Col>
                      </Row>
                    </div>
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
          :this.state.searchText || this.state.searchText !== ''?
          <Row className="mt-5">
              <Col className="mb-5 mb-xl-0" xl="8">
                <Card className="shadow">
                  <CardHeader className="border-0">
                    '{this.state.searchText}'로 검색한 게시물이 존재하지 않습니다.
                  </CardHeader>
                </Card>
              </Col>
            </Row> 
          :''
        }
        </Container>
      </>
    );
  }
}


export default Index;

