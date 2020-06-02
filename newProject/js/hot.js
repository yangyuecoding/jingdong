/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-06-01 22:05:33
 * @LastEditors: YangYi
 * @LastEditTime: 2020-06-02 16:00:47
 */
var register = _(".user-register"),
    login = _(".user-login"),
    userinfo = _(".userinfo"),
    usi_slider = _(".usi-slider ul"),
    usi_sm_sliders = _(".usi-sliders"),
    //用户左侧按钮
    left_menu = _(".usi-slider .icon-fangkuai-"),
    //用户右侧按钮
    right_menu = _(".usi-slider .icon-fangkuai"),
    //左侧大时间
    left_time = _(".left-time");
//右侧倒计时
reduce_time = _(".reduce-time1 > span"),
    //抢购列表元素
    rushtobuy2 = _(".rushtobuy2").children,
    //商品列表容器
    goods_list = _(".goods-list");
//用户侧左右移动状态变量
var inco_move_count = 0;
var end_reduce = 0;
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
        on(register, "mouseenter", dragUserInfo);
        addClass(register, "basecolor");
        on(userinfo, "mouseleave", function () {
            removeClass(register.parentNode, "myspcposition");
            userinfo.style.display = "none";
        });
        on(left_menu, "click", function () {
            iconMenuMove("left");
        })
        on(right_menu, "click", function () {
            iconMenuMove("right");
        })
        //退出登录
        console.log(_(".tologout"))
        on(_(".tologout"), "click", function () {
            removeClass(login, "hideTips");
            addClass(register, "high");
            register.innerHTML = "欢迎注册";
            removeCookie("token", "/");
            right_menu.dispatchEvent(right_clc_event);
        })

    } else {
        removeClass(login, "hideTips");
        addClass(register, "high");
        register.innerHTML = "欢迎注册";
    }
}

function dragUserInfo() {
    addClass(this.parentNode, "myspcposition");
    userinfo.style.display = "block";
    //修改ul的根据ul子元素个数修改ul的宽度
    usi_slider.style.width = usi_slider.children.length * 85 + "px";
}
//左右按钮事件
function iconMenuMove(der) {
    if (der === "right") {
        if (Math.abs(parseInt(getStyle(usi_sm_sliders, "left"))) === 480) return false;
        inco_move_count++;
        animate(usi_sm_sliders, {
            left: -(inco_move_count * 160)
        }, "swing")
    } else {
        if (Math.abs(parseInt(getStyle(usi_sm_sliders, "left"))) === 0) return false;
        inco_move_count--;
        animate(usi_sm_sliders, {
            left: -(inco_move_count * 160)
        }, "swing")
    }

}
//处理登录信息
function handelSlidUser() {
    slid_rig_tips.innerHTML = "Hi," + Cookie("token");
    addClass(slid_rig_logi, "hideTips");
    addClass(slid_rig_rem, "hideTips");
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
            shopcar_num.innerHTML = res.body.data.reduce((data, item) => {
                return data += Number(item.goods_count);
            }, 0)
        })
        .catch(rej => {
            console.log(rej);
        })
}

window.onload = function () {
    regUserName();
    // renderRTB();
    //抢购时间
    var d = new Date();
    if(d.getHours() % 2 === 0){
        var rush_time = d.getHours();
    }else{
        var rush_time = d.getHours() - 1;
    }
    console.log(rush_time);
    
    setInterval(function () {
        if (!((rush_time + 2) === d.getHours())) return false;
            rush_time += 2;
            if ((rush_time + 2) === d.getHours()) {
                rush_time = rush_time + 2;
                renderRTB(rush_time);
                if (rush_time === 24) {
                    rush_time = 0;
                }
            } else {
                return false;
            }
    }, 1000);
   
    //先调用一次
    renderRTB(rush_time);
    //渲染商品列表
    rendergoodslist();
}

//获取时间
function judgeHour(d) {
    var tiemr = setInterval(() => {
        if (!(d.getHours() % 2)) {
            console.log()
            rush_time = d.getHours();
        }
    }, 7200000)

}


//每两个小时更新一次  抢购倒计时
function renderRTB(num) {
    //倒计时开始元素
    var elechild;
    //倒计时滚动时间
    Array.from(rushtobuy2).forEach((item, index) => {
        elechild = item.children[0].children[0];
        elechild.innerHTML = addZero(num + index * 2);
        //通过new Data() 计算出来 当前的小时时间是否与 当前元素的小时时间=2  是否是 大于等于关系

    })
    checkTimer(num);
}


function checkTimer(num) {
    //获取当前时间
    var d = new Date();
    if ((num + 2) === d.getHours()) {
        num = num + 2;
        renderRTB(num);
    }
    console.log(num, num + 2);
    setInterval(() => {
        disappeartime({
            start: num,
            end: num + 2
        })
    }, 1000)
}


//时间间隔
function disappeartime(options, toBreak) {
    //可以穿多参数 {start:,end:}
    if (!isObject(options)) return false;
    var d = new Date();
    // d.setHours(options.start,0,0);
    var start = d.getTime();

    d.setHours(options.end, 0, 0);
    var end = d.getTime();
    var reduce = end - start;
    if (toBreak) return reduce;
    
    var hour = getZero(parseInt(reduce / 1000 / 60 / 60));
    var min = getZero(parseInt(reduce / 1000 / 60 % 60));
    var sec = getZero(parseInt(reduce / 1000 % 60));
    reduce_time[0].innerHTML = hour;
    reduce_time[1].innerHTML = min;
    reduce_time[2].innerHTML = sec;

}
//计数单位
function getZero(num) {
    return num <= 9 ? "0" + num : num;
}

//时间数字小于10的
function addZero(num) {
    num = num.toFixed(2);
    return num = num <= 9 ? "0" + num : num;
}

//渲染商品列表
function rendergoodslist(){
    ajax({
        url:"../api/getgoods/goodstype.php",
        
    })
    .then( res => {
        //碎金存放20个商品
        pushData(res);
    })
    .catch( rej => {
        console.log(rej);
    })
}

function pushData(res){
    var goods = [];
    while(goods.length < 30){
        goods.push(res.body.data[parseInt(res.body.data.length * Math.random())]);
    }
   //渲染列表
   rendermylist(goods);
}

//渲染列表
function rendermylist(data){
    goods_list.innerHTML = data.reduce( ( html,arr,i ) => {
        var data = parseInt((parseInt( arr.goods_number * Math.random() ) / arr.goods_number * 100 )) +"%";
       
        return html += `
        <div class="goods" data-id="${arr.goods_id}">
        <a href="../html/gooddetails.html?goods-id=${arr.goods_id}">
        <img src="${arr.goods_big_logo}" alt="">
        <span class="title">
        ${arr.goods_name}
        </span>
        <div class="tips clearAll">
            <span class="price">
                <em>抢购价</em>
                <b>${arr.goods_price}</b>
            </span>
            <span class="num">
                <em>仅剩</em>
                <b>${arr.goods_number}</b>
            </span>
        </div>
        <div class="sell-num">
            已售 <span>
               ${ data }
            </span>
            <div class="sell-p">
                <span>
                    <div class="more-p" style="width:${data}"></div>
                </span>
            </div>
            <button>立即抢购</button>
        </div>
        </a>
    </div>

        `;
    } ,"")
}