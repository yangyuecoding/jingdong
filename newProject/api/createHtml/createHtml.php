<?php
/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-29 13:29:55
 * @LastEditors: YangYi
 * @LastEditTime: 2020-05-30 09:29:17
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

    ob_strart();//打开缓冲区
    $fn=date('http://localhost/php/newProject/html/gooddetails_').rand($id).'html';//生成文件名
    require("supply.php");//载入要生成静态页的文件，因为后台有ob_clean()所以在不会显示出来
    $fs=fopen($fn,'w');//打开静态页文件
    fwrite($fs,ob_get_contents());//生成静态文件
    ob_clean();//清空缓存
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