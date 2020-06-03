/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-24 17:04:17
 * @LastEditors: YangYi
 * @LastEditTime: 2020-06-03 17:01:16
 */ 

//    console.log(username,password,subBtn);
function userInfo(){
// 选择元素
var username = _(".myname"),
    password = _(".mypassword"),
    subBtn = _(".subBtn");
    return [
        username,
        password,
        subBtn
    ]
}
//提示功能
var clearTips = _(".hideiptTips");
//错误信息
var info = _(".info-b");
var userlist = userInfo();
//加载效果
var myTips = _(".myTips");
//主流程
window.onload  = function(){
    userlist.forEach( (item,index) => {
        if(index === 2){
            //提交功能
            on(item,"click",subEvent);
        }else{
            //给每一个绑定 聚焦 失焦 键盘弹出
            on(item,"focus",focusEvent);
            on(item,"blur",blurEvent);
            on(item,"keyup",keyupEvent);
        }
    })
}
//优化前
// //聚焦事件
// function focusEvent(){
//     //用户名
//     if(this === userlist[0]){
//         //用户名
//         userfocEvent.call(this);
//         allfocEvent.call(this,userlist[0]);
//     }
//     //密码
//     if(this === userlist[1]){
//         //用户名
//         pwdfocEvent.call(this);
//     }
// }
// //失焦
// function blurEvent(){
//     if(this === userlist[0]){
//         //用户名
//         userblurEvent.call(this);
//     }
//      //密码
//      if(this === userlist[1]){
//         //用户名
//         pwdblurEvent.call(this);
//     }
// }
// //键盘抬起
// function keyupEvent(){
//     if(this === userlist[0]){
//         //用户名
//         userkeyEvent.call(this);
//     }
//       //密码
//       if(this === userlist[1]){
//         //用户名
//         pwdkeyEvent.call(this);
//     }
// }

// //处理用户名和密码的聚焦事件
// function allfocEvent(ele){
//     var lab = this.parentNode.children[0];
//     lab.style.cssText = `background-position:${ele ===userlist[0]? "0px":"-48px" } -48px`;
// }




// //密码的树胶 失焦 键盘抬起
// function pwdfocEvent(){
//     var lab = this.parentNode.children[0];
//     lab.style.cssText = `background-position:-48px -48px`;
// }

// function pwdblurEvent(){
//     var lab = this.parentNode.children[0];
//     lab.style.cssText = `background-position:-48px 0px`;
// }

// function pwdkeyEvent(){
//     removeClass(this.nextElementSibling,"hideiptTips");
//     this.nextElementSibling.onclick = function(){
//        //清空ipt
//        this.value = "";
//     }.bind(this);
// }

// //用户名聚焦
// function userfocEvent(){
//     var lab = this.parentNode.children[0];
//     lab.style.cssText = `background-position:0px -48px`;
// }
// //用户失焦
// function userblurEvent(){
//     var lab = this.parentNode.children[0];
//     lab.style.cssText = `background-position:0px 0px`;
// }
// //用户谈起
// function userkeyEvent(){
//     removeClass(this.nextElementSibling,"hideiptTips");
//     this.nextElementSibling.onclick = function(){
//        //清空ipt
//        this.value = "";
//     }.bind(this);
// }


//聚焦事件
function focusEvent(){
    //用户名
    if(this === userlist[0]){
        //用户名
        allfocEvent.call(this,userlist[0]);
    }
    //密码
    if(this === userlist[1]){
        //用户名
        allfocEvent.call(this,userlist[1]);
    }
}
//失焦
function blurEvent(){
    if(this === userlist[0]){
        //用户名
        allblurEvent.call(this,userlist[0]);
    }
     //密码
     if(this === userlist[1]){
        //用户名
        allblurEvent.call(this,userlist[1]);
    }
}
//键盘抬起
function keyupEvent(){
    if(this === userlist[0]){
        //用户名
        allkeyEvent.call(this);
    }
      //密码
      if(this === userlist[1]){
        //用户名
        allkeyEvent.call(this);
    }
}

//处理用户名和密码的聚焦事件
function allfocEvent(ele){
    var lab = this.parentNode.children[0];
    lab.style.cssText = `background-position:${ele ===userlist[0]? "0px":"-48px" } -48px`;
}

//处理用户名和密码的失焦事件
function allblurEvent(ele){
    var lab = this.parentNode.children[0];
    lab.style.cssText = `background-position:${ele === userlist[0]?"0px":"-48px"} 0px`;
}

function allkeyEvent(){
    removeClass(this.nextElementSibling,"hideiptTips");
    this.nextElementSibling.onclick = function(){
       //清空ipt
       this.value = "";
       addClass(this.nextElementSibling,"hideiptTips");
    }.bind(this);
}


//提交功能
function subEvent(){
    ajax({
        url:"../api/loginApi/login.php",
        data:{
            username:userlist[0].value,
            password:userlist[1].value
        }
    })
    .then( res => {
       if(res.code === 200){
           addClass(info,"hideiptTips");
           //成功
           removeClass(myTips,"hideiptTips");
           //存一条用户名cookie
           Cookie("token",userlist[0].value,{
                path:"/"
            })
           setTimeout( () => {
            location.replace("../index.html");
           },2000);
       }else{
           removeClass(info,"hideiptTips");
       }
       console.log(res);
    })
    .catch( rej => {
        console.log(rej);
        removeClass(info,"hideiptTips");
    })
}
