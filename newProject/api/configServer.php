<?php
/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-24 13:59:16
 * @LastEditors: YangYi
 * @LastEditTime: 2020-05-25 09:02:53
 */ 

    //连接数据库
    $link = mysqli_connect("localhost","root","951921220","jingdongdb");
    if(!$link){
        echo json_encode(array(
            "code"      => 50,
            "detail"    => "数据库连接失败",
        ));
    }
?>