<?php
/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-05-27 19:36:12
 * @LastEditors: YangYi
 * @LastEditTime: 2020-05-27 20:00:23
 */ 
	header("content-type","text/html;charset=utf-8");
	
	//1接收数据
	$username = $_GET["username"];
	//2、在数据库中查询
	   //1)、建立连接，并选择数据库
	   $conn = mysql_connect("localhost","root","951921220");
	   mysql_select_db("jingdongdb",$conn);
	   //2)、执行SQL语句（查询）
	   $sqlStr="select * from vip where username='$username'";
	   
	   $result=mysql_query($sqlStr,$conn);
	   
	   //3)、关闭连接
	   mysql_close($conn);
	//3、响应结果
	//获得$result的行数
	$rows = mysql_num_rows($result);
		
	if($rows>0){//如果用户名存在，返回0；
		echo "0";	
	}else {//如果用户名不存在，返回1.
		echo "1";
	}	
?>