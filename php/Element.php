<?php

class Element
{
    
    public $id = '';
    public $name = '';
    public $eparams = [];
    public $setPanel = null;
    public $method = '';
    
    public $replayToken = false;

    protected $onDesing = true;
    protected $onDebug = true;

    protected $_response =  [];

    public function __construct($opt = [])
    {
        foreach ($opt as $k => $v) {
            $this->$k = $v;
        }
    }

    /* OK */
    public function config()
    {
    }

    /* OK */
    public function evalMethod()
    {
    }

    /* OK */
    public function setPanel($panel)
    {
        $this->_panel = $panel ;
    }

    /* OK */
    public function getPanel()
    {
        if (isset($this->_panel)) {
            return $this->_panel;
        }
        return $this->panel;
    }

    


   
    public function addResponse($response)
    {
        $this->_response[] = (object)$response;
    }

    public function getResponse()
    {
        return $this->_response;
    }

    
}
