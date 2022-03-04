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

    protected $acceptedRoles = [];
    static $_acceptedRoles = ['a', 'b', 'c'];

    static public function _acceptedRoles(){
        return self::$_acceptedRoles;
    }

    public function __construct($opt = [])
    {
        foreach ($opt as $k => $v) {
            $this->$k = $v;
        }
    }

    /* OK */
    public function evalMethod()
    {
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
