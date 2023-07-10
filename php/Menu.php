<?php

namespace WH;

include_once 'Sigefor/Element.php';
include_once 'DB.php';
include_once 'Interfaces.php';
include_once 'Trait/ConfigJson.php';

use Tool, Store, DB, ConfigJson, Sigefor\Element;

class Menu extends Element{

    use ConfigJson;

    protected $tUsers = "_sg_users";
    protected $tGroups = "_sg_groups";
    protected $tGroUsr = "_sg_grp_usr";

    static $patternJsonFile = '';


    public function __construct($config = null){

        Element::__construct($config);

    }

    public function evalMethod($method = false): bool{
		
		if($method){
            $this->method = $method;//$method = $this->method;
		}
        
        switch ($this->method){
            case 'init':
                $this->load();
                break;
            case 'login':
                
                break;                
        }
		
		return true;
	}

    public function load(){
        
        //$json = $this->getConfigJson();
        //print_r($this->setPanel);exit;
       //Tool::hx($this->setPanel);
        $this->addResponse([
            'mode'  => 'init',
            'type'  => 'element',
            'wc'    =>'wh-menu',
            'id'    => $this->id,
            'props' =>[
                'name'  =>$this->name,
                'dataSource'=>$this->menu,
            ],
            'replayToken'=>$this->replayToken,
            'setPanel'=>$this->setPanel,
            'appendTo'=>$this->appendTo,
        ]);	
    }
}