/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-06-01 22:05:33
 * @LastEditors: YangYi
 * @LastEditTime: 2020-06-01 22:16:14
 */ 
var register = _(".user-register"),
    login = _(".user-login"),
    userinfo = _(".userinfo"),
    usi_slider=_(".usi-slider ul"),
    usi_sm_sliders = _(".usi-sliders"),
    //用户左侧按钮
    left_menu = _(".usi-slider .icon-fangkuai-"),
    //用户右侧按钮
    right_menu = _(".usi-slider .icon-fangkuai");
 
//用户侧左右移动状态变量
var inco_move_count = 0;

var shopcar_num = _(".shopcar-num");
function regUserName() {
    if (Cookie("token")) {
        var right_clc_event = new Event("click");
        addClass(login, "hideTips");
        removeClass(register, "high");
        register.href = "javascript:";
        register.innerHTML = Cookie("token");
        rendershopcarnum();
        //显示用户的的下拉菜单
        on(register,"mouseenter",dragUserInfo);
        addClass(register,"basecolor");
        on(userinfo,"mouseleave",function(){
            removeClass(register.parentNode,"myspcposition");
            userinfo.style.display = "none";
        });
        on(left_menu,"click",function(){
            iconMenuMove("left");
        })
        on(right_menu,"click",function(){
            iconMenuMove("right");
        })
        //退出登录
        console.log(_(".tologout"))
        on(_(".tologout"),"click",function(){
            removeClass(login, "hideTips");
            addClass(register, "high");
            register.innerHTML = "欢迎注册";
            removeCookie("token","/");
            right_menu.dispatchEvent(right_clc_event);
        })
       
    } else {
        removeClass(login, "hideTips");
        addClass(register, "high");
        register.innerHTML = "欢迎注册";
    }
}
function dragUserInfo(){
    addClass(this.parentNode,"myspcposition");
    userinfo.style.display = "block";
    //修改ul的根据ul子元素个数修改ul的宽度
    usi_slider.style.width = usi_slider.children.length * 85 +"px";
}
//左右按钮事件
function iconMenuMove(der){
    if(der === "right"){
        if(Math.abs(parseInt(getStyle(usi_sm_sliders,"left")))  === 480 ) return false;
        inco_move_count++;
        animate(usi_sm_sliders,{left:- (inco_move_count * 160)},"swing")
    }else{
        if(Math.abs(parseInt(getStyle(usi_sm_sliders,"left")))  === 0 ) return false;
        inco_move_count--;
        animate(usi_sm_sliders,{left:- (inco_move_count * 160)},"swing")
    }
   
}
//处理登录信息
function handelSlidUser(){
    slid_rig_tips.innerHTML = "Hi," + Cookie("token");
    addClass(slid_rig_logi,"hideTips");
    addClass(slid_rig_rem,"hideTips");
    slid_rig_logo.innerHTML = "退出";
    slid_rig_upd.innerHTML = "达叔说首充888送屠龙刀";
}

function rendershopcarnum() {
    //发送请求 渲染购物车的商品数量
    ajax({
            url: "../api/createHtml/rendershopcar.php",
            data: {
                username: Cookie("token")
            }
        })
        .then(res => {
        shopcar_num.innerHTML = res.body.data.reduce( (data,item) =>{ 
            return data += Number(item.goods_count);
        },0)
        })
        .catch(rej => {
            console.log(rej);
        })
}

window.onload = function(){
    regUserName()
}