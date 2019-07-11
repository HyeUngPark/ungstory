import axios from 'axios';
  
export function apiSend(method, url,param) {
    const sendParams={
        method : method
        ,url : url
    }
    if(method === 'get'){
        sendParams.param = param;
    }else if(method === 'post'){
        sendParams.data = param;
    }
    console.log(sendParams);

    axios(sendParams)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    
}
 

