<?php

namespace WH;

include_once 'Store.php'; 
include_once 'User.php';
include_once 'JWT.php'; 
include_once 'Tool.php';
include_once 'Interfaces.php';

use JWT;
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

    private function evalJWT(){
        $value = JWT::verifyHeader();

        if($value){

            //Tool::hx($value);
            User::set($value->payload->user);
            User::setRoles($value->payload->roles);
            return true;
        }
        User::set(null);
        User::setRoles([]);
        
        return false;
    }

    private function init()
    {
        
        $this->evalJWT();

        if(Store::getHeader('Application-Mode') === 'start'){
            $this->setElement($this->init);
        }

        $this->request = Store::getReq('__app_request');
        $this->id = Store::getReq('__app_id');
        
        $this->evalRequest($this->request);
    }

    public function evalCommand($command)
    {
       
        //$command = Tool::toJson($command);

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
            $this->evalCommand(Tool::toJson($request));
        }
    }

    private function responseToken($token){
        $this->addResponse((object)[
            "mode" => "update",
            "id"=>$this->id,
            "props"=>[
                "token" => $token,
                "paz"=>"nunca"
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
            //Tool::hr($config);
            if(($config->acceptedRoles?? false) && !User::validRoles($config->acceptedRoles)){
                return;
            }
            
            if($info->appendTo ?? false){
                $config->appendTo = $info->appendTo;
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

        if ($e instanceof \WH\IUserAdmin and $userInfo = (object)$e->getUserInfo()) {
            
            User::set($userInfo->user);
            User::setRoles($userInfo->roles);
            $token = JWT::generate($userInfo);
            
            $this->responseToken($token);
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
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Application-Mode, authorization, sid,  Application-Id");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Allow: GET, POST, OPTIONS, PUT, DELETE");
        header('mode: init');
        //header('Content-Type: application/json; charset=utf-8');

        return json_encode($this->getResponse(), JSON_PRETTY_PRINT);
    }
}
