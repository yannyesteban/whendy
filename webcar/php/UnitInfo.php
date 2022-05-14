<?php

namespace GT;

include_once SEVIAN_PATH . 'Sigefor/Element.php';
include_once SEVIAN_PATH . 'DB.php';
include_once SEVIAN_PATH . 'Interfaces.php';
include_once SEVIAN_PATH . 'Trait/ConfigJson.php';

use Tool, Store, DB, ConfigJson, Sigefor\Element;

class UnitInfo extends Element
{

    private $templateFile = "";


    public function __construct($config = null)
    {

        Element::__construct($config);
    }

    public function evalMethod($method = false): bool
    {

        if ($method) {
            $this->method = $method; //$method = $this->method;
        }

        switch ($this->method) {
            case 'init':
                $this->load();
                break;
            case 'login':

                break;
        }

        return true;
    }


    public function load()
    {

        $win = [
            'width'=>'350px',
            'height'=>'200px',
            'top'=>'150px',
            'right'=>'50px',

            
            'resizable'=> true,
            'movible'=> false
        ];
        
        if($this->config->modal?? false){
            $win = [
                'mode'=>'modal',
                'resizable'=>false,
                'movible'=> false
            ];
        }

        //Tool::hx($win);
        

        $this->popupFile =  TEMPLATES_PATH.'info/unit-popup.html';
        $template = Store::loadFile($this->popupFile);

        //Tool::hx($template);


        $this->addResponse([
            'mode'  => 'init',
            'type'  => 'element',
            'wc'    => 'gt-unit-info',
            'id'    => $this->id,
            'props' => [
                'name'  => $this->name,
                'caption'=>'Info--->',
                'template' => $template,
                'dataSource' => [
                    'win'=>$win
                    
                ],
            ],
            'replayToken' => $this->replayToken,
            'setPanel' => $this->setPanel,
            'appendTo' => $this->appendTo,
        ]);
    }


    private function loadUnits($user)
    {

        $cn = DB::get();
        $cn->query = "SELECT
        u.id as unitId, vn.name as unitName,
        ac.client_id as clientId,
        cl.name as client,
        u.account_id as accountId,
        ac.name as account

        FROM unit as u
        INNER JOIN user_unit as uu ON uu.unit_id = u.id
        INNER JOIN account as ac ON ac.id = u.account_id
        INNER JOIN client as cl ON cl.id = ac.client_id
        LEFT JOIN unit_name as vn ON vn.id = u.name_id

        WHERE uu.user = '$user'
        ORDER BY client, account, unitName
        #LIMIT 50
        ";

        $result = $cn->execute();

        return $cn->getDataAll($result);

      


      
    }
}
