<?php
/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-31 00:20:41
 * @LastEditors: YangYi
 * @LastEditTime: 2020-05-31 00:33:26
 */ 


    include("../configServer.php");

    $username = $_REQUEST["username"];

    $sql = "SELECT * FROM `oneusergoods` WHERE `username`='$username'";


    $res = mysqli_query($link,$sql);

    $obj = array();
    // echo json_encode($query_data);
    while ($row = mysqli_fetch_assoc($res)) {
        array_push($obj, $row);
    }
   
    echo json_encode(array(
        "code"  => 200,
        "body"  => array(
            "data"  => $obj
        )
        ));

?>