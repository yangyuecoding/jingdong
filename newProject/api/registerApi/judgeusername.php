
<?php
    include("../configServer.php");
    //如果没有相应 结束一个信息
    if(!array_key_exists("username",$_REQUEST)){
        die(json_encode(array(
            "code"  => 100,
            "detail"=> "无有效数据",
        )));
    }

    $username = $_REQUEST["username"];

    //插叙语句
    $sql = "SELECT * FROM `userlist` WHERE `username`='$username'";

    
    $res = mysqli_query($link,$sql);

    $data = mysqli_fetch_all($res);

    if(count($data) === 1){
        echo json_encode(array(
            "code"  => 500,
            "detail"=> "用户名重名",
        ));
    }else{
        echo json_encode(array(
            "code"  => 200,
            "detail"=> "用户名可用",
        ));
    }

?>