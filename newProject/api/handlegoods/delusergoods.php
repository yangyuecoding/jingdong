<?php
/*
 * @Description: 越哥哥的小代码,看看就行了
 * 
 * $
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-06-02 16:21:21
 * @LastEditors: YangYi
 * @LastEditTime: 2020-06-02 16:34:11
 */ 

    include("../configServer.php");


    if( !(array_key_exists("username",$_REQUEST) && array_key_exists("goods_id",$_REQUEST)) ){
        echo json_encode(array(
            "code"  => 100,
            "detail"=> "无有效数据"
        ));
    }

    $username = $_REQUEST["username"];
    $goods_id = $_REQUEST["goods_id"];

    $sql = " DELETE FROM `oneusergoods` WHERE (`username`='$username' AND `goods_id`='$goods_id')";

    $res = mysqli_query($link,$sql);

    if($res){
        echo json_encode(array(
            "code"  => 300,
            "detail"=>"删除成功"
        ));
    }else{
        echo json_encode(array(
            "code"  => 400,
            "detail"=>"删除失败"
        ));
    }

?>