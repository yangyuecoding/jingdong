<?php
/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-31 16:15:42
 * @LastEditors: YangYi
 * @LastEditTime: 2020-05-31 16:33:51
 */ 

    include("../configServer.php");

    if( !array_key_exists("goods_id",$_REQUEST)){
        echo json_encode(array(
            "code"      => 250,
            "detail"    => "无有效数据"
        ));
    }

    $id = $_REQUEST["goods_id"];

    $sql = "SELECT * FROM `goods` WHERE `goods_id`='$id'";

    // echo $sql;

    $res = mysqli_query($link,$sql);

    // $data = mysqli_fetch_all($res);
   
    $all_data = mysqli_fetch_assoc($res);
    
    // echo count($data);
    if($all_data){ 
        echo json_encode(array(
            "code"  => 200,
            "body"  => array(
                "data"  => json_encode($all_data)
            )
            ));
    }
?>