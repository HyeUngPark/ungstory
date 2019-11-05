import React from 'react';
import { Button, Modal, ModalBody,ModalHeader, Card , Row, Col} from 'reactstrap';

import * as api from "utils/api";

export default class PostImgList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal : false
      ,imgList : []
      ,imgListCk : false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectCallback = this.props.callbackFromParent;
  }
  toggle = (e) => {
    this.getPostImgList();
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  cancel=()=>{
    this.setState({
      imgList : []
      ,imgListCk : false
    });
    this.toggle();
  }

  getPostImgListCallback = (result)=>{
    if(result.reCd==="01"){
      this.setState({
        imgListCk : true
        ,imgList : result.postImgList
        ,modal: !this.state.modal
      });
    }else if(result.reCd ==='02'){
      // console.log('내 사진목록 조회 실패');
      this.setState({
        imgListCk : true
        ,modal: !this.state.modal
      });
    }else if(result.reCd ==='03'){
      // console.log('내 사진목록 0건');
      this.setState({
        imgListCk : true
        ,modal: !this.state.modal
      });
    }
  }
  
  imgSelect =(index , e) =>{
    this.selectCallback(this.state.imgList[index]);
    this.cancel();
  }

  getPostImgList =() =>{
    if(!this.state.imgListCk){
      let param={
        usrId : this.props.usrId
      };
      api.apiSend('post','getPostImgList',param,this.getPostImgListCallback);
   }else{
     this.setState({
      modal: !this.state.modal
     });
   }
  }

  // componentDidMount(){
  //   if(!this.state.imgListCk && localStorage.getItem('usrInfo')){
  //       this.getPostImgList();
  //   }
  // }

  render() {
    return (
        <div>
          <i className="ni ni-album-2 align-items-center">
            <label 
              className ="form-control-cursor"
              htmlFor="imgList"
            >
              &nbsp;포스팅 이미지 
            </label>
          </i>
          <input type="button" 
            className="form-display-none"
            id="imgList" 
            onClick={e=>{this.toggle()}}
          />
          <Modal isOpen={this.state.modal} backdrop={false} onKeyUp={(e)=>{
            if(e.key === "Escape"){
              this.cancel();
            }
          }}>
          <form className="card shadow" onSubmit={this.handleSubmit}>
          <Card className="bg-secondary shadow border-0">
            <h5 className="display-4">&nbsp;게시물 사진 리스트</h5>
            <h4 className="display-5">&nbsp;사용할 이미지를 선택해주세요</h4>
            <hr className="my-4" />
            <ModalBody>
              <Row>
                <Col lg="12">
                {( this.state.imgList &&
                  this.state.imgList.length >0 ) ? 
                  this.state.imgList.map(
                    (img,index) => (<li className="form-tag form-tag-li" key={index}>
                      <div
                      >
                          <a href="javascript:void(0)" 
                            className="form-control-cursor"
                            style={{
                            }}
                            onClick={e=>{this.imgSelect(index,e)}}
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
                      </li>)
                      )
              :<div>'포스팅한 사진이 없습니다.'<br/></div>}
                </Col>
                <hr className="my-4" />
              </Row>
              <Row>
              {/* 확인 */}
              <Col lg="12" className="text-center">
                  <Button color="danger" onClick={this.cancel}>닫기</Button>
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