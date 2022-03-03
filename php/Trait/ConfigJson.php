<?php

trait ConfigJson{

	private function getConfigJson($name = null){
        if($name === null){
            $name = $this->name;
        }
        $file = Tool::getFileName($name);
        $json = null;
        if($file){
            $json = Store::getJson(Tool::loadFile($file));
        }
        
        return $json;
    }
}