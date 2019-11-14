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
 

