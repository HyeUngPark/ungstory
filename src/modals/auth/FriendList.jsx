import React from 'react';
import { 
  Button, 
  Modal, 
  ModalBody,
  Table,
  Card, 
  Row, 
  Col,
  Media
} from 'reactstrap';

import * as api from "utils/api";

import FrdInfo from '../frd/FrdInfo.jsx';
import * as popup from "utils/popup";
import { withRouter } from 'react-router-dom';


class FriendList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FrdListModal : false
      ,frdList : []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getFrdList();
  }
  toggle = (e) => {
    this.setState({
      FrdListModal : !this.state.FrdListModal
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  cancel=()=>{
    this.setState({
      frdList : []
      ,FrdListModal : false
    });
  }

  getFrdListCallback = (result)=>{
    if(result.reCd==="01"){
      this.setState({
        frdList : result.myFrd
      });
    }else if(result.reCd ==='02'){
      // console.log('내 친구 목록 조회 실패');
      this.setState({
        frdList : []
      });
    }else if(result.reCd ==='03'){
      // console.log('내 사진목록 0건');
      this.setState({
        frdList : []
      });
    }
  }
  
  frdMsg = (frdName) =>{
    this.props.history.push({
      pathname: '/user/msg-send',
      search: '',
      state: {
        frdName : frdName
      }
    });
    this.toggle();
  }

  getFrdList =() =>{
    if(localStorage.getItem('usrInfo')){
      let param={
        usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
      };
      api.apiSend('post','/frd/getFrdList',param,this.getFrdListCallback);
   }else{
     this.setState({
      FrdListModal: !this.state.FrdListModal
     });
   }
  }

  render() {
    return (
        <div>
          <div 
            className="form-control-cursor"
            onClick={e=>{this.toggle()}}
          >
            {this.props.frdCount}
          </div>
          <Modal 
                isOpen={this.state.FrdListModal} 
                zIndex = "90"
                backdrop={false} onKeyUp={(e)=>{
                if(e.key === "Escape"){
                  this.cancel();
                }
          }}>
          <form className="card shadow" onSubmit={this.handleSubmit}>
          <Card className="bg-secondary shadow border-0">
            <h5 className="display-4">&nbsp;친구 리스트</h5>
            <hr className="my-4" />
            <ModalBody>
              <Row>
                <Col lg="12">
                  <Table className="align-items-center table-flush table-font" responsive>
                    <thead className="thead-light justify-content-center">
                      <tr>
                        <th scope="col">유저</th>
                        <th scope="col">친구 수</th>
                        <th scope="col">메시지 보내기</th>
                      </tr>
                    </thead>
                    <tbody>
                 {(this.state.frdList && this.state.frdList.length> 0) ?    
                  this.state.frdList.map((frd, frdIdx)=>{
                    return(
                    <tr>
                      <th scope="row">
                        <Media className="align-items-center">
                          <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip806693074"
                            onClick={e => popup.openImg(frd.usrPt)}
                          >
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={(
                                frd.usrPt !== ''
                                ? frd.usrPt
                                : require("assets/img/theme/no-profile-130x130.png"))}
                            />
                          </a>
                          &nbsp;&nbsp;
                          <Media>
                              <span className="mb-0 text-sm">
                                <FrdInfo frdName={frd._id}/>
                              </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                         {
                          <div className="d-flex align-items-center">
                            {frd.usrFrds} 명 
                          </div>
                        }
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                            <input type="button" 
                              color="primary" 
                              className="btn btn-primary" 
                              value="메시지 보내기"
                              onClick={e=>{this.frdMsg(frd._id)}}
                            />
                        </div>
                      </td>
                    </tr>
                  );
                  })
                  : <tr>
                  <td colSpan="3">
                    <h4>친구가 없습니다.</h4>
                  </td>
                  </tr>
                }
                  </tbody>
                </Table>
                <hr className="my-4" />
                </Col>
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

export default withRouter(FriendList);