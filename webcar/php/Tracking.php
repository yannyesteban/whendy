<?php

namespace GT;

include_once SEVIAN_PATH . 'Sigefor/Element.php';
include_once SEVIAN_PATH . 'DB.php';
include_once SEVIAN_PATH . 'Interfaces.php';
include_once SEVIAN_PATH . 'Trait/ConfigJson.php';

use Tool, Store, DB, ConfigJson, Sigefor\Element;

class Tracking extends Element
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
                Store::setSes('time', $this->getTime());
                break;
            case 'tracking-data':
                $this->trackingData('panda');
                break;                
            case 'load-unit-data':
                $this->addResponse([
                    'mode'  => 'init',
                    
                    
                    
                    'storeData' => [
                        'name'=> 'unit',
                        'data'  => $this->getUnitData('panda', $this->config->unitId?? 0)
                        
                    ],
                    'replayToken' => $this->replayToken,
                    'setPanel' => $this->setPanel,
                    'appendTo' => $this->appendTo,
                ]);


                break;
        }

        return true;
    }


    public function load()
    {

        
        $this->addResponse([
            'mode'  => 'init',
            'type'  => 'element',
            'wc'    => 'gt-tracking',
            'id'    => $this->id,
            'props' => [
                
                'dataSource' => [

                    'unitData' => 'Hola Tracking'
                ],
            ],
            'replayToken' => $this->replayToken,
            'setPanel' => $this->setPanel,
            'appendTo' => $this->appendTo,
        ]);
    }

    
    private function trackingData($uset){
        $time = Store::getSes('time');
        $this->addResponse([
            'mode'  => 'init',
            
            
            
            'storeData' => [
                'name'=> 'tracking',
                'data'  => $this->updateTracking('panda', $time)
                
            ],
            'replayToken' => $this->replayToken,
            'setPanel' => $this->setPanel,
            'appendTo' => $this->appendTo,
        ]);
        Store::setSes('time', $this->getTime());

        $time = Store::getSes('time');
        $this->addResponse([
            'mode'  => 'init',
            
            
            
            'storeData' => [
                'name'=> 'last-time',
                'data'  => $time
                
            ],
            'replayToken' => $this->replayToken,
            'setPanel' => $this->setPanel,
            'appendTo' => $this->appendTo,
        ]);
        
    }


    private function getTime(){
		$cn = DB::get();
        $cn->query = "SELECT now() as time";

        $result = $cn->execute();
		$time = "";
		if($rs = $cn->getDataAssoc($result)){
			$time = $rs['time'];
		}

        return $time;
	}

    private function updateTracking($user, $time){

        $cn = DB::get();

        $cn->query = "SELECT u.id as unitId, u.conn_status as connected, t.id as tracking_id,
        	UNIX_TIMESTAMP(now()) as ants, now() as time_now,
			u.conn_status  as connected,
        	CASE u.conn_status WHEN 1 THEN 'Conectado' ELSE '-' END as str_status,
             t.device_id as deviceId, t.date_time,
            t.longitude, t.latitude, t.speed, t.heading, t.altitude, t.satellite,
            t.event_id as eventId, t.mileage, t.input_status as inputStatus, t.voltage_level_i1 as voltageI1, t.voltage_level_i2 as voltageI2,
            t.output_status as outputStatus, t.battery_voltage as batteryVoltage,

            e.event_id as mainEvent,
            date_format(t.date_time, '%d/%m/%Y %T') as dateTime,
            date_format(t.date_time, '%T') as uTime,
            date_format(t.date_time, '%d/%m/%Y') as uDate,

            UNIX_TIMESTAMP(now()) as ts,
            IFNULL(e.title,'') as myEvent, de.name as event,

         (input_status >> (1-1)) % 2 as i1,
         (input_status >> (2-1)) % 2 as i2,
         (input_status >> (3-1)) % 2 as i3,
         (input_status >> (4-1)) % 2 as i4,
         (input_status >> (5-1)) % 2 as i5,
         (input_status >> (6-1)) % 2 as i6,
         (input_status >> (7-1)) % 2 as i7,
         (input_status >> (8-1)) % 2 as i8,

         (output_status >> (1-1)) % 2 as o1,
         (output_status >> (2-1)) % 2 as o2,
         (output_status >> (3-1)) % 2 as o3,
         (output_status >> (4-1)) % 2 as o4,
         (output_status >> (5-1)) % 2 as o5,
         (output_status >> (6-1)) % 2 as o6,
         (output_status >> (7-1)) % 2 as o7,
         (output_status >> (8-1)) % 2 as o8

        FROM unit as u
        INNER JOIN user_unit as uu ON uu.unit_id = u.id


        INNER JOIN tracking as t ON u.id = t.unit_id AND t.date_time = u.tracking_date

        LEFT JOIN device as v ON v.id = u.device_id
        LEFT JOIN device_event de ON de.version_id = v.version_id AND de.event_id = t.event_id

        LEFT JOIN event as e ON e.unit_id = t.unit_id AND e.date_time = t.date_time

        WHERE  uu.user='$user' and u.time > '$time'

        ORDER BY t.date_time
        ";



		$result = $cn->execute();
		$tracking = $cn->getDataAll($result);
        $tracking = $this->getDataInput($user, $tracking);
        $tracking = json_decode(json_encode($tracking, JSON_NUMERIC_CHECK));
        return $tracking;
        $units = [];

        forEach($tracking as $unit){
            $units[$unit->unitId] = $unit;
        }
         
		return $units;
		
        //return $this->getDataInput($user, $tracking);
    }


    private function getDataInput($user, $tracking){
        $dataUnitInput = $this->loadConfigInput($user);
        if(count($dataUnitInput ) <= 0){
            return $tracking;
        }

        $data = array_map(function($item) use($dataUnitInput){

            if(!isset($item['unitId']) or !isset($dataUnitInput[$item['unitId']])){
                return $item;
            }
            $dataInput = $dataUnitInput[$item['unitId']];

            $item['iInputs'] = [];
            $item['inputs'] = [];
            $item['outputs'] = [];
            foreach($dataInput as $k => $v){
                if(isset($item[$k]) && $item[$k]==1){
                    $item['in'.$v['input_id']] = "on";
                }else{
                    $item['in'.$v['input_id']] = "off";
                }

                $item['iInputs'][] = [
                    'id'=>$v['input_id'],
                    'on'=>(isset($item[$k]) && $item[$k]==1),
                    'name'=>$v['name'],
                    'value'=>(isset($item[$k]) && $item[$k]==1)? $v['value_on']: $v['value_off'],
                    'type'=>$v['ctype']
                ];
                if($v['ctype'] == 'i'){
                    $item['inputs'][] = [
                        'id'=>$v['input_id'],
                        'on'=>(isset($item[$k]) && $item[$k]==1),
                        'name'=>$v['name'],
                        'value'=>(isset($item[$k]) && $item[$k]==1)? $v['value_on']: $v['value_off'],
                        'type'=>$v['ctype']
                    ];
                }
                if($v['ctype'] == 'o'){
                    $item['outputs'][] = [
                        'id'=>$v['input_id'],
                        'on'=>(isset($item[$k]) && $item[$k]==1),
                        'name'=>$v['name'],
                        'value'=>(isset($item[$k]) && $item[$k]==1)? $v['value_on']: $v['value_off'],
                        'type'=>$v['ctype']
                    ];
                }

            }
            return $item;
        }, $tracking);

        return $data;
    }


    private function loadConfigInput($user){
        $cn = DB::get();

        $cn->query = "SELECT CASE i.type WHEN 1 THEN 'i' ELSE 'o' END as ctype, i.type,ui.number, i.id as input_id, i.name,ui.unit_id, value_on, value_off
        FROM unit_input as ui
        INNER JOIN input as i ON i.id = ui.input_id
        INNER JOIN user_unit as uu ON uu.unit_id = ui.unit_id
        WHERE uu.user = '$user'
        ORDER BY i.type, number";
        $result = $cn->execute();
		$data = $cn->getDataAll($result);
        $dataInput = [];

        foreach($data as $k => $v){
            $dataInput[$v['unit_id']][$v['ctype'].$v['number']] = $v;
        }

        return $dataInput;

    }
   
	
}
