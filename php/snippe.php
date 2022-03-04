<?php

$myReflection = new \ReflectionClass($class);
if ($myReflection->isSubclassOf('\WH\IPreConfig')) {
    $class::_loadPreConfig($info);
}



function setElement($info, $update = false)
{


    if ($info->id === 0 or $info->id === "0") {
        $info->id = $this->getReq("__sg_panel") ?? $this->defaultPanel;
    } elseif ($info->id === -1 or $info->id === "-1") {
        $info->id = $this->defaultPanel;
    }

    if (isset($this->_info[$info->id])) {
        if (!$info->element) {
            $info->element = $this->_info[$info->id]->element;
        }

        if (!$info->name) {
            $info->name = $this->_info[$info->id]->name;
        }
    }


    if (!isset($this->classElement[$info->element])) {
        return;
    }

    $info->async = $this->onAjax;

    $this->_info[$info->id] = $info;



    if (!isset($this->_userData[$info->id])) {
        $this->_userData[$info->id] = [];
    }
    $info->_data_user = $this->_userData[$info->id];
    /*
            $info = [
                "name"=>'',
                'eparams=>'',
                'id'=>'',
                'debug'='',
                'design'=>'',
                'userData'=>[]
            ]
    
            */

    \Store::setExp("ID_", $info->id);
    \Store::setExp("ELEMENT_", $info->element);
    //$this->setExp("NAME_", $info->name);
    \Store::setExp("ASYNC_", $info->async);
    if ($info->eparams ?? false) {
        foreach ($info->eparams as $k => $v) {
            //hr("$k -> $v");
            \Store::setExp($k, $v);
        }
    }

    $info->config->setPanel = $info->setPanel;
    $info->config->id = $info->id;
    $info->config->method = $info->method;
    $info->config->name = $info->name;
    $info->config->config = $info->config;
    $info->config->replayToken = $info->replayToken;

    $e = $this->_e[$info->id] = new $this->classElement[$info->element]($info->config);

    /*
            if (!isset($this->_pVars[$info->id])) {
                $this->_pVars[$info->id] = [];
            }
            $e->pVars = &$this->_pVars[$info->id];
            $e->setVPanel($this->_pVars[$info->id]);
            $e->gVars = &$this->_gVars;
            */

    $e->config();
    //$e->getSequenceBefore();
    $e->evalMethod();
    //$e->getSequenceAfter();

    if ($e instanceof \WH\UserAdmin and $userInfo = $e->getUserInfo()) {
        hx($userInfo);
        //$this->setUserInfo($userInfo);
    }


    $this->mergeResponse($e->getResponse());

    return;

    if ($e instanceof \Sevian\UserInfo) {
        $e->setUserInfo($this->getUserInfo());
    }
    $e->config();
    $e->getSequenceBefore();
    $e->evalMethod();
    $e->getSequenceAfter();


    if ($e instanceof \Sevian\ListenSigns) {
        $this->addTask($info->id, $e->getTaskXSigns());
    }

    if ($e instanceof \Sevian\DBInfo) {
        $dbInfo = $e->getDBInfo();
        foreach ($dbInfo as $k => $v) {
            Connection::set($k, $v);
        }
    }

    if ($e instanceof \Sevian\CSSDocAdmin) {
        $this->addCss($e->getCSSDocuments());
    }

    if ($e instanceof \Sevian\JsDocAdmin) {
        $this->addJs($e->getJsDocuments());
    }

    $this->addFrament($e->getResponse());



    if ($e instanceof \Sevian\TemplateAdmin) {
        if ($html = $e->getTemplate()) {
            $this->setTemplate($html);
        } elseif ($e->getThemeTemplate()) {
            $this->templateName = $e->getThemeTemplate();
        }
    }

    if ($e instanceof \Sevian\WindowsAdmin and $windows = $e->getWindows()) {
        $this->_windows = $windows;
    }

    if ($e instanceof \Sevian\JsonRequest) { // and $_jsonRequest = $e->getRequest()
        $this->_jsonRequest = $e->getRequest();
    }

    $this->_response = array_merge($this->_response, $e->getResponse());

    if ($e instanceof \Sevian\PanelsAdmin and $panels = $e->getPanels()) {
        foreach ($panels as $k => $p) {
            $this->setElement($p);
        }
    }

    if ($info->mode == 'panel') {
        $this->addPanel($e);
        //$this->_str->addPanel($info->id, $e->getPanel());
        $this->_str->addPanel($info->id, $e);
        $info->update = true;
        $info->isPanel = true;
    }


    $sign = "$info->element:$info->name:$info->method";

    foreach ($this->_tasks as $_id => $task) {
        //hr($sign,"blue");
        //hx($task,"red");


        if (isset($task[$sign])) {
            $this->sequence($task[$sign]);
        }
    }
}
