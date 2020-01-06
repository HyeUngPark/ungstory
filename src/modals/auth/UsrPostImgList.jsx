import React from 'react';
import { Button, Modal, ModalBody,ModalHeader, Card , Row, Col} from 'reactstrap';

import * as api from "utils/api";

export default class UsrPostImgList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal : false
      ,imgList : []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectCallback = this.props.callbackFromParent;
  }
  static defaultProps = {
    thisYear : new Date().getFullYear()
  };

  toggle = (e) => {
    this.setState({
      modal : !this.state.modal
    });
  }
    

  handleSubmit(event) {
    event.preventDefault();
  }

  cancel=()=>{
    this.setState({
      imgList : []
    });
    this.toggle();
  }

  usrPostImgListCallback = (result)=>{
    if(result.reCd==="01"){
      this.setState({
        imgList : result.pstPts
        ,modal: !this.state.modal
      });
    }else if(result.reCd ==='02'){
      // console.log('내 사진목록 조회 실패');
      this.setState({
        modal: !this.state.modal
        ,imgList : []
      });
    }else if(result.reCd ==='03'){
      // console.log('내 사진목록 0건');
      this.setState({
        modal: !this.state.modal
        ,imgList : []
      });
    }
  }
  
  imgSelect =(index , e) =>{
    this.selectCallback(this.state.imgList[index]);
    this.cancel();
  }

  usrPostImgList =() =>{
    let param={
      usrId : this.props.usrId
    };
    api.apiSend('post','usrPostImgList',param,this.usrPostImgListCallback);
  }

  render() {
    return (
        <div>
          <div 
            className="form-control-cursor"
            onClick = {e=>{
              this.toggle()
            }}
          >
            {this.props.postImgCount}
          </div>
          <Modal isOpen={this.state.modal} backdrop={false} onKeyUp={(e)=>{
            if(e.key === "Escape"){
              this.cancel();
            }
          }}>
          <form className="card shadow" onSubmit={this.handleSubmit}>
          <Card className="bg-secondary shadow border-0">
            <h5 className="display-4">&nbsp;포스팅 이미지 리스트</h5>
            <h4 className="display-5">&nbsp;클릭 시 해당 게시물을 확인할 수 있습니다.</h4>
            <hr className="my-4" />
            <ModalBody>
                {( this.state.imgList &&
                  this.state.imgList.length >0 ) ? 
                  this.state.imgList.map((imgs, idx)=>{
                    return(
                      <Row>
                        <Col lg="12">
                        {imgs.date.substring(0,4) === this.props.thisYear 
                          ? `${imgs.date.substring(4,2)}월`
                          : `${imgs.date.substring(0,4)}년 ${imgs.date.substring(4,2)} 월`
                        }
                        </Col>
                          <hr className="my-4" />
                        <Col lg="12">
                        {imgs.pstPts.map(
                          (img,imgIndex) => (<li className="form-tag form-tag-li" key={index}>
                          <a href="javascript:void(0)" 
                            className="form-control-cursor"
                            onClick={e=>{this.imgSelect(img.pstPk)}}
                          >
                            <img src={img.pstPts} 
                                style={{
                                  width: "100px",
                                  height: "100px",
                                }}
                                value={imgIndex} 
                              />
                          </a>
                        </li>))}
                        </Col>
                      </Row>
                      )})
                    :<Row>
                    <Col lg="12">
                      '포스팅한 사진이 없습니다.'<br/>
                    </Col>
                    </Row>
                }
                <hr className="my-4" />
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