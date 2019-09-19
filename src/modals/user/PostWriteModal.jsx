import React from 'react';
import { Button, Modal, ModalBody, Row, Col} from 'reactstrap';

import * as api from "api/api";

export default class PostWriteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      modal: false
      , tag: []
      , tempImgs : []
      , PostContent : ''
      , pstPubYn : '01'
    };
    // this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.modalClose = this.props.callbackFromParent;
  }
  toggle = (e) => {
    // e.stopPropagation();
    // e.preventDefault();
    this.setState({
      modal: !this.state.modal
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  addTag = (e) =>{
    if(e.key==="Enter"){
      const list = this.state.tag;
      if(list.length<5){
        list.push(e.target.value);
        this.setState({
          tag : list
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
      const list = this.state.tag;
      if (idx > -1) list.splice(idx, 1)
      this.setState({
        tag : list
      });
    }
  }
  cancel=()=>{
    this.setState({
      tag:[]
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
    console.log("removeImg >> \n",e.target,'\n',idx);

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
    console.log("imgView >> \n",e.target,'\n',idx);
    
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
      switch(e.target.value){
        case 1:
          this.setState({
            pstPubYn : '01'
          });
          break;
        case 2:
          this.setState({
            pstPubYn : '02'
          });
          break;
        case 3:
          this.setState({
            pstPubYn : '03'
          });
          break;
      }
    }else if(cd === 'c'){ // 게시글 내용
      this.setState({
        PostContent : e.target.value
      });
    }
  }

  postCallback = (result) =>{
    if(result.reCd === '01'){
      alert('게시글 작성 성공');
    }else{
      alert('게시글 작성 실패');
    }
    // this.cancel();
    window.location.reload();

  };

  post = () =>{
    // valcheck
    if(this.state.tempImgs.length==0 && this.state.PostContent === ''){
      alert('이미지 또는 게시글 내용 중 하나는 필수입니다.');
      return;
    }
    var param={
      usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
      ,pstPts : this.state.tempImgs
      ,pstCt : this.state.PostContent
      ,pstHt : this.state.tag
      ,pstPubYn : this.state.pstPubYn
    }
    api.apiSend('post','post',param,this.postCallback);
  };

  render() {
    const tagList = this.state.tag.map(
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
          <div onClick={this.toggle} className="dropdown-item form-control-cursor"><i className="ni ni-send" />게시글 작성</div>
          {/* <a href="javascript:void(0)" onClick={this.toggle} className="dropdown-item form-control-cursor"><i className="ni ni-send" /><span>게시글 작성</span></a> */}
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
                    src={require("assets/img/theme/team-4-800x800.jpg")}
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
                  {/* <form
                    encType="multipart/form-data"
                    onSubmit={this.handleSubmit}
                  > */}
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
                        //  value ={this.state.postImgs}
                         onClick={e=>{this.setState({
                           tempImgs : []
                         })}}
                         onChange = {this.imgChange}
                    />
                  {/* </form> */}
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
                           id="PostHashTag" 
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
                {/* </Col>
                <Col lg="3"> */}
                    <select className="form-control" 
                            onChange={e=>{this.valChange('p',e)}}
                            style={{width:"50%",display:"inline"}}
                    > 
                      <option value='1'>
                        전체
                      </option>  
                      <option value='2'>
                        친구에게만
                      </option>  
                      <option value='3'>
                        비공개
                      </option>  
                    </select>
                    <br/>
                </Col>
                <Col lg="5">
                  <input type="button" 
                         color="primary" 
                         className="btn btn-primary" 
                         value="게시"
                         onClick={this.post}       
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