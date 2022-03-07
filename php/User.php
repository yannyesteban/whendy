<?php

class User
{
    private static $user = null;
    private static $roles = ['x', 'y', 'z', '** super **'];

    public static function set($user)
    {
        self::$user = $user;
    }

    public static function get()
    {
        return self::$user;
    }

    public static function setRoles($roles)
    {
        self::$roles = $roles;
    }

    public static function getRoles()
    {
        return self::$roles;
    }

    public static function validRoles($roles = [])
    {
        
        if ($roles === [] || in_array('** super **', self::$roles) || in_array('** public **', $roles) || array_intersect(self::$roles, $roles)) {

            /* approved access */
            return true;
        }

        /* access denied */
        return false;
    }
}
