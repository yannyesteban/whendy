<?php
namespace Sigefor;
include_once __DIR__.'/../Store.php';
include_once __DIR__.'/../Interfaces.php';
include_once __DIR__.'/../Element.php';
include_once __DIR__.'/../Trait/ConfigJson.php';

use ConfigJson, WH\IUserInfo, WH\IPreConfig, Store;

class Element extends \Element implements IUserInfo, IPreConfig
{
    
    use ConfigJson;

    protected $_userInfo =  null;


    public static function _loadPreConfig($info){

        if($info->name?? false){
            return Store::loadJson($info->name);
        }
        return $info;
    }
    
    public function __construct($config = []){
        \Element::__construct($config);
    }

    public function setUserInfo($info){
        $this->_userInfo = $info;
    }
    
    public function getUserInfo(){
        return $this->_userInfo;
    }
	
    public function getUser(){
        return $this->_userInfo->user;
    }
}
