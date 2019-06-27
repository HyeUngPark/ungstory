import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col} from 'reactstrap';

export default class PostWriteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modal: false,tag: []};
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  closeModal = (e) =>{
    e.stopPropagation();

    this.setState({
      modal: false
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
    })
    this.toggle();
  }

  

  render() {
    const tagList = this.state.tag.map(
      (tag,index) => (<li className="form-tag form-tag-li" key={index}>
                        <a href="javascript:void(0)" className="form-control-cursor">
                          #{tag}
                          <span className="form-tag-del-btn" value={index} onClick={this.removeTag}>X</span>
                        </a>
                      </li>)
    );
    return (
        <div autoFocus={false}>
          <div onClick={this.toggle} className="dropdown-item form-control-cursor"><i className="ni ni-send" />게시글 작성</div>
          <Modal isOpen={this.state.modal}>
          <form onSubmit={this.handleSubmit} className="card shadow">
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
                  <textarea className="form-control " id="PostContent" rows="3" autoFocus={true} placeholder="내용 입력하세요"></textarea>
                </Col>
              </Row>
              <br/>
              <Row lg="12">
                <Col lg="3">
                  <i className=" ni ni-image align-items-center">
                    <label htmlFor="PostImg">&nbsp;이미지 </label>
                  </i>
                  <input multiple="multiple"  type="file" name="filename[]" id="PostImg" className="form-display-none"/>
                </Col>
                <Col lg="3 text-right">
                  <span>
                    <i className=" ni ni-tag align-items-center" >
                      <label htmlFor="PostImg">&nbsp;해시태그 </label>
                    </i>
                  </span>
                </Col>
                <Col lg="6" style={{paddingLeft:"0"}}>
                  <span>
                    <input className="form-control " 
                           id="PostHashTag" 
                           placeholder="입력후 엔터"
                           style={{height:"30px", width:"150px"}} 
                           onKeyPress={this.addTag}/>
                  </span>
                </Col>
              </Row>
                <Col lg="12">
                    <ul id="tag-list" className="form-tag-ul">
                        {tagList}
                    </ul>
                </Col>
              <br/>
              <Row>
                <Col lg="7">
                  <i className="ni ni-lock-circle-open" style={{width:"45%"}}>&nbsp;공개 여부</i>&nbsp;
                {/* </Col>
                <Col lg="3"> */}
                    <select className="form-control" style={{width:"50%",display:"inline"}}> 
                      <option>
                        전체
                      </option>  
                      <option>
                        친구에게만
                      </option>  
                      <option>
                        비공개
                      </option>  
                    </select>
                    <br/>
                </Col>
                <Col lg="5">
                  <input type="submit" color="primary" className="btn btn-primary" value="게시"/>
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