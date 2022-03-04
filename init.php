<?php
ini_set('max_execution_time', 180);
ini_set('memory_limit', '512M');
ini_set("session.gc_maxlifetime", "18000");

//ini_set('session.cookie_samesite', 'None');
//session_set_cookie_params(['samesite' => 'None']);
/*
session_set_cookie_params([
    'lifetime' =>  $currentCookieParams["lifetime"],
    'path' => '/',
    'domain' => $cookie_domain,
    'secure' => "1",
    'httponly' => "1",
    'samesite' => 'None',
])
*/

include_once 'php/Tool.php';
include_once "php/Store.php";
include_once "php/whendy.php";
include_once 'php/DB.php';
include_once 'php/EnvAdmin.php';
include_once 'php/ConstantAdmin.php';
include_once 'php/ClassAdmin.php';

Store::start();

ConstantAdmin::load("configuration/constants.json");
EnvAdmin::load("configuration/env.json");
ClassAdmin::load("configuration/classes.json");
DB::load("configuration/bd.json");

$init = Store::loadJson("configuration/init.json");

$app = new WH\Whendy(["init"=>$init]);

echo $app->render();
