<?php

include_once 'Element.php';

class Map extends Element{

    static $patternJsonFile = '';
    
    public function __construct($config = null){

        Element::__construct($config);

    }

    public function evalMethod($method = false): bool{
        
        if ($method === false) {
            $method = $this->method;
        }

        switch ($method) {
            case 'load':
                $this->load();
                break;
        }

        return true;
    }

    public function load(){
        $this->setInfoElement([
            'type'      => 'element',
            'setPanel'=> $this->setPanel,
			'id'		=> $this->id,
			'title'		=> 'MAP',
			'iClass'	=> 'WHMap',
            'component' => 'wh-map',
            'replayToken'=>$this->replayToken,
			//'html'		=> $this->panel->render(),
			'script'	=> '',
			'css'		=> '',
			'config'	=> [
                "length"=>12474737
            ]
			
		]);
    }

    public function update(){
        $this->addResponse([
            'type'  =>'',
            'id'    =>$this->id,
            'data'  =>[
                'unitData'      => "12474737",
            ],
            'replayToken'=>$this->replayToken
        ]);	
        
    }
}
