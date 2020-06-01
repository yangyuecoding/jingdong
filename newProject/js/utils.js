//随机颜色函数 ---全部随机
//author : yangyi 
function randomColor() {
    var r = parseInt(Math.random() * 256);
    var g = parseInt(Math.random() * 256);
    var b = parseInt(Math.random() * 256);
    var end_color = "rgb(" + r + "," + g + "," + b + ")";
    // console.log(end_color);
    return end_color;
}
//选择大方向底色的随机颜色
function randomSelectColor(color) {
    var r = color === "red" ? 255 : parseInt(Math.random() * 256);
    var g = color === "green" ? 255 : parseInt(Math.random() * 256);
    var b = color === "blue" ? 255 : parseInt(Math.random() * 256);
    var end_color = " rgb(" + r + "," + g + "," + b + ")";
    return end_color;
}

//多class 事件委托
function onClass(ele, type, ele_select, callback) {
    // 用参数的长度来判断触发事件委托，还是普通的时间监听
    if (arguments.length === 4 && typeof ele_select === "string") {
        //触发事件委托
        ele.addEventListener(type, function (evt) {
            //兼容事件对象
            var e = evt || event;
            //兼容目标时间对象
            var target = e.target || e.srcElement;
            var node = target;
            // console.log(node);
            //吧选择器的第一位拿出来比较看是  id  class  还是 标签
            var ele_select_first = ele_select.slice(0, 1);
            // console.log(ele_select_first);
            var ele_select_body = null;
            //获取到 选择器的类型
            var ele_select_type = null;
            switch (ele_select_first) {
                case ".":
                    // 获取到除过第一位的选择器内容
                    ele_select_type = "className";
                    ele_select_body = ele_select.slice(1);
                    break;
                case "#":
                    ele_select_type = "id";
                    ele_select_body = ele_select.slice(1);
                    break;
                default:
                    ele_select_type = "nodeName";
                    ele_select_body = ele_select;
                    break;
            }
            // console.log(ele_select_body);
            //找到代理方就不向上冒泡了
            while (node !== ele) {
                // console.log(node);
                if (ele_select_type === "className") {
                    var reg = new RegExp(ele_select_body, "g");
                    if (reg.test(node[ele_select_type])) {
                        callback.call(node, e);
                        break;
                    }
                } else {
                    if (node[ele_select_type] === (ele_select_type === "nodeName" ? ele_select_body.toUpperCase() : ele_select_body)) {
                        callback.call(node, e);
                        break;
                    }
                }
                node = node.parentNode;
            }
        });
        //return false 相当于终止器   我进入到上面的事件委托这个事情  后面的逻辑直接不用再去判定了
        return false;
    }
    ele.addEventListener(type, ele_select);
}




//事件委托和事件监听封装 --- 非IE使用
function on(ele, type, ele_select, callback) {
    // 用参数的长度来判断触发事件委托，还是普通的时间监听
    if (arguments.length === 4 && typeof ele_select === "string") {
        //触发事件委托
        ele.addEventListener(type, function (evt) {
            //兼容事件对象
            var e = evt || event;
            //兼容目标时间对象
            var target = e.target || e.srcElement;
            var node = target;
            // console.log(node);
            //吧选择器的第一位拿出来比较看是  id  class  还是 标签
            var ele_select_first = ele_select.slice(0, 1);
            // console.log(ele_select_first);
            var ele_select_body = null;
            //获取到 选择器的类型
            var ele_select_type = null;
            switch (ele_select_first) {
                case ".":
                    // 获取到除过第一位的选择器内容
                    ele_select_type = "className";
                    ele_select_body = ele_select.slice(1);
                    break;
                case "#":
                    ele_select_type = "id";
                    ele_select_body = ele_select.slice(1);
                    break;
                default:
                    ele_select_type = "nodeName";
                    ele_select_body = ele_select;
                    break;
            }
            // console.log(ele_select_body);
            //找到代理方就不向上冒泡了
            while (node !== ele) {
                // console.log(node);
                if (node[ele_select_type] === (ele_select_type === "nodeName" ? ele_select_body.toUpperCase() : ele_select_body)) {
                    // if(node[ele_select_type] === ele_select_body){
                    // callback 回调函数指向了window这里很有迷惑，我们用call 改变this的指向到当前的的事件委托者  node
                    // callback(e,node);
                    callback.call(node, e);
                    break;
                }
                node = node.parentNode;
            }
        });
        //return false 相当于终止器   我进入到上面的事件委托这个事情  后面的逻辑直接不用再去判定了
        return false;
    }
    ele.addEventListener(type, ele_select);
}


//事件委托和事件监听兼容性写法
function onAll(ele, type, ele_select, callback) {
    // 用参数的长度来判断触发事件委托，还是普通的时间监听 
    if (arguments.length === 4 && typeof ele_select === "string") {
        //触发事件委托
        if (typeof ele.addEventListener === "function") {
            ele.addEventListener(type, function (evt) {
                var e = evt || event;
                common_func(e, ele, type, ele_select, callback);
            });
            //return false 相当于终止器   我进入到上面的事件委托这个  后面的逻辑直接不用再去判定了
            return false;
        } else {
            ele.attachEvent("on" + type, function (evt) {
                var e = evt || event;
                common_func(e, ele, type, ele_select, callback);
            });
        }
    } else {
        if (typeof ele.addEventListener === "function") {
            ele.addEventListener(type, ele_select);
            return false;
        }
        ele.attachEvent("on" + type, ele_select);
    }
}
//IE和非ie兼容公共函数
function common_func(e, ele, type, ele_select, callback) {
    var target = e.target || e.srcElement;
    var node = target;
    //吧选择器的第一位拿出来比较看是  id  class  还是 标签
    var ele_select_first = ele_select.slice(0, 1);
    var ele_select_body = null;
    //获取到 选择器的类型
    var ele_select_type = null;
    switch (ele_select_first) {
        case ".":
            // 获取到除过第一位的选择器内容
            ele_select_type = "className";
            ele_select_body = ele_select.slice(1);
            break;
        case "#":
            ele_select_type = "id";
            ele_select_body = ele_select.slice(1);
            break;
        default:
            ele_select_type = "nodeName";
            ele_select_body = ele_select;
            break;
    }
    //找到代理方就不向上冒泡了
    while (node !== ele) {
        if (node[ele_select_type] === (ele_select_type === "nodeName" ? ele_select_body.toUpperCase() : ele_select_body)) {
            // if(node[ele_select_type] === ele_select_body){
            // callback 回调函数指向了window这里很有迷惑，我们用call 改变this的指向到当前的的事件委托者  node
            // callback(e,node);
            callback.call(node, e);
            break;
        }
        node = node.parentNode;
    }
}


function hack() {
    // 事件监听兼容写法
    //ele --- dom对象   type --- 事件类型    ----callback 事件函数
    if (typeof ele.addEventListener === "function") {
        //非IE
        ele.addEventListener(type, callback);
    } else {
        // IE
        ele.attachEvent("on" + type, callback);
    }
    // 属性的兼容
    if (typeof getComputedStyle === "function") {
        res = getComputedStyle(dom);
    } else {
        res = dom.currentStyle;
    }

    // 阻止默认事件 ---- e 为兼容后的事件对象event
    if (typeof e.preventDefault === "function") {
        //非IE
        e.preventDefault();
    } else {
        e.returnValue = true;
    }
    //阻止冒泡事件
    if (typeof e.stopPropagation === "function") {
        e.stopPropagation()
    } else {
        e.cancelBubble = true;
    }
}

//选择元素
function _(box) {
    var ele = document.querySelectorAll(box);
    if (ele === null) {
        return ele;
    } else if (ele.length === 1) {
        return ele[0];
    } else {
        return [].slice.call(ele);
    }
}
//删除类名
function removeClass(ele, className) {
    var reg = new RegExp("\\s?" + className, "g");
    ele.className = ele.className.replace(reg, "");
    return ele.className;
}

//添加类名
function addClass(ele, className) {
    var reg = new RegExp("\\s?" + className, "g");
    if (reg.test(ele.className)) {
        return false;
    }
    ele.className += " " + className;
    return ele.className;
}

//promise 改写
function ajaxGet(url, data, isJson = true) {
    return new Promise(function (resolve, reject) {
        //兼容IE低版本和标准浏览器
        var xhr = null;
        if (typeof XMLHttpRequest === "function") {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        //因为为的data在调用函数的时候已经进行了一次对象的判断，所以这里不用再进行判断了，并且当我没有传入地址栏参数的时候，我只是简单的获取数据
        //直接写地址栏信息即可
        url = toUrlData(url, data);
        xhr.open("GET", url);
        xhr.send(null);
        xhr.onreadystatechange = function () {
            //判断，当我的ajax的状态码为4，和http的状态码为200系列 则代表成功获取
            if (xhr.readyState === 4) {
                if (/^2\d{2}$/.test(xhr.status)) {
                    resolve(isJson ? JSON.parse(xhr.responseText) : xhr.responseText);
                } else {
                    reject(xhr.status);
                }

            }
        }
    })
}

function isObject(obj) {
    return (typeof obj === "object" && obj !== null && obj.constructor && obj.constructor === Object);
}
//表单验证的时候；参数为./demo.php?key=value&key1=value1
// function toUrlData(data,url){
//     if(isObject(data)){
//         var str = "";
//         for(var attr in data){
//             str += "&"+attr+"="+data[attr];
//         }
//         str = str.slice(1);
//         url +="?"+str; 
//     }
//     return url;
// }


function toUrlData(url, data, method) {
    if (!isObject(data)) return false;
    method = method || "get";
    //url 是一段字符串  data  是一个对象
    var str = "";
    for (var attr in data) {
        str += "&" + attr + "=" + data[attr];
    }
    str = str.slice(1);
    if (method.toUpperCase() === "POST") {
        return str;
    }
    url += "?" + str;
    return url;
}
//post请求
function ajaxPost(url, data, isJson = true) {
    return new Promise(function (resolve, reject) {
        var xhr = null;
        if (typeof XMLHttpRequest === "function") {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.open("POST", url);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        data = toUrlData(url, data, "post");
        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (/^2\d{2}$/.test(xhr.status)) {
                    resolve(isJson ? JSON.parse(xhr.responseText) : xhr.responseText);
                } else {
                    reject(xhr.status);
                }
            }
        }
    })
}


function ajax(options) {
    if (!isObject(options)) return false;
    return new Promise(function (resolve, reject) {
        var _default = {
            method: "get", //默认请求方式
            url: "",
            data: {},
            type: "json", //请求到文本的解析方式
            complete: function () { //完成的的会调
                console.log("请求完成");
            },
            success: function (res) { //请求成功的会调
                console.log(res);
            },
            error: function (res) { //请求成功的会调
                console.log(res);
            },
            bindThis: {
                name: "yy"
            },
            status: {
                200: function (res) {
                    console.log(res, "请求成功");
                },
                404: function (res) {
                    console.log(res, "请求失败")
                }
            }
        }
        options = extend(_default, options);
        //修改3个会调函数的this指向
        if (options.bindThis) {
            var fn_list = ["complete", "success", "error"];
            fn_list.forEach((item) => {
                options[item] = options[item].bind(options.bindThis);
            })
        }
        options.method = options.method.toLowerCase();
        //兼容请求体型
        var xhr = null;
        if (typeof XMLHttpRequest === "function") {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        options.method === "get" ? xhr.open(options.method, toUrlData(options.url, options.data, options
            .method)) : xhr.open(options.method, options.url);
        if (options.method === "post") {
            xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            xhr.send(toUrlData(options.url, options.data, options.method));
        } else {
            xhr.send(null);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                options.complete();
                if (/2\d{2}/.test(xhr.status)) {
                    try {
                        var data = options.type === "json" ? JSON.parse(xhr.responseText) : xhr
                            .responseText;
                        // options.success && options.success(data);
                        resolve(data);
                    } catch (e) {
                        // options.error(e);
                        reject(e);
                    }
                } else {
                    // options.error("请求失败");
                    reject("请求失败");
                }
                if (isObject(options.status)) {
                    typeof options.status[xhr.status] === "function" ? options.status[xhr.status](xhr
                        .status) : "";
                }
            }
        }
    })
}

function extend() {
    var target = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
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
//缓冲运动  根据iNow  的位置，不断重新计算速度
function animate(ele, options, movement_mode, callback) {
    //获取元素当前的位置  初始是默位置 ，这个之不断该表
    for (var attr in options) {
        options[attr] = {
            iNow: attr === "opacity" ? 100 * getStyle(ele, attr) : parseInt(getStyle(ele, attr)),
            target: attr === "opacity" ? 100 * options[attr] : options[attr]
        }
    }
    // speed 参数可以不传，默认为5
    var speed = speed ? speed : 3;
    clearInterval(ele.timer);

    ele.timer = setInterval(function () {
        for (var attr in options) {
            // 还得判断速度的方向问题  当目标 大于 初始 即是往正方向走， 速度应该为正  否则速度为负  100 -- 200 初始位置不断 +5    200 -100    初始位置不断-5
            speed = options[attr].target > options[attr].iNow ? Math.abs(speed) : -Math.abs(speed);
            //movement_mode  控制运动的方式  swing  缓冲运动  constant  匀速运动   还得判断 大于0 和小于0 的因素  
            //大于0  随着越除越小  最后 一直到了0.0几，这个时候就需要  向上取整 ，保证每次运动都为1，否则最后很慢达到目标  小于0 一样，不过需要向下取整保证渠道的是 -1
            if (movement_mode && movement_mode === "swing") {
                speed = speed >= 0 ? Math.ceil((options[attr].target - options[attr].iNow) / 20) : Math.floor((options[attr].target - options[attr].iNow) / 20);
            }
            //判断边界 当目标 - 当前小于速度，则代表 运动结束，再推一把  
            if (Math.abs(Math.abs(options[attr].target) - Math.abs(options[attr].iNow)) <= Math.abs(speed)) {
                if (attr === "opacity") {
                    ele.style[attr] = options[attr].target / 100;
                } else {
                    ele.style[attr] = options[attr].target + "px";
                }
                //因为只有一个定时器，同时执行3个运动，最先到达的会直接关闭定时器
                //谁先到了就删除这个属性
                delete options[attr];
                //如果还能循环，我就不关闭定时器
                for (var attr in options) {
                    return false;
                }
                clearInterval(ele.timer);
                callback && callback();
            } else {
                if (attr === "opacity") {
                    options[attr].iNow += speed;
                    ele.style[attr] = options[attr].iNow / 100;
                } else {
                    options[attr].iNow += speed;
                    ele.style[attr] = options[attr].iNow + "px";
                }
            }
        }
    }, 30)
}

function removeCookie(name, options) {
    console.log(name, options);
    //options 传递有两种格式  object   string   当为对象的时候需要合并对象，，否则将path传入  ，并返回一个带有expires值的独享，重新设置
    Cookie(name, "", isObject(options) ? extend(options, {
        expires: -1
    }) : {
        path: options,
        expires: -1
    })
}

function Cookie(name, value, options) {
   
    if (arguments.length > 1 && typeof value === "string") {
        //设置cookie
        if (!isObject(options)) {
            options = {}
        }
        // console.log(name,value,options);
        if (typeof options.expires === "number") {
            var d = new Date();
            d.setDate(d.getDate() + options.expires);
            console.log(options.expires);
        }
        console.log(1);
        return document.cookie = [
            name + "=" + value,
            typeof options.domain === "string" ? ";domain=" + options.domain : "",
            typeof options.path === "string" ? ";path=" + options.path : "",
            typeof options.expires === "number" ? ";expires=" + d : "",
        ].join("");
    }
    //获取cookie
    var cookie_str = document.cookie;
    //  console.log(cookie_str);
    var cookie_arr = cookie_str.split("; ");
    for (var i = 0; i < cookie_arr.length; i++) {
        if (cookie_arr[i].split("=")[0] === name) {
            return cookie_arr[i].split("=")[1];
        }
    }
}


//全封装放大镜
class Magnifier {
    constructor(ele, res, options) {
       
        this.container = this.chooseEle(ele);
        this.res = res;
        this.options = options;
        console.log(this.options);
        //是否移入的状态
        this.isMove = false;
        this.init();
    }
    chooseEle(ele) {
        ele = document.querySelectorAll(ele);
        if (ele === null) {
            return false;
        } else if (ele.length === 1) {
            return ele[0];
        } else {
            return [].slice.call(ele);
        }
    }
    init() {
        //创建左侧图片盒子
        this.renderSmall();
        //创建裁剪盒子
        this.renderCutting();
        //创建右侧盒子
        this.renderBig();
        //创建图片盒子
        this.renderImg();
        //合并dom
        this.concatDom();
        //绑定事件
        this.bindEvent();
        this.fixedvariable();
    }
    renderSmall() {
        //创建左侧smallbox
        this.small_box = document.createElement("div");
        //正方形吧
        this.small_box.style.cssText = `
            cursor: pointer;
            box-sizing:border-box;
            width: ${this.options.small_box ? this.options.small_box : 350 }px;
            height:${this.options.small_box ? this.options.small_box : 350 }px;
            border: 1px solid #999;
            background: url(${typeof this.res[0][7] === "string"?this.res[0][7]:"https://image1.suning.cn/uimg/b2c/newcatentries/0070067457-000000000106196180_1_800x800.jpg" }) no-repeat;
            background-size: contain;
        `;
    }
    renderCutting() {
        //创建左侧裁剪盒子
        this.cutting_box = document.createElement("div");
        this.cutting_box.style.cssText = `
            width: ${this.options.cutting_box? this.options.cutting_box:100}px;
            height:${this.options.cutting_box? this.options.cutting_box:100}px;
            display:none;
            background:#ccc;
            opacity:0.5;
            position:absolute;
        `;
        //将左侧的裁剪盒子添加到左侧大盒子去
        this.small_box.appendChild(this.cutting_box);
    }
    renderBig() {
        //创建右侧裁剪盒子
        this.big_box = document.createElement("div");
        this.big_box.style.cssText = `
            box-sizing:border-box;
            position: absolute;
            width: ${this.options.big_box?this.options.big_box:600}px;
            height:${this.options.big_box?this.options.big_box:600}px;
            top: 0;
            left: ${this.options.small_box && this.options.gap ? this.options.small_box + this.options.gap:this.options.small_box}px;
            border: 1px solid #999;
            display:none;
            overflow:hidden;
        `;  
    }
    renderImg() {
        //创建右侧图片
        this.img_box = document.createElement("img");
        this.img_box.style.cssText = `
            width: 100%;
            position:absolute;
          `;
        this.img_box.src = `${typeof this.res[0][7] === "string"?this.res[0][7]:"https://image1.suning.cn/uimg/b2c/newcatentries/0070067457-000000000106196180_1_800x800.jpg" }`;
        //将图片盒子放入到大图片中
        this.big_box.appendChild(this.img_box);
    }
    concatDom() {
        //合并dom对象
        this.container.appendChild(this.small_box);
        this.container.appendChild(this.big_box);
    }
    bindEvent() {
        //拆分不能炫技，不拆分了
        //开始功能

        //鼠标移入功能
        on(this.small_box, "mouseenter", function () {
            this.isMove = true;
            //显示裁剪盒子  显示右侧大图
            this.toggle(this.isMove);
        }.bind(this));

        //鼠标移动中
        on(this.small_box, "mousemove", this.cutting_move.bind(this))

        //鼠标移出
        on(this.small_box, "mouseleave", function () {
            this.isMove = false;
            //显示裁剪盒子  显示右侧大图
            this.toggle(this.isMove);
        }.bind(this))
    }
    cutting_move(e){
        //获取鼠标位置
        var _left = e.pageX - this.small_box_offset._left - (this.cutting_box_offset._width / 2);
        var _top = e.pageY - this.small_box_offset._top - (this.cutting_box_offset._heiht / 2);
        
        //判断边界
        var pos = this.cutting_boundary(_left,_top);
        this.cutting_box.style.left = pos.x + "px";
        this.cutting_box.style.top = pos.y + "px";
        
        //小图移动大图跟随
        this.big_move(pos.x,pos.y);
    }
    //裁剪盒子移动边界
    cutting_boundary(x,y){
       x = (x <= 0)? 0 : x;
       x = x >= (this.small_box_offset._width - this.cutting_box_offset._width)? this.small_box_offset._width - this.cutting_box_offset._width:x;
       y = (y <= 0) ?0:y;
       y = y >= (this.small_box_offset._heiht - this.cutting_box_offset._heiht)?(this.small_box_offset._heiht - this.cutting_box_offset._heiht):y;
        return {
            x:x,
            y:y
        }
    }
    big_move(x,y){
        //获取裁剪盒子在small_boc里面移动的百分比   
        this.move_p = {
            _left_p:x / (this.small_box_offset._width - this.cutting_box_offset._width),
            _top_p: y / (this.small_box_offset._width - this.cutting_box_offset._width),
        }
        //放大背景图片
        this.img_box.style.width = this.bebig.end_width +"px";
        this.img_box.style.height = this.bebig.end_height +"px";
        
        //大图跟随
        this.img_box.style.left = -this.move_p._left_p * (this.bebig.end_width -  this.big_offset._width) +"px";
        this.img_box.style.top = -this.move_p._top_p * (this.bebig.end_height - this.big_offset._height) +"px";
    }
    //固定参数
    fixedvariable(){
        
        //左侧大图的宽高 位置   最大的父元素有定位
        this.small_box_offset = {
            _width:this.small_box.offsetWidth,
            _heiht:this.small_box.offsetHeight,
            _left:this.small_box.parentNode.parentNode.parentNode.offsetLeft,
            _top:this.small_box.parentNode.parentNode.parentNode.offsetTop
        }
        console.log(this.small_box_offset);
        //裁剪盒子的宽高
        this.cutting_box_offset = {
            _width:parseInt(getStyle(this.cutting_box,"width")),
            _heiht:parseInt(getStyle(this.cutting_box,"height"))
        }
        //大图片的宽高
        this.big_offset = {
            _width:parseInt(getStyle(this.big_box,"width")),
            _height:parseInt(getStyle(this.big_box,"height")),
        }
        //计算从裁剪盒子到右侧背景图放大了 几倍
        this.bebig = {
            big_width: this.big_offset._width / this.cutting_box_offset._width,
            big_height: this.big_offset._height / this.cutting_box_offset._heiht,
            // 放大结果
            end_width: (this.big_offset._width / this.cutting_box_offset._width) * this.small_box_offset._width,
            end_height: (this.big_offset._height / this.cutting_box_offset._heiht) * this.small_box_offset._heiht
        }
        
    }
    toggle(flag) {
        this.cutting_box.style.display = flag ? "block" : "none";
        this.big_box.style.display = flag ? "block" : "none";
    }
}