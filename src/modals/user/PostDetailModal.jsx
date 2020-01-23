import React from 'react';
import {
  Button, 
  Modal, 
  ModalBody, 
  Row, 
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,

} from 'reactstrap';

import * as popup from "utils/popup";
import * as api from "utils/api";

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import FrdInfo from '../frd/FrdInfo';
import PostModifyModal from '../user/PostModifyModal';
import Index from "../../views/Index";

class PostDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      modal: false
      ,postInfo : {}
      ,firstCd : false
      ,replyComment : ''
      ,defaultStyle : !this.props.style ? {'display':'none'}: {'display':''}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.modalClose = this.props.callbackFromParent;
    // this.props.viewPt = this.getPostInfo.bind(this);
  }
  toggle = (e) => {
    if(!Object.getOwnPropertyNames(this.state.postInfo).length > 0){
      this.getPostInfo();
    }
    this.setState({
      modal: !this.state.modal
    });
  }

  getPostList = (tag) => {
    var index = <Index/>;
    index.props.getPost(tag);
    this.cancel();
  }

  getPostInfoCallback = (result) => {
    if(result.reCd === '01'){
      console.log('포스팅 정보 조회 성공');
      this.setState({
        postInfo : result.postInfo
        ,firstCd : true
      });
    }else {
      console.log('포스팅 정보 조회 실패');
      this.setState({
        postInfo : {}
        ,firstCd : true
      });
    }
  }

  getPostInfo = (pstPk) => {
    let param ={
      pstPk : this.props.pstPk ? this.props.pstPk : pstPk
      ,usrName : localStorage.getItem('usrInfo') ? JSON.parse(localStorage.getItem('usrInfo')).usrName : ''
    };
    api.apiSend('post','getPostInfo',param,this.getPostInfoCallback);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  cancel=()=>{
    this.setState({
      postInfo : {}
      ,modal: false
    });
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
    this.getPostInfo();
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

  commentWrite = () => {
    let postInfo = this.state.postInfo;
    if(!postInfo.wrComment || postInfo.wrComment === ''){
      alert('댓글 내용을 입력해주세요.');
      return;
    }else{
      let param ={
        usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
        ,pstPk : this.props.pstPk
        ,pstCmtCt : postInfo.wrComment
      };
      postInfo.wrComment = '';
      this.setState({
        postInfo : postInfo
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
    this.getPostInfo();
  }

  commentReply = (cd, commentIdx) =>{
    let postInfo = this.state.postInfo;
    if(postInfo){
      if(cd === 'v'){
        for(var i=0; i< postInfo.pstCmt.length; i++){
          if(i==commentIdx){
            postInfo.pstCmt[commentIdx].pstCmtRp = true;
          }else{
            postInfo.pstCmt[i].pstCmtRp = false;
          }
        }
        this.setState({
          postInfo : postInfo
        });
      }else if(cd === 'c'){
        postInfo.pstCmt[commentIdx].pstCmtRp = false;
        this.setState({
          postInfo : postInfo
          ,replyComment : ''
        });
      }else if(cd === 'e'){
        if(this.state.replyComment === ''){
          alert('답글을 입력해주세요.');
          return;
        }

        let param = {
          usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
          ,pstPk : this.props.pstPk
          ,pstCmtCt : this.state.replyComment
          ,pstCmtPk : postInfo.pstCmt[commentIdx].pstCmtPk
          ,pstCmtGp : postInfo.pstCmt[commentIdx].pstCmtGp
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
    this.getPostInfo();
  }

  commentChnage = (e) =>{
    let postInfo = this.state.postInfo;
    
    postInfo.wrComment = e.target.value;

    this.setState({
      postInfo : postInfo
    });
  }

  commentUtChnage =(e, commentIdx)=>{
    let postInfo = this.state.postInfo;
    postInfo.pstCmt[commentIdx].updateComment = e.target.value;
    this.setState({
      postInfo : postInfo
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
    
    this.getPostInfo();
  }
  commentUpdate = (cd, commentIdx) =>{
    let postInfo = this.state.postInfo;
    if(postInfo){
      if(cd === 'v'){
        postInfo.pstCmt[commentIdx].pstCmtUd = true;
        this.setState({
          postInfo : postInfo
        });
      }else if(cd === 'c'){
        postInfo.pstCmt[commentIdx].pstCmtUd = false;
        postInfo.pstCmt[commentIdx].updateComment = '';
        this.setState({
          postInfo : postInfo
        });
      }else if(cd === 'e'){
        let param = {
          pstCmtCt : postInfo.pstCmt[commentIdx].updateComment
          ,pstCmtPk : postInfo.pstCmt[commentIdx].pstCmtPk
        };
        postInfo.pstCmt[commentIdx].updateComment= '';
        postInfo.pstCmt[commentIdx].pstCmtUd = false;
        this.setState({
          postInfo : postInfo
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
    this.getPostInfo();
  }

  commentDelete = (commentIdx)=>{
    let postInfo = this.state.postInfo;
    let pstCmtDcd;
    if(postInfo.pstCmt.length === (commentIdx+1)
     ||postInfo.pstCmt[commentIdx].pstCmtGp !== postInfo.pstCmt[commentIdx+1].pstCmtGp
    ){
        pstCmtDcd = '04';
    }else if(commentIdx !==0 
      && postInfo.pstCmt[commentIdx].pstCmtGp === postInfo.pstCmt[commentIdx+1].pstCmtGp){
        pstCmtDcd = '03R';
    }else{
        pstCmtDcd = '03';
    }
    let param = {
      pstCmtPk : postInfo.pstCmt[commentIdx].pstCmtPk
      ,pstCmtDcd : pstCmtDcd
    };
    api.apiSend('post','postCmtDel',param,this.commentDeleteCallback);
  }

  commentDeleteConfirm = (commentIdx)=>{
    confirmAlert({
      title: '댓글 삭제 확인',
      message: '정말 삭제하시겠습니까?',
      buttons: [
        {
          label: '삭제하기',
          onClick: () => this.commentDelete(commentIdx)
        },
        {
          label: '취소',
          onClick: () => {}
        }
      ]
    });
  }
  
  goPage = (page) =>{
    if(page){
      this.props.history.push(page);
    }
  }

  postMgToggle = () =>{
    let postInfo = this.state.postInfo;
    postInfo.postMg = true;
    this.setState({
      postInfo : postInfo
    });
  }

  postMg =(cd) =>{
    if(cd === 'd'){
      confirmAlert({
        title: '포스트 삭제 확인',
        message: '정말 포스트를 삭제하시겠습니까?',
        buttons: [
          {
            label: '삭제하기',
            onClick: () => this.postDelete()
          },
          {
            label: '취소',
            onClick: () => {
              let postInfo = this.state.postInfo;
              postInfo.postMg = false;
              this.setState({
                postInfo : postInfo
              });
            }
          }
        ]
      });
    }
  }

  modalClose =()=>{
    let postInfo = this.state.postInfo;
    postInfo.postMg = false;
    this.setState(prevState => ({
      postInfo: postInfo
    }));
  }
 
  render() {
    return (
        <div>
          <div 
            className="btn btn-info"
            onClick={e=>{this.toggle()}}
            style={this.state.defaultStyle}
          >
            상세보기
          </div>

          <Modal 
            isOpen={this.state.modal} 
            zIndex = "90"
            backdrop="static" 
            onKeyUp={(e)=>{
              if(e.key === "Escape"){
                this.cancel();
              }
            }}
            // shouldCloseOnOverlayClick={false}
          >
            {
              !Object.getOwnPropertyNames(this.state.postInfo).length > 0? 
              <form className="card shadow" 
                onSubmit={this.handleSubmit}
                encType="multipart/form-data"
              >
                <ModalBody>
                  <Row>
                    <Col lg="12">
                      포스트 조회에 실패하였습니다.
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12" className="text-center">
                      <Button color="danger" onClick={this.cancel}>닫기</Button>
                    </Col>
                  </Row>
                </ModalBody>
              </form>
            :
            <form className="card shadow" 
                  onSubmit={this.handleSubmit}
                  // encType="multipart/form-data"
            >
            <ModalBody
              className="modal-scroll"
            >
              <Row>
                <Col lg="12" className="text-right">
                  <span className="form-tag-del-btn form-tag-del-15" onClick={e=>{this.cancel()}}>X</span>
                </Col>
              </Row>
              <Row className="">
                <Col lg="12">
                    <Row className="align-items-center" lg="12">
                      <Col lg="6">
                        <FrdInfo callbackFromParent={this.goPage} frdName={this.state.postInfo.usrName}/>
                      </Col>
                      <Col lg="6" className="text-right">
                        <span>
                        {this.state.postInfo.wrDt}
                        {(this.state.postInfo.myPst) ? 
                                <UncontrolledDropdown
                                  isOpen={this.state.postInfo.postMg}
                                >
                                    <DropdownToggle 
                                      className="pr-0" 
                                      onClick={e=>{this.postMgToggle()}}
                                      nav>
                                      &nbsp;
                                      <i className="ni ni-settings-gear-65 form-control-cursor"/>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-arrow " right>
                                      <PostModifyModal callbackFromParent={e=>{this.modalClose()}} post={this.state.postInfo}/>
                                      <DropdownItem
                                        className="form-control-cursor"
                                        onClick = {e=>{this.postMg('d')}}
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
                </Col>
              </Row>
              <br/>
              <Row>
                <Col lg="2">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={this.state.postInfo.usrPt  
                    ? this.state.postInfo.usrPt
                    : require("assets/img/theme/no-profile-130x130.png")}
                  />
                </span>
                </Col>
                <Col lg="10">
                  <textarea className="form-control" 
                            id="PostContent" 
                            rows="3" 
                            autoFocus={true} 
                            // placeholder="내용 입력하세요"
                            value={this.state.postInfo.pstCt}
                  />
                 
                </Col>
              </Row>
              <br/>
              <Row lg="12">
                <Col lg="3">
                  <i className=" ni ni-image align-items-center">
                    <label 
                      className ="form-control-cursor"
                      htmlFor="PostImg"
                    >
                      &nbsp;이미지 
                    </label>
                  </i>
                  
                </Col>
              </Row>
                <Row lg="12">
                  <Col>
                    <ul id="img-list" className="form-tag-ul">
                    {
                     (this.state.postInfo.pstPts && this.state.postInfo.pstPts.length>0)
                      ? this.state.postInfo.pstPts.map(
                       (img,index) => (<li className="form-tag form-tag-li" key={index}>
                        <div
                          style={{
                            position: "relative"
                          }}
                        >
                            <a href="javascript:void(0)" 
                              className="form-control-cursor"
                              style={{
                              }}
                              onClick={e => popup.openImg(img)}
                            >
                              <img src={img} 
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                  }}
                                  value={index} 
                                />
                            </a>
                          </div>
                        </li>))
                        : 
                        <li className="form-tag form-tag-li">
                          포스팅 이미지가 없습니다.
                        </li>
                      }
                      </ul>
                  </Col>
                </Row>
                <Row lg="12">
                  <Col lg="3" 
                  // className="text-right"
                  >
                    <span style={{
                      paddingRight : '0px'
                    }}>
                      <i className=" ni ni-tag align-items-center">
                        &nbsp;해시태그
                      </i>
                    </span>
                  </Col>
                </Row>
                <Row lg="12">
                  <Col>
                    <ul id="img-list" className="form-tag-ul">
                    {
                     (this.state.postInfo.pstPts && this.state.postInfo.pstHt.length>0)
                      ? this.state.postInfo.pstHt.map(
                       (tag,index) => (<li className="form-tag form-tag-li" key={index}>
                        <div
                          style={{
                            position: "relative"
                          }}
                        >
                          <a href="javascript:void(0)" 
                              className="form-control-cursor"
                              style={{
                              }}
                              onClick={e=>{
                                this.getPostList(tag);
                              }}
                            > 
                              #{tag}
                            </a>
                          </div>
                        </li>))
                        : 
                        <li className="form-tag form-tag-li">
                          해시태그가 없습니다.
                        </li>
                      }
                  </ul>
                </Col>
              </Row>
              <br/>
              <Row>
                <Col lg="auto">
                  <span className="description">
                    좋아요 : &nbsp;
                    <span onClick={e=>{this.postLike(this.state.postInfo.pstPk, e)}}
                          className="text-center ">
                          <font className = "form-control-cursor"
                                style={{"font-size" : "large"}}>
                            {localStorage.getItem('usrInfo')
                              && JSON.parse(localStorage.getItem('usrInfo')).usrLikePst.indexOf(this.state.postInfo.pstPk)>-1
                              ? <span name="like" value="1">♥</span> : <span name="like" value="2">♡</span>
                            }
                          </font>
                          &nbsp;</span> {this.state.postInfo.pstLike} 
                    </span>
                </Col>
              </Row>
              <br/>
              <Row>
                <Col lg="12">
                  <i className="ni ni-lock-circle-open">
                    &nbsp;공개 여부 : &nbsp;
                      {this.state.postInfo.pstPubYn === '01' ?
                      '전체공개' :
                      this.state.postInfo.pstPubYn === '02' ? 
                      "친구에게만 공개"
                      : "비공개"
                    }
                    </i>
                </Col>
              </Row>
              <br/>
                {/*////////////////////////////////
                  ////////////// 댓글 //////////////  
                  ////////////////////////////////*/}
                  {
                    (this.state.postInfo.pstCmt && this.state.postInfo.pstCmt.length == 0 ) ? 
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
                    <Row className="">
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
                      <Col lg="9" className="form-padding-left-2 form-padding-right-0"> 
                        <textarea 
                          className="form-control " 
                          id="exampleFormControlTextarea1" 
                          rows="3" 
                          placeholder="댓글을 입력하세요" 
                          onChange = {e=>{this.commentChnage(e)}}
                          value = {this.state.postInfo.wrComment}
                          ref={(textarea) => { this.textarea = textarea; }}
                        >
                        </textarea>
                      </Col>
                      <Col lg="2">
                        <button type="button" 
                                className="btn btn-primary"
                                onClick = {e=>{this.commentWrite()}}
                        >
                          작성
                        </button>
                      </Col>
                      </Row> : ''}
                    <br/>
                    {/* 댓글 내용 */}
                      {
                      (this.state.postInfo.pstCmt && this.state.postInfo.pstCmt.length >0 ) ?
                      this.state.postInfo.pstCmt.map((comment, commentIdx)=>{
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
                        <Col lg="11" className="form-padding-left-2 form-padding-right-0">
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
                                                    onChange = {e=>{this.commentUtChnage(e, commentIdx)}}
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
                                        onClick = {e=>{this.commentUpdate('e',commentIdx)}}
                                >
                                  수정하기
                                </button>&nbsp;
                                <button type="button" 
                                        className="btn-sm btn-danger form-control-cursor"
                                        onClick = {e=>{this.commentUpdate('c', commentIdx)}}
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
                                      onClick ={e=>{this.commentUpdate('v', commentIdx)}}
                              >
                                수정
                              </button> &nbsp;
                              <button type="button" 
                                      className="btn-sm btn-danger form-control-cursor"
                                      onClick={e=>{this.commentDeleteConfirm(commentIdx)}}
                              >
                                삭제 
                              </button> &nbsp;
                              </span>
                            : (localStorage.getItem('usrInfo')
                              && JSON.parse(localStorage.getItem('usrInfo')).usrName === this.state.postInfo.usrName )
                            ? 
                              <span>
                                <button type="button" 
                                  className="btn-sm btn-danger form-control-cursor"
                                  onClick={e=>{this.commentDeleteConfirm(commentIdx)}}
                                >
                                  삭제 
                                </button> &nbsp;
                              </span>
                            : ''
                          }
                              <button type="button" 
                                      className="btn-sm btn-info form-control-cursor"
                                      onClick = {e=>{this.commentReply('v', commentIdx)}}
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
                                onClick = {e=>{this.commentReply('e', commentIdx, comment.pstCmtGp)}}
                                >
                          작성
                        </button>
                        <button type="button" 
                                className="btn btn-danger form-control-cursor"
                                onClick = {e=>{this.commentReply('c', commentIdx)}}
                        >
                          취소
                        </button>
                      </Col>
                      </Row>
                    </div>
                        : ''}
                      </div> 
                      )}) : ''
              ////////////////////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////////////////////
                  }
              <Row>
                <Col lg="12" className="text-center">
                  <Button color="danger" onClick={this.cancel}>닫기</Button>
                </Col>
              </Row>
            </ModalBody>
            </form>
            }
          </Modal>
        </div>
      
    );
  }
}

export default PostDetailModal