<?php

namespace WH;
include_once 'Store.php'; 
include_once 'Tool.php';
include_once 'Interfaces.php';

function hr($msg, $colox = 'black', $back = 'inherit')
{
    if (is_array($msg) or is_object($msg)) {
        $msg = print_r($msg, true);
    }

    echo "<pre>$msg</pre>";
}

function hx($msg, $colox = 'black', $back = 'inherit')
{
    if (is_array($msg) or is_object($msg)) {
        $msg = print_r($msg, true);
    }

    echo "<pre>$msg</pre>";
    exit;
}

use ClassAdmin;
use stdClass;
use Store;

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

//date_default_timezone_set('America/Caracas');


include __DIR__ . '/../../sevian2020/sevian/JasonFileInfo.php';

class Whendy
{
    
    private $init = null;
    
    private $id = 'application';
    private $template = '';
    private $templateFile = '';

    private $params = null;
    private $cssSheets = [];
    private $response = [];
    private $elements = [];
    private $modules = [];

    private $classElement = [];
    private $onAjax = true;

    private $request = [];

    private $instance = null;


    public function __construct($config)
    {
        foreach ($config as $k => $v) {
            $this->$k = $v;
        }
    }

    private function getHeader(){

        return getallheaders();
    }

    public function sessionInit($req)
    {
        if (isset($req->__sg_ins)) {
            $this->instance = $req->__sg_ins;
        } else {
            $this->instance = uniqid('p');
        }
        
        Store::start($this->instance);
    }

    public function evalCommand($command)
    {
        switch ($command->type) {

            case 'init-app':
                $this->initApp();
                break;
            case 'init':
                $this->setElement(new ICommand($command));
                break;
            case 'element':
                $this->setElement(new ICommand($command));                
                break;
            case 'update':
                $this->updateElement();
                break;
            default:
                break;
        }
    }


    public function evalRequest($requests)
    {
        if (!is_array($requests)) {
            return false;
        }

        foreach ($requests as $request) {
            $this->evalCommand($request);
        }
    }

    private function init()
    {
        $this->request = [];

        $headers = $this->getHeader();


        //$this->elementsLoad($this->elements);
        //$this->template = @file_get_contents($this->templateFile);

        $this->evalElement($this->init);
        //hx($this->init);
        
        $appMode = $headers['Application-Mode'] ?? '';
        if($appMode === 'start'){
            //hx(88);
            $this->initApp();
            //$this->evalElement($this->init);
        }
        
        
        

        $req = $this->decodeParams();

       

        if ($req->__sg_data ?? false) {
            Store::setVReq((array)$req->__sg_data);
        }

        if ($req->__sg_request ?? false) {
            $this->request = $req->__sg_request;
        }


        $this->sessionInit($req);


        $this->evalRequest($this->request);
    }

    private function decodeParams()
    {
        if (strtolower($_SERVER['CONTENT_TYPE'] ?? '') === 'application/json') {
            $json = file_get_contents('php://input');
            return json_decode($json);
        } elseif (strtolower($_SERVER['REQUEST_METHOD']) === 'get') {
            return (object)$_GET;
        } elseif (strtolower($_SERVER['REQUEST_METHOD']) === 'post') {
            return (object)$_POST;
        }
    }


    private function responseToken($token){
        $this->addResponse((object)[
            "mode" => "update",
            "id"=>$this->id,
            "props"=>[
                "token" => $token
            ]
        ]);
    }

    private function initApp()
    {
        $this->addResponse((object)[
            "mode" => "update",
            "id"=>$this->id,
            "wc"=>"wh-app",
            "props"=>[
                "innerHTML" => $this->template,
                "params" => $this->params,
                "cssSheets" => $this->cssSheets,
                "modules" => $this->modules
            ],
        ]);

        $this->initCommands($this->init);
    }

    private function initCommands($commands){
        foreach($commands as $command){
            $this->evalCommand($command);
        }
    }
    public function addResponse($response)
    {
        $this->response[] =  (object)$response;
    }

    public function mergeResponse($responses)
    {
        $this->response = array_merge($this->response, $responses);
    }

    public function setResponse($response)
    {
        //$this->response = $response;
    }
    public function getResponse()
    {
        return $this->response;
    }

    


    public function setClassElement($info)
    {
        if ($info->file ?? '' != '') {
            require_once($info->file);
        }
        $this->classElement[$info->name] = $info->class;

        //$this->classElement[$info->name]::setElementName($info->name);


        if (isset($info->init)) {
            foreach ($info->init as $k => $v) {
                $this->classElement[$info->name]::${$k} = $v;
            }
        }
    }

    public function elementsLoad($elements)
    {
        foreach ($elements as $info) {
            if ($info->enable) {
                $this->setClassElement($info);

                if ($info->js ?? false) {
                    //$this->addJs($info['js']);
                }
                if ($info->css ?? false) {
                    // $this->addCss($info['css']);
                }
                if ($info->module ?? false) {
                    $this->modules[] = $info->module ?? new stdClass;
                }
            }
        }
        return;
    }

    public function evalElement($info, $update = false)
    {


        $class = ClassAdmin::get($info->element);

        if(!$class){
            return;
        }

        $e = new $class([]);

        $e->evalMethod("init");
        $this->mergeResponse($e->getResponse());

        return;
        hx($info->element);

        if ($info->id === 0 or $info->id === "0") {
            $info->id = $this->getReq("__sg_panel") ?? $this->defaultPanel;
        } elseif ($info->id === -1 or $info->id === "-1") {
            $info->id = $this->defaultPanel;
        }

        if (isset($this->_info[$info->id])) {
            if (!$info->element) {
                $info->element = $this->_info[$info->id]->element;
            }

            if (!$info->name) {
                $info->name = $this->_info[$info->id]->name;
            }
        }


        if (!isset($this->classElement[$info->element])) {
            return;
        }

        $info->async = $this->onAjax;

        $this->_info[$info->id] = $info;



        if (!isset($this->_userData[$info->id])) {
            $this->_userData[$info->id] = [];
        }
        $info->_data_user = $this->_userData[$info->id];
        /*
        $info = [
            "name"=>'',
            'eparams=>'',
            'id'=>'',
            'debug'='',
            'design'=>'',
            'userData'=>[]
        ]

        */

        \Store::setExp("ID_", $info->id);
        \Store::setExp("ELEMENT_", $info->element);
        //$this->setExp("NAME_", $info->name);
        \Store::setExp("ASYNC_", $info->async);
        if ($info->eparams ?? false) {
            foreach ($info->eparams as $k => $v) {
                //hr("$k -> $v");
                \Store::setExp($k, $v);
            }
        }

        $info->config->setPanel = $info->setPanel;
        $info->config->id = $info->id;
        $info->config->method = $info->method;
        $info->config->name = $info->name;
        $info->config->config = $info->config;
        $info->config->replayToken = $info->replayToken;

        $e = $this->_e[$info->id] = new $this->classElement[$info->element]($info->config);

        /*
        if (!isset($this->_pVars[$info->id])) {
            $this->_pVars[$info->id] = [];
        }
        $e->pVars = &$this->_pVars[$info->id];
        $e->setVPanel($this->_pVars[$info->id]);
        $e->gVars = &$this->_gVars;
        */

        $e->config();
        //$e->getSequenceBefore();
        $e->evalMethod();
        //$e->getSequenceAfter();

        if ($e instanceof \WH\UserAdmin and $userInfo = $e->getUserInfo()) {
            hx($userInfo);
            //$this->setUserInfo($userInfo);
        }


        $this->mergeResponse($e->getResponse());

        return;

        if ($e instanceof \Sevian\UserInfo) {
            $e->setUserInfo($this->getUserInfo());
        }
        $e->config();
        $e->getSequenceBefore();
        $e->evalMethod();
        $e->getSequenceAfter();


        if ($e instanceof \Sevian\ListenSigns) {
            $this->addTask($info->id, $e->getTaskXSigns());
        }

        if ($e instanceof \Sevian\DBInfo) {
            $dbInfo = $e->getDBInfo();
            foreach ($dbInfo as $k => $v) {
                Connection::set($k, $v);
            }
        }

        if ($e instanceof \Sevian\CSSDocAdmin) {
            $this->addCss($e->getCSSDocuments());
        }

        if ($e instanceof \Sevian\JsDocAdmin) {
            $this->addJs($e->getJsDocuments());
        }

        $this->addFrament($e->getResponse());
        
        

        if ($e instanceof \Sevian\TemplateAdmin) {
            if ($html = $e->getTemplate()) {
                $this->setTemplate($html);
            } elseif ($e->getThemeTemplate()) {
                $this->templateName = $e->getThemeTemplate();
            }
        }

        if ($e instanceof \Sevian\WindowsAdmin and $windows = $e->getWindows()) {
            $this->_windows = $windows;
        }

        if ($e instanceof \Sevian\JsonRequest) { // and $_jsonRequest = $e->getRequest()
            $this->_jsonRequest = $e->getRequest();
        }

        $this->_response = array_merge($this->_response, $e->getResponse());

        if ($e instanceof \Sevian\PanelsAdmin and $panels = $e->getPanels()) {
            foreach ($panels as $k => $p) {
                $this->setElement($p);
            }
        }

        if ($info->mode == 'panel') {
            $this->addPanel($e);
            //$this->_str->addPanel($info->id, $e->getPanel());
            $this->_str->addPanel($info->id, $e);
            $info->update = true;
            $info->isPanel = true;
        }


        $sign = "$info->element:$info->name:$info->method";

        foreach ($this->_tasks as $_id => $task) {
            //hr($sign,"blue");
            //hx($task,"red");


            if (isset($task[$sign])) {
                $this->sequence($task[$sign]);
            }
        }
    }

    public function setElement($info, $update = false)
    {


        if ($info->id === 0 or $info->id === "0") {
            $info->id = $this->getReq("__sg_panel") ?? $this->defaultPanel;
        } elseif ($info->id === -1 or $info->id === "-1") {
            $info->id = $this->defaultPanel;
        }

        if (isset($this->_info[$info->id])) {
            if (!$info->element) {
                $info->element = $this->_info[$info->id]->element;
            }

            if (!$info->name) {
                $info->name = $this->_info[$info->id]->name;
            }
        }


        if (!isset($this->classElement[$info->element])) {
            return;
        }

        $info->async = $this->onAjax;

        $this->_info[$info->id] = $info;



        if (!isset($this->_userData[$info->id])) {
            $this->_userData[$info->id] = [];
        }
        $info->_data_user = $this->_userData[$info->id];
        /*
        $info = [
            "name"=>'',
            'eparams=>'',
            'id'=>'',
            'debug'='',
            'design'=>'',
            'userData'=>[]
        ]

        */

        \Store::setExp("ID_", $info->id);
        \Store::setExp("ELEMENT_", $info->element);
        //$this->setExp("NAME_", $info->name);
        \Store::setExp("ASYNC_", $info->async);
        if ($info->eparams ?? false) {
            foreach ($info->eparams as $k => $v) {
                //hr("$k -> $v");
                \Store::setExp($k, $v);
            }
        }

        $info->config->setPanel = $info->setPanel;
        $info->config->id = $info->id;
        $info->config->method = $info->method;
        $info->config->name = $info->name;
        $info->config->config = $info->config;
        $info->config->replayToken = $info->replayToken;

        $e = $this->_e[$info->id] = new $this->classElement[$info->element]($info->config);

        /*
        if (!isset($this->_pVars[$info->id])) {
            $this->_pVars[$info->id] = [];
        }
        $e->pVars = &$this->_pVars[$info->id];
        $e->setVPanel($this->_pVars[$info->id]);
        $e->gVars = &$this->_gVars;
        */

        $e->config();
        //$e->getSequenceBefore();
        $e->evalMethod();
        //$e->getSequenceAfter();

        if ($e instanceof \WH\UserAdmin and $userInfo = $e->getUserInfo()) {
            hx($userInfo);
            //$this->setUserInfo($userInfo);
        }


        $this->mergeResponse($e->getResponse());

        return;

        if ($e instanceof \Sevian\UserInfo) {
            $e->setUserInfo($this->getUserInfo());
        }
        $e->config();
        $e->getSequenceBefore();
        $e->evalMethod();
        $e->getSequenceAfter();


        if ($e instanceof \Sevian\ListenSigns) {
            $this->addTask($info->id, $e->getTaskXSigns());
        }

        if ($e instanceof \Sevian\DBInfo) {
            $dbInfo = $e->getDBInfo();
            foreach ($dbInfo as $k => $v) {
                Connection::set($k, $v);
            }
        }

        if ($e instanceof \Sevian\CSSDocAdmin) {
            $this->addCss($e->getCSSDocuments());
        }

        if ($e instanceof \Sevian\JsDocAdmin) {
            $this->addJs($e->getJsDocuments());
        }

        $this->addFrament($e->getResponse());
        
        

        if ($e instanceof \Sevian\TemplateAdmin) {
            if ($html = $e->getTemplate()) {
                $this->setTemplate($html);
            } elseif ($e->getThemeTemplate()) {
                $this->templateName = $e->getThemeTemplate();
            }
        }

        if ($e instanceof \Sevian\WindowsAdmin and $windows = $e->getWindows()) {
            $this->_windows = $windows;
        }

        if ($e instanceof \Sevian\JsonRequest) { // and $_jsonRequest = $e->getRequest()
            $this->_jsonRequest = $e->getRequest();
        }

        $this->_response = array_merge($this->_response, $e->getResponse());

        if ($e instanceof \Sevian\PanelsAdmin and $panels = $e->getPanels()) {
            foreach ($panels as $k => $p) {
                $this->setElement($p);
            }
        }

        if ($info->mode == 'panel') {
            $this->addPanel($e);
            //$this->_str->addPanel($info->id, $e->getPanel());
            $this->_str->addPanel($info->id, $e);
            $info->update = true;
            $info->isPanel = true;
        }


        $sign = "$info->element:$info->name:$info->method";

        foreach ($this->_tasks as $_id => $task) {
            //hr($sign,"blue");
            //hx($task,"red");


            if (isset($task[$sign])) {
                $this->sequence($task[$sign]);
            }
        }
    }


    
    public function render()
    {
        $this->init();


       // hx($this->getResponse());

        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Allow: GET, POST, OPTIONS, PUT, DELETE");
        header('mode: init');
        //header('Content-Type: application/json; charset=utf-8');


        return json_encode($this->getResponse(), JSON_PRETTY_PRINT);
    }
    
}
