<?php

namespace GT;

include_once SEVIAN_PATH . 'Sigefor/Element.php';
include_once SEVIAN_PATH . 'DB.php';
include_once SEVIAN_PATH . 'Interfaces.php';
include_once SEVIAN_PATH . 'Trait/ConfigJson.php';

use Tool, Store, DB, ConfigJson, Sigefor\Element;



class ConnectedInfo extends Element
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

        $win = [
            'width'=>'350px',
            'height'=>'200px',
            'bottom'=>'180px',
            'right'=>'50px',

            
            'resizable'=> true,
            'movible'=> false
        ];
        
        if($this->config->modal?? false){
            $win = [
                'mode'=>'modal',
                //'visibility'=>'hidden',
                'resizable'=>false,
                'movible'=> false
            ];
        }

        $this->addResponse([
            'mode'  => 'init',
            'type'  => 'element',
            'wc'    => 'gt-connected-info',
            'id'    => $this->id,
            'props' => [
                'name'  => $this->name,
                'caption'=>'Unidades Conectadas...',
                'dataSource' => [
                    'win'=>$win, 
                    'units'=>$this->lastUnits('panda')
                    
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


    public function lastUnits($user){

		$cn = DB::get();
		$path = PATH_IMAGES;
        $cn->query = "SELECT 
            u.id as unitId,
            vn.name as unitName,de.name as deviceId, 
            date_format(u.conn_date,'%d/%m/%Y') as lastDate, 
            date_format(u.conn_date,'%H:%m:%s') as lastTime, 
            u.conn_status as connected,
            TIMESTAMPDIFF(MINUTE, conn_date, now()) as delay,
            CASE u.conn_status WHEN 1 THEN 'Conectado' ELSE '-' END as statusName,
            0 as active
        
            FROM unit as u
            INNER JOIN user_unit as uu ON uu.unit_id = u.id
            INNER JOIN device as de ON de.id = u.device_id
    
            LEFT JOIN unit_name as vn ON vn.id = u.name_id
            LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id
            LEFT JOIN tracking as t ON t.unit_id = u.id AND u.tracking_date = t.date_time
    
            WHERE
            
                u.time > CURRENT_DATE() and uu.user = '$user'
            
            ORDER BY 2

        ";
		
		$result = $cn->execute();
        
        return $cn->getJsonAll($result);

        $data =  $cn->getJsonAll($result);


        $units = [];

        forEach($data as $unit){
            $units[$unit->unitId] = $unit;
        }
         
		return $units;
    }
}
