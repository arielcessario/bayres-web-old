<?php

$data = file_get_contents("php://input");

$decoded = json_decode($data);

sendMail($decoded->email, $decoded->mensaje);

function sendMail($email, $mensaje)
{
    //$to = 'mmaneff@gmail.com';
    $to = 'juan.dilello@gmail.com';

    $headers = "From: " . $email . "\r\n" .
        "CC: mmaneff@gmail.com";

    $success = mail($to, 'Consulta', $mensaje, $headers);

    echo json_encode( $success );
}