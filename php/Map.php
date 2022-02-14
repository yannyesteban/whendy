<?php

include_once 'Element.php';

class Map extends Element{

    static $patternJsonFile = '';
    
    public function __constructor(){
        echo "555";
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
			'id'		=> $this->id,
			'title'		=> 'MAP',
			'iClass'	=> 'WHMap',
            'component' => 'wh-map',
			//'html'		=> $this->panel->render(),
			'script'	=> '',
			'css'		=> '',
			'config'	=> [
                "a"=>9999
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
