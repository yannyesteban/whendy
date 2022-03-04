<?php

include_once 'Tool.php';


class Store{
    
	private static $id = [];
	private static $sid = '';

	private static $method = [];

	public static $ses = [];
	public static $req = [];
	public static $exp = [];
	public static $frm = [];
    public static $env = [];

	private static $header = null;

	public static $cfg = null;
	
	public static function start(){

		self::$header = getallheaders();
		self::$req = self::decodeRequest();
		self::$sid = self::$header['SID'];

		if(self::$sid){
			session_name(self::$sid);
		}else{
			self::$sid = uniqid('p');
		}

		session_start();

		self::$cfg = &$_SESSION;
		self::$ses = &$_SESSION['ses'];
	}

	private static function decodeRequest()
    {
        self::$method = strtolower($_SERVER['REQUEST_METHOD']);
		
		if (strtolower($_SERVER['CONTENT_TYPE'] ?? '') === 'application/json') {

			return json_decode(file_get_contents('php://input'), true);
        } elseif (self::$method === 'get') {

			return $_GET;
        } elseif (self::$method === 'post') {
            
			return $_POST;
        }
		
		return [];		
    }
	
	public static function getSid(){
		return self::$sid;
	}

	public static function setSes($key, $value){
		self::$ses[$key] = $value;
	}
	
	public static function &getSes($key){
		return self::$ses[$key];
	}

	public static function setVReq($data){
		self::$req = $data;
	}
	public static function &getVReq(){
		return self::$req;
	}
	public static function setReq($key, $value){
		self::$req[$key] = $value;
	}
	public static function &getReq($key){
		return self::$req[$key];
	}

	public static function getHeader($key){
		return self::$header[$key] ?? null;
	}

	public static function addSes($ses){
		self::$ses = array_merge(self::$ses, $ses);
	}

	public static function addReq($req){
		self::$req = array_merge(self::$req, $req);
	}

	public static function setExp($key, $value){
		self::$exp[$key] = $value;
	}
	
	public static function &getExp($key){
		return self::$exp[$key];
	}

	public static function &getVSes(){
		return self::$ses;
	}
	
	public static function &getVExp(){
		return self::$exp;
	}

	public static function &getVFrm(){
		return self::$frm;
	}

    public static function evalExp($q){

		return Tool::evalExp(self::vars($q));
	}

	public static function setEnvData($data){
		self::$env = $data;
	}

	public static function setEnv($key, $value){
		self::$env[$key] = $value;
	}

    public static function getEnv($key){
		return self::$env[$key]?? null;
	}


	public static function vars($q, $default = false){
		return Tool::vars($q, [
			[
				'token' 	=> '@',
				'data' 		=> self::$ses,
				'default' 	=> $default
			],
			[
				'token'		=> '\#',
				'data' 		=> self::$req,
				'default' 	=> $default
			],
			[
				'token'		=> '\&F_',
				'data' 		=> self::$frm,
				'default' 	=> $default
			],
			[
				'token' 	=> '&EX_',
				'data' 		=> self::$exp,
				'default' 	=> $default
			],
		]);
	}

	public static function varParam($q, $data, $default = false){
		return Tool::vars($q, [
			[
				'token' 	=> '&P_',
				'data' 		=> $data,
				'default' 	=> $default
			]
		]);
	}

	public static function varCustom($q, $data, $token, $default = false){
		return Tool::vars($q, [
			[
				'token' 	=> $token,
				'data' 		=> $data,
				'default' 	=> $default
			]
		]);
	}

	public static function params($q){
		$params = false;
		$q = self::vars($q);
		\Sevian\Tool::param($q, $params);
		return $params;
	}

	public static function getJson($data, $mode = false){
		return json_decode(Store::vars($data), $mode);
	}

	public static function loadJson($name){
        $file = Tool::loadFile($name);
        $json = self::getJson($file);
        
        return $json;
    }

	public static function loadFile($name){
        $data = Tool::loadFile($name);
		return Store::vars($data);
    }
}
