import axios from 'axios';
import React from "react";
import ReactDOM from "react-dom";

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
    let urlInfos = window.location.pathname.split('/');
    var page;
    
    if(urlInfos[1] ==='auth'){
        page ='loadingAuth';
    }else{
        page ='loadingUser';
    }
    if(document.getElementById(page)){
        var loader = <Loading/>;
        ReactDOM.render(loader, document.getElementById(page));
    }
    
    await axios(sendParams) 
    .then(response=>{
        callback(response.data);
    })
    .catch(error=>{
        callback(error.response);
    }).finally(()=>{
        if(document.getElementById(page)){
            var clear = <div style={{'display':'none'}}></div>;
            ReactDOM.render(clear,document.getElementById(page));
        }
        // ReactDOM.unmountComponentAtNode(document.getElementById('loading'));
    });
}
    


