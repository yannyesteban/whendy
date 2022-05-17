<?php

namespace GT;

include_once SEVIAN_PATH . 'Sigefor/Element.php';
include_once SEVIAN_PATH . 'DB.php';
include_once SEVIAN_PATH . 'Interfaces.php';
include_once SEVIAN_PATH . 'Trait/ConfigJson.php';

use stdClass;
use Tool, Store, DB, ConfigJson, Sigefor\Element;

class RapidCommand extends Element
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
                $this->load('panda', $this->config->unitId ?? 0);
                break;
            case 'load-unit-data':
                //Tool::hx($this->config->unitId);
                $this->addResponse([
                    'data' => $this->loadProtocol('panda', $this->config->unitId ?? 0)
                ]);

                break;
            case 'load-command-data':
                $this->addResponse([
                    'replayToken' => $this->replayToken,
                    'data' => $this->loadCommand('panda', $this->config->unitId ?? 0, $this->config->command ?? 0, $this->config->role ?? 0, $this->config->index ?? 0, 
                            $this->config->mode ?? 1, $this->config->buttons ?? 1, $this->config->last ?? false)
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
            'wc'    => 'gt-rapid-command',
            'id'    => $this->id,
            'props' => [
                'name'  => $this->name,
                'caption' => 'COMM: ',
                'dataSource' => [
                    'caption' => 'RAPID COMMAND: ',
                    "protocol" => $this->loadProtocol('panda', $this->config->unitId ?? 0)
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

        
        $result = $cn->execute();

        $data = [];
        if ($data = $cn->getDataAssoc($result)) {
            $unitName = $data['unitName'];
            if ($data['document']) {
                $data = json_decode($data['document']);
            } else {
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

    private function loadCommand($user, $unitId, $command, $role = '', $index = 0, $mode = 1, $buttons = [], $last = false)
    {

        $cond = "pc.command = '$command'";
        if($role){
            $cond = "pc.role = '$role'";
        }
        
        $cn = DB::get();
        $cn->query = "SELECT u.id as unitId, n.name as unitName, CASE WHEN uc.id IS NOT NULL THEN 2 ELSE 1 END as _mode,
                        pc.*, uc.name, uc.params, uc.query, uc.values,
                        p.document->'$.actions' as actions, p.id as versionId
        
                    FROM unit as u
                    INNER JOIN unit_name as n ON n.id = u.name_id
                    INNER JOIN user_unit as uu ON uu.unit_id = u.id
                    LEFT join device as d ON d.id = u.device_id
                    LEFT JOIN protocol as p ON p.id = d.version_id
                    LEFT JOIN json_table(document,
                        '$.commands[*]' columns
                            (
                                command varchar(100) path '$.command',
                                command_doc json path '$',
                                role varchar(100) path '$.role'

                            )
                        ) as pc ON $cond

                    LEFT JOIN unit_cmd as uc ON uc.unit_id = u.id and uc.index = '$index' AND uc.command = pc.command
                    WHERE u.id = '$unitId' AND uu.user= '$user'";

        //Tool::hx($cn->query);
        //Tool::hx($cn->query);
        $result = $cn->execute();

        $data = new stdClass;
        if ($rs = $cn->getDataAssoc($result)) {
            $unitName = $rs['unitName'];
            if ($rs['command_doc']) {
                $data = json_decode($rs['command_doc']);
            }

            $data->unitId = $unitId;
            $data->unitName = $unitName;
            $data->user = $user;

            $data->name = $rs['name'];
            

            if ($rs['params']) {
                $data->params = json_decode($rs['params']);
            }

            if ($rs['query']) {
                $data->query = json_decode($rs['query']);
            }

            if ($rs['values']) {
                $data->values = json_decode($rs['values']);
            }

            if ($rs['actions']) {
                $data->actions = json_decode($rs['actions']);
               
                foreach($buttons as $button){
                   
                    if( $data->actions->$button){
                        $data->$button = $data->actions->$button;
                    }
                }
            }

            $data->_mode = $rs['_mode'];

            $data->onSend = "Enviar";

            $data->index = $index;

            $data->buttons = $buttons;

            $data->last = $last;

            $data->versionId = $rs['versionId'];
            
            
        }

        //Tool::hx($cn->getDataAssoc($result));

        //Tool::hx($data);
        return $data;
    }
}
