import React from 'react';
import { Button, Modal, ModalBody,ModalHeader, Card , Row, Col} from 'reactstrap';

import * as api from "api/api";
import PostImgList from './PostImgList';

export default class ProfileChange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal : false
      ,tempImgs : ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.modalClose = this.props.callbackFromParent;
  
  }
  
  modalClose =(e)=>{
    console.log("PwFind modalClose()");
    // this.setState(prevState => ({
    //     isModalOpen: !prevState.isModalOpen
    // }));
  }
  toggle = (e) => {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  cancel=()=>{
    this.setState({
      tempImgs : ''
    });
    this.toggle();
  }

  pwFindCallback = (result)=>{
    if(result.reCd==="01"){
      alert('임시 비밀번호가 발급되었습니다. 이메일을 확인해주세요');
      this.cancel();
    }else if(result.reCd ==='02'){
      alert('비밀번호 찾기를 실패했습니다.')
    }
    return;
  }
  profileModify = ()=>{

  }
  imgView =(e)=>{

  }
  imgChange =(e)=>{
    if(e.target.files.length===1){
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (file) {
            this.setState({
              tempImgs : file.target.result
            });
            e.preventDefault();
        }.bind(this);
    }else{
      alert("프로필 이미지는 1개까지만 선택 가능합니다.");
      return;
    }
  }

  removeImg = (e)=>{
    this.setState({
      tempImgs : ""
    });
  }
  pwFind =() =>{
    let idVal = this.state.usrId;
    if(idVal===''){
      alert('이메일을 입력해 주세요.');
      return;
    }else if(idVal.indexOf('@')<0 || idVal.indexOf('.')<0){ // 이메일 형식 체크
      alert("이메일 형식을 지켜주세요\nex)test@test.com");
      return;
    }

    let param={
      usrId : this.state.usrId
   };
   api.apiSend('post','pwFind',param,this.pwFindCallback);
  }
  imgSelect =(img) =>{
    this.setState({
      tempImgs : img
    });
  }
  render() {
    return (
        <div>
          <Button
            className="float-right"
            color="default"
            href="#pablo"
            onClick={e => this.toggle()}
            size="sm"
          >
            프로필 사진 수정
          </Button>
          <Modal isOpen={this.state.modal} backdrop={false} onKeyUp={(e)=>{
            if(e.key === "Escape"){
              this.cancel();
            }
          }}>
          <form className="card shadow" onSubmit={this.handleSubmit}>
          <Card className="bg-secondary shadow border-0">
            <h5 className="display-4">&nbsp;프로필 사진 변경</h5>
            <ModalBody>
              <Row>
                <Col lg="6">
                  {/* 이미지 등록 */}
                  <i className=" ni ni-image align-items-center">
                    <label 
                      className ="form-control-cursor"
                      htmlFor="newImg"
                    >
                      &nbsp;새 이미지 
                    </label>
                  </i>
                  <input type="file" 
                         className="form-display-none"
                         name="filename[]" 
                         id="newImg" 
                         multiple
                         onClick={e=>{this.setState({
                           tempImgs : ''
                         })}}
                         onChange = {this.imgChange}
                    />
                </Col>
                <Col lg="6">
                  {/* 올린 사진들 중 선택 */}
                  <PostImgList 
                      callbackFromParent={this.imgSelect}
                      usrId = {this.props.usrId}/>
                </Col>
              </Row>
              {this.state.tempImgs !== "" ? 
              <Row>
                <Col lg="6">
                <div
                  style={{
                    position: "relative"
                  }}
                  className="form-tag form-tag-li"
                >
                    <a href="javascript:void(0)" 
                      className="form-control-cursor"
                      style={{
                      }}
                      onClick={e=>{this.imgView(e)}}
                    >
                      <img src={this.state.tempImgs} 
                          style={{
                            width: "100px",
                            height: "100px",
                          }}
                        />
                    </a>
                    <span className="form-tag-del-btn form-control-cursor" 
                          onClick={e=>{this.removeImg(e)}}
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
                </Col>
              </Row>
              :''}
              <Row>
              {/* 확인 */}
              <Col lg="12">
                  <input type="button" 
                         color="primary" 
                         className="btn btn-primary" 
                         value="확인"
                         onClick={e=>{this.profileModify()}}       
                  />
                  <Button color="danger" onClick={this.cancel}>취소</Button>
              </Col>
              </Row>
              {/* 취소 */}
             
            </ModalBody>
            </Card>
            </form>
          </Modal>
        </div>
      
    );
  }
}