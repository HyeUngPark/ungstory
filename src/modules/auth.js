import { Map, List } from 'immutable';
import { handleActions, createAction } from 'redux-actions';

import * as api from "api/api";

// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

const LOGIN = 'auth/AUTH_LOGIN';
const LOGOUT = 'auth/AUTH_LOGOUT';
const LOGINCK = 'auth/AUTH_LOGINCK';

export const login = createAction(LOGIN);
export const logout = createAction(LOGOUT);
export const loginck = createAction(LOGINCK);

const initialState = Map({
    loginYn: false
    ,loginId : ''
});

// const loginCallback = (result) =>{
//     if(result.reCd==="01"){
//         console.log('login 성공 \n',this.props);
//         return this.state.push(Map({
//             loginYn : true
//             ,loginId : ''
//        }));
//     }else if(result.reCd ==='02'){
//         console.log('아이디 또는 비밀번호를 확인해주세요');
//         alert('아이디 또는 비밀번호를 확인해주세요');
//         return this.state.push(Map({
//             loginYn : false
//             ,loginId : ''
//         }));
//     }else if(result.reCd ==='03'){
//         console.log('아직 이메일 인증이 완료되지 않았습니다.\n이메일 인증 후 로그인해주세요');
//         alert('아직 이메일 인증이 완료되지 않았습니다.\n이메일 인증 후 로그인해주세요');
//         return this.state.push(Map({
//             loginYn : false
//             ,loginId : ''
//         }));
//     }
//   }

export default handleActions({
    [LOGIN]: (state, action) => {
        console.log('★★★ AUTH_LOGIN state ★★★ \n', state);
        console.log('★★★ AUTH_LOGIN action ★★★ \n', action);
        // api.apiSend('post','login',state.param,this.loginCallback);
        return state.push(Map({
            loginYn : true
            ,loginId : 'test'
        }));
    //   return state.push(Map({
    //     loginYn,
    //     loginId
    //   }));
        // 로그인 처리
    },
    [LOGOUT]: (state, action) => {
    //   const { payload: id } = action;
    //   const index = state.findIndex(todo => todo.get('id') === id);
    //   return state.delete(index);
        // 로그아웃 처리
    },
    [LOGINCK] : (state, action) =>{
        // 로그인체크
    }
  }, initialState);

  
  