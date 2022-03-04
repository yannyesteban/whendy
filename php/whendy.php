<?php

namespace WH;

include_once 'Store.php'; 
include_once 'User.php'; 
include_once 'Tool.php';
include_once 'Interfaces.php';

use Tool, Store, User, ClassAdmin;

class Whendy
{
    
    private $init = null;
    private $id = 'application';
    private $response = [];
    private $request = [];

    public function __construct($config)
    {
        foreach ($config as $k => $v) {
            $this->$k = $v;
        }
    }

    private function init()
    {
        
        if(Store::getHeader('Application-Mode') === 'start'){
            $this->setElement($this->init);
        }

        $this->request = Store::getReq('__sg_request');
        
        $this->evalRequest($this->request);
    }

    public function evalCommand($command)
    {
        
        $command = (object)$command;
        
        switch ($command->type) {
            
            case 'init':
                $this->setElement(new ICommand($command));
                break;
            case 'element':
                $this->setElement(new ICommand($command));                
                break;
            case 'update':
                break;
            default:
                break;
        }
    }

    public function initElements($elements){
        if (!is_array($elements)) {
            return false;
        }

        foreach ($elements as $element) {
            $this->setElement($element);
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

    private function responseToken($token){
        $this->addResponse((object)[
            "mode" => "update",
            "id"=>$this->id,
            "props"=>[
                "token" => $token
            ]
        ]);
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

    public function setElement($info, $update = false)
    {
        
        $class = ClassAdmin::get($info->element);

        if(!$class || !is_a($class, "\Element", true)){
            return;
        }
        
        if(!User::validRoles($class::_acceptedRoles())){
            return;
        }

        Store::setExp("ID_", $info->id?? null);
        Store::setExp("ELEMENT_", $info->element?? null);
        
        if ($info->eparams ?? false) {
            foreach ($info->eparams as $k => $v) {
                Store::setExp($k, $v);
            }
        }
       
        $config = $info;
        
        if(is_a($class, "\WH\IPreConfig", true)){
            $config = $class::_loadPreConfig($info);

            if(($config->acceptedRoles?? false) && !User::validRoles($config->acceptedRoles)){
                return;
            }
            
            if($info->setPanel ?? false){
                $config->setPanel = $info->setPanel;
            }

            if($info->eparams ?? false){
                $config->eparams = $info->eparams;
            }

            if($info->method ?? false){
                $config->method = $info->method;
            }
            
        }

        if($config->sequenceBefore?? false){

        }

        $e = new $class($config);
        
        $e->evalMethod($info->method ?? '');
        
        $this->mergeResponse($e->getResponse());

        if($config->sequenceBefore?? false){
            
        }

        if ($e instanceof \WH\UserAdmin and $userInfo = $e->getUserInfo()) {
            //hx($userInfo);
            //$this->setUserInfo($userInfo);
        }

        if ($e instanceof IAppElementAdmin and $elements = $e->getAppElement()) {
            $this->initElements($elements);
            
            //hx($userInfo);
            //$this->setUserInfo($userInfo);
        }
    }
    
    public function render()
    {
        
        $this->init();

        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Allow: GET, POST, OPTIONS, PUT, DELETE");
        header('mode: init');
        //header('Content-Type: application/json; charset=utf-8');

        return json_encode($this->getResponse(), JSON_PRETTY_PRINT);
    }
}
