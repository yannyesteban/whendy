<?php

namespace GT;

include_once SEVIAN_PATH . 'Sigefor/Element.php';
include_once SEVIAN_PATH . 'DB.php';
include_once SEVIAN_PATH . 'Interfaces.php';
include_once SEVIAN_PATH . 'Trait/ConfigJson.php';

use Tool, Store, DB, ConfigJson, Sigefor\Element;

class UnitMenu extends Element
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
            'wc'    => 'gt-unit-menu',
            'id'    => $this->id,
            'props' => [
                'name'  => $this->name,
                'dataSource' => [

                    'unitData' => $this->loadUnits('panda')
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
        LIMIT 3
        ";

        $result = $cn->execute();

        $data = $cn->getDataAll($result);

        $items = [];
        $client = null;
        $account = null;

        $main = null;
        $main1 = null;
        foreach ($data as $index => $item) {
            if ($client != $item['client']) {
                $client = $item['client'];
                $main = (object)[
                    "caption" => $item['client'],
                    "addClass" => "client",
                    "value" => $item['clientId'],
                    "items" => [],
                    "checkbox"=>"true"

                ];
                $account = null;
                $items[] = $main;
            }

            if ($account != $item['account']) {

                $account = $item['account'];
                $main1 = (object)[
                    "caption" => $item['account'],
                    "addClass" => "account",
                    "value" => $item['accountId'],
                    "items" => [],
                    "checkbox"=>"true"

                ];
                $main->items[] = $main1;
            }

            $main1->items[] = [
                "caption" => $item['unitName'],
                "addClass" => "unit",
                "value" => $item['unitId'],
                'checkbox'=> "true",
            ];
        }


        return $items;
    }
}
