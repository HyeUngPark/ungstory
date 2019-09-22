import axios from 'axios';
  
export function apiSend(method, url,param,callback) {
    const sendParams={
        method : method
        ,url : url
    }
    if(method === 'get'){
        sendParams.params = param;
    }else if(method === 'post' || method === 'put'){
        sendParams.data = param;
    }
    
    axios(sendParams)
      .then(response=>{
        callback(response.data);
    })
    .catch(error=>{
        callback(error.response);
    });
}
 

