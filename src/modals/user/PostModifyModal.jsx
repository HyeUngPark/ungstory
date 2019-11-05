import React from 'react';
import { Button, Modal, ModalBody, Row, Col} from 'reactstrap';

import * as api from "utils/api";

export default class PostModifyModal extends React.Component {
  constructor(props) {
    super(props);
    let post = this.props.post;
    let tempPts =[], tempHts = [];
    
    if(post.pstPts){
      for(let i=0; i<post.pstPts.length; i++){
        tempPts.push(post.pstPts[i].src);
      }
    }
    if(post.pstHt){
      for(var i=0; i<post.pstHt.length; i++){
        tempHts.push(post.pstHt[i]);
      }
    }

    this.state = { 
      modal: false
      , pstPk  : post.pstPk
      , tags: tempHts
      , tempImgs : tempPts
      , PostContent : post.pstCt
      , pstPubYn : post.pstPubYn
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.modalClose = this.props.callbackFromParent;
  }
  toggle = (e) => {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  addTag = (e) =>{
    if(e.key==="Enter"){
      const list = this.state.tags;
      if(list.length<5){
        list.push(e.target.value);
        this.setState({
          tags : list
        });
      }else{
        alert("태그는 5개까지만 입력 가능합니다.");
      }
      e.target.value="";
    }
  }
  removeTag = (e) =>{
    if(e.target){
      const idx =  e.target.attributes.value.value * 1;
      const list = this.state.tags;
      if (idx > -1) list.splice(idx, 1)
      this.setState({
        tag : list
      });
    }
  }
  cancel=()=>{
    this.setState({
      tags:[]
      ,tempImgs : []
    })
    // this.modalOpen();
    this.modalClose();
    this.toggle();
  }

  imgChange =(e)=>{
    if(e.target.files.length<6){
      for(var i=0; i<e.target.files.length; i++){
        var file = e.target.files[i];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (file) {
          var tempList = this.state.tempImgs;
            tempList.push(file.target.result);
            this.setState({
              tempImgs : tempList
            });
            e.preventDefault();
          }.bind(this);
        }
    }else{
      alert("이미지는 5개까지만 업로드 가능합니다.");
      return;
    }

  }

  removeImg = (idx,e) =>{
    // console.log("removeImg >> \n",e.target,'\n',idx);

    if(e.target){
      // const idx =  e.target.attributes.value.value * 1;
      const list = this.state.tempImgs;
      if (idx > -1) list.splice(idx, 1)
      this.setState({
        tempImgs : list
      });
    }
  }

  imgView =(idx,e)=>{
    // console.log("imgView >> \n",e.target,'\n',idx);
    
    if(e.target){
      // const idx =  e.target.attributes.value.value * 1;
      const list = this.state.tempImgs;
      if (idx > -1){
        window.open('about:blank',list[idx]);
      }
    }
  };

  valChange = (cd, e) =>{
    if(cd === 'p'){ // 공개여부
      // console.log('공개여부+>>'+e.target.value);
      this.setState({
        pstPubYn : e.target.value
      });
    }else if(cd === 'c'){ // 게시글 내용
      this.setState({
        PostContent : e.target.value
      });
    }
  }

  postModifyCallback = (result) =>{
    if(result.reCd === '01'){
      alert('게시글 수정 성공');
    }else{
      alert('게시글 수정 실패');
    }
    window.location.reload();

  };

  postModify = () =>{
    if(this.state.tempImgs.length==0 && this.state.PostContent === ''){
      alert('이미지 또는 게시글 내용 중 하나는 필수입니다.');
      return;
    }
    var param={
      pstPk : this.state.pstPk
      ,pstPts : this.state.tempImgs
      ,pstCt : this.state.PostContent
      ,pstHt : this.state.tags
      ,pstPubYn : this.state.pstPubYn
    }
    api.apiSend('put','postModify',param,this.postModifyCallback);
  };

  render() {
    const tagList = this.state.tags.map(
      (tag,index) => (<li className="form-tag form-tag-li" key={index}>
                        <a href="javascript:void(0)" className="form-control-cursor">
                          #{tag}
                          <span className="form-tag-del-btn" value={index} onClick={this.removeTag}>X</span>
                        </a>
                      </li>)
    );
    const imgList = this.state.tempImgs.map(
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
                            onClick={e=>{this.imgView(index,e)}}
                          >
                            <img src={img} 
                                style={{
                                  width: "100px",
                                  height: "100px",
                                }}
                                value={index} 
                              />
                          </a>
                          <span className="form-tag-del-btn form-control-cursor" 
                                value={index} 
                                onClick={e=>{this.removeImg(index,e)}}
                                style ={{
                                  position:'absolute',
                                  right:'0px',
                                  top:'0px',
                                  fontSize : '0.75rem'
                                }}
                          >
                            X
                          </span>
                        </div>
                      </li>)
    );

    return (
        <div>
          <div onClick={this.toggle} 
               className="dropdown-item form-control-cursor">
                 <i className="ni ni-send"/> 포스트 수정 </div>
          <Modal isOpen={this.state.modal} backdrop={false} onKeyUp={(e)=>{
            if(e.key === "Escape"){
              this.cancel();
            }
          }}>
          <form className="card shadow" 
                onSubmit={this.handleSubmit}
                encType="multipart/form-data"
          >
            {/* <ModalHeader><h3>게시글 작성</h3></ModalHeader> */}
            <ModalBody>
              <Row>
                <Col lg="2">
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
                <Col lg="10">
                  <textarea className="form-control" 
                            id="PostContent" 
                            rows="3" 
                            autoFocus={true} 
                            placeholder="내용 입력하세요"
                            onChange={e=>{this.valChange('c',e)}}
                            value={this.state.PostContent}
                  >
                    
                  </textarea>
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
                  <input type="file" 
                         className="form-display-none"
                         name="filename[]" 
                         id="PostImg" 
                         multiple
                         onClick={e=>{this.setState({
                           tempImgs : []
                         })}}
                         onChange = {this.imgChange}
                    />
                </Col>
              </Row>
                <Row lg="12">
                  <Col>
                      <ul id="img-list" className="form-tag-ul">
                          {imgList}
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
                <Col lg="9" style={{paddingLeft:"0"}}>
                  <span>
                    <input className="form-control " 
                           id="PostHashTags" 
                           placeholder="입력후 엔터"
                           style={{height:"30px", width:"150px"}} 
                           onKeyPress={this.addTag}/>
                  </span>
                </Col>
                </Row>
                <Row lg="12">
                  <Col lg="8">
                      <ul id="tag-list" className="form-tag-ul">
                          {tagList}
                      </ul>
                  </Col>
                </Row>
              <br/>
              <Row>
                <Col lg="7">
                  <i className="ni ni-lock-circle-open" style={{width:"45%"}}>&nbsp;공개 여부</i>&nbsp;
                    <select className="form-control" 
                            onChange={e=>{this.valChange('p',e)}}
                            style={{width:"50%",display:"inline"}}
                            value={this.state.pstPubYn}
                    > 
                      <option value='01'>
                        전체
                      </option>  
                      <option value='02'>
                        친구에게만
                      </option>  
                      <option value='03'>
                        비공개
                      </option>  
                    </select>
                    <br/>
                </Col>
                <Col lg="5">
                  <input type="button" 
                         color="primary" 
                         className="btn btn-primary" 
                         value="수정"
                         onClick={this.postModify}       
                  />
                  <Button color="danger" onClick={this.cancel}>취소</Button>
                </Col>
              </Row>
            </ModalBody>
            </form>
          </Modal>
        </div>
      
    );
  }
}