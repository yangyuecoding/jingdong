<!--
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-06-01 11:22:48
 * @LastEditors: YangYi
 * @LastEditTime: 2020-06-03 17:23:22
--> 
# 京东商城
## 功能模块
### 注册页  (统一说一下，返回值这里所有都需要**JSON.parse**)
#### 判断用户名是否可用
+  url : **api/registerApi/judgeusername.php**
+ 请求方式: **post 或者 get**
+ 参数: 必填 
    +   username:<string>
+ 返回值: json
    +   code ==> 200 验证成功  500 验证失败
    +   detail ===>  成功或者失败的描述
    #### 注册用户
    +   **api/registerApi/addUser.php**
    +   请求方式：post 或者 get
    +   参数  json
        +    code ==> 200 验证成功 500 验证成功 
        +   detail ===> 成功或者失败的描述
### 登录页
+   **api/loginApi/login.php**
    + 请求方式: post 或者 get
    + 参数  必填
        +   username : string
        +   password : string
    + 返回值 json
        +  code ===> 200 成功  400 失败
        +   detail ==> 成功或者失败的描述
### 首页
+ 商品列表使用了代理服务器 **http://localhost/pdd**
+ 配置nginx 服务器配置文件
+ 搜索框使用了 jsonp 请求了百度搜索接口
    +  url：**https://www.baidu.com/sugrec**
    +   参数: 必填
        +   prod:string  固定参数  pc
        +   sugsid:string 固定参数 1423,31169,21125,30839,31187,30823,22159
        +   wd:想要搜索的内容
        +   cb:hello   全局函数字段  全局函数名


### 列表页
+   根据商品类型渲染 商品
    +   url:**api/getgoods/goodstype.php**
    +   请求方式 get
    +   参数: 无需
### 详情页
+ 渲染购物车数量
    +url:   **api/createHtml/rendershopcar.php**
    + data : 必填
        + username ：string  
    + 返回值 json  
        + code ：200 成功
        + body ： { data ：obj }
+ 渲染详情页 
    + url : **api/getgoods/goodsdetails.php**
    + 参数 ：必填
        + id : string 
    + 返回值：json
        + code : 200 成功 400 失败
        + data ： array 成功  string 鼠标

### 购物车
+ 为单独用户喧嚷商品
    + url：**/api/getgoods/special_goods_id.php**
    + data ：必填
        + goods_id:string
    + 返回值 json
        + code ： number 200 成功
        + body:{data:响应数据 json串}
+ 删除用户数据
    + url:**/api/handlegoods/delusergoods.php**
    + data:必填
        + username:string 用户名
        + goods_id:string 商品id
    + 返回值：json
        + code:300成功  400 失败
        + detail :成功或者失败的描述
+ 更新用户商品数量
    + url ：**/api/handlegoods/addgoods.php**
    + data:必填
        + username：string
        + goods_id:string 
        + goods_count:string
    + 返回值:json
        + code:200成功  400 失败
        + detail :成功或者失败的描述
### configServer.php
+ 该文件为开发人员本地服务器连接配置文件，需要根据自己的数据库信息来修改!
