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
        
        // ReactDOM.render(<Loading/>, document.getElementById('root'));
        await axios(sendParams) 
        .then(response=>{
            callback(response.data);
        })
        .catch(error=>{
            callback(error.response);
        }).finally(()=>{

        });
    }
    


