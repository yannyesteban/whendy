<?php
namespace WH;

interface IAppAmin{

    public function getModules();
    public function getCssSheets();
    public function getTemplate();

    public function setAppConfig($appConfig);

}

interface DBInfo{
    public function setDBInfo($info);
    public function getDBInfo();

}

interface IUserInfo{
    public function setUserInfo($info);
    public function getUserInfo();

}

interface IUserAdmin{

    public function getUserInfo();

}