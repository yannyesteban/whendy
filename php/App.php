<?php

namespace WH;

include_once 'Store.php';
include_once 'AppElement.php';
include_once 'Interfaces.php';

use ConfigJson, WH\IUserInfo, Store;

class App extends AppElement implements IPreConfig
{

    static $patternJsonFile = '';

    protected $jsModules = [];

    public static function _loadPreConfig($info)
    {

        if ($info->name) {
            return Store::loadJson($info->name);
        }
        return $info;
    }

    public static function _test()
    {

        print_r("esto es un test estatico");
    }

    public function __construct($config = null)
    {

        AppElement::__construct($config);
    }

    public function evalMethod($method = false): bool
    {

        if ($method) {
            $this->method = $method; //$method = $this->method;
        }

        switch ($this->method) {
            case 'init':
                $this->load();
                break;
            case 'load':
                $this->load();
                break;
        }




        return true;
    }

    public function load()
    {

        $this->template = Store::loadFile($this->templateFile);


        $response = [
            'mode'  => 'update',
            'element' => 'wh-app',
            'id'    => $this->id,
            'props'  => [
                'name'      => $this->name,
                'className'      => $this->className,
                'cssSheets'      => $this->cssSheets,
                'modules'      => $this->modules,
                'jsModules'      => $this->jsModules,
                'innerHTML' => $this->template


            ],
            'attrs' => [
                'sid' => Store::getSid()
            ]
        ];

        //hx($response);
        $this->addResponse($response);
    }
}
