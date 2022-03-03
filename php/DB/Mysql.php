<?php

namespace Sevian\DB;

class Mysql extends DBase{
	
	public $driver = "mysql";
	public $quote = "`";

	public $server = "localhost";
	public $user = "root";
	public $pass = '';
	public $database = '';
	public $port = '';
	public $charset = "utf-8";
	
	
	public $result = false;
	public $pagination = false;
	public $page = 1;
	public $pageLimit = 10;
	public $errno = 0;


	public $error = false;
	public $lastId = false;
	public $affectedRows = false;	
	private $c = null;
	
	public function __construct($server='', $user='', $pass='', $database='', $port='', $charset='') {
		
		$this->connect($server, $user, $pass, $database, $port, $charset);		
		
	}

	public function connect($server='', $user='', $pass='', $dbase='', $port='', $charset='') {
		
		if ($server!=''){
			$this->server = $server;
        }
		if ($user!=''){
			$this->user = $user;
        }
		if ($pass!=''){
			$this->pass = $pass;
        }
		if ($dbase!=''){
			$this->dbase = $dbase;
        }
		if ($port!=''){
			$this->port = $port;
        }
		if ($charset!=''){
			$this->charset = $charset;
        }
	    $this->c = new \mysqli($this->server, $this->user, $this->pass, $this->dbase);
		//$this->c->set_charset('latin1');
		//hr($this->charset);
		//$this->c->set_charset($this->charset);
		if (!$this->c->connect_errno){
			$this->status = true;
		}		
		
		
	}

	public function close(){
		
		$this->c->close();	
	}
	
	public function execute($query = '', $evalMeta = false){

		if ($query != ''){
			$this->query = $query;
        }		
		
		if($evalMeta){
			$this->query = $this->metaFunctions($this->query);
			
		}
		
		$this->error = false;
		$this->errno = false;
		$this->lastId = false;
		$this->affectedRows = false;
		
		$this->query = preg_replace('/;+$/', '', $this->query);
		$this->fieldCount = false;
		$this->pageCount = 0;
		
		if($this->result = $this->_query($this->query)){
			
			if(isset($this->result->field_count)){
				$this->fieldCount = $this->result->field_count;
			}
		}
		
		if($this->c->errno){
			$this->error = $this->c->error;
			$this->errno = $this->c->errno;
			//hr($this->error);
			
			return true;
		}
		
        if($this->fieldCount){
			
			$this->recordCount = $this->result->num_rows;
	        if ($this->pagination and is_numeric($this->page)and is_numeric($this->pageLimit) 
						and $this->recordCount > 0 
						and $this->pageLimit > 0
						and preg_match("/^([^\w]+|\s*)\bselect\b/i", $this->query)
						and !preg_match("/ limit\s+[0-9]/i", $this->query)){
				$this->pageCount = ceil($this->recordCount / $this->pageLimit);
				if($this->page > $this->pageCount){
					$this->page = $this->pageCount;
				}if($this->page <= 0){
					$this->page = 1;
				}
				$firstRecord = $this->pageLimit * ($this->page - 1);
				$this->result = $this->_query($this->query." LIMIT $firstRecord, $this->pageLimit");
				$this->recordCount = $this->result->num_rows;
				$this->fieldCount = $this->result->field_count;
	        }
        }else{
			
			$this->affectedRows = $this->c->affected_rows;
			$this->lastId = $this->c->insert_id;
						
        }
		
		if($this->fieldCount){
			return $this->result;	
		}else{
			return true;	
		}
		return $this->result;		
	}
	
	public function free($result=''){
		if ($result!=''){
			$this->result = $result;
        }		
		return $this->result->free();
	}
	
	public function getDataRow($result=''){
   		
		if ($result!=''){
			$this->result = $result;
        }
		if(!$this->result->field_count){
			return false;
		}
		return $this->result->fetch_row();		
		
	}

	public function getDataAll($result='', $resulttype=MYSQLI_ASSOC){
   		
		if ($result!=''){
			$this->result = $result;
        }
		
		if(!$this->result->field_count){
			return false;
		}
		return $this->result->fetch_all($resulttype);		
		
	}

	public function getJsonAll($result='', $resulttype=MYSQLI_ASSOC){
   		
		if ($result!=''){
			$this->result = $result;
        }
		
		if(!$this->result->field_count){
			return false;
		}

		return json_decode(json_encode($this->result->fetch_all(MYSQLI_ASSOC), JSON_NUMERIC_CHECK));
	}

	public function getData($result=''){
   		
		
		if (is_resource($result)){
			$this->result = $result;
		}else{
			//return false;
        }
		

		if(!$this->result->field_count){
			return false;
		}
		
		return $this->result->fetch_array();
			
		
				
		
	}

	public function getDataArray($result='', $resulttype=MYSQLI_BOTH){
   		
		if ($result!=''){
			$this->result = $result;
        }
		if(!$this->result->field_count){
			return false;
		}
		return $this->result->fetch_array($resulttype);		
		
	}
	
	public function getDataAssoc($result=''){

		if ($result!=''){
			$this->result = $result;
        }
		//hr($this->query, "red");
		if($this->errno){
			hr($this->query);
			hr($this->error);
			hr($this->errno);
			//return false;
			
		}
		
		if(!$this->result->field_count){
			return false;
		}
		return $this->result->fetch_assoc();			
	}
	
	public function getJson($result=''){

		if ($result!=''){
			$this->result = $result;
        }
		
		if($this->errno or !$this->result->field_count){
			return null;
		}
		return json_decode(json_encode($this->result->fetch_assoc(), JSON_NUMERIC_CHECK));
	}

	public function getLastId(){
		
		return $this->c->insert_id;	

	}

	public function fieldsName($result){

		$info = $result->fetch_fields();
		$fields = array();
		foreach($info as $field){
			
			$fields[] = $field->name;
			
		}// next
		return $fields;
	
	}

	public function infoTable($table){

		$info = new InfoResult;
		
		//$info->tables[$table] = $table;

		$query = "DESCRIBE $table";
		$result = $this->execute($query);
		
		$pos = 0;
		
		if(!$this->c->errno){
			
			
			$info->tables[$table] = $table;
			$info->fieldCount = $result->field_count;
			while($rs = $this->result->fetch_array()){
				
				$f = $rs['Field'];
				$type = $rs['Type'];
				$aux = $this->getRealType($type);
				
				$field = new InfoField();
				$field->table = $table;
				
				$field->field = $f;
				$field->name = $f;
				
				$field->type = $aux[1];
				$field->length = (isset($aux[2])? isset($aux[2]): '');
				$field->decimals = (isset($aux[3])? isset($aux[3]): '');
				$field->mtype = $this->getMetaType($aux[1]);
				$field->not_null = ($rs['Null'] == 'NO')?true:false;
				$field->key = ($rs['Key'] == 'PRI')? true: false;
				$field->default = $rs['Default'];
				$field->serial = ($rs['Extra'] == 'auto_increment')? true: false;

				if($field->key){
					$info->keys[$f] = $f;
				}
				
				$info->fields[$pos++] = $field;
				
				
			}
		}
		
		return $info;
		
	}
	
	public function infoQuery($q, $evalMeta=false){
		
		if($evalMeta){
			$q = $this->metaFunctions($q);
			
		}
		
		if(!preg_match("/ limit\s+[0-9]/i", $q)){
			$q = $q." LIMIT 0";
		}
		
		$result = $this->_query($q);
		
		if ($this->c->errno){
			$this->errno = $this->c->errno;
			$this->error = $this->c->error;
	       
			return false;
			
		
        }
		
		return $this->infoResult($result);
		
	}

	public function infoResult($result){
		
		
		$info = new InfoResult;
		$info->fieldCount = $result->field_count;
		

		
  	 	$fetch_field = $result->fetch_fields();
		
		
		$dup = array();
		
		
		$i = 0;
		
		foreach ($fetch_field as $v) {
			
				
			$t = $v->table;
			$f = $v->name;


			if(isset($dup[$f])){
				$dup[$f]++;
				$name = $f.$dup[$f];
				
			}else{
				$dup[$f] = 1;
				$name = $f;
			}			

			if(!isset($info->tables[$t]) and $t){
				$info->tables[$t] = $t;
			}
				
			$field = new InfoField();
			$field->table = $t;
			
			$field->field = $f;
			$field->name = $name;


			$field->orgname = $v->orgname;
			$field->orgtable = $v->orgtable;

			$field->type = $v->type;
			$field->mtype = $this->getMetaType($v->type);

			$field->length = $v->length;
			$field->decimals = $v->decimals;			
		
			$field->default = $v->def;
			$field->notNull = ($v->flags & 1)? true: false;
		
		
			$field->key = ($v->flags & 2)? true: false;
			$field->unique = ($v->flags & 4)? true: false;
			$field->serial = ($v->flags & 512)? true: false;
			$field->unsigned = ($v->flags & 32)? true: false;
			$field->position = $i++;
		
			
			if($field->key){
				$info->keys[$name] = $f;
			}
			
			$info->fields[$name] = $field;
			
			
		}
			
		return $info;		
		
	}

    public function getTables($db=''){
		if($db==''){
			$db = $this->database;	
		}
		$tables = array();
		$result = $this->c->query("SHOW TABLES FROM $db");
		while($rs = $result->fetch_row()){
			$tables[] = $rs[0]; 
		}// end while
		return $tables;
    }
	
	public function getFields($table){
		$fields = array();
		$result = $this->c->query("SHOW COLUMNS FROM $table");
		while($rs = $result->fetch_row()){
			$fields[] = $rs[0]; 
		}// end while
		return $fields;
    }
	private function _query($q){
		//hr($q, "purple");
		$q = $this->evalQuery($q);
		//hr($q, "green");
		return $this->c->query($q);
	}
	public function begin(){
		$this->c->query("BEGIN");
		
    }

    public function rollback(){
		$this->c->query("ROLLBACK");
		
    }

	public function commit(){
		$this->c->query("COMMIT");
		
    }

	public function concat(){

		$args = func_get_args();
		$str = '';
		foreach($args as $arg){
			$str .= (($str!='')?", ":'').$arg;
		}// next
		
		return "CONCAT($str)";
		
	}
	
	public function serialName($table, $pre, $field){
		$len = strlen($pre)+1;
		$query = "SELECT IFNULL(MAX(SUBSTRING($field, $len)*1), 0)+1 as n FROM $table WHERE $field REGEXP '^$pre([0-9]+)$'";
		$result = $this->execute($query);
		$n=1;	
		if($rs = $this->result->fetch_array()){
			$n = $rs["n"];
		}		
		return $n;
	}
	
	public function serialId($table, $field, $filters = []){
		/* erroorrrrrrrrrrrrrrrrr */
		$len = strlen($pre)+1;
		$_where = '';

		foreach($filters as $k => $v){
			$_where	.= (($_where != '')?" AND ":'').$this->addQuotes($k)."=".$this->addSlashes($v); 		
		}// next
		
		if($_where != ''){
			$_where = "WHERE $_where"	;
		}
		$query = "
			SELECT IFNULL(MAX(field), 0)+1 as n 
			FROM $table 
			$_where";

		$result = $this->execute($query);

		$n=1;	
		if($rs = pg_fetch_array($result)){
			$n = $rs["n"];
		}
		return $n;

	}

	public function evalFilters($q, $search, $fields, $quantifier = "%"){
		
		$str = '';
		foreach($fields as $field){
			$str .= (($str!='')?" OR ":'').$field." LIKE '$quantifier$search$quantifier'";
		}// next
			
		$str = "(". $str. ")";
		if (preg_match("/(WHERE|HAVING)/i", $q, $c)){
			$q = preg_replace ( "/(WHERE|HAVING)/i", "\\0 $str AND ", $q, 1);
		}else{
			$q = preg_replace ( "/(GROUP\s+BY|ORDER|LIMIT|$)/i", " WHERE $str "."\\0", $q, 1);
		}
		return $q;
		
		
	}	
	
	public function getRealType($q){
		$exp = "/(\w+)(?:\((\d+)(?:,(\d+))?\))?/";
		if(preg_match($exp,$q,$c)){
			return $c;
			
		}
		return array();
	}	
	
	public function getMetaType($type){
		
		switch(strtolower($type)){
		//case "int":
		//case "bigint":
		//case "tinyint":
		case "int":
		case "1"://TINY
		case "2"://SHORT
		case "3"://LONG
		case "8"://LONGLONG
		case "9"://INT24
			return "I"; 
		case "date":
		case "10"://DATE
		case "12"://DATETIME
			return "D"; 
		case "datetime":
		case "timestamp":
		case "7"://TIMESTAMP
			return "S"; 
		case "decimal":
		case "real":
		case "float":
		case "numeric":
		case "double":
		case "246"://DECIMAL
		case "4"://FLOAT
		case "5"://DOUBLE
			return "R"; 
		case "time":
		case "11"://TIME
			return "T"; 
		case "char":
			return "CH"; 
		case "varchar":
		case "253"://VAR_STRING
		case "254"://STRING
			return "C"; 
		case "text":
		case "249"://TINY_BLOB
		case "250"://MEDIUM_BLOB 
		case "251"://LONG_BLOB
		case "252"://BLOB
			return "B"; 		
		}// end switch
	}
	
	public function addSlashes($string){

		return $this->c->real_escape_string($string);
		
	}

	function metaError($errno){
		switch ($errno){
		case "1216":
			return C_ERROR_RESTRICCION;
			break;
		case "1217":
			return C_ERROR_ELIMINACION;
			break;
		case "1054":
			return C_ERROR_COLUMNA;
			break;
		case "1062":
			return C_ERROR_DUPLICADO;
			break;
		case "1146":
			return C_ERROR_TABLA;
			break;
		case "1007":
			return C_ERROR_EXISTE_DB;
			break;
		case "1451":
			return C_ERROR_UPD_DEL_FK;
			break;
		default:
			return $msg_error." N� de error: ".$nro_error;
		}// end switch
	
	}
	
	static function metaCONCAT($arg){
		return "CONCAT($arg)";
	}

	static function metaIFNULL($arg){
		return "IFNULL($arg)";
	}

	static function metaDATE_FORMAT($arg){
		return "date_format($arg)";
	}

	public function metaSql($name, $value){
		
		switch($name){
			case "IFNULL":
				return "IFNULL($value)";
				break;
			case "CONCAT":
				return "IFNULL($value)";
			
			case "EQ_NUM":
				$list = $this->getList($value);
				
				if($list[1] == "''" or $list[1] == ''){
					
					return $list[0]." IS NULL";
				}else{
					return $list[0]." = ".$list[1];
				}

				break;
			default:
				return "$name($value)";
			
		}
		
	}

	public function prepare($sql){
		$this->stmt = $this->c->prepare($sql);

		$query = "
		SELECT 
		form, caption, class as className, query, params, methods, pages, f.groups
		FROM $this->tForms as f
		WHERE form = ?
		";
		$this->cn->prepare($query);
		$this->cn->stmt->bind_param("s",$name);
		
		$this->cn->stmt->execute();

		$result = $this->cn->stmt->get_result();
		//print_r($this->cn->stmt->fetch());
	}

}// end class


?>