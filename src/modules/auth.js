import { Map } from 'immutable';
import { handleActions, createAction } from 'redux-actions';

import * as api from "api/api";

// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

const AUTH_LOGIN = 'auth/AUTH_LOGIN';
const AUTH_LOGOUT = 'auth/AUTH_LOGOUT';
const AUTH_LOGINCK = 'auth/AUTH_LOGINCK';

export const authLogin = createAction(AUTH_LOGIN);
export const authLogout = createAction(AUTH_LOGOUT);
export const authLoginck = createAction(AUTH_LOGINCK);

const initialState = Map({
  loginYn: false
  ,loginId : ''
});

const loginCallback = (result) =>{
    if(result.reCd==="01"){
        console.log('login 성공 \n',this.props);
        return this.state.push(Map({
            loginYn : true
            ,loginId : ''
       }));
    }else if(result.reCd ==='02'){
        console.log('아이디 또는 비밀번호를 확인해주세요');
        alert('아이디 또는 비밀번호를 확인해주세요');
        return this.state.push(Map({
            loginYn : false
            ,loginId : ''
        }));
    }else if(result.reCd ==='03'){
        console.log('아직 이메일 인증이 완료되지 않았습니다.\n이메일 인증 후 로그인해주세요');
        alert('아직 이메일 인증이 완료되지 않았습니다.\n이메일 인증 후 로그인해주세요');
        return this.state.push(Map({
            loginYn : false
            ,loginId : ''
        }));
    }
  }

export default handleActions({
    [AUTH_LOGIN]: (state, action) => {
        console.log('★★★ AUTH_LOGIN state ★★★ \n', state);
        console.log('★★★ AUTH_LOGIN action ★★★ \n', action);
      /* payload 안에 있는 id, text, done에 대한 레퍼런스를 만들어줍니다.
      레퍼런스를 만들지 않고, 바로 push(Map(action.payload))를 해도 되지만,
      나중에 이 코드를 보게 됐을 때, 
      이 액션이 어떤 데이터를 처리하는지 쉽게 보기 위해서 하는 작업입니다. */
    //   const { loginYn, loginId} = action.payload;
  
    //   return state.push(Map({
    //     loginYn,
    //     loginId
    //   }));
        // 로그인 처리
        // api.apiSend('post','login',param,this.loginCallback);
    },
    [AUTH_LOGOUT]: (state, action) => {
    //   const { payload: id } = action;
    //   const index = state.findIndex(todo => todo.get('id') === id);
    //   return state.delete(index);
        // 로그아웃 처리
    },
    [AUTH_LOGINCK] : (state, action) =>{
        // 로그인체크
    }
  }, initialState);

  
  