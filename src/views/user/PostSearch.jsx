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

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import * as api from "utils/api";
import * as popup from "utils/popup";
import * as date from "utils/date";

import PostDetailModal from '../../modals/user/PostDetailModal';

class PostSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      beforeDate : new Date()
      ,afterDate : new Date()
      ,searchList : []
      ,firstCd : false
    };
  }
  postSearchCallback = (rs) => {
    if(rs.reCd === '01'){
      // console.log('조회 성공');
      this.setState({
        searchList : rs.myPstList
        ,firstCd : true
      });
    }else if(rs.reCd === '03'){
      // console.log('조회 결과 없음');
      this.setState({
        searchList:[]
        ,firstCd : true
      });
    }else{
      // console.log('조회 실패');
      this.setState({
        searchList:[]
        ,firstCd : true
      });
    }
  }
  postSearch =()=>{
    let today = new Date();
    if(this.state.beforeDate > this.state.afterDate){
      alert('날짜 선택이 잘못되었습니다. 시작날짜를 더 이전날짜로 변경해주세요.');
      this.setState({
        beforeDate : this.state.afterDate
      });
    }else if(this.state.afterDate > today ){
      alert('오늘보다 먼 날짜는 선택할 수 없습니다.');
      this.setState({
        afterDate : new Date()
      });
    }else{
      // console.log(this.state.beforeDate,'~',this.state.afterDate,' 조회');
      let param ={
        usrName : JSON.parse(localStorage.getItem('usrInfo')).usrName
        ,beforeDate : this.state.beforeDate
        ,afterDate : this.state.afterDate
      };
      api.apiSend('post','myPostList',param,this.postSearchCallback);
    }
  }

  valChange =(date,cd)=>{
    if(cd==='b'){
      this.setState({
        beforeDate : date
      });
    }else if(cd==='a'){
      this.setState({
        afterDate : date
      });
    }
  }

  setDate = (cd) => {
    let bfDate = date.getBeforeDate(cd);
    this.setState({
      beforeDate : bfDate
      ,afterDate : new Date()
    });
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
                  <h3 className="mb-0">내 포스트 검색</h3>
                </CardHeader>
                  <Row className="text-center justify-content-center">
                    <Col lg="12">
                      <DatePicker
                        selected={this.state.beforeDate}
                        onChange={date => this.valChange(date,'b')}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="yyyy/MM/dd"
                        className="mr--80 form-control-border-none form-control-cursor"
                        zIndex="100"
                        style={{
                          'position':'absolute'
                        }}
                      />
                      <span style={{
                          'position':'relative'
                        }}
                      >
                        ~
                      </span> &nbsp;&nbsp;
                      <DatePicker
                        selected={this.state.afterDate}
                        onChange={date => this.valChange(date,'a')}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="yyyy/MM/dd"
                        className="mr--80 form-control-border-none form-control-cursor"
                      />
                      <input type="button" 
                            color="primary" 
                            className="btn btn-primary form-input-left-margin" 
                            value="조회"
                            onClick={e=>{this.postSearch()}}
                      />
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <a 
                        href="javascript:void(0)"
                        onClick ={e=>{this.setDate('1w')}}
                      >
                        1주일
                      </a> &nbsp;&nbsp;
                      <a 
                        href="javascript:void(0)"
                        onClick ={e=>{this.setDate('1m')}}
                      >
                        1개월 
                      </a> &nbsp;&nbsp;
                      <a 
                        href="javascript:void(0)"
                        onClick ={e=>{this.setDate('6m')}}
                      >
                        6개월
                      </a> &nbsp;&nbsp;
                      <a 
                        href="javascript:void(0)"
                        onClick ={e=>{this.setDate('1y')}}
                      >
                        1년
                      </a> 
                    </Col>
                  </Row>
                  <br/>
                <Table className="align-items-center table-flush table-font" responsive>
                  <thead className="thead-light justify-content-center">
                    <tr>
                      <th scope="col">사진</th>
                      <th scope="col">포스팅 내용</th>
                      <th scope="col">해시태그</th>
                      <th scope="col">좋아요</th>
                      <th scope="col">댓글 수</th>
                      <th scope="col">게시일</th>
                      <th scope="col">상세보기</th>
                    </tr>
                  </thead>
                  <tbody>
                  { 
                    this.state.searchList.length>0 ? 
                    this.state.searchList.map((pst, pstIdx)=>{
                  return(
                    <tr>
                      <th scope="row">
                        {pst.pstPts.length>0 ?
                          <li className="form-tag form-tag-li">
                            <Media className="align-items-center">
                              <a
                                // className="avatar avatar-sm"
                                href="javascript:void(0)"
                                id="tooltip806693070"
                                onClick={e => popup.openImg(pst.pstPts[0])}
                              >
                                <img src={pst.pstPts[0]} 
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                  }}
                                  // value={pt.pstPk} 
                                />
                              </a>
                            </Media> 포함 {pst.pstPts.length}개
                        </li>
                         : '포스팅된 사진이 없습니다.'
                      }
                      </th>
                      <td>
                        <div className="d-flex align-items-center">
                          {pst.pstCt}
                        </div>
                      </td>
                      <td>
                        {pst.pstHt.length>0?
                          <div className="d-flex align-items-center">
                            <a href="javascirpt:void(0)">
                              #{pst.pstHt[0]}
                            </a> &nbsp; 포함 {pst.pstHt.length}개
                          </div>
                        :
                        <div className="d-flex align-items-center">
                          해시태그 없음
                        </div>
                      } 
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {pst.pstLike}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {pst.pstCmt}개
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {pst.fstWrDt}
                        </div>
                      </td>
                      <td>
                        <PostDetailModal 
                          pstPk={pst.pstPk}
                          style={true}
                        />
                      </td>
                    </tr>
                    )}) 
                    : 
                    <tr>
                      <th colSpan="5">
                        {!this.state.firstCd ? 
                          <div className="d-flex align-items-center">
                            날짜 설정 후 조회를 진행해주세요
                          </div>
                          :
                          <div className="d-flex align-items-center">
                            조회된 결과가 없습니다.                    
                          </div>
                        }
                      </th>
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

export default PostSearch;
