import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// 액션 생성 함수들을 한꺼번에 불러옵니다.
import * as authActions from 'modules/auth';

class authContainer extends Component {
//   render() {
//     const { loginYn } = this.props;
//     // const { handleChange, handleInsert } = this;
//     //   <TodoInput 
//     //     onChange={handleChange}
//     //     onInsert={handleInsert}
//     //     value={value}
//     //   />
//   }
}

/* 이번에는 mapStateToProps와 mapDispatchToProps 함수에 대한 레퍼런스를
따로 만들지 않고, 그 내부에 바로 정의해주었습니다.*/
export default connect(
  (state) => ({
    loginYn: state.loginYn.get('loginYn')
  }),
  (dispatch) => ({
    /* bindActionCreators를 사용하면 다음 작업들을 자동으로 해줍니다:
      {
          actionCreator: (...params) => dispatch(actionCreator(...params))
      }
      그래서 이전에 우리가 했었던 것처럼 하나하나 dispatch할 필요가 없습니다.
      예를 들면 InputActions의 경우 다음과 같은 작업이 되어 있는 것이죠.
      InputActions: {
        setInput: (value) => dispatch(inputActions.setInput(value))
      }
      나중에 이를 호출할 때는 this.props.InputActions.setInput을 호출하면 됩니다.
    */
    authActions: bindActionCreators(authActions, dispatch)
  })
)();
