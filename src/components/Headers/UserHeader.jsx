import React from "react";

// reactstrap components
import { Button, Container, Row, Col} from "reactstrap";
import UsrProfileCheck from '../../modals/auth/UsrProfileCheck';

class UserHeader extends React.Component {
  constructor(props){
    super(props);
    this.state =  {
        postList : []
    };
  }
  static defaultProps = {
    usrName : localStorage.getItem('usrInfo') ? JSON.parse(localStorage.getItem('usrInfo')).usrName : '' 
  }
  render() {
    return (
      <>
        <div
          className="header pb-8 pt-5 pt-lg-12 d-flex align-items-center"
          style={{
            minHeight: "600px",
            backgroundImage:
              "url(" + require("assets/img/theme/profile-cover.jpg") + ")",
            backgroundSize: "cover",
            backgroundPosition: "center top"
          }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-default opacity-8" />
          {/* Header container */}
          <Container className="d-flex align-items-center" fluid>
            <Row>
              <Col lg="7" md="10">
                <h1 className="display-2 text-white">{this.props.usrName}님 반갑습니다.</h1>
                <p className="text-white mt-0 mb-5">
                  프로필 화면 입니다. 프로필 정보를 변경하시려면 "프로필 수정" 버튼을 클릭 후 비밀번호를 확인해주세요.
                </p>
                <UsrProfileCheck/>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default UserHeader;
