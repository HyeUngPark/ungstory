import React from 'react';
import { Button, Modal, ModalBody, Row, Col} from 'reactstrap';

import * as popup from "utils/popup";
import * as api from "utils/api";

export default class PostDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      modal: false
      ,postInfo : {}
      ,firstCd : false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.modalClose = this.props.callbackFromParent;
  }
  toggle = (e) => {
    if(!this.state.firstCd){
      this.getPostInfo(this.props.pstPk);
    }
    this.setState({
      modal: !this.state.modal
    });
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
    if(pstPk){
      let param ={
        pstPk : pstPk
      };
      api.apiSend('post','getPostInfo',param,this.getPostInfoCallback);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  cancel=()=>{
    this.setState({
      postInfo : {}
    });
    // this.modalClose();
    this.toggle();
  }

  render() {
    return (
        <div>
          <Button 
            className="btn btn-info"
            onClick={e=>{this.toggle()}}
          >
            상세보기
          </Button>

          <Modal isOpen={this.state.modal} backdrop={false} onKeyUp={(e)=>{
            if(e.key === "Escape"){
              this.cancel();
            }
          }}>
            {
              !Object.getOwnPropertyNames(this.state.postInfo).length > 0? 
              <form className="card shadow" 
                onSubmit={this.handleSubmit}
                encType="multipart/form-data"
              >
                <Row>
                  <Col>
                    포스트 조회에 실패하였습니다.
                  </Col>
                </Row>
              </form>
            :
            <form className="card shadow" 
                  onSubmit={this.handleSubmit}
                  // encType="multipart/form-data"
            >
            <ModalBody>
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
                     (this.state.postInfo.pstPts && this.state.postInfo.pstPts.length>0)
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
                              // onClick={e => popup.openImg(img)}
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
                <Col lg="7">
                  <i className="ni ni-lock-circle-open" style={{width:"45%"}}>
                    &nbsp;공개 여부 : &nbsp;
                      {this.state.postInfo.pstPubYn === '01' ?
                      '전체공개' :
                      this.state.postInfo.pstPubYn === '02' ? 
                      "친구에게만 공개"
                      : "비공개"
                    }
                    </i>
                    <br/>
                </Col>
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