<?php

namespace GT;

include_once SEVIAN_PATH . 'Sigefor/Element.php';
include_once SEVIAN_PATH . 'DB.php';
include_once SEVIAN_PATH . 'Interfaces.php';
include_once SEVIAN_PATH . 'Trait/ConfigJson.php';

use Tool, Store, DB, ConfigJson, Sigefor\Element;

class Unit extends Element
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

            case 'load-unit-data':
                $this->addResponse([
                    'mode'  => 'init',
                    
                    
                    
                    'storeData' => [
                        'name'=> 'unit',
                        'data'  => $this->getUnitData('panda', $this->config->unitId?? 0, $this->config->active?? 0)
                        
                    ],
                    'replayToken' => $this->replayToken,
                    'setPanel' => $this->setPanel,
                    'appendTo' => $this->appendTo,
                ]);
                break;

            case 'load-units-status':
                
                $this->addResponse([

                    'storeData' => [
                        'name'=> 'units',
                        'data'  => $this->lastUnits('panda')
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
            'wc'    => 'gt-unit',
            'id'    => $this->id,
            'props' => [
                'name'  => $this->name,
                'dataSource' => [

                    "a"=>"esteban"
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


    public function getUnitData($user, $unitId, $active = 0){

		$cn = DB::get();
		$path = PATH_IMAGES;
        $cn->query = "SELECT
        u.id as unitId,
        ac.client_id as client_id,
        cl.name as client,
        u.account_id,
        ac.name as account,
        u.device_id,
        de.name as device_name,
        u.vehicle_id,
        vn.name as vehicle_name,
        CASE WHEN t.id IS NULL THEN 1 ELSE 0 END as noTracking,
        CASE WHEN t.id IS NULL THEN 0 ELSE 1 END as valid,
        vn.name as unitName,
        CONCAT('$path', ic.icon, '.png') as image, ve.plate, br.name as brand, mo.name as model, ve.color,
        u.conn_status as connected,

		t.id as trackId,
        t.date_time,
            t.longitude, t.latitude, t.speed, t.heading, t.altitude, t.satellite,
            t.event_id as eventId, t.mileage, t.input_status as inputStatus, t.voltage_level_i1 as voltageI1, t.voltage_level_i2 as voltageI2,
            t.output_status as outputStatus, t.battery_voltage as batteryVoltage,

            e.event_id as mainEvent,
            date_format(t.date_time, '%d/%m/%Y %T') as dateTime,
            date_format(t.date_time, '%T') as uTime,
            date_format(t.date_time, '%d/%m/%Y') as uDate,

            UNIX_TIMESTAMP(now()) as ts,
            IFNULL(e.title,'') as myEvent,
            de.name as event,m.name as device_model, v.version,IFNULL(v.name, '') as protocol, '$active' as active


        FROM unit as u
        INNER JOIN user_unit as uu ON uu.unit_id = u.id
        LEFT JOIN unit_name as vn ON vn.id = u.name_id

        LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id

        LEFT JOIN vehicle_brand as br ON br.id = ve.brand_id
        LEFT JOIN vehicle_model as mo ON mo.id = ve.model_id

        LEFT JOIN device as de ON de.id = u.device_id
        LEFT JOIN device_version as v on v.id = de.version_id
        LEFT JOIN device_model as m ON m.id = v.id_model
        LEFT JOIN device_name as dn ON dn.name = de.name


        LEFT JOIN icon as ic ON ic.id = u.icon_id

        LEFT JOIN account as ac ON ac.id = u.account_id
        LEFT JOIN client as cl ON cl.id = ac.client_id

        LEFT JOIN tracking as t ON t.unit_id = u.id AND t.date_time = u.tracking_date
      	LEFT JOIN event as e ON e.unit_id = t.unit_id AND e.date_time = t.date_time
        WHERE uu.user = '$user' and u.id = '$unitId'
        ORDER BY client, account, vehicle_name

        ";
		
		$result = $cn->execute();
		$data = $cn->getJson($result);

        //Tool::hx($cn->query);
		if($data->trackId??false){
			$io = $this->evalInput($user, $unitId, $data->inputStatus, $data->outputStatus);
			$data->inputs = $io['inputs'] ?? [];
			$data->outputs = $io['outputs'] ?? [];
		}
		
		//hx($cn->query);
        //print_r(json_decode(json_encode($data)));
        return json_decode(json_encode($data, JSON_NUMERIC_CHECK));
        
    }

	private function evalInput($user, $unitId, $input, $output){
		
        $cn = DB::get();

        $cn->query = "SELECT ui.unit_id as unitId,

		ui.type,

		'i' as ctype, number, ui.input_id as inputId, i.name,
		($input >> (number - 1 ))%2 as `on`,
		CASE ($input >> (number - 1 ))%2 WHEN 1 THEN value_on ELSE value_off END as value
				FROM unit_input as ui
				INNER JOIN input as i ON i.id = ui.input_id
				INNER JOIN user_unit as uu ON uu.unit_id = ui.unit_id
				WHERE uu.user = '$user' AND ui.unit_id = '$unitId' AND ui.type = 1

		union

		SELECT ui.unit_id as unitId,

		ui.type,

		'o' as ctype, number, ui.input_id as inputId, i.name,
		($output >> (number - 1 ))%2 as `on`,
		CASE ($output >> (number - 1 ))%2 WHEN 1 THEN value_on ELSE value_off END as value
				FROM unit_input as ui
				INNER JOIN input as i ON i.id = ui.input_id
				INNER JOIN user_unit as uu ON uu.unit_id = ui.unit_id
				WHERE uu.user = '$user' AND ui.unit_id = '$unitId' AND ui.type = 2

			ORDER BY unitId, type, number

		";

        $result = $cn->execute();
		$data = $cn->getDataAll($result);
		$inputs = [];
		$outputs = [];

		if(is_array($data)){

			$inputs = array_filter( $data, function( $v ) {
				return $v['type'] == 1;
			});

			$outputs = array_filter( $data, function( $v ) {
				return $v['type'] == 2;
			});
		}

		return [
			'inputs' => array_values($inputs),
			'outputs' => array_values($outputs),
		];



    }



    public function lastUnits($user){

		$cn = DB::get();
		$path = PATH_IMAGES;
        $cn->query = "SELECT 
            u.id as unitId,
            vn.name as name,de.name as device, 
            date_format(u.conn_date,'%d/%m/%Y') as lastDate, 
            date_format(u.conn_date,'%H:%m:%s') as lastTime, 
            u.conn_status as connected,
            TIMESTAMPDIFF(MINUTE, conn_date, now()) as delay,
            CASE u.conn_status WHEN 1 THEN 'Conectado' ELSE '-' END as status,
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

        $data =  $cn->getJsonAll($result);
        $units = [];

        forEach($data as $unit){
            $units[$unit->unitId] = $unit;
        }
         
		return $units;
    }

}
