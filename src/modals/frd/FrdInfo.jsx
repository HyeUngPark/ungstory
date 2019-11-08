import React from 'react';
import {Button, 
        Modal, 
        ModalBody,
        Card, 
        CardHeader,
        CardBody, 
        Row, 
        Col, 
        Container} from 'reactstrap';

import * as api from "utils/api";
import * as popup from "utils/popup";

export default class FrdInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal : false
      ,profileData : {}
      ,firstCd : false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.noticeCallback = this.props.callbackFromParent;    

    // this.frdInfo();
  }
  toggle = (e) => {
    if(!this.state.firstCd){
      this.frdInfo();
    }
    this.setState({
      modal: !this.state.modal
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  frdInfoCallback = (result) =>{
    if(result.reCd === '01'){
      console.log('친구 정보 조회 성공');
      this.setState({
        profileData : result.profileData
        ,firstCd : true
      });
    }else{
      console.log('친구 정보 조회 실패');
      this.setState({
        firstCd : true
      });
    }
  }

  frdInfo = () =>{
    let param={
      usrName : localStorage.getItem('usrInfo') 
      ? JSON.parse(localStorage.getItem('usrInfo')).usrName
      : ''
      ,frdName : this.props.frdName
    };
    api.apiSend('post','/frd/frdInfo',param,this.frdInfoCallback);
  }

  render() {
    return (
        <div>
            <a 
                className= "form-control-cursor"
                href="javascript:void(0)"
                onClick={this.toggle}
            >
            {this.props.frdName}
          </a>
          <Modal 
            isOpen={this.state.modal} 
            backdrop={false} 
            onKeyUp={(e)=>{
              if(e.key === "Escape"){
                this.cancel();
              }
            }}
            style ={{
              width : '80%'
            }}
          >
        <form className="card shadow" onSubmit={this.handleSubmit}>
          <Card className="bg-secondary shadow border-0">
            <h5 className="display-4">&nbsp;친구 정보</h5>
            <ModalBody>
{/*               <Container className="mt--7" fluid>
 */}        <Row className="justify-content-center"> 
{/*               <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
 */}          <Col>      
                <Card className="card-profile shadow">
                  <Row className="justify-content-center">
                    <Col className="order-lg-2" lg="3">
                      <div className="card-profile-image">
                        <a href="javascript:void(0)" 
                          onClick={e => popup.openImg(this.state.profileData.usrPt)}>
                          <img
                            alt="..."
                            className="rounded-circle"
                            src={this.state.profileData.usrPt !=="" 
                                ? this.state.profileData.usrPt
                                : require("assets/img/theme/no-profile-130x130.png")}
                          />
                        </a>
                      </div>
                    </Col>
                  </Row>
                  <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                    <div className="d-flex justify-content-between">
                      <Button
                        className="float-right"
                        color="info"
                        href="javascript:void(0)"
                        onClick={e=>{this.toggle()}}
                        size="sm"
                      >
                        친구 추가
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0 pt-md-4">
                    <Row>
                      <div className="col">
                        <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                          <div>
                            <span className="description">친구</span>
                            <span className="heading">{this.state.profileData?this.state.profileData.frdCount:''}</span>
                          </div>
                          <div>
                            <span className="description">사진</span>
                            <span className="heading">{this.state.profileData?this.state.profileData.pstPts:''}</span>
                          </div>
                          <div>
                            <span className="description">함께 아는 친구</span>
                            <span className="heading">{this.state.profileData?this.state.profileData.withFrd:''}</span>
                          </div>
                        </div>
                      </div>
                    </Row>
                    <div className="text-center">
                      <h3>
                        {this.state.profileData.usrName}
                      </h3>
                      <hr className="my-4" />
                      <p>
                        <div className="d-flex justify-content-between">
                        </div>
                        {(this.state.profileData.usrMsg !== '') ? this.state.profileData.usrMsg : '대화명이 없습니다.'}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
{/*           </Container>
 */}        <br/>
        <Row className="align-items-center justify-content-center"> 
          <Button 
            color="danger" 
            onClick={e=>{this.toggle()}}
          >
                닫기
          </Button>
        </Row>
      </ModalBody>
      </Card>
      </form>
    </Modal>
  </div>
      
    );
  }
}