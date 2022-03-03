<?php
namespace WH;

include_once 'AppElement.php';
include_once 'Interfaces.php';

use ConfigJson, WH\IUserInfo;

class App extends AppElement{

    static $patternJsonFile = '';
    
    public function __construct($config = null){

        AppElement::__construct($config);

    }

    public function evalMethod($method = false): bool{
		
		if($method){
            $this->method = $method;//$method = $this->method;
		}

        switch ($this->method){
            case 'init':
                $this->load();
                break;            
            case 'load':
                $this->load();
                break;
        }
		
		
		
		
		return true;
	}

    public function load(){
        $this->addResponse([
            'mode'  => 'update',
            'id'    => $this->id,
            'props'  =>[
                'unitData'      => "12474737",
                'innerHTML'=>"hello"
            ],
            'replayToken'=>$this->replayToken
        ]);	
    }

}