<?php
/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-24 15:26:41
 * @LastEditors: YangYi
 * @LastEditTime: 2020-05-24 15:56:00
 */ 

    include("../configServer.php");

    if(!( array_key_exists("username",$_REQUEST)&& array_key_exists("password",$_REQUEST) && array_key_exists("telphone",$_REQUEST) )){
        echo json_encode(array(
            "code"  => "100",
            "detail"=> "无有效数据",
        ));
    }

    $username = $_REQUEST["username"];
    $password = $_REQUEST["password"];
    $telphone = $_REQUEST["telphone"];

    $sql = "INSERT INTO `userlist` (`username`,`password`,`telphone`) VALUES ('$username','$password','$telphone')";

    $res = mysqli_query($link,$sql);
    
    //插入成功
    if($res){
        echo json_encode(array(
            "code"  => 200,
            "detail"=>"数据插入成功",
        ));
    }else{
        echo json_encode(array(
            "code"  => 500,
            "detail"=>"数据插入失败",
        ));
    }

?>