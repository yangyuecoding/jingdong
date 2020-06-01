/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-29 11:49:32
 * @LastEditors: YangYi
 * @LastEditTime: 2020-06-01 17:21:31
 */

//获取等号后面的数据
var href = location.href.slice(location.href.indexOf("=") + 1);

//选择购物车元素
var shopcar = _(".shopcar");
//获取由于版心居中无法获取两遍的宽度
var _width = (window.innerWidth - parseInt(getStyle(_(".mycont"), "width"))) / 2;
//获取购物车商品数量
var shopcar_num = _(".shopcar-num");
//选择元素
var register = _(".user-register"),
    login = _(".user-login");
//移动完成的状态  只有移动到达终点，才能发送ajax请求
var isFinshed = false;
window.onload = function () {
    // 判断是否有用户登录信息
    regUserName();
    //渲染数据   还需要做一件事件 ，每一次渲染完了，如果登录了，请求下这个用户的购物车的数量
    getgoodsDetails();
}

function regUserName() {
    if (Cookie("token")) {
        addClass(login, "hideTips");
        removeClass(register, "high");
        register.href = "javascript:";
        register.innerHTML = Cookie("token");
        

        //有cookie渲染购物车数量
        rendershopcarnum();
    } else {
        removeClass(login, "hideTips");
        addClass(register, "high");
        register.innerHTML = "欢迎注册";
    }
}

//页面加载发送一次请i去 渲染购物车的数量

function rendershopcarnum() {
    //发送请求 渲染购物车的商品数量
    ajax({
            url: "../api/createHtml/rendershopcar.php",
            data: {
                username: Cookie("token")
            }
        })
        .then(res => {
            console.log(res.body.data);
            //渲染购物车  重要点  曾经重复添加了购物车的数量  
            //两次判断 先算出来总的商品总数
            //再把每次因为传了innerhtml造成了重复加法 的其他的除过这个id的商品数量剪掉
        
            //     var data = 0;
        //     for(var i = 0 ;i < res.body.data.length;i++){
        //          data += Number(res.body.data[i].goods_count);

        //     }
        //     for(var i = 0 ;i < res.body.data.length;i++){
        //         if(!(res.body.data[i].goods_id === href)){
        //             data -= Number(res.body.data[i].goods_count);
        //         }
        //    }
        //    shopcar_num.innerHTML = data;
        shopcar_num.innerHTML = res.body.data.reduce( (data,item) =>{ 
            return data += Number(item.goods_count);
        },0)
        })
        .catch(rej => {
            console.log(rej);
        })
}

function getgoodsDetails() {
    ajax({
            url: "../api/getgoods/goodsdetails.php",
            data: {
                id: href
            }
        })
        .then(res => {
            //代表成功了
            if (res.code === 200) {
                renderHtml(res.data);
                //面向对象动态生成放大镜
                //放大镜主容器  
                //@params ele  dom元素 放大镜主容器
                //@params data object  后台请求的数据
                //@params options object 自定时放大镜的配置项 可以修改左侧和右侧的大小 以及连个间隔
                let mangifier = new Magnifier(".manger_box", res.data, {
                    //左侧盒子大小
                    small_box: 350,
                    //右侧盒子自定义大小
                    big_box: 500,
                    //裁剪盒子
                    cutting_box: 200,
                    //两个盒子的间隔
                    gap: 10
                })
            }
        })
        .catch(rej => {
            console.log(rej);
        })
}

function renderHtml(res) {
    //渲染商品明细
    var html = "";
    html += `
    <div class="title-tips">
    商品详情页
        </div>
        <div class="goods-detail clearAll">
            <div class="manger_box">
            </div>
            <!-- 右侧商品信息 -->
            <div class="sell-info">
                <div class="title">
                    <a href="javascript:"> ${res[0][1]}</a>
                </div>
                <div class="price">
                    <span>￥</span>
                    <span id="shop-price">${res[0][2]}</span>
                </div>
                <!-- 根据等级修改价格 -->
                <div class="level clearAll">
                    <ul>
                        <li class="level1 active">基础版</li>
                        <li class="level2">旗舰版</li>
                        <li class="level3">奢华版</li>
                    </ul>
                </div>
                <div class="goods-num clearAll">
                <input type="text" id="goods-num" value="1">
                <div class="btns">
                    <button class="add">+</button>
                <button class="reduce">-</button>
                </div>
            </div>
                <div class="ok">
                    <button class="toBuy">立即购买</button>
                    <button class="toCar">加入购物车</button>
                </div>
            </div>
        </div>
        <!-- 详情页 -->
        <div class="sell-goods-info">
            <!-- 详情提示 -->
            <div class="goods-sell-info clearAll">
                <ul class="clearAll">
                    <li class="tip_ac">商品详细信息</li>
                    <li>相关商品</li>
                </ul>
            </div>
            ${res[0][6]}
        </div>
    </div>
    `;
    _(".myMain").innerHTML = html;


    //获取价格
    var price = _("#shop-price");
    var money = price.innerHTML;
    //获取input的值
    var num = _("#goods-num");
    //全局同一管理 商品的数量
    var count = 1;
    //增加数量
    on(_(".add"), "click", function () {
        count++;
        if (count >= 1) {
            _(".reduce").style.display = "block";
        }
        price.innerHTML = (count * money).toFixed(2);
        num.value = count;

    })
    //减少数量
    on(_(".reduce"), "click", function () {
        if (num.value == 1) {
            // count = 1;
            this.style.display = "none";
        } else {
            count--;
        }
        price.innerHTML = (count * money).toFixed(2);
        num.value = count;
    })

    //自定义事件先触发一次判断
    var touchZ = new Event("click");
    _(".reduce").dispatchEvent(touchZ);

    //触发购物车特效
    on(_(".toCar"), "click", function (e) {

        //先判断用户是否登录
        if (!Cookie("token")) {
            if (confirm("请先登!")) {
                location.replace("./login.html");
            }
            return false;
        }
        //购物车移动特效
        shopcarMove.call(this, e);
        // rendershopcarnum();
    })
}

function shopcarMove(e) {

    var x1 = e.pageX,
        y1 = e.pageY,
        x2 = _width + shopcar.offsetLeft,
        y2 = shopcar.parentNode.offsetTop,
        x3 = x2 - 5,
        y3 = y2 - 2;
    var a = -((y2 - y3) * x1 - (x2 - x3) * y1 + x2 * y3 - x3 * y2) / ((x2 - x3) * (x1 - x2) * (x1 - x3));
    var b = ((y2 - y3) * x1 * x1 + x2 * x2 * y3 - x3 * x3 * y2 - (x2 * x2 - x3 * x3) * y1) / ((x2 - x3) * (x1 - x2) * (x1 - x3));
    var c = ((x2 * y3 - x3 * y2) * x1 * x1 - (x2 * x2 * y3 - x3 * x3 * y2) * x1 + (x2 * x2 * x3 - x2 * x3 * x3) * y1) / ((x2 - x3) * (x1 - x2) * (x1 - x3));
    //创建一个盒子 
    var div = document.createElement("div");
    div.style.left = x1 + "px";
    div.style.top = y1 + "px";
    div.className = "shopcar_color";
    document.body.appendChild(div);

    //购物车移动

    var timer = setInterval(() => {
        // 横坐标匀速运动
        x1 += 10
        // 纵坐标按照抛物线公式代入x1计算就行
        y1 = a * x1 * x1 + b * x1 + c
        div.style.left = x1 + 'px'
        div.style.top = y1 + 'px'
        if (x1 >= x2) {
            // 清除定时器
            clearInterval(timer)
            // div移除
            div.remove()
            // 购物车数量  上当前数量
            shopcar_num.innerHTML = Number(_("#goods-num").value) + Number(shopcar_num.innerHTML);
            //移动成功了  再发送ajax请求
            //渲染购物车  重要点  曾经重复添加了购物车的数量  
            //两次判断 先算出来总的商品总数
            //再把每次因为传了innerhtml造成了重复加法 的其他的除过这个id的商品数量剪掉
            ajax({
                url: "../api/createHtml/rendershopcar.php",
                data: {
                    username: Cookie("token")
                }
            })
            .then( res=>{
                var data = 0;
                for(var i = 0 ;i < res.body.data.length;i++){
                    data += Number(res.body.data[i].goods_count);

                }
                for(var i = 0 ;i < res.body.data.length;i++){
                    if(!(res.body.data[i].goods_id === href)){
                        data -= Number(res.body.data[i].goods_count);
                    }
            }
                    console.log(data);
                ajax({
                    url: "../api/handlegoods/addgoods.php",
                    data: {
                        username: Cookie("token"),
                        goods_id: href,
                        goods_count: data+ Number(_("#goods-num").value)
                    }
                })
                .then(res => {
                    console.log(res)
                })
                .catch(rej => {
                    console.log(rej)
                })
                    // shopcar_num.innerHTML = data;
            })
            .catch(rej => {
                console.log(rej);
            })
       
           
           
            // ajax({
            //         url: "../api/handlegoods/addgoods.php",
            //         data: {
            //             username: Cookie("token"),
            //             goods_id: href,
            //             goods_count: shopcar_num.innerHTML
            //         }
            //     })
            //     .then(res => {
            //         console.log(res)
            //     })
            //     .catch(rej => {
            //         console.log(rej)
            //     })
        }
    }, 30)
}

//事件委托绑定前往购物车页面  为了偷懒，就不在渲染之后写两个  事件监听了
onClass(document.body,"click",".toBuy",function(){
    location.replace("./shopcar.html");
})











//ES5动态生成放大镜   
//dom元素可以通过模板字符串来创建  只有图片资源必须通过请求来获取到
// function Magnifier(net_res,options){
//     //存一下网络请求下来的数据
//     this.data = net_res;
//     //options为自定义配置项  
//     //可以配置左、右侧图片、盒子的大小，间距
//     this.options = options;
//     this.init();
// }
// Magnifier.property = {
//     constructor:Magnifier,
//     init:function(){
//         console.log(this);
//     }
// }

// //全封装放大镜
// class Magnifier {
//     constructor(ele, res, options) {
//         this.container = this.chooseEle(ele);
//         this.res = res;
//         this.options = options;
//         //是否移入的状态
//         this.isMove = false;
//         this.init();
//     }
//     chooseEle(ele) {
//         ele = document.querySelectorAll(ele);
//         if (ele === null) {
//             return false;
//         } else if (ele.length === 1) {
//             return ele[0];
//         } else {
//             return [].slice.call(ele);
//         }
//     }
//     init() {
//         //创建左侧图片盒子
//         this.renderSmall();
//         //创建裁剪盒子
//         this.renderCutting();
//         //创建右侧盒子
//         this.renderBig();
//         //创建图片盒子
//         this.renderImg();
//         //合并dom
//         this.concatDom();
//         //绑定事件
//         this.bindEvent();
//         this.fixedvariable();
//     }
//     renderSmall() {
//         //创建左侧smallbox
//         this.small_box = document.createElement("div");
//         //正方形吧
//         this.small_box.style.cssText = `
//             cursor: pointer;
//             box-sizing:border-box;
//             width: ${this.options.small_box ? this.options.small_box : 350 }px;
//             height:${this.options.small_box ? this.options.small_box : 350 }px;
//             border: 1px solid #999;
//             background: url(${typeof this.res[0][7] === "string"?this.res[0][7]:"https://image1.suning.cn/uimg/b2c/newcatentries/0070067457-000000000106196180_1_800x800.jpg" }) no-repeat;
//             background-size: contain;
//         `;
//     }
//     renderCutting() {
//         //创建左侧裁剪盒子
//         this.cutting_box = document.createElement("div");
//         this.cutting_box.style.cssText = `
//             width: 100px;
//             height:100px;
//             display:none;
//             background:#ccc;
//             opacity:0.5;
//             position:absolute;
//         `;
//         //将左侧的裁剪盒子添加到左侧大盒子去
//         this.small_box.appendChild(this.cutting_box);
//     }
//     renderBig() {
//         //创建右侧裁剪盒子
//         this.big_box = document.createElement("div");
//         this.big_box.style.cssText = `
//             box-sizing:border-box;
//             position: absolute;
//             width: ${this.options.big_box?this.options.big_box:600}px;
//             height:${this.options.big_box?this.options.big_box:600}px;
//             top: 0;
//             left: ${this.options.small_box && this.options.gap ? this.options.small_box + this.options.gap:this.options.small_box}px;
//             border: 1px solid #999;
//             display:none;
//             overflow:hidden;
//         `;  
//     }
//     renderImg() {
//         //创建右侧图片
//         this.img_box = document.createElement("img");
//         this.img_box.style.cssText = `
//             width: 100%;
//             position:absolute;
//           `;
//         this.img_box.src = `${typeof this.res[0][7] === "string"?this.res[0][7]:"https://image1.suning.cn/uimg/b2c/newcatentries/0070067457-000000000106196180_1_800x800.jpg" }`;
//         //将图片盒子放入到大图片中
//         this.big_box.appendChild(this.img_box);
//     }
//     concatDom() {
//         //合并dom对象
//         this.container.appendChild(this.small_box);
//         this.container.appendChild(this.big_box);
//     }
//     bindEvent() {
//         //拆分不能炫技，不拆分了
//         //开始功能

//         //鼠标移入功能
//         on(this.small_box, "mouseenter", function () {
//             this.isMove = true;
//             //显示裁剪盒子  显示右侧大图
//             this.toggle(this.isMove);
//         }.bind(this));

//         //鼠标移动中
//         on(this.small_box, "mousemove", this.cutting_move.bind(this))

//         //鼠标移出
//         on(this.small_box, "mouseleave", function () {
//             this.isMove = false;
//             //显示裁剪盒子  显示右侧大图
//             this.toggle(this.isMove);
//         }.bind(this))
//     }
//     cutting_move(e){
//         //获取鼠标位置
//         var _left = e.pageX - this.small_box_offset._left - (this.cutting_box_offset._width / 2);
//         var _top = e.pageY - this.small_box_offset._top - (this.cutting_box_offset._heiht / 2);

//         //判断边界
//         var pos = this.cutting_boundary(_left,_top);
//         this.cutting_box.style.left = pos.x + "px";
//         this.cutting_box.style.top = pos.y + "px";

//         //小图移动大图跟随
//         this.big_move(pos.x,pos.y);
//     }
//     //裁剪盒子移动边界
//     cutting_boundary(x,y){
//        x = (x <= 0)? 0 : x;
//        x = x >= (this.small_box_offset._width - this.cutting_box_offset._width)? this.small_box_offset._width - this.cutting_box_offset._width:x;
//        y = (y <= 0) ?0:y;
//        y = y >= (this.small_box_offset._heiht - this.cutting_box_offset._heiht)?(this.small_box_offset._heiht - this.cutting_box_offset._heiht):y;
//         return {
//             x:x,
//             y:y
//         }
//     }
//     big_move(x,y){
//         //获取裁剪盒子在small_boc里面移动的百分比   
//         this.move_p = {
//             _left_p:x / (this.small_box_offset._width - this.cutting_box_offset._width),
//             _top_p: y / (this.small_box_offset._width - this.cutting_box_offset._width),
//         }
//         //放大背景图片
//         this.img_box.style.width = this.bebig.end_width +"px";
//         this.img_box.style.height = this.bebig.end_height +"px";

//         //大图跟随
//         this.img_box.style.left = -this.move_p._left_p * (this.bebig.end_width -  this.big_offset._width) +"px";
//         this.img_box.style.top = -this.move_p._top_p * (this.bebig.end_height - this.big_offset._height) +"px";
//     }
//     //固定参数
//     fixedvariable(){

//         //左侧大图的宽高 位置   最大的父元素有定位
//         this.small_box_offset = {
//             _width:this.small_box.offsetWidth,
//             _heiht:this.small_box.offsetHeight,
//             _left:this.small_box.parentNode.parentNode.parentNode.offsetLeft,
//             _top:this.small_box.parentNode.parentNode.parentNode.offsetTop
//         }
//         console.log(this.small_box_offset);
//         //裁剪盒子的宽高
//         this.cutting_box_offset = {
//             _width:parseInt(getStyle(this.cutting_box,"width")),
//             _heiht:parseInt(getStyle(this.cutting_box,"height"))
//         }
//         //大图片的宽高
//         this.big_offset = {
//             _width:parseInt(getStyle(this.big_box,"width")),
//             _height:parseInt(getStyle(this.big_box,"height")),
//         }
//         //计算从裁剪盒子到右侧背景图放大了 几倍
//         this.bebig = {
//             big_width: this.big_offset._width / this.cutting_box_offset._width,
//             big_height: this.big_offset._height / this.cutting_box_offset._heiht,
//             // 放大结果
//             end_width: (this.big_offset._width / this.cutting_box_offset._width) * this.small_box_offset._width,
//             end_height: (this.big_offset._height / this.cutting_box_offset._heiht) * this.small_box_offset._heiht
//         }

//     }
//     toggle(flag) {
//         this.cutting_box.style.display = flag ? "block" : "none";
//         this.big_box.style.display = flag ? "block" : "none";
//     }
// }


// var list = _("#mylist");
// var prev = 0;
// var next = 0;
// [].slice.call(list.children).forEach((item,index) => {
//     item.onclick = function(){
//         prev = next;
//         next = index;

//         removeClass(list.children[prev],"active");
//         addClass(list.children[next],"active");
//         console.log("上一张"+prev,"下一张"+next);
//     }
// })