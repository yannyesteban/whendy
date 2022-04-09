<?php

namespace GT;

include_once SEVIAN_PATH . 'Sigefor/Element.php';
include_once SEVIAN_PATH . 'DB.php';
include_once SEVIAN_PATH . 'Interfaces.php';
include_once SEVIAN_PATH . 'Trait/ConfigJson.php';

use Tool, Store, DB, ConfigJson, Sigefor\Element;

class UnitStore extends Element
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
                $this->load();
                break;
            case 'login':

                break;
        }

        return true;
    }


    public function load()
    {

        //$json = $this->getConfigJson();
        //print_r($this->setPanel);exit;
        //Tool::hx($this->loadUnits('panda'));
        $this->addResponse([
            'mode'  => 'init',
            'type'  => 'element',
            'wc'    => 'gt-unit-store',
            'id'    => $this->id,
            'props' => [
                'name'  => $this->name,
                'interval'=>"10",
                'delay'=>"10",
                'dataSource'=>'STORE'
                //'dataSource' => ['data'=>$this->loadUnits('panda')],
            ],
            'replayToken' => $this->replayToken,
            'setPanel' => $this->setPanel,
            'appendTo' => $this->appendTo,
        ]);


        //Tool::hx(8);
        
    }


    private function loadUnits($user)
    {

        $cn = DB::get();
        $cn->query = "SELECT u.id as `value` , COALESCE(vn.name, '  -- undefined --') as `text` 
            FROM unit as u 
            INNER JOIN user_unit as uu ON uu.unit_id = u.id 
            LEFT JOIN unit_name as vn ON vn.id = u.name_id 
            LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id 
            WHERE uu.user = '$user' 
            ORDER BY text
        ";

        $result = $cn->execute();

        return $cn->getDataAll($result);
    }
}
