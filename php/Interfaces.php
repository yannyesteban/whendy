<?php
namespace WH;

interface IAppAmin{

    public function getModules();
    public function getCssSheets();
    public function getTemplate();

    public function setAppConfig($appConfig);

}

interface IAppElementAdmin{

    public function getAppElement();

}

interface DBInfo{
    public function setDBInfo($info);
    public function getDBInfo();

}

interface IUserInfo{
    public function setUserInfo($info);
    public function getUserInfo();

}

interface IUserAdmin{

    public function getUserInfo();

}

interface IPreConfig{
    static function _loadPreConfig($info);
}

class ICommand
{
    public $type = 'element';
    public $id = null;
    public $element = '';
    public $name = '';
    public $method = '';
    public $config = null;
    public $replayToken = null;
    public $setPanel = null;
    public $appendTo = null;


    public $debugMode = false;
    public $designMode = false;



    public function __construct($opt = [])
    {
        foreach ($opt as $k => $v) {
            if (property_exists($this, $k)) {
                if ($k === 'eparams' and gettype($v) !== 'object' and gettype($v) !== 'array') {
                    $this->$k = \json_decode($v);
                    continue;
                }

                $this->$k = $v;
            }
        }
    }
}


class IElement
{
    //public $mode = 'panel';
    public $id = false;
    public $element = '';
    public $name = '';
    public $method = '';
    public $eparams = false;
    public $replayToken = null;

    public $debugMode = false;
    public $designMode = false;



    public function __construct($opt = [])
    {
        foreach ($opt as $k => $v) {
            if (property_exists($this, $k)) {
                $this->$k = $v;
            }
        }
    }
}