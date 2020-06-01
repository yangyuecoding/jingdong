<?php
/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-29 13:29:55
 * @LastEditors: YangYi
 * @LastEditTime: 2020-05-29 15:06:39
 */ 
    include("../configServer.php");

    //请求无有效数据
    if(!array_key_exists("id",$_REQUEST)){
        die(json_encode(array(
            "code"  => "100",
            "detail"=> "无有效数据",
        )));
    }

    $id = $_REQUEST["id"];

    $sql = "SELECT * FROM `goods` WHERE `goods_id`=$id";

    $res = mysqli_query($link,$sql);

    $data = mysqli_fetch_all($res);
    if( $data ){
        echo json_encode(array(
            "code"  => 200,
            "data"  => $data,
        ));
    }else{
        echo json_encode(array(
            "code"  => 400,
            "data"  => "数据库中没有这条数据",
        ));
    }
?>