import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// 액션 생성 함수들을 한꺼번에 불러옵니다.
import * as authActions from 'modules/auth';

class AuthContainer extends Component {
  render() {
    return(
    <>
    <input type = "button" value="test"/>
    </>
    );
  }
}
export default connect(
  (state) => ({
    loginYn: state.loginYn
  }),
  (dispatch) => ({
    authActions: bindActionCreators(authActions, dispatch)
  })
)(AuthContainer);
