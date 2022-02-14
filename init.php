<?php

include "php/whendy.php";

$config = json_decode(@file_get_contents("config.json", true));

$app = new WH\App($config);

echo $app->render();