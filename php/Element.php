<?php

class Element
{
    public $async = false;
    
    public $setPanel = null;
    
    public $elementId = null;
    public $name = '';
    public $eparams = [];
    public $updated = false;
    public $replayToken = false;

    protected $_panel = null;
    protected $_init = null;
    private $_jsActions = [];

    protected $onDesing = true;
    protected $onDebug = true;

    public $jsClassName = '';
    /* to here */
    public $id = null;
    public $method = '';

    private static $_elementName = [];
    public $element = "default";

    public $title = '';
    public $panel = null;
    public $containerId = null;

    protected $_res = [];

    public $_data_user = [];

    protected $_signs = null;
    protected $_listen = null;
    protected $_secBefore = null;
    protected $_secAfter = null;
    protected $_config = [];
    protected $_response = [];
    protected $_infoElement = null;
    protected $_jsElement = [];
    protected $_components = null;
    protected $typeElement = "panel";
    protected $info = null;
    protected $panelActions = null;
    protected $_configInput = null;

    protected $_vPanel = [];

    public function __construct($opt = [])
    {
        foreach ($opt as $k => $v) {
            $this->$k = $v;
        }
    }
    public function getInfoElement()
    {
        return $this->_infoElement;
    }

    public function setInfoElement($infoElement)
    {
        $this->_response[] = $infoElement;
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

    /* OK */
    public function setInit($info)
    {
        $this->_init = $info;
    }

    /* OK */
    public function getInit()
    {
        return $this->_init;
    }

    /* OK */
    public function setJSActions($info)
    {
        $this->_jsActions = $info;
    }

    /* OK */
    public function getJSActions()
    {
        return $this->_jsActions;
    }

    /* OK */
    public function getJSClass()
    {
        return $this->jsClassName;
    }


   
    public function addResponse($response)
    {
        $this->_response[] = $response;
    }

    public function getResponse()
    {
        return $this->_response;
    }

    public function addFragment($frag)
    {
        $this->_response[]=$frag;
    }

    public function getResponse2()
    {
        return $this->_response;
    }

    public function getSequenceBefore()
    {
        return $this->_secBefore;
    }

    public function getSequenceAfter()
    {
        return $this->_secAfter;
    }

    public function addConfig($config)
    {
        $this->_config = array_merge($this->_config, $config);
    }



    public static function setElementName($name)
    {
        self::$_elementName[get_called_class()] = $name;
    }
    public static function getElementName()
    {
        return self::$_elementName[get_called_class()];
    }
    public function getPanelId()
    {
        return self::$_elementName[get_called_class()].'_'.$this->id;
        //return get_called_class().'_'.$this->id;
    //return static::$_element'_'.$this->id;
    }

    public function getConfigPanel()
    {
        return $this->_configPanel;
    }

    

   

    public function _addJsElement($opt)
    {
        $this->_jsElement[] = $opt;
    }
    public function _getJsElement()
    {
        return $this->_jsElement;
    }

    public function configInput()
    {
        return $this->_configInput;
    }
    
    public function getJsonComponents()
    {
        return $this->_components?? [];
    }
    public function setVPanel(&$var)
    {
        $this->_vPanel = &$var;
    }
    public function &getVPanel()
    {
        return $this->_vPanel;
    }
    public function setSes($key, $value)
    {
        $this->_vPanel[$key] = $value;
    }
    public function &getSes($key)
    {
        return $this->_vPanel[$key];
    }
}
