import React from 'react';
import { Button, Modal, ModalBody,ModalHeader, Card , Row, Col} from 'reactstrap';

import * as api from "utils/api";
import PostImgList from './PostImgList';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

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
  
  profileModifyCallback = (result)=>{
    if(result.reCd==="01"){
      alert('프로필 변경 성공');
    }else if(result.reCd ==='02'){
      alert('프로필 변경 실패');
    }
    
    let usrInfo = JSON.parse(localStorage.getItem('usrInfo'));
    usrInfo.usrPt = result.usrPt;
    localStorage.setItem('usrInfo',JSON.stringify(usrInfo));

    this.cancel();
    this.modalClose();
  }
  profileModify = (cd)=>{
    let param={
      usrId : this.props.usrId
    }
    if(cd !== 'id' && this.state.tempImgs === ''){
      alert('변경할 이미지를 선택해주세요.');
      return;
    }else if(cd === 'id'){

      param.usrPt = '';
      param.changeCd = 'img';
    }else{
      param.usrPt = this.state.tempImgs;
      param.changeCd = 'img';
    }
    api.apiSend('put','profileChange',param, this.profileModifyCallback);
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
      alert("프로필 이미지는 1개만 선택 가능합니다.");
      return;
    }
  }
  deleteProfileImg = ()=>{
    if(this.props.usrPt === ''){
      alert('이미 프로필 이미지가 없습니다.');
      return;
    }else{
      confirmAlert({
        title: '프로필 이미지 삭제 확인',
        message: '정말 프로필 이미지를 삭제하시겠습니까?',
        buttons: [
          {
            label: '삭제하기',
            onClick: () => this.profileModify('id')
          },
          {
            label: '취소',
            onClick: () => {}
          }
        ],
      });
    }
  }

  removeImg = (e)=>{
    this.setState({
      tempImgs : ""
    });
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
            href="jvascript:void(0)"
            onClick={e => this.toggle()}
            size="sm"
          >
            프로필 사진 수정
          </Button>
          <Modal isOpen={this.state.modal} 
                 zIndex = "90"
                 backdrop={false} 
                 onKeyUp={(e)=>{
                  if(e.key === "Escape"){
                    this.cancel();
                  }
                }
          }>
          <form className="card shadow" onSubmit={this.handleSubmit}>
          <Card className="bg-secondary shadow border-0">
            <h5 className="display-4">&nbsp;프로필 사진 변경</h5>
            <ModalBody>
              <Row>
                <Col lg="4">
                  {/* 이미지 등록 */}
                  <i className="ni ni-image align-items-center">
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
                <Col lg="4">
                  {/* 올린 사진들 중 선택 */}
                  <PostImgList 
                      callbackFromParent={this.imgSelect}
                      usrId = {this.props.usrId}/>
                </Col>
                <Col lg="4">
                  {/* 프로필 이미지 삭제 */}
                  <i className="ni ni-basket align-items-center">
                    <label 
                      className ="form-control-cursor"
                      htmlFor="delImg"
                    >
                      &nbsp;이미지 삭제
                    </label>
                  </i>
                  <input type="button" 
                         className="form-display-none"
                         name="filename[]" 
                         id="delImg" 
                         onClick={this.deleteProfileImg}
                    />
                </Col>
                <hr className="my-4" />
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
                <hr className="my-4" />
              </Row>
              :''}
              <Row>
                <Col lg="12" className="text-center">
                    {/* 확인 */}
                    <input type="button" 
                          color="primary" 
                          className="btn btn-primary" 
                          value="확인"
                          onClick={e=>{this.profileModify('iu')}}       
                    />
                    {/* 취소 */}
                    <Button color="danger" onClick={this.cancel}>취소</Button>
                </Col>
              </Row>
             
            </ModalBody>
            </Card>
            </form>
          </Modal>
        </div>
      
    );
  }
}