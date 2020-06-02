/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-30 16:08:13
 * @LastEditors: YangYi
 * @LastEditTime: 2020-06-03 00:22:40
 */

var register = _(".user-register"),
    shopcar_num = _(".shopcar-num"),
    login = _(".user-login");
   //tbody的内容
   var tbody_html = "";
//页面加载重新渲染登录和购物车商品数量
//选择相关的处理元素
//数量量
var count = _(".mycount");
//全选按钮
var allchk = _("#all-id");
//价格
var all_price = _(".end-num ");
//记录选择上的数量
var chk_num = 0;
window.onload = function () {
    // 判断是否有用户登录信息
    regUserName();
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
            
            console.log(res.body.data);
            //渲染购物车列表
            rendereTable(res.body.data);
        })
        .catch(rej => {
            console.log(rej);
        })
}


function rendereTable(res){
    //购物车渲染程序
    //渲染模板
    // _(".myTbody").innerHTML
    //    return  html += `
    //     <tr>
    //     <td><input type="checkbox" name="" id=""></td>
    //     <td>
    //         <div class="detail">
    //             <img src="https://image5.suning.cn/uimg/b2c/newcatentries/0070081143-000000000144879464_2_200x200.jpg" alt="">
    //             <span>南极人【10双装】夏季男士丝袜超薄中筒袜男袜子薄款透气纯色商务袜P3038</span>
    //         </div>
    //     </td>
    //     <td></td>
    //     <td>${item.goods_count}</td>
    //     <td>1000</td>
    //     <td>删除</td>
    // </tr>
    //
    // _(".myTbody").innerHTML = "";
    res.forEach( (item) => {
        renderUserlist(item);
    })  
        tbody_html = "";
    }

//因为购物用户购物车的东西较多  需要循环发送请求渲染用户数据

async function renderUserlist( item ){
    try{
        let goods = await ajax({
            url:"../api/getgoods/special_goods_id.php",
            data:{
                goods_id:item.goods_id
            }
        })
        var data = JSON.parse(goods.body.data);
        tbody_html += `
            <tr goods-id="${data.goods_id}">
            <td><input type="checkbox" name="" id="" class="youcheck"></td>
            <td>
                <div class="detail">
                    <img src="${data.goods_small_logo}" alt="">
                    <span>${data.goods_name}</span>
                </div>
            </td>
            <td>${data.goods_price}</td>
            <td class="count_calc">
                <button class="redu">-</button>
                <input type="text" name="" id="" value="${item.goods_count}" disabled>
                <button class="toadd">+</button>
            </td>
            <td>${Number(data.goods_price) * Number(item.goods_count) }</td>
            <td class="del">删除</td>
        </tr>`;
    }catch(err){
        console.log(err);
    }
    _(".myTbody").innerHTML =  tbody_html;
}


//事件委托偷懒绑定事件
on(_(".myTbody"),"click",".youcheck",handleCheckEvent);

//checkbox  事件处理 
function handleCheckEvent(e){
    if(this.checked){
        chk_num++;
        changeInnerHtml.call(this,true);
    }else{
        changeInnerHtml.call(this,false);
        chk_num--;
    }
   if(this.parentNode.parentNode.parentNode.children.length === chk_num){
    allchk.checked = true;
   }else{
    allchk.checked = false;
   }
}
//处理 是否点击的总价钱和商品总量的数量
function changeInnerHtml(flag){
    if(flag){
        count.innerHTML = Number(count.innerHTML) + Number(this.parentNode.parentNode.children[3].children[1].value); 
        all_price.innerHTML = (Number(all_price.innerHTML)+Number(this.parentNode.parentNode.children[4].innerHTML)).toFixed(2);
    }else{
        
        count.innerHTML = Number(count.innerHTML) - Number(this.parentNode.parentNode.children[3].children[1].value); 
        all_price.innerHTML = (Number(all_price.innerHTML)-Number(this.parentNode.parentNode.children[4].innerHTML)).toFixed(2);
    }
}
//全选按钮
on(allchk,"click",handelallchkEvent);
function handelallchkEvent(){
    var chklist = Array.from(document.querySelectorAll(".youcheck"));
    //全选前先清空价格和数量
    count.innerHTML = "0";
    all_price.innerHTML ="0.00";
    // chklist
    chklist.forEach(item => {
        // if(item.checked){
        //     done_count += Number(item.parentNode.parentNode.children[3].children[1].value);
        //     done_money += Number(item.parentNode.parentNode.children[4].innerHTML) ;
        // }
        if(this.checked){
            item.checked = true;
            //遍历所有item的父元素拿到商品的总量
            count.innerHTML = Number(count.innerHTML) + Number(item.parentNode.parentNode.children[3].children[1].value); 
            all_price.innerHTML = (Number(all_price.innerHTML)+ Number(item.parentNode.parentNode.children[4].innerHTML)).toFixed(2);
        }else{
            item.checked = false;
            count.innerHTML = "0"; 
            all_price.innerHTML = "0.00";
        }
    })
}


//删除事件
on(_(".myTbody"),"click",".del",handelDel);
function handelDel(e){
   
    //发送请求携带参数字段，{用户名,商品id}
    ajax({
        url:"../api/handlegoods/delusergoods.php",
        data:{
            username:Cookie("token"),
            goods_id:this.parentNode.getAttribute("goods-id")
        }
    })
    .then(res => {
        console.log(res);
        if(res.code === 300){
            //删除成功
            this.parentNode.remove();
            //重新渲染购物车数量
            rendershopcarnum();
            //将全选按钮职位false  初始化数量和金额
            allchk.checked = false;
            count.innerHTML = "0"; 
            all_price.innerHTML = "0.00";
        }else{
            alert("服务器错误删除失败，请联系客服");
        }
    })
    .catch(rej => {
        console.log(rej);
    })
}

//增加数量
on(_(".myTbody"),"click",".toadd",handeladd);
function handeladd(){
    var num  = Number(this.previousElementSibling.value);
    num++;
    //发一个请求，如果成功了 就增加数量
    ajax({
        url:"../api/handlegoods/addgoods.php",
        data:{
            username:Cookie("token"),
            goods_id:this.parentNode.parentNode.getAttribute("goods-id") ,
            goods_count:num,
        }
    })
    .then( res => {
        console.log(res);
        if(res.code == "250"){
             //重新渲染购物车数量
            //  rendershopcarnum();
            this.previousElementSibling.value = num;
            shopcar_num.innerHTML = Number(shopcar_num.innerHTML) + 1;  
        }
    })
    .catch(rej => {
        console.log(rej);
    })
}

//删除数量

on(_(".myTbody"),"click",".redu",handelreduce);
function handelreduce(){
    var num  = Number(this.nextElementSibling.value);
    //发一个请求，如果成功了 就减少数量
    num--;
    if( num === 0){
        return false;
    }
    ajax({
        url:"../api/handlegoods/addgoods.php",
        data:{
            username:Cookie("token"),
            goods_id:this.parentNode.parentNode.getAttribute("goods-id") ,
            goods_count:num,
        }
    })
    .then( res => {
        console.log(res);
        if(res.code == "250"){
             //重新渲染购物车数量
            //  rendershopcarnum();
            this.nextElementSibling.value = num;
            shopcar_num.innerHTML = Number(shopcar_num.innerHTML) - 1;  
        }
    })
    .catch(rej => {
        console.log(rej);
    })
     
}



