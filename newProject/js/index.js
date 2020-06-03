/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-25 09:47:00
 * @LastEditors: YangYi
 * @LastEditTime: 2020-06-03 12:00:23
 */



//选择元素
var register = _(".user-register"),
    login = _(".user-login"),
    userinfo = _(".userinfo"),
    usi_slider = _(".usi-slider ul"),
    usi_sm_sliders = _(".usi-sliders"),
    //用户左侧按钮
    left_menu = _(".usi-slider .icon-fangkuai-"),
    //用户右侧按钮
    right_menu = _(".usi-slider .icon-fangkuai"),
    //轮播图右侧登录信息
    slid_rig_tips = _(".slid_rig_tips"),
    slid_rig_logi = _(".slid_rig_logi"),
    slid_rig_logo = _(".slid_rig_logo"),
    slid_rig_upd = _(".slid_rig_upd"),
    slid_rig_rem = _(".slid_rig_rem"),
    rig_slider_imgs = _(".scroll-bar"),
    scroll_box = _(".scroll-box"),
    scroll_big_img = _(".rig-slider-imgs");
sli_img = _(".sli-img");
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
        //处理轮播图右侧登录信息
        handelSlidUser();
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
        //轮播图退出登录信息
        on(slid_rig_logo, "click", function () {
            removeClass(login, "hideTips");
            addClass(register, "high");
            register.innerHTML = "欢迎注册";
            removeCookie("token", "/");
            right_menu.dispatchEvent(right_clc_event);

            slid_rig_tips.innerHTML = "Hi," + Cookie("token");
            removeClass(slid_rig_logi, "hideTips");
            removeClass(slid_rig_rem, "hideTips");
            slid_rig_logo.innerHTML = "注册";
            slid_rig_upd.innerHTML = "新人福利";
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
    console.log(der);
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
            url: "./api/createHtml/rendershopcar.php",
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
// 轮播图
function YySwitch(imtBOX, Judgment, options) {
    //最大的box
    this.container = this.chooseEle(imtBOX);
    this.init(Judgment, options);
}
YySwitch.prototype = {
    constructor: YySwitch,
    //初始化
    init: function (Judgment, options) {

        //纺织参数错误 或者 没有传递
        options = options || {};
        Judgment = Judgment || {};
        //图片的盒子;
        this.img_box = null;
        //图片的容器
        this.img_box_arr = [];
        //分页器的盒子
        this.pageAction_box = null;
        //分页器的容器
        this.pageAction_box_arr = [];
        //左右按钮
        this.clickBtn = [];
        //单一运动的轮播图坐标  上一张，下一张默认的索引都为0
        this.next = 0;
        this.prev = 0;
        //全局存img_box滑动的状态 默认是fasle  只有当变为true的时候下一张才能运动
        this.isMove = false;

        //默认参数 ，里面存放着各种属性的数据

        let _default = {
            //图片的数量和数据
            imgs: [
                "https://img20.360buyimg.com/pop/s1180x940_jfs/t1/128784/39/2325/83692/5ec4a568E231100bc/cc6170150a0099a3.jpg.webp",
                "http://img20.360buyimg.com/pop/s1180x940_jfs/t1/122289/9/2407/67305/5ec4df7fE85979583/e3b79dec3f31884a.jpg.webp",
                "https://img12.360buyimg.com/pop/s1180x940_jfs/t1/114582/22/7412/55588/5ec396bdE756cff96/87ff3d1b10a4d68a.jpg.webp",
                "https://img12.360buyimg.com/pop/s1180x940_jfs/t1/122770/16/2651/89249/5ec7315bEea3012c4/069a7b1edf3c8e0b.jpg.webp",
                "https://img13.360buyimg.com/pop/s1180x940_jfs/t1/122022/29/2140/72437/5ec33779Ead8c24e5/b8ef831ac7a94d08.jpg.webp",
                "https://img10.360buyimg.com/pop/s1180x940_jfs/t1/124174/21/519/65688/5eb60976Ed9307b3c/8ee937b906902c95.jpg.webp"
            ],
            //左右按钮的大小
            clickBtn_width: 20,
            clickBtn_height: 20,
            //图片父容器的宽高
            img_box_width: this.container.offsetWidth,
            img_box_height: this.container.offsetHeight,
            //分页器按钮的大小
            pageAction_box_width: 10,
            pageAction_box_height: 10,
            //分页器的背景颜色
            pageAction_bg_color: "red",
            //分页器的按钮颜色
            pageAction_hig_color: "green",
            isCircular: true,
            //自动播放全局定时器
            tiner: null,
            //图片几秒钟切换一次
            timeLong: 2500
        };
        //当有同名属性出现的时候偶，后面的覆盖前面的
        for (var attr in _default) {
            this[attr] = options[attr] ? options[attr] : _default[attr];
        }

        let Judgment_variable = {
            effect: "slider",
            pageAction: true,
            loop: true
        };

        //合并对象的方法  第一种
        // Judgment = assign(Judgment_variable,Judgment);
        // for(var attr in Judgment){
        //     this[attr] = Judgment[attr];
        // }

        // 将默认参数与传入的参数合并 第二种方法
        for (var attr in Judgment_variable) {
            this[attr] = Judgment[attr] !== undefined ? Judgment[attr] : Judgment_variable[attr];
        }

        //当参数为 slider 的时候 无缝轮播  在后面复制一张
        this.effect && this.effect === "slider" ? this.imgs.push(this.imgs[0]) : "";
        //创建最大的img容器
        this.creatImg_box();
        //创建分页器  当这个属性传递了 并且传递的值为true 才开始熏染分页器按钮
        this.pageAction && this.pageAction === true ? this.creatPage_box() : "";
        //创建图片容器
        // this.creatImg_div_box();
        //创建左右按钮
        this.creatClickBtn();
        //控制轮播图运动的默认参数
        //绑定事件
        this.bindEvent();
        //当loop为true的时候 自动轮播
        this.loop && this.loop === true ? this.autoPlay() : "";
        //绑定全局的失焦和聚焦事件
        this.windowEvent();
    },
    //选择元素
    chooseEle: function (ele) {
        ele = document.querySelectorAll(ele);
        if (ele === null) {
            return false;
        } else if (ele.length === 1) {
            return ele[0];
        } else {
            return [].slice.call(ele);
        }
    },
    //创建img——box 并插入
    creatImg_box: function () {
        this.img_box = document.createElement("div");

        this.imgs.forEach((item, index) => {
            let small_img_box = document.createElement("div");
            let small_img = document.createElement("img");
            small_img.src = item;
            //让图片的大小，跟随最大的父容器的大小
            small_img.style.cssText = `
                display: block;
                float:left;
                width:${this.img_box_width}px;
                height:${this.img_box_height}px;
            `;
            small_img_box.style.cssText = `float:left`;
            //dom 结构 <div 最大的容器> > <div 每个图片的父容器> <img> 每个图片
            small_img_box.appendChild(small_img);
            this.img_box.appendChild(small_img_box);
            this.img_box_arr.push(small_img);
        })
        this.img_box.style.cssText = `
            width:${ this.img_box_arr.length * this.img_box_width }px;
            height:${ this.img_box_height }px;
            position:absolute;
            left:0;
        `;
        //将轮播图容器添加到最大的container里面去
        this.container.appendChild(this.img_box);
    },
    //左右按钮
    creatClickBtn: function () {
        for (var i = 0; i < 2; i++) {
            let clickBtn_ele = document.createElement("button");
            clickBtn_ele.innerHTML = `${i===0?"<":">"}`;
            //先左侧 再右侧
            clickBtn_ele.style.cssText = `
            position: absolute;
            height: 20px;
            width: 20px;
            z-index: 100;
            font-size:30px;
            outline:0;
            border:0;
            left: ${i===0?20:""}px;
            right:${i ===1?20:""}px;
            top: 50%;
            margin-top: -10px;
            `;
            this.clickBtn.push(clickBtn_ele);
            this.container.appendChild(clickBtn_ele);
        }
    },
    //分页器
    creatPage_box: function () {
        //先创建分页器按钮的父元素
        this.pageAction_box = document.createElement("p");
        this.pageAction_box.style.cssText = `
            position: absolute;
            text-align: center;
            left: 50%;
            margin-left: -50px;
            z-index: 100;
            top: 100%;
            margin-top: -40px;
            cursor: pointer;
        `;

        //因为是slider的情况，所以需要让循环创建的分页器的数量少一

        for (var i = 0; i < this.imgs.length - 1; i++) {
            let span_ele = document.createElement("span");
            span_ele.style.cssText = `
                 display: inline-block;
                 width: ${this.pageAction_box_width}px;
                 margin-left: 10px;
                 border-radius: ${this.isCircular? "50%" : 0}; 
                 border: 2px solid yellowgreen;
                 background-color:${ i===0? this.pageAction_hig_color:""};
                 height: ${this.pageAction_box_height}px;   
            `;
            this.pageAction_box_arr.push(span_ele);
            this.pageAction_box.appendChild(span_ele);
        }

        this.container.appendChild(this.pageAction_box);
    },
    //绑定事件
    bindEvent: function () {
        //左侧按钮
        this.clickBtn[0].addEventListener("click", function () {
            if (this.isMove) return false;
            if (this.next === 0) {
                this.next = this.img_box_arr.length - 2;
                this.img_box.style.left = -(this.next + 1) * this.img_box_width + "px";
            } else {
                this.next--;
            }
            //动画切换
            this.pageActionLayout();
            this.img_box_arr[this.next].style.opacity = 0;
            animate(this.img_box_arr[this.next], {
                opacity: 1
            }, "swing");
            //分页器运动
            this.isMove = true;
            animate(this.img_box, {
                left: -this.next * this.img_box_width
            }, "swing", 5, () => {
                //当图片运动到终点了  置为true
                this.isMove = false;
            });
        }.bind(this))
        //右侧按钮
        this.clickBtn[1].addEventListener("click", function () {
            // console.log(this.isMove);
            if (this.isMove) return false;
            if (this.next === this.img_box_arr.length - 1) {
                //到达最后一张，让他的下标到第二章 因为最后一张和他一张，
                this.img_box.style.left = 0;
                this.next = 1;
            } else {
                this.next++;
            }

            //动画切换
            this.pageActionLayout();
            this.img_box_arr[this.next].style.opacity = 0;
            animate(this.img_box_arr[this.next], {
                opacity: 1
            }, "swing");
            this.isMove = true;
            //分页器运动
            animate(this.img_box, {
                left: -this.next * this.img_box_width
            }, "swing", 5, () => {
                //当图片运动到终点了  置为true
                this.isMove = false;
            });
        }.bind(this))
        //分页器按钮的点击事件 
        this.pageAction_box_arr.forEach((item, index) => {
            item.onmouseenter = () => {
                //添加了判断值后无法  实时的获取到图片的位移距离
                // if(this.isMove) return false;
                this.next = index;
                //短暂运动
                //     animate(this.img_box, {
                //     left: -this.next * this.img_box_width
                // }, "swing", 5,() => {
                //     //当图片运动到终点了  置为true
                //     this.isMove = false;
                // });
                //点击的时候，让this.next  变成true  点击就无法生效了
                this.isMove = true;
                this.pageAction_box_arr[this.next].style.opacity = 0;
                this.img_box_arr[this.next].style.opacity = 0;
                animate(this.img_box_arr[this.next], {
                    opacity: 1
                }, "swing");
                //分页器按钮有效特效
                animate(this.pageAction_box_arr[this.next], {
                    opacity: 1,
                }, "swing");
                animate(this.img_box, {
                    left: -this.next * this.img_box_width,
                }, "swing", 5, () => {
                    this.isMove = false;
                });
                this.pageActionLayout();
                //开启自动播放功能
                this.autoPlay();
            }
        })
    },
    pageActionLayout: function () {
        //先删除所有的分页器的backgroundColor ,然后给需要的添加
        for (var i = 0; i < this.pageAction_box_arr.length; i++) {
            this.pageAction_box_arr[i].style.backgroundColor = "";
        }
        //给当前的点击移动到的图片添加bgcolor
        if (this.next === this.img_box_arr.length - 1) {
            this.pageAction_box_arr[0].style.backgroundColor = `${this.pageAction_hig_color}`;
        } else {
            this.pageAction_box_arr[this.next].style.backgroundColor = `${this.pageAction_hig_color}`;
        }
    },
    //自动轮播
    autoPlay: function () {
        // console.log("我应该改开始自动运动了");
        //自定义事件  触发自动轮播
        var right_click = new Event("click");
        this.timer = setInterval(() => {
            this.clickBtn[1].dispatchEvent(right_click);
        }, this.timeLong);
    },
    //处理失焦和聚焦事件
    windowEvent: function () {
        window.addEventListener("blur", () => {
            console.log("我已经失焦了");
            clearInterval(this.timer);
        })
        window.addEventListener("focus", () => {
            console.log("我已经获得焦点了");
            this.autoPlay();
        })
    },
    //分页器按钮事件
    pageAction_box_click: function () {

    }
}

window.onload = function () {
    regUserName();
    var sw = new YySwitch(".main-container", {
        //当effect 参数为slider 时候，无缝轮播，pageAction:为true的时候渲染分页按钮 loop 为true的时候调用自动播放功能
        effect: "slider",
        loop: true
    });
    // 渲染首页商品列表
    ajax({
            url: "http://localhost/pdd",
            data: {
                page: 1,
                size: 50
            }
        })
        .then(res => {
            console.log(res);
            //初始化工具函数  -- 同一的状态管理
            init(res);
        })
        .catch(rej => {
            console.log(rej);
        })

    function init(res) {
        var data = res.goods;
        //渲染页面
        renderIndex(data);
    }
    renderTimer();
}
//合并对象
function assign() {
    var target = arguments[0];
    for (var i = 0; i < arguments.length; i++) {
        for (var attr in arguments[i]) {
            target[attr] = arguments[i][attr];
        }
    }
    return target;
}

function getStyle(ele, attr) {
    if (ele.currentStyle) {
        return ele.currentStyle[attr];
    } else {
        return getComputedStyle(ele)[attr];
    }
}
//动画函数
function animate(ele, opitions, speed_model, speed, callback) {
    //处理参数，每一个属性都需要对应两个参数，target ，iNow
    for (var attr in opitions) {
        opitions[attr] = {
            target: attr === "opacity" ? opitions[attr] * 100 : opitions[attr],
            iNow: attr === "opacity" ? parseInt(getComputedStyle(ele)[attr] * 100) : parseInt(getComputedStyle(
                ele)[attr])
        }
    }
    speed = speed === undefined ? 5 : speed;
    clearInterval(ele.timer);
    ele.timer = setInterval(function () {
        //    console.log(1);
        for (var attr in opitions) {
            //计算缓冲运动
            //{height: {target: 300, iNow: 100}}
            //{width: {target: 200, iNow: 100}}p
            var target = opitions[attr].target;
            var iNow = opitions[attr].iNow;
            //    console.log(target,iNow);
            if (speed_model === "swing") {
                speed = target >= iNow ? Math.ceil((target - iNow) / 10) : Math.floor((target - iNow) / 10);
            } else {
                speed = target >= iNow ? Math.abs(speed) : -Math.abs(speed);
            }
            //    console.log(target,iNow,speed);
            //终止条件
            if (Math.abs(opitions[attr].target - opitions[attr].iNow) <= Math.abs(speed)) {
                ele.style[attr] = attr === "opacity" ? target / 100 : target + "px";
                //谁道道了种植我就删除他   因为定时器的两次运动不同步，造成了一个到达了 然后删除了定时器，另外一个可能没有在同一时间
                //到达目标，打比方 宽度道道了，高度可能差10像素没有到达，这个时候，下面for in 用来判断，如果我还还有属性，那么我就不应该
                //删除定时器，所以直接return false ,继续执行代码
                // console.log(opitions);
                delete opitions[attr];
                for (var num in opitions) {
                    // opitions里面还有数据，那我就返回，下面代码不执行了，否则我就关闭定时器
                    return false;
                    return false;
                }

                clearInterval(ele.timer);

                typeof callback === "function" ? callback() : "";

            } else {
                opitions[attr].iNow += speed;
                //    ele.style[attr] = opitions[attr].iNow + "px";
                ele.style[attr] = attr === "opacity" ? opitions[attr].iNow / 100 : opitions[attr].iNow +
                    "px";
            }
        }
    }, 30);
}
// 左侧侧边栏  弹出效果
$(".myslider li").mouseenter(function () {
    $(".slider-menus").show();
    for (var i = 0; i < this.parentNode.children.length; i++) {
        if (Number(this.getAttribute("data-index")) === i) {
            // $(".slider-menus").html(`这个是弹出的第<b>${i}</b>个页面了`);
        }
    }
})
$(".main-sell").mouseleave(function () {
    $(".slider-menus").hide();
})

//抢购专区 slider 特效
$(".slider-item > button").mouseenter(function () {
    $(this).animate({
        opacity: 0.3
    })
})
$(".slider-item > button").mouseleave(function () {
    $(this).animate({
        opacity: 1
    })
})

// 计算移动图像的宽度
$(".yy-sell-myslider").append($(".yy-sell-myslider > div:first-of-type").clone(true));
var count = $(".yy-sell-myslider div")[0].children.length;
$(".yy-sell-myslider").css({
    width: count * 800
})

//全局下标
var index = 0;

//绑定点击事件
$(".slider-item > button").click(function () {
    if (this.getAttribute("data-index") == 1) {
        if (index === 0) {
            index = count - 2;
            $(".yy-sell-myslider").css({
                left: -(index + 1) * 800
            })

        } else {
            index--;
        }
        $(".yy-sell-myslider").animate({
            left: -(index) * 800
        }, 1000)
    }
    if (this.getAttribute("data-index") == 2) {
        if (index === count - 1) {
            index = 1;
            $(".yy-sell-myslider").css({
                left: 0
            })
            $(".yy-sell-myslider").animate({
                left: -index * 800
            }, 1000)
        } else {
            index++;
        }
        $(".yy-sell-myslider").animate({
            left: -index * 800
        }, 1000)
    }
})

//计算移动容器的宽度
$(".imgs-slider").append($(".imgs-slider > div:first-of-type").clone(true));

var r_count = $(".imgs-slider")[0].children.length;
$(".imgs-slider").css({
    width: 180 * r_count
})
//找到所有的span
var spans = _(".spans span");
var r_index = 0;

function r_autoPlay() {
    //右侧
    if (r_index === r_count - 1) {
        r_index = 1;
        $(".imgs-slider").css({
            left: 0
        })
        $(".imgs-slider").animate({
            left: -(r_index) * 180
        })
    } else {
        r_index++;
    }
    $(".imgs-slider").animate({
        left: -r_index * 180
    })
    //切换类名
    toggleClass(r_index);
    // removeClass($(".spans")[r_index],highcolor);
    // addClass($(".spans")[r_index],highcolor);
}

function toggleClass(index) {
    for (var i = 0; i < spans.length; i++) {
        removeClass(spans[i], "highcolor");
    }
    if (index === 2) {
        addClass(spans[0], "highcolor");
    } else {
        addClass(spans[index], "highcolor");
    }
}
setInterval(() => {
    r_autoPlay();
}, 2000)

window.onscroll = function () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollTop >= 700) {
        $(".serach").css({
            left: 0,
            width: "100%",
            position: "fixed",
            marginTop: -30,
            paddingTop: 12,
            backgroundColor: "#fff",
            borderBottom: "2px solid red",
            "z-index": 999
        });

        $(".shopcar").css({
            right: 360,
            zIndex: 999,
            top: 12
        });
    } else {
        console.log("吸顶结束");
        $(".serach").css({
            position: "",
            marginLeft: "",
            marginTop: "",
            backgroundColor: "",
            paddingTop: "",
            border: ""
        });
        $(".shopcar").css({
            right: "",
            zIndex: "",
            top: ""
        });
    }
    if( scrollTop >= 400 && scrollTop <= 700 ) {
        addClass(_(".kill-goods"),"water-active");
    }else{
        removeClass(_(".kill-goods"),"water-active");
    }
    if( scrollTop >= 700 && scrollTop <= 1000 ) {
        addClass(_(".specail-goods"),"water-active");
    }else{
        removeClass(_(".specail-goods"),"water-active");
    }
}





// // 渲染首页商品列表
// ajax({
//         url: "http://localhost/pdd",
//         data: {
//             page: 1,
//             size: 50
//         }
//     })
//     .then(res => {
//         console.log(res);
//         //初始化工具函数  -- 同一的状态管理
//         init(res);
//     })
//     .catch(rej => {
//         console.log(rej);
//     })

// function init(res) {
//     var data = res.goods;
//     //渲染页面
//     renderIndex(data);
// }

// 渲染商品列表
function renderIndex(data) {
    var html = "";
    if (!(typeof data === "object")) return false;
    data.forEach(item => {
        if (!isObject(item)) return false;
        html += `<div class="goods">
        <img src="${item.thumb_url}" alt="">
        <div class="title">
            <span>${item.goods_name}</span>
        </div>
        <div class="price clearAll">
            <div class="left-pric">
                <i>￥</i>
                <span class="group-price">${item.price / 100}</span>
                <span>￥${item.market_price / 100}</span>
            </div>
            <div class="right-pric">
                <span>${item.sales_tip}</span>
            </div>
        </div>
    </div>`;
        document.querySelector(".goods-list").innerHTML = html;
    })
}


//无缝运动
$(".sli-img").append($(".sli-img > div:first-of-type").clone(true));
//计算父元素的宽度
var my_count = $(".sli-img > .show-things").length;
$(".sli-img").css({
    width: my_count * 990
})
var move_count = 0;
// 控制移动的变量
var imgs_isMOVE = true;
var timer1 = null;

function autoMove() {
    if (!imgs_isMOVE) return false;
    clearInterval(timer1);
    animate(rig_slider_imgs, {
        opacity: 0
    }, "swing");
    animate(scroll_box, {
        opacity: 0
    }, "swing");
    timer1 = setInterval(() => {
        move_count++;
        if (2 * move_count === 1980) {
            move_count = 0;
        }
        $(".sli-img").css({
            transform: ` translateX(-${2*move_count}px)`
        })
    }, 30);
}
// autoMove();
var sli_img = _(".sli-img");
scroll_big_img.addEventListener("mouseenter", stopMove)
scroll_big_img.addEventListener("mouseleave", autoMove);

function stopMove() {
    animate(rig_slider_imgs, {
        opacity: 1
    }, "swing");
    animate(scroll_box, {
        opacity: 1
    }, "swing");
    clearInterval(timer1);
}
//自定义事件  鼠标移入事件
var autoMove = new Event("mouseenter");
//自定义鼠标移出事件
var autoLeave = new Event("mouseleave");

scroll_big_img.dispatchEvent(autoLeave);


//点击li的时候村一条cookie 记录当前点击的id

//选择元素
var list = _(".check-goods > ul > li");


//选择商品类型的切换效果
var li_list = [].slice.call(_(".myul li"));
var li_prev = 0;
var li_next = 0;

li_list.forEach((item, index) => {
    item.onmouseenter = function () {
        console.log(this)
        li_prev = li_next;
        li_next = index;

        removeClass(li_list[li_prev], "focus-goods");
        addClass(li_list[li_next], "focus-goods");
    }
})

//发现好货



//拖拽开始
class Drag {
    constructor(options) {
        //选择元素
        this.init(options);
        //移动状态变量
        this.isMove = false;
    }
    init(options) {
        this.chooseEle(options);
        this.fixedvarable();
        this.bindEvent();
    }
    chooseEle(options) {
        for (var attr in options) {
            this[attr + "_ele"] = document.querySelector(options[attr]);
        }
    }
    //判定事件
    bindEvent() {
        on(this.move_box_ele, "mousedown", function () {
            console.log("拖拽开始!");
            //结束元素的运动
            this.sli_img_ele.dispatchEvent(autoMove);
            this.isMove = true;
        }.bind(this))
        on(document.body, "mousemove", function (e) {
            e = e || window.event;
            if (!this.isMove) return false;
            //盒子移动
            var x = e.pageX;

            this.box_slider(x);
            e.preventDefault();

        }.bind(this))
        on(document.body, "mouseup", function () {
            console.log("拖拽结束!");
            this.isMove = false;
            //开启元素的运动
            setTimeout(this.sli_img_ele.dispatchEvent(autoLeave), 1000)
        }.bind(this))
    }
    box_slider(x) {
        var _left = x - this.ancestors_offset._ac_left - this.ancestors_offset._ac_out_left - this.move_box_ele_offset._width / 2;
        //判断边界
        var end_pos = this.boundary(_left);
        this.move_box_ele.style.left = end_pos + "px";

        //计算移动的比例
        this.move_p = {
            x_p: isNaN((end_pos / (this.move_fat_ele_offset._width - this.move_box_ele_offset._width))) ? 1 : end_pos / (this.move_fat_ele_offset._width - this.move_box_ele_offset._width)
        }
        //图片容器跟随移动
        this.sli_img_ele.style.cssText = `width:3960px;transform:translateX(-${ parseInt( this.move_p.x_p * (this.sli_img_ele.offsetWidth -990) ) }px)`;
        //将进度条拉动的距离存到 原本函数上面，防止每次拖拽结束回到0
        move_count = parseInt(parseInt(this.move_p.x_p * (this.sli_img_ele.offsetWidth - 990)) / 2);
        //判断图片容器的移动范围
        if (2 * move_count >= 1980) {
            move_count = 0;
        }
    }
    //边界判断
    boundary(_left) {
        _left = _left <= 0 ? 0 : _left;
        _left = _left >= (this.move_fat_ele_offset._width - this.move_box_ele_offset._width) ? (this.move_fat_ele_offset - this.move_box_ele_offset._width) : _left;
        return _left;
    }
    // 固定参数 为 元素的offsetleft
    fixedvarable() {
        this.ancestors_offset = {
            _ac_left: this.move_box_ele.parentNode.parentNode.offsetLeft,
            _ac_out_left: this.move_box_ele.parentNode.parentNode.parentNode.offsetLeft,
        }
        this.move_box_ele_offset = {
            _width: this.move_box_ele.offsetWidth
        }
        //大长条的长度
        this.move_fat_ele_offset = {
            _width: this.move_fat_ele.offsetWidth
        }
    }
}

new Drag({
    move_box: ".scroll-box",
    move_fat: ".scroll-bar",
    sli_img: ".sli-img"
})


//抢购倒计时
var cs_des = _(".cs-des"),
    cs_timer = _(".timer");
    
function renderTimer(){
    var d = new Date();
    var rush_time;
    if(d.getHours() % 2 === 0){
        rush_time = d.getHours();
    }else{
        rush_time = d.getHours() - 1;
    }
    renderRTB(rush_time);
    setInterval(function () {
        if (!((rush_time + 2) === d.getHours())) return false;
            rush_time += 2;
            if ((rush_time + 2) === d.getHours()) {
                rush_time = rush_time + 2;
                if (rush_time >= 24) {
                    rush_time = 0;
                }
                renderRTB(rush_time);
            }
    }, 1000);
}
function  renderRTB(rush_time){
    cs_des.children[0].innerHTML = addZero(rush_time);
   setInterval(function(){
    disappeartime({
        start:rush_time,
        end:rush_time+2
    })
   },1000)
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
    cs_timer.children[0].innerHTML = hour;
    cs_timer.children[1].innerHTML = min;
    cs_timer.children[2].innerHTML = sec;
    if (Number(hour) === 0 && Number(min) === 0 && Number(sec) === 0) {
        if (confirm("本场次抢购已经结束")) {
            location.reload(true);
        }
    }
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

//回到顶部
var fixed_list = _(".water").children[0].children;

Array.from(fixed_list).forEach( (item,index) => {
    if(index === 0){
        item.onclick = function(){
            window.scrollTo({ 
                top: 400, 
                behavior: "smooth" 
            });
        }
    }
    if(index === 1){
        item.onclick = function(){
            window.scrollTo({ 
                top: 700, 
                behavior: "smooth" 
            });
        }
    }
    if(index === 2){
        item.onclick = function(){
            window.scrollTo({ 
                top: 0, 
                behavior: "smooth" 
            });
        }
    }
})


// 输入框搜索请求百度jsonp接口
function jsonp(url,data,cb_fn_name,gb_fn_name,callback){
    var _default = {};
    _default[cb_fn_name ] = gb_fn_name;
    data = data || {};
    data = extend(_default,data);
    window[data[ cb_fn_name]] = function(res){
        callback(res);
    }
    var script = document.createElement("script");
    script.src = toUrlData(url,data);
    document.body.appendChild(script);
    script.onload = function(){
        this.remove();
    }
 }


 _("#int-info").oninput = function(){
    jsonp("https://www.baidu.com/sugrec",{
        prod:"pc",
        sugsid : "1423,31169,21125,30839,31187,30823,22159",
        wd :this.value
     },"cb","hello",function(res){
        renderSerachList(res);
     })
 }
 _("#int-info").onfocus = function(){
    _(".serach-list").style.display = "block";
 }
 _("#int-info").onblur = function(){
    _(".serach-list").style.display = "none";
 }
 function renderSerachList(data){
     //不是对象
     if(!isObject(data)) return false;
    data = data.g;
    //不是数组
    if(! (data instanceof Array)) return false;
    var str = "";
    for(var i = 0 ;i<data.length;i++){
        str += ` <li>${data[i].q}</li>`; 
    }
    _(".mu-list-ul").innerHTML = str;
 }