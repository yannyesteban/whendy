<?php

namespace WH;

include_once 'Sigefor/Element.php';
include_once 'Store.php';
include_once 'Element.php';
include_once 'Interfaces.php';

use Store;

class Fragment extends \Sigefor\Element
{

    static $patternJsonFile = '';

    public $templateFile = "";
    public $template = "";

    public function __construct($config = null)
    {

        \Element::__construct($config);
    }

    public function evalMethod($method = false): bool
    {

        if ($method) {
            $this->method = $method; //$method = $this->method;
        }

        switch ($this->method) {
            case 'load':
                $this->load();
        }




        return true;
    }

    public function load()
    {


        $this->template = Store::loadFile($this->templateFile);


        $this->addResponse([
            'mode'  => 'init',
            'type'  => 'element',
            'wc' => 'wh-html',
            'id'    => $this->id,
            'props'  => [

                'innerHTML' => $this->template
            ],
            'replayToken' => $this->replayToken,
            'setPanel' => $this->setPanel
        ]);
    }
}
