<?php

namespace WH;

include_once 'Interfaces.php';
include_once 'Element.php';
include_once 'Trait/ConfigJson.php';

use ConfigJson, WH\IUserInfo;

class AppElement extends \Element implements IUserInfo, IAppAmin, IAppElementAdmin
{

    use ConfigJson;

    protected $modules = [];
    protected $cssSheets = [];
    protected $templateFile = [];
    protected $template = [];
    protected $elements = [];
    

    protected $_userInfo =  null;

    public function __construct($config = [])
    {
        \Element::__construct($config);
    }

    public function getAppElement(){
        return $this->elements;
    }

    public function setUserInfo($info)
    {
        $this->_userInfo = $info;
    }

    public function getUserInfo()
    {
        return $this->_userInfo;
    }

    public function getUser()
    {
        return $this->_userInfo->user;
    }

    public function getModules()
    {
    }
    public function getCssSheets()
    {
    }
    public function getTemplate()
    {
    }

    public function setAppConfig($appConfig)
    {
    }
}
