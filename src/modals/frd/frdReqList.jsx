import React from 'react';
import { Button, Modal, ModalBody,ModalHeader, Card , Row, Col, Input} from 'reactstrap';

import * as api from "api/api";

export default class frdReqList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal : false
      ,frdReqList : []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.profilePwCheck = this.props.callbackFromParent;
    this.frdReqList();
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
      // usrPw : ''
    });
    
    this.toggle();
  }

  frdReqListCallback = (result)=>{
    if(result.reCd==="01"){
      console.log('친구 신청 목록 조회 성공');
      this.setState({
        frdReqList : result.frdReqList
      })
    }else if(result.reCd ==='02'){
      console.log('친구 신청 목록 조회 실패');
    }else{
      alert('서버오류');
    }
    return;
  }

  frdReqList = () =>{
    let param={
      usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
    };
    api.apiSend('post','/frd/frdReqList',param,this.frdReqListCallback);
  }

  frdRes =(cd, frdIdx) => {
    if(cd === 'y'){ // 친구 수락

    }else if(cd ==='n'){ // 친구 거절

    }
  }

  render() {
    return (
        <div>
            <a 
                href="javascript:void(0)"
                onClick={this.toggle}
            >
                <small className="btn btn-info">친구 신청 목록</small>
          </a>
          <Modal isOpen={this.state.modal} backdrop={false} onKeyUp={(e)=>{
            if(e.key === "Escape"){
              this.cancel();
            }
          }}>
          <form className="card shadow" onSubmit={this.handleSubmit}>
          <Card className="bg-secondary shadow border-0">

            <h5 className="display-4">&nbsp;친구 신청 목록</h5>
 
            <ModalBody>
            <Table className="align-items-center table-flush table-font" responsive>
                  <thead className="thead-light justify-content-center">
                    <tr>
                      <th scope="col">유저</th>
                      <th scope="col">함께 아는 친구</th>
                      <th scope="col">수락/거절</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                  (this.state.frdReqList.length === 0 )?
                    <tr>
                      <td colSpan="3">
                        <h4>신청한 친구가 없습니다.</h4>
                      </td>
                    </tr>
                  :    
                  this.state.frdReqList.map((frd, frdIdx)=>{
                    return(
                    <tr>
                      <th scope="row">
                        <Media className="align-items-center">
                          <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip806693074"
                            onClick={e => e.preventDefault()}
                          >
                            {/* <img
                              alt="..."
                              className="rounded-circle"
                              src={(
                                search.usrPt !== ''
                                ? search.usrPt
                                : require("assets/img/theme/no-profile-130x130.png"))}
                            /> */}
                            <img
                              alt="..."
                              src={require("assets/img/theme/team-4-800x800.jpg")}
                            />
                          </a>
                            &nbsp;
                          <Media>
                            <span className="mb-0 text-sm">
                              {frd.usrName}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                         {frd.withFrd>0 ? 
                          <div className="d-flex align-items-center">
                            {frd.withFrd} 명 
                          </div>
                            :
                          <div className="d-flex align-items-center">
                            함께아는 친구 없음 
                          </div>
                         }
                      </td>
                      <td>
                        <input type="button" 
                          color="primary" 
                          className="btn btn-primary" 
                          value="수락"
                          onClick={e=>{this.frdRes('y',frdIdx)}}
                        />
                        <Button color="danger" onClick={e=>{this.frdRes('n',frdIdx)}}>
                          취소
                        </Button>
                      </td>
                    </tr>
                    );
                    })
                  }
                  </tbody>
                </Table>
              
            </ModalBody>
            </Card>
            </form>
          </Modal>
        </div>
      
    );
  }
}