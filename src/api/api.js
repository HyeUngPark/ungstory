import axios from 'axios';
  
export function apiSend(method, url,param,callback) {
    const sendParams={
        method : method
        ,url : url
    }
    if(method === 'get'){
        sendParams.params = param;
    }else if(method === 'post'){
        sendParams.data = param;
    }
    // var result = [];
    var result={};
    axios(sendParams)
      .then(response=>{
        callback(response.data);
        // return response.data;
        // result.push(response.data);
    })
    .catch(error=>{
        // result = error.response;
        callback(error.response);
        // return error.response;
        // result.push(error.response);
    });
    //   console.log("★★★API RESULT★★★\n",result);
    // return result;
}
 

