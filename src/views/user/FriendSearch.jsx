import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  Media,
  Table,
  Container,
  Row,
  Button,
  Col,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.jsx";
import * as api from "api/api";

class FriendSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchName : ''
      ,searchList : []
      ,searchCd :false
    };
  }

  friendAction = (cd ,searchIdx) =>{
    if(cd==='y'){ // 친구 신청
      console.log(this.state.searchList[searchIdx],' 친구 신청');
    }
  }

  valChange =(e, cd)=>{
    if(cd ==='n'){
      this.setState({
        searchName : e.target.value
      });
    }
  }

  friendSearchCallback =(rs) =>{
    if(rs.reCd === '01'){
      this.setState({
        searchList : rs.frdList
        ,searchCd : true
      });
    }else{
      this.setState({
        searchCd : true
      });
    }
  }

  friendSearch =() =>{
    let searchName = this.state.searchName;
    if(searchName.search(/\s/) !== -1){
      alert(' 공백은 사용할 수 없습니다. ');
      return ;
    }
    
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    
    if(special_pattern.test(searchName) === true ){
      alert('특수문자는 사용할 수 없습니다.');
      return;
    }

    if(searchName !== ''){
      this.setState({
        searchList : []
      });

      let param={
        usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
        ,searchName : searchName
      };
      api.apiSend('post','frendSearch',param,this.friendSearchCallback);      
    }else{
      alert('검색할 닉네임을 입력해주세요');
    }
  }
  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">친구 검색</h3>
                </CardHeader>
                  <Row>
                    <Col lg="6">
                      <input className="form-control form-input-left-margin" 
                              placeholder="검색할 닉네임을 입력하세요."
                              // style={{width:"50%"}} 
                              value={this.state.searchName}
                              onChange={e=>{this.valChange(e ,'n')}}
                              onKeyPress ={e=>{if(e.key === 'Enter'){
                                this.friendSearch();
                              }}}
                      />
                    </Col>
                    <Col lg="6">
                      <input type="button" 
                            color="primary" 
                            className="btn btn-primary form-input-left-margin" 
                            value="검색"
                            onClick={e=>{this.friendSearch()}}
                      />
                    </Col>
                  </Row>
                  <br/>
                <Table className="align-items-center table-flush table-font" responsive>
                  <thead className="thead-light justify-content-center">
                    <tr>
                      <th scope="col">유저</th>
                      <th scope="col">함께 아는 친구</th>
                      <th scope="col">친구 신청</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                  (!this.state.searchCd && this.state.searchList.length === 0 )?
                    <tr>
                      <td colSpan="3">
                        <h4>친구를 검색해주세요</h4>
                      </td>
                    </tr>
                  : (this.state.searchCd && this.state.searchList.length> 0) ?    
                  this.state.searchList.map((search, searchIdx)=>{
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
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={(
                                search.usrPt !== ''
                                ? search.usrPt
                                : require("assets/img/theme/no-profile-130x130.png"))}
                            />
                          </a>
                            &nbsp;
                          <Media>
                            <span className="mb-0 text-sm">
                              {search.usrName}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                          {search.eqFrd>0 ? 
                          <div className="d-flex align-items-center">
                            00 명 
                          </div>
                            :
                          <div className="d-flex align-items-center">
                            함께아는 친구 없음 
                          </div>
                          }
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {search.usrName === JSON.parse(localStorage.getItem('usrInfo')).usrName
                            ?
                            '본인'
                            :
                            !search.frdYn ?
                            <input type="button" 
                              color="primary" 
                              className="btn btn-primary" 
                              value="친구 신청"
                              onClick={e=>{this.friendAction('y',searchIdx)}}
                            />
                            : '친구'
                        }
                        </div>
                      </td>
                    </tr>
                  );
                  })
                  : <tr>
                  <td colSpan="3">
                    <h4>검색된 친구가 없습니다.</h4>
                  </td>
                  </tr>
                }
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default FriendSearch;
