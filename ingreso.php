<?php
    $name = $_GET["name"];
    $password = $_GET["password"];

    $url = "http://localhost:3000/customers/$name/$password";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);
    $data = json_decode($response, true);
    if ($data) {
        if ($data["name"] == $name && $data["password"] == $password) {
        // Redirect the user to the desired webpage
        header("Location: http://localhost:3000/home");
        exit();
        }
    } else {
        echo $response;
        echo "<br>";
        echo "Invalid credentials";
    } 
?>