<?php

include 'User.php';
$header = [
    'alg' => 'HS256',
    'typ' => 'JWT'

];

$payload = [
    'cedula' => '12474737',
    'name' => 'Yanny',
    'iat' => 4737
];




include 'DB.php';

DB::load([[
    "name"    => "uno",
    "driver"    => "mysql",
    "host"    => "localhost",
    "port"    => "3306",
    "user"    => "root",
    "pass"    => "123456",
    "dbase"    => "gt",
    "charset"    => "utf-8",
]]);

$cn = DB::get('uno');

$cn->query = "select * from unit limit 1";

$result = $cn->execute();
$data = $cn->getDataAll($result);

print_r($data);
