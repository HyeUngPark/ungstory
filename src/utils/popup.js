export function openImg(img) {
    var win = window.open("", "PopupWin", "width=500,height=600");
    if(img!==''){
      win.document.write(
        "<img alt='...'" 
        +"src='"+img+"'"
        +"/>"
      );
    }else{
      win.document.write(
        "<img alt='...'" 
        +"src='"+require("assets/img/theme/no-profile-130x130.png")+"'"
        +"/>"
      );
    }
}
 

