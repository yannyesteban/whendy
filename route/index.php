<?php



$request = $_SERVER['REQUEST_URI'];

print_r($request);
http_response_code(404);