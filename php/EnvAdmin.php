<?php

include_once 'Store.php';

class EnvAdmin
{

    private static $_values = [];


    public static function load($name){
        $file = Tool::loadFile($name);
        $json = Store::getJson($file);
        
        self::init($json);
    }
    
    public static function init($json)
    {
        foreach ($json as $key => $value) {
            self::set($key, $value);
        }
    }

    public static function set($key, $value)
    {
        Store::setEnv($key, $value);
        self::$_values[$key] = $value;
    }

    public static function get($key)
    {
        return  $_values[$key] ?? null;
    }
}
