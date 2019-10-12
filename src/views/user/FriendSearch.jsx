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

class FriendSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchName : ''
    };
  }

  friendAction = (cd) =>{
    if(cd==='y'){ // 친구 수락
      console.log('친구 수락');
    }else if(cd ==='n'){ // 친구 거절
      console.log('친구 거절');
    }
  }

  valChange =(e, cd)=>{
    if(cd ==='n'){
      this.setState({
        searchName : e.target.value
      });
    }
  }

  friendSearch =() =>{
    if(this.state.searchName !== ''){
      console.log('친구 검색');
    }else{
      console.log('닉네임을 입력해주세요');
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
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light justify-content-center">
                    <tr>
                      <th scope="col">유저</th>
                      <th scope="col">함께 아는 친구</th>
                      <th scope="col">수락/거절</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">
                        <Media className="align-items-center">
                          {/* <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={require("assets/img/theme/vue.jpg")}
                            />
                          </a> */}
                          <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip806693074"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={require("assets/img/theme/team-2-800x800.jpg")}
                            />
                          </a>
                            &nbsp;
                          <Media>
                            <span className="mb-0 text-sm">
                              닉네임
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                          {/* <UncontrolledTooltip
                            delay={0}
                            target="tooltip664029969"
                            >
                            Ryan Tompson
                          </UncontrolledTooltip> */}
                          <div className="d-flex align-items-center">
                            00 명 
                          </div>
                          <div className="d-flex align-items-center">
                            함께아는 친구 없음 
                          </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <input type="button" 
                                color="primary" 
                                className="btn btn-primary" 
                                value="수락"
                                onClick={e=>{this.friendAction('y')}}
                          />
                          <Button color="danger" onClick={e=>{this.friendAction('n')}}>
                            거절
                          </Button> 
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              
              {/**
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          2 <span className="sr-only">(current)</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              **/}
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default FriendSearch;
