<?php
/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-30 16:45:34
 * @LastEditors: YangYi
 * @LastEditTime: 2020-05-31 13:24:38
 */ 

    include("../configServer.php");

    $username = $_REQUEST["username"];
    $goods_id = $_REQUEST["goods_id"];
    $goods_count = $_REQUEST["goods_count"];

    //需要判断如果数据库中已经有这个用户对象选购的某个id的商品，那就更新这个商品id的数量  
    //先查询数据库 如果能查到就更新这个数据  需要区分用户的姓名  如果用户名不一样 那就更新当前用户的商品数据
    $query_sql = "SELECT `username`,`goods_id` FROM `oneusergoods` WHERE (`username`= '$username' AND `goods_id`='$goods_id')";
    
    $query_res = mysqli_query($link,$query_sql);
    
    $query_data = mysqli_fetch_all($query_res);

    $updata_sql = "UPDATE `oneusergoods` SET `username`='$username',`goods_id`='$goods_id',`goods_count`='$goods_count' WHERE ( `username`='$username' AND `goods_id`='$goods_id' )";
    //数据库重名了  
    if(count($query_data)===1){
        //如果该用户已经有id为这个的商品了，那就跟新这个id的商品数量
        $updata_res = mysqli_query($link,$updata_sql);
        if($updata_res){
             die(json_encode(array(
                "code"  => "250",
                "detail"=> "数据库数据重名了，已经更新"
             )));
        }
    }else{
            //如果没有再新建

    $insert_sql = "INSERT INTO `oneusergoods` (`username`,`goods_id`,`goods_count`) VALUES ('$username','$goods_id','$goods_count')";

    $res = mysqli_query($link,$insert_sql);

    if($res){
        echo json_encode(array(
            "code"  => 200,
            "detail"=> "插入成功"
        ));
    }else{
        echo json_encode(array(
            "code"  => 400,
            "detail"=> "插入失败"
        ));
    }
    }



?>