/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-28 11:33:44
 * @LastEditors: YangYi
 * @LastEditTime: 2020-06-02 23:38:16
 */
//获取首页商品列表 渲染分页
var options = {
    url: "../api/getgoods/goodstype.php",
    index: 1
}
//获取等号后面的数据
var href = location.href.slice(location.href.indexOf("=")+1);
window.onload = function () {
    ajax(options)
        .then(res => {
            //如果成功的获取到了数据
            if (res.code === 200) {
                init(res.body);
            }
        })
        .catch(rej => {
            console.log(rej);
        })
}

//瀑布流放弃  改写分页
function init(data) {
    var _default = {
        colum: Math.floor(parseInt(getStyle(_(".mybox"), "width")) / 250),
        index: options.index,
        callback: function (index) {
            rendergoods(_default, index);
        }
    }
    _default = extend(_default, data);
   
    //渲染列表
    rendergoods(_default, _default.index);
     //渲染分页
     renderPage(_default);
}

function renderPage(options){
    var html = `<li class="prev"><</li>`;
    var len = 0;
    //根据列宽和类型来渲染数据
    options.data.forEach(item => {
        // console.log(item.cat_one_id ===  decodeURIComponent(href));
        if (item.cat_one_id === decodeURIComponent(href)) {
          len++;
        }
        // console.log(len);
    })
    //渲染多少页
    var col = Math.ceil( len / options.colum );
    // _(".pageAction").innerHTML
    for(var i = 0 ;i < col;i++){
        html += `
            <li ${i===0? "class='item active'":"class='item'" }>${i+1}</li>        
        `;
    }
    html += `<li class="next">></li>`; 
    _(".pageAction").innerHTML = html;
  
    //事件委托绑定事件 分页按钮
    on(_(".pageAction"),"click",".item",function(){
        options.index = Number(this.innerHTML);
        options.callback(options.index);
        removeAll(".item","active");
        addClass(this,"active");
    })

    //左按钮
    on(_(".pageAction"),"click",".prev",function(e){
       if(options.index === 1){
            addClass(this,"disabled");
            removeClass(_(".next"),"disabled");
            return false;
       }else{
            options.index--;
       }
       rendergoods(options,options.index);
        removeAll(".item","active");
       //把他的下标由 1-5 变成 0 - 4
        addClass(_(".item")[options.index-1],"active");
        e.preventDefault();
    
})
    //右侧按钮
    on(_(".pageAction"),"click",".next",function(e){
        if(options.index >= col){
            removeAll(".item","active");
            addClass(_(".item")[options.index-1],"active");
            addClass(this,"disabled");
            removeClass(_(".prev"),"disabled");
            return false;
        }else{
            options.index++;
        }
        rendergoods(options,options.index);
         removeAll(".item","active");
        //把他的下标由 1-5 变成 0 - 4
         addClass(_(".item")[options.index-1],"active");
         e.preventDefault();

    })
}

//清空类
function removeAll(ele,_class){
    ele = _(ele);
    for(var i = 0 ;i < ele.length;i++){
        removeClass(ele[i],_class);
    }
}


function rendergoods(data, index) {
    var html = "";
    console.log(data, index);
    var arr = [];
    // 合并同类型数据
    data.data.forEach(item => {
        if (item.cat_one_id === decodeURIComponent(href)) {
            arr.push(item);
        }
    })
    // start  end  间距
    //  0     3    4    但是index 分页器是从0开始的 index*count-count  index*count-1    
    // 4    7     4
    // 8   11    4
    var start = index * data.colum - data.colum;
    var end = index * data.colum - 1;
    for (var i = start ; i <= end ; i++) {
       if(arr[i] === undefined){
           continue;
       }
       html += `<div class="goods" data-id="${arr[i].goods_id}">
        <a href="../html/gooddetails.html?goods-id=${arr[i].goods_id}">
        <img src="${arr[i].goods_big_logo}" alt="">
        <span class="title">
            ${arr[i].goods_name}
        </span>
        <div class="tips clearAll">
            <span class="price">
                <em>抢购价</em>
                <b> ${arr[i].goods_price}</b>
            </span>
            <span class="num">
                <em>仅剩</em>
                <b> ${arr[i].goods_number}</b>
                </span>
            </div>
        </a>
       </div>`;
    }
    _(".goods-list").innerHTML = html;
     //渲染分页
    //  removeClass(_(".prev","disabled"));
    //  removeClass(_(".next","disabled"));
       
}

// 回到首页
var goback = _(".gobackIndex");
//获取浏览器的宽、高
var w_width = window.innerWidth;
var w_height = window.innerHeight;
console.log(w_width,w_height)
//获取自身的宽高
var widht = parseInt(getStyle(goback,"width"));
var height = parseInt(getStyle(goback,"height"));
window.onresize = function(){
     w_width = window.innerWidth;
     w_height = window.innerHeight;
    console.log(w_width,w_height)

}
//判断边界
var _left = w_width - widht <= 0 ? 0 : w_width - widht;
    left = w_width >= (w_width - widht)?w_width - widht:w_width;
var _top = w_height - height <= 0 ? 0: w_height - height;
    _top = w_height >= (w_height - height)?w_height - height:w_height;

var timer = setInterval(randomMove,2000);
function randomMove(){
    goback.children[0].style.color = randomColor();
    animate(goback,{
        left:parseInt( _left * Math.random()),
        top:parseInt( _top * Math.random()),
        opacity:1
    },"swing",function(){
        goback.style.opacity = 0.3;
    })
    
}
on(goback,"mouseenter",function(){
    clearInterval(timer);   
})
on(goback,"mouseenter",function(){
    timer = setInterval(randomMove,2000);
})

//前往商品详情页
//给每一个goods绑定点击事件获取商品id 设置cookie  渲染当前点击的页面
on(_(".goods-list"),"click",".goods",function(){
//    alert(this.getAttribute("data-id"));
   //村一条cookie
    Cookie("goods-id",this.getAttribute("data-id"));
    location.replace("gooddetails.html");
})




// //渲染瀑布流
// /*
//     data 后端返回的数据
//     type 字段 cat-one-id  默认为内衣配饰
//     总种类有其他、大家电、海外购、童装玩具、智能设备
//     、食品、电子教育、品牌墙、钟表眼镜、电视、电脑办公
// */
// function calculat() {
//     //获取容器的宽度
//     var w_width = parseInt(getStyle(_(".mybox"), "width"));
//     //设置单张图片的宽度
//     var img_width = 250;
//     //间隙默认是10
//     var interval = 10;
//     //计算能放多少列
//     var colum = Math.floor((w_width + interval) / (interval + img_width))
//     //修改父容器的宽度
//     _(".mybox").style.width = colum * 250 + (colum - 1) * 10 + "px";
//     //用一组的数组来记录第一行的高度
//     var arr = new Array(colum);
//     return {
//         colum,
//         img_width,
//         arr
//     }

// }

// function waeterFull(data, type) {
//     var obj = calculat();
//     //渲染页面结构
//     //循环数据中为大家电的
//     type = Cookie("shop-type") ? Cookie("shop-type") : "大家电";
//     //将数组中同一类型的数据取出来
//     var wtf = [];
//     data.forEach(item => {
//         if (item.cat_one_id === type) {
//             wtf.push(item);
//         }
//     })
//     //渲染列表
//     renderList(wtf, obj);
// }

// function renderList(arr, obj) {
//     var html = "";
//     if (arr.length >= 12) {
//         //按照顺序先渲染第一行
//         for (var i = 0; i < arr.length; i++) {
//             if (i < obj.colum) {
//                 html += `<div class="goods" data-id="${arr[i].goods_id}">
//                 <img src="${arr[i].goods_big_logo}" alt="">
//                 <span class="title">
//                 ${arr[i].goods_name}
//                 </span>
//                 <div class="tips clearAll">
//                     <span class="price">
//                         <em>抢购价</em>
//                         <b> ${arr[i].goods_price}</b>
//                     </span>
//                     <span class="num">
//                         <em>仅剩</em>
//                         <b> ${arr[i].goods_number}</b>
//                         </span>
//                 </div>
//             </div>`;
//             }
//         }
//     }
//     _(".goods-list").innerHTML = html;
//     console.log(_(".goods"));
// }