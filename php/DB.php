<?php

	
include 'DB/DBase.php';
include 'DB/Mysql.php';
include 'DB/Postgres.php';

class Info{
	
	public $name	= false;
	public $driver	= false;
	public $host	= false;
	public $port	= false;
	public $user	= false;
	public $pass	= false;
	public $dbase	= false;
	public $charset	= false;
		
	public function __construct($opt = []){
		
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
	}	
}	

class DB{
	
	static $_defaultName = '_default';
	
	static $_connections = [];
	
	public static function load($name){
        $file = Tool::loadFile($name);
        $json = Store::getJson($file);
        
        self::init($json);
    }

	static function init($conn = []){
		
		foreach($conn as $info){
			self::set(new Info($info));
		}
		
	}
	static function set($info){

		if($info->name === '' ||  $info->name === null){
			$info->name = self::$_defaultName;
		}
		self::$_connections[$info->name] = new Info($info);
	}
	static function get($name = false){
		
		if($name === false){
			$name = self::$_defaultName;
		}
		
		if(!isset(self::$_connections[$name])){
			return false;
		}
		
		$info = self::$_connections[$name];

		switch(strtolower(trim($info->driver))){
			case 'mysqlx':
				//$cn = new cls_mysql($server,$user,$password,$dbase,$port);
				//return new cls_mysql($server, $user, $password, $dbase, $port, $charset);
				return new cls_mysql($info->host, $info->user, $info->pass, $info->dbase, $info->port, $info->charset);
				break;
			case 'mysql':
				//$cn = new cls_mysql($server,$user,$password,$dbase,$port);
				return new Sevian\DB\Mysql($info->host, $info->user, $info->pass, $info->dbase, $info->port, $info->charset);
				break;

			case 'postgres':
				return new Sevian\DB\Postgres($info->host, $info->user, $info->pass, $info->dbase, $info->port, $info->charset);
				break;
		}
	
	}
	
}

?>