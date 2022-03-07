<?php

namespace WH;



include_once 'DB.php';
include_once 'Element.php';
include_once 'Interfaces.php';
include_once 'Trait/ConfigJson.php';

use Tool, Store, DB, ConfigJson;

class UserAdmin extends \Element implements IUserAdmin{

    use ConfigJson;

    protected $tUsers = '_sg_users';
    protected $tGroups = '_sg_groups';
    protected $tGroUsr = '_sg_grp_usr';

    static $patternJsonFile = '';
    protected $user = '';
    protected $roles = [];

    public function __construct($config = null){

        \Element::__construct($config);

    }

    public function evalMethod($method = false): bool{
		
		if($method){
            $this->method = $method;//$method = $this->method;
		}
        
        switch ($this->method){
            case 'form':
                $this->form();
                break;
            case 'login':

                $user = Store::getReq('user');
                $pass = Store::getReq('pass');
                $this->dbLogin($user, $pass);
                
                break;                
        }
		
		return true;
	}

    public function form(){

        $json = $this->getConfigJson();

        
        $this->addResponse([
            'mode'  => 'init',
            'type'  => 'element',
            'wc'=>'wh-html',
            'id'    => $this->id,
            'props'  =>[
                'name'=>$this->name,
                'innerHTML'=>Tool::loadFile('templates/login.html'),
                'json'=>$json
            ],
            'replayToken'=>$this->replayToken,
            'setPanel'=>$this->setPanel
        ]);	
    }

    public function getUserInfo(){
        return [
            'user'=>$this->user,
            'roles'=>$this->roles
        ];
    }

    private function dbLogin($user, $pass){

        
		$cn = DB::get();
        $security = 'md5';
        $_user = $cn->addSlashes($user);
        $error = 0;



		$cn->query = "
			SELECT * 
			FROM $this->tUsers 
			WHERE user = '$_user'";
        //hx($cn->query);
		
        $result = $cn->execute();
        
        $this->auth = false;
        
		if($rs = $cn->getDataAssoc($result)){
           
            if($rs['pass'] === $security($pass)){

                if($rs['status'] != 1){
                    // user not active
                    $error = 3;  
                }elseif($rs['expiration'] != '' and $rs['expiration'] != '0000-00-00' and $rs['expiration'] < date('Y-m-d')) {
                    // the pass is expired
                    $error = 4; 
                }else{
                    $auth = true;
                    // OK
                    $error = 0;
                }
                
            }else{
                // pass is wrong
                $error = 2; 
            }
            
		}else{
            // user not found
		    $error = 1;
        }
        if($error === 0){
            $this->user = $user;
            $this->roles = $this->dbRoles($user);
        }
    }

    private function dbRoles($user){

		$cn = DB::get();
        $security = 'md5';
        $_user = $cn->addSlashes($user);
		$cn->query = "
			SELECT gu.group 
			FROM $this->tGroUsr as gu
			WHERE user = '$_user'";

		$result = $cn->execute();
		$data = $cn->getDataAll($result);
        return array_column($data, 'group');
    }
}