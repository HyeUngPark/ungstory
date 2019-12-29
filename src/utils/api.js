import axios from 'axios';
import React from "react";
import ReactDOM from "react-dom";

// import Loading from '../components/Loadings/Loading.js';
import Loading from 'components/Loadings/Loading.jsx';

export async function apiSend (method, url,param,callback){
    const sendParams={
        method : method
        ,url : url
    }
        if(method === 'get'){
            sendParams.params = param;
        }else if(method === 'post' || method === 'put'){
            sendParams.data = param;
        }
        // ReactDOM.render(<Loading/>,document.getElementById('root'))
        // var loading = <Loading />;
        // var loading = new Loading();
        // loading.props.toggle();
        // console.log(loading);
        // loading.toggle();
        // loading.props.toggle();
        await axios(sendParams) 
        .then(response=>{
            callback(response.data);
            // loading.props.toggle();
            // loading.toggle();
            // loading.defaultProps.toggle();
        })
        .catch(error=>{
            callback(error.response);
            // loading.props.toggle();
            // loading.defaultProps.toggle();
            // loading.toggle();
        }).finally(()=>{
            // loading.props.toggle();
            // loading.defaultProps.toggle();
            // loading.toggle();
        });
    }
    


