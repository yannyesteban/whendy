<?php
namespace WH;

include_once 'Element.php';
include_once 'Interfaces.php';


class Html extends \Element{

    static $patternJsonFile = '';
    
    public function __construct($config = null){

        \Element::__construct($config);

    }

    public function evalMethod($method = false): bool{
		
		if($method){
            $this->method = $method;//$method = $this->method;
		}
        
        switch ($this->method){
            case 'load':
                $this->load();
        }
		
		
		
		
		return true;
	}

    public function load(){
        $this->addResponse([
            'mode'  => 'init',
            'type'  => 'element',
            'wc'=>'wh-html',
            'id'    => $this->id,
            'props'  =>[
                
                'innerHTML'=>'Hola Mundo !!!'.$this->name
            ],
            'replayToken'=>$this->replayToken,
            'setPanel'=>$this->setPanel
        ]);	
    }

}