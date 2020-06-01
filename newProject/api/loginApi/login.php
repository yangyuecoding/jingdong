
<?php
/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-25 09:00:19
 * @LastEditors: YangYi
 * @LastEditTime: 2020-05-31 17:01:01
 */ 

    //连接数据库
    include("../configServer.php");

    if(!(array_key_exists("username",$_REQUEST) && array_key_exists("password",$_REQUEST)) ){
        die(json_encode(array(
            "code"  => 100,
            "detail"=> "无有效数据",
        )));
    }
    $username = $_REQUEST["username"];
    $password = $_REQUEST["password"];

    $sql = "SELECT * FROM `userlist` WHERE (`username`='$username' AND `password`='$password')";
    $res = mysqli_query($link,$sql);
    // echo json_encode($res);
    $data = mysqli_fetch_all($res);

    if(count($data) === 1){
        echo json_encode(array(
            "code"  => 200,
            "detail"=> "登录成功",
        ));

    }else{
        echo json_encode(array(
            "code"  => 400,
            "detail"=> "登录失败",
        ));
    }
?>
