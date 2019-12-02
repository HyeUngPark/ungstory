import React from 'react';
import {Button, 
        Modal, 
        ModalBody,
        Card, 
        CardHeader,
        CardBody, 
        Row, 
        Col, 
        Dropdown,
        DropdownToggle,
        DropdownMenu,
        DropdownItem,
      } from 'reactstrap';

import * as api from "utils/api";
import * as popup from "utils/popup";

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default class MsgList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        msgModal : false
        ,searchName : ''
        ,searchList : []
        ,searchCd : false // 임시
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.goPage = this.props.callbackFromParent;    
    // this.imgDrop = React.createRef();
  }
  toggle = (e) => {
    // if(!this.state.firstCd){
    //   this.frdInfo();
    // }
    this.setState({
        msgModal: !this.state.msgModal
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  cancel =()=>{

  }

//   goPages = (page)=>{
//     if(page){
//       this.toggle();
//       this.goPage(page);
//     }
//   }
 
//   openPost =(e, pstPk) =>{
//     this.imgClick.current.props.pstPk = pstPk;
//     this.imgClick.current.toggle();
//   }
  render() {
    return (
        <div>
            <a 
                className= "form-control-cursor"
                href="javascript:void(0)"
                onClick={this.toggle}
            >
            <i className=" ni ni-chat-round"></i>
            &nbsp;
          </a>
          <Modal 
            isOpen={this.state.msgModal} 
            backdrop="static" 
            zIndex = "80"
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
            <h5 className="display-4">&nbsp;메시지</h5>
            <ModalBody>

            <Row className="justify-content-center"> 
              <Col>      
                <Card className="card-profile shadow">
                  <Row className="justify-content-center">
                    <Col className="order-lg-2" lg="3">
                      <div className="card-profile-image">
                        <a href="javascript:void(0)" 
                          onClick={e => popup.openImg(require("assets/img/theme/no-profile-130x130.png"))}>
                          <img
                            alt="..."
                            className="rounded-circle"
                            src={require("assets/img/theme/no-profile-130x130.png")}
                          />
                        </a>
                      </div>
                    </Col>
                  </Row>
                  <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                    <div className="d-flex justify-content-between">
                      {/* 스타일을 위해 넣은 안쓰는 버튼 */}
                      <Button style={{
                        'visibility':'hidden'
                      }}>
                      </Button>
                    </div>
                </CardHeader>
            </Card>
            </Col>
        </Row>
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