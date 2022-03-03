<?php

class User
{
    private static $user = null;
    private static $roles = [];


    public static function get()
    {
        return self::$user;
    }
}
