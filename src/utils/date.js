export function getBeforeDate(cd) {
    let date = new Date();
    if(cd === '1w'){
        return new Date(date.setDate(date.getDate() - 7));
    }else if(cd === '1m'){
        return new Date(date.setMonth(date.getMonth() - 1));
    }else if(cd === '6m'){
        return new Date(date.setMonth(date.getMonth() - 6));
    }else if(cd === '1y'){
        return new Date(date.setFullYear(date.getFullYear() - 1));
    }
}
 
export function getDate(format, d){
    var date = d ? d : new Date();
    var year = date.getFullYear();              
    var month = (1 + date.getMonth());          
    month = month >= 10 ? month : '0' + month;  
    var day = date.getDate();                   
    day = day >= 10 ? day : '0' + day;          
    var hour = date.getHours();
    hour = hour >= 10 ? hour : '0' + hour;        
    var min = date.getMinutes();
    min = min >= 10 ? min : '0' + min;        
    var sec = date.getSeconds();
    sec = sec >= 10 ? sec : '0' + sec;        
 
    return  year+'-'+month+'-'+day+" "+hour+":"+min+":"+sec;
}
