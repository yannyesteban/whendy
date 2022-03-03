<?php



class ClassAdmin{

    private static $_classes = [];
    
    public static function load($name){
        $file = Tool::loadFile($name);
        $json = Store::getJson($file);
        
        self::init($json);
    }

    public static function init($json){
        
        foreach($json as $item){
            self::$_classes[$item->name] = $item;
        }
    }


    public static function get($name){
        $class = self::$_classes[$name] ?? null;
        if(!$class){
            return null;
        }

        if(!class_exists($class->class)){
            include_once($class->file);
        }

        return $class->class;
    }

    public static function new($name, $data = null){

        if(self::get($name)){
            return new (ClassAdmin::get($name))($data);
        }

        return new stdClass;
    }

}