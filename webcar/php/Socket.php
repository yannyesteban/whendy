<?php

namespace GT;

include_once SEVIAN_PATH . 'Sigefor/Element.php';
include_once SEVIAN_PATH . 'DB.php';
include_once SEVIAN_PATH . 'Interfaces.php';
include_once SEVIAN_PATH . 'Trait/ConfigJson.php';

use Tool, Store, DB, ConfigJson, Sigefor\Element;



class Socket extends Element
{

    private $popupTemplate = '';
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


        $this->popupFile =  TEMPLATES_PATH.'info/unit-popup.html';
        $this->template = Store::loadFile($this->popupFile);

        
        $this->addResponse([
            'mode'  => 'init',
            'type'  => 'element',
            'wc'    => 'gt-map',
            'id'    => $this->id,
            'props' => [
                'api'=>'google',
                'popupTemplate' => Store::loadFile($this->popupFile),
                'dataSource' => [

                    'marks' => [],
                    
                    
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
