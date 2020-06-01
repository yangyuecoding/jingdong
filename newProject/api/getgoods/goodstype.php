<?php

    include("../configServer.php");

    $sql = "SELECT * FROM `goods`";
    
    $res = mysqli_query($link,$sql);


    $obj = array();
    // echo json_encode($query_data);
    while ($row = mysqli_fetch_assoc($res)) {
        // echo json_encode($row);
        array_push($obj, $row);
    }
    echo json_encode(array(
        "code" => 200,
        "body" => array(
            "data" => $obj,
        )
    ));
    // echo json_encode(arrar(
    //     "code"  => 200,
    //     "body"  => array(
    //         "data"  => $obj,
    //     )
    // ));
?>