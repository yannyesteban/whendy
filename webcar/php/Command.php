<?php

namespace GT;

include_once SEVIAN_PATH . 'Sigefor/Element.php';
include_once SEVIAN_PATH . 'DB.php';
include_once SEVIAN_PATH . 'Interfaces.php';
include_once SEVIAN_PATH . 'Trait/ConfigJson.php';

use stdClass;
use Tool, Store, DB, ConfigJson, Sigefor\Element;

class Command extends Element
{

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
                $this->load('panda', $this->config->unitId?? 0);
                break;
            case 'load-unit-data':
                //Tool::hx($this->config->unitId);
                $this->addResponse([
                    'data'=>$this->loadProtocol('panda', $this->config->unitId?? 0)
                ]);
                
                break;
        }

        return true;
    }


    public function load($user, $unitId)
    {

        //Tool::hx($unitId);
        
        $this->addResponse([
            'mode'  => 'init',
            'type'  => 'element',
            'wc'    => 'gt-command',
            'id'    => $this->id,
            'props' => [
                'name'  => $this->name,
                'caption'=>'COMM: ',
                'dataSource' => [
                    'caption'=>'COMM: ',
                    "protocol"=>$this->loadProtocol('panda', $this->config->unitId?? 0)
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

    private function loadProtocol($user, $unitId)
    {

        $cn = DB::get();
        $cn->query = "SELECT p.*, n.name as unitName

        FROM unit as u
        INNER JOIN unit_name as n ON n.id = u.name_id
        LEFT JOIN device as d ON d.id = u.device_id
        
        INNER JOIN user_unit as uu ON uu.unit_id = u.id

        LEFT JOIN protocol as p ON p.id = d.version_id
        WHERE u.id = '$unitId' AND uu.user= '$user'

        
        ";

        //Tool::hx($cn->query);
        $result = $cn->execute();

        $data = [];
        if($data = $cn->getDataAssoc($result)){
            $unitName = $data['unitName'];
            if($data['document']){
                $data = json_decode($data['document']);
            }else{
                $data = new stdClass;
            }
            
            $data->unitId = $unitId;
            $data->unitName = $unitName;
            $data->user = $user;
        }

        //Tool::hx($cn->getDataAssoc($result));
       
        //Tool::hx($data);
        return $data;

      


      
    }
}
