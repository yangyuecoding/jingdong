/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-23 16:54:16
 * @LastEditors: YangYi
 * @LastEditTime: 2020-05-24 15:57:59
 */
//获取元素  输入框提示元素
var ipt_ele = _(".ipt-tip"),
    //用户名
    username = _("#myname"),
    //密码
    password = _("#mypassword"),
    //确认密码
    reppassword = _("#myreppwd"),
    //电话
    telphone = _("#mytelphone"),
    //提交按钮
    subBtn = _(".subBtn"),
    //提示信息
    iptTips = _(".iptTips"),
    //用户名下拉框提示
    usernameTips = _(".usernameTips"),
    //提交的提示
    endTips = _(".endTips");
//密码等级
var count = 0;
//动态设置 提示信息的top高度
ipt_ele.forEach((item, index) => {
    //第一个  54*1 30 * 0 + 5  
    //第二个 54 * 2 + 30 * 1 + 5
    //第二个 54 * 3 + 30 * 2 + 5
    item.style.top = 54 * (index + 1) + 30 * index + 5 + "px";
    //默认全部隐藏
    addClass(item, "hideTips");
    //input的提示信息一起隐藏
    addClass(iptTips[index], "hideTips");
})
//绑定事件 ---  前端验证
// console.log(username,password,reppassword,telphone,subBtn);
//注册敏感用户信息
function userInfo() {
    return [{
            ele: username,
            isAdopt: false
        },
        {
            ele: password,
            isAdopt: false
        },
        {
            ele: reppassword,
            isAdopt: false
        },
        {
            ele: telphone,
            isAdopt: false
        },
    ]
}
var userlist = userInfo();
//用户名事件
//密码验证状态  --- 输入以后，才能触发密码和确认密码的失焦事件
var isBegin = false;
var isTelBegin = false; //同上
window.onload = function () {

    //用名验证
    userlist.forEach(function (item, index) {
        //处理提示信息和叉号已经确认框的改变
        on(item.ele, "focus", tipsEvent);
        //输入框信息改变  
        on(item.ele, "keyup", changeEvent);
        //失去焦点判断用户名是否合格,隐藏提示栏以及input提示信息
        on(item.ele, "blur", valuesEvent);
        //插入用户数据
        on(subBtn,"click",checkUser);
    })

    //  on(username,"blur",usernameEvent);   
}
//处理用户名问题
function tipsEvent() {
    removeClass(this.parentNode.nextElementSibling, "hideTips");
    //如果验证成功 除过pwd 删除其他的仁和提示
    userlist.forEach(function (item, index) {
        //除过密码框的 全部都删除隐藏这个类
        if (this === item.ele && item.isAdopt && item.ele !== password) {
            console.log(this.parentNode.nextElementSibling.className);
            addClass(this.parentNode.nextElementSibling, "hideTips");
        } 
    }.bind(this))
}
//处理用户信息
function valuesEvent() {
    //  用户名输入框处理
    if (this === username) {
        usernameEvent.call(this);
    }
    //密码框输入框处理
    if (this === password) {
        passwordEvent.call(this);
    }
    //确认密码
    if (this === reppassword) {
        reppasswordEvent.call(this);
    }
    //确认手机号
    if (this === telphone) {
        telphoneEvent.call(this);
    }
}
//输入框信息改变
function changeEvent() {
    removeClass(this.nextElementSibling, "hideTips");
    if (this === password) {
        isBegin = true;
    }
    if (this === telphone) {
        isTelBegin = true;
    }

}

function usernameEvent() {
    // 失去焦点  处理用户名信息
    var reg = /^\w{4,20}$/;
    //显示用户名信息
    if (reg.test(this.value)) {
        //符合规则
        //发送后端验证用户名
        //修改提示元素的定位属性
        console.log("用户名符合贵伐");
        //发起请求
        ajax({
            url:"../api/registerApi/judgeusername.php",
            data:{
                username:this.value
            }
        })
        .then( res => {
            //成功
            console.log(this,res);
            if(res.code === 200){
                addClass(usernameTips,"hideTips");
                //改变对应元素的状态
                changeEleBuff.call(this);
            }else{
                removeClass(usernameTips,"hideTips");
                changeValue.call(this,usernameTips);
            }
        } )
        .catch( rej => {
            //失败
            console.log(rej);
        })
        removeClass(this.nextElementSibling, "hideTips");
        this.nextElementSibling.style.cssText = "background-position:0px -117px";
        
        //前端验证成功了，发送后端验证 是否可用  继续处理 .... 
    } else {
        //如果错误了 ,删除 错误提示
        addClass(this.nextElementSibling, "hideTips");
        console.log("验证失败，重新干一件事件,出现一个div");
        changeEleBuff.call(this, false);
    }
    //先这样写 倒是再细分
    addClass(this.parentNode.nextElementSibling, "hideTips");
}

function passwordEvent() {
    //当没有输入  失去焦点以后隐藏
    addClass(this.parentNode.nextElementSibling, "hideTips");
    if (!isBegin) return false;
    //密码等级
    var count = 0;
    ////密码框输入框处理
    var reg = /^\w{6,20}$/;
    if (reg.test(this.value)) {
        //纯字母
        var reg1 = /[a-zA-Z]/;
        //纯数字
        var reg2 = /\d/;
        //纯下划线
        var reg3 = /_/;
        if (reg1.test(this.value)) {
            count++;
        }
        if (reg2.test(this.value)) {
            count++;
        }
        if (reg3.test(this.value)) {
            count++;
        }
        switch (count) {
            case 3:
                //密码强度为强
                //处理密码等级提示
                cahngeLevel.call(this, count);
                break;
            case 2:
                //密码强度为中
                cahngeLevel.call(this, count);
                break;
            case 1:
                cahngeLevel.call(this, count);
                break;
                //密码强度为弱
        }
        console.log("用户名符合贵伐");
        //失去焦点后显示出来
        removeClass(this.parentNode.nextElementSibling, "hideTips");
        //显示提示
        removeClass(this.nextElementSibling, "hideTips");
        //删除错误提示颜色
        removeClass(this.parentNode.nextElementSibling, "pwdColor");
        this.nextElementSibling.style.cssText = "background-position:0px -117px";
        //改变对应元素的状态
        changeEleBuff.call(this);

    } else {
        removeClass(this.parentNode.nextElementSibling, "hideTips");
        //改变对应元素的状态
        changeEleBuff.call(this, false);
        //添加错误颜色
        addClass(this.parentNode.nextElementSibling, "pwdColor");
    }
}

//处理密码等级
function cahngeLevel(count) {
    var ele = this.parentNode.nextElementSibling.children[0];
    if (count === 1) {
        ele.style.cssText = `background-position:-17px -134px`;
    }
    if (count === 2) {
        ele.style.cssText = `background-position:-34px -117px`;
    }
    if (count === 3) {
        ele.style.cssText = `background-position:-34px -134px`;
    }
}

//处理用户等级
function changeEleBuff(isTrue = true) {
    for (var i = 0; i < userlist.length; i++) {
        if (this === userlist[i].ele) {
            userlist[i].isAdopt = isTrue;
        }
    }
}

function reppasswordEvent() {
    //重复密码
    addClass(this.parentNode.nextElementSibling, "hideTips");
    if (!isBegin) return false;
    if (this.value === password.value && this.value !== "") {
        console.log("两次密码一样");
        //显示提示
        removeClass(this.nextElementSibling, "hideTips");
        this.nextElementSibling.style.cssText = "background-position:0px -117px";
        //改变对应元素的状态
        changeEleBuff.call(this);
        //隐藏提示
        addClass(this.parentNode.nextElementSibling, "hideTips");

    } else {
        console.log("两次输入密码不一致");
        removeClass(this.parentNode.nextElementSibling, "hideTips");
        //改变对应元素的状态
        changeEleBuff.call(this, false);
        //添加错误颜色
        addClass(this.parentNode.nextElementSibling, "pwdColor");
        //删除提示
        addClass(this.nextElementSibling, "hideTips");
    }
}

//确认手机
function telphoneEvent() {
    //失焦后隐藏下方提示
    addClass(this.parentNode.nextElementSibling, "hideTips");
    if (!isTelBegin) return false;
    var reg = /^1[1-9]\d{8}[^0]$/;
    console.log(reg.test(this.value));
    if (reg.test(this.value)) {
        console.log("手机号验证成功");
        this.nextElementSibling.style.cssText = "background-position:0px -117px";
        addClass(this.parentNode.nextElementSibling, "hideTips");
        //改变对应元素的状态
        changeEleBuff.call(this);
        isTelBegin = false;
    } else {
        console.log("验证失败");
        //隐藏ipt的提示
        addClass(this.nextElementSibling, "hideTips");
        //添加颜色提示
        addClass(this.parentNode.nextElementSibling, "pwdColor");
        //显示下方提示
        removeClass(this.parentNode.nextElementSibling, "hideTips");
    }

}
//修改提示框的内容
function changeValue(ele){
    var list = ele.children[0].children;
    // var randomName = Math.random().toString(16).slice(2,5);
    Array.from(list).forEach( item => {
        //随机拼接名字
        item.innerHTML = " 建议使用 " + this.value +  Math.random().toString(16).slice(2,5);
    })
}

//提交后端
function checkUser(){
    for(var i = 0 ;i < userlist.length;i++){
        if(!userlist[i].isAdopt){
            userlist[i].ele.focus();
           //处理提交信息
           removeClass(endTips,"hideTips");
            return false;
        }
    }
    //全部都成功了
    judgeSucc();
    // console.log("所有数据验证成功");
   
}
//验证成功
function judgeSucc(){
    var count = 5;
    removeClass(endTips,"hideTips");
    endTips.innerHTML = `${count}秒后跳转登录页,点击跳转<a href="login.html">首页</a>`;

    //发一个请求 插入用户数据
    ajax({
        url:"../api/registerApi/addUser.php",
        data:{
            username:username.value,
            password:password.value,
            telphone:telphone.value
        }
    })
    .then( res => {
        console.log(res);
    })
    .catch( rej => {
        console.log(rej);
    })
    setInterval( () => {
        count--;
        if(count === 0){
            location.replace("login.html");
        }
        endTips.innerHTML = `${count}秒后跳转登录页,点击跳转<a href="login.html">首页</a>`;
    },1000)
}