<?php

namespace Sevian\DB;

class Postgres extends DBase{
	public $driver = "postgres";
	public $quote = '"';
	public $charset = "utf8";
	
	private $c = false;
	public function __construct($server='', $user='', $pass='', $dbase='', $port='', $charset='') {
		
		$this->connect($server, $user, $pass, $dbase, $port, $charset);

	}// end function	
	
	public function connect($server='', $user='', $pass='', $dbase='', $port='', $charset='') {
		
		if ($server!=''){
			$this->server = $server;
        }// end if
		if ($user!=''){
			$this->user = $user;
        }// end if
		if ($pass!=''){
			$this->pass = $pass;
        }// end if
		if ($dbase!=''){
			$this->dbase = $dbase;
        }// end if
		if ($port!=''){
			$this->port = $port;
        }// end if
		if ($charset!=''){
			$this->charset = $charset;
        }// end if
		
	    $this->c = pg_connect(
		"host=$this->server dbname=$this->dbase user=$this->user password=$this->pass port=$this->port");
		pg_set_error_verbosity($this->c, PGSQL_ERRORS_VERBOSE);
		//$this->c->set_charset('latin1');
		//$this->c->set_charset('utf8');
		
		if (!pg_last_error()){
			$this->status = true;
		}// end if
		
    }// end function
	
	public function close(){
		
		pg_close($this->c);	
	}// end function
	
	public function execute($query='', $evalMeta=false){
		
		if ($query!=''){
			$this->query = $query;
        }// end if
		
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
			$this->fieldCount = @pg_num_fields($this->result);
		}
		
		//echo @pg_last_error();exit;
		if(pg_last_error()){
			$this->error = pg_last_error();
			$this->errno = substr($this->error, 8, 5);
			return false;	
		}// end if
		
        if ($this->fieldCount){
			
			$this->recordCount = @pg_num_rows($this->result);
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
				}// end if
				$firstRecord = $this->pageLimit * ($this->page - 1);
				$this->result = $this->_query($this->query." LIMIT $this->pageLimit OFFSET $firstRecord");
				$this->recordCount = @pg_num_rows($this->result);
				$this->fieldCount = @pg_num_fields($this->result);
				
				
	        }// end if
			
        }else{
			$this->affectedRows = @pg_affected_rows();
			/*
			if(@pg_last_oid($this->result)==="0"){
				$result = @pg_query("SELECT lastval();");
				if($row = @pg_fetch_row($result)){
					$this->lastId = $row[0];
				}
			}
			*/
        }// end if
		
		if($this->fieldCount){

			return $this->result;	
		}else{
						//hr($this->fieldCount);
			//hr($this->query, "red");
			//hr($this->result);
			//return $this->result;
			return true;	
		}// end if
			
		
	}// end function

	public function free($result=''){
		if ($result!=''){
			$this->result = $result;
        }// end if		
		return $this->result->free();
	}
	
	public function getDataRow($result=''){
   		
		if ($result!=''){
			$this->result = $result;
        }// end if
		if(!$this->fieldCount){
			return false;
		}// end if
		return pg_fetch_row($this->result);		
		
	}// end function

	public function getDataAll($result='', $resulttype=PGSQL_ASSOC){
   		/*
		$resulttype = 1 ASSOC
		$resulttype = 2 NUM
		$resulttype = 3 BOTH
		
		*/
		if ($result!=''){
			$this->result = $result;
        }// end if
		if(!$this->fieldCount){
			return false;
		}// end if
		
		
		if($resulttype == PGSQL_ASSOC){
			return pg_fetch_all_columns($this->result);	
		}else{
			$data = array();
			while ($row = pg_fetch_array($this->result, null, $resulttype)) {
				$data[] = $row;
			}
			return $data;
		}
		
			
		
	}// end function

	public function getData($result=''){
   		
		if ($result!=''){
			$this->result = $result;
        }// end if
		
		if(!$this->result){
			return false;
		}// end if
		
		return pg_fetch_array($this->result);		
		
	}// end function

	public function getDataArray($result='', $resulttype=PGSQL_BOTH){
   		
		if ($result!=''){
			$this->result = $result;
        }// end if
		if(!$this->fieldCount){
			return false;
		}// end if
		return pg_fetch_array($this->result, $resulttype);		
		
	}// end function
	
	public function getDataAssoc($result=''){
		
		if(!$this->fieldCount){
			return false;
		}// end if
   		if ($result!=''){
			$this->result = $result;
        }// end if
		return pg_fetch_assoc($this->result);		
		
	}// end function	

	public function getLastId(){

		$result = @pg_query("SELECT lastval();");
		if($row = @pg_fetch_row($result)){
			return $this->lastId = $row[0];
		}
		return false;

	}// end function
	
	public function fieldsName($result){
		
		$n = pg_num_fields($result);
		$fields = array();
		for($i=0; $i < $n; $i++){
			$fields[] = pg_field_name($result, $i);
			
		}// next
		return $fields;
	
	}// end function

	public function serialName($table, $pre, $field){
		$len = strlen($pre)+1;
		
		$query = "SELECT COALESCE(MAX(SUBSTRING($field, $len)::integer*1), 0)+1 as n FROM $table WHERE $field ~ '^$pre([0-9]+)$'";

		$result = $this->execute($query);

		$n=1;	
		if($rs = pg_fetch_array($result)){
			$n = $rs["n"];
		}// end if
		return $n;

	}// end function

	public function serialId($table, $field, $filters){
		
		$len = strlen($pre)+1;
		$_where = '';
		
		foreach($filters as $k => $v){
			$_where	.= (($_where != '')?" AND ":'').$this->addQuotes($k)."=".$this->addSlashes($v); 		
		}// next
		
		$query = "
			SELECT COALESCE(MAX(field), 0)+1 as n 
			FROM $table 
			WHERE $_where";

		$result = $this->execute($query);

		$n=1;	
		if($rs = pg_fetch_array($result)){
			$n = $rs["n"];
		}// end if
		return $n;

	}// end function

	public function evalFilters($q, $search, $fields, $quantifier = "%"){
		
		$str = '';
		foreach($fields as $field){
			$str .= (($str!='')?" OR ":'')."to_ascii(".$field."::varchar) ILIKE to_ascii('$quantifier$search$quantifier')";
		}// next
			
		$str = "(". $str. ")";
		if (preg_match("/(WHERE|HAVING)/i", $q, $c)){
			$q = preg_replace ( "/(WHERE|HAVING)/i", "\\0 $str AND ", $q, 1);
		}else{
			$q = preg_replace ( "/(GROUP\s+BY|ORDER|LIMIT|$)/i", " WHERE $str "."\\0", $q, 1);
		}// end if
		return $q;
		
		
	}// end function	


	public function infoTable($table){

		$info = new InfoTable;
		$info->fields = array();
		$info->keys = array();
		$info->table = $table;
		

		$query = "
			SELECT a.attname as field, c2.typname as type, indisprimary as primary, indisunique as unique, attnotnull,
				CASE  WHEN attlen <0 THEN a.atttypmod -4  ELSE attlen END as length,
				NULLIF(btrim(split_part(b.adsrc,':',1),''''),'') as default,
				CASE WHEN position('nextval' IN b.adsrc)=1 then 't' else 'f' end as serial,
				CASE atttypid
					WHEN 21 /*int2*/ THEN 16
					WHEN 23 /*int4*/ THEN 32
					WHEN 20 /*int8*/ THEN 64
					WHEN 1700 /*numeric*/ THEN
				CASE WHEN atttypmod = -1
				THEN null
				ELSE ((atttypmod - 4) >> 16) & 65535
				END
					WHEN 700 /*float4*/ THEN 24 /*FLT_MANT_DIG*/
					WHEN 701 /*float8*/ THEN 53 /*DBL_MANT_DIG*/
				ELSE null
				END AS numeric_precision,
				CASE
					WHEN atttypid IN (21, 23, 20) THEN 0
					WHEN atttypid IN (1700) THEN
				CASE
					WHEN atttypmod = -1 THEN null
				ELSE (atttypmod - 4) & 65535
				END
				ELSE null
				END AS numeric_scale								
			
			FROM pg_attribute as a
			INNER JOIN pg_type as c ON a.attrelid=c.typrelid AND attnum>=1 AND typname = '$table'
			INNER JOIN pg_type as c2 ON a.atttypid = c2.oid
			LEFT JOIN pg_attrdef as b ON b.adrelid = a.attrelid AND b.adnum = a.attnum
			LEFT JOIN pg_index as d ON d.indrelid = c.typrelid AND a.attnum = any (d.indkey)";
		$result = @pg_query($query);
		
		$pos = 0;
		
		if(!pg_last_error()){
			
			$info->tables[$table] = $table;
			$info->fieldCount = @pg_num_fields($result);
			while($rs = pg_fetch_assoc($result)){
				
				$f = $rs['field'];
								
				$field = new InfoField();
				$field->table = $table;
				
				$field->field = $f;
				$field->name = $f;
				
				$field->type = $rs['type'];
				if($rs['type'] == "numeric"){
					$field->length = $rs['numeric_precision'];
				}else{
					$field->length = $rs['length'];
				}// end if	
				$field->decimals = $rs['numeric_scale'];
				$field->mtype = $this->getMetaType($field->type);
				$field->notNull = ($rs["attnotnull"] == "t")? true: false;
				$field->key = ($rs['primary'] == 't')? true: false;
				$field->default = $rs['default'];
				$field->serial = ($rs['serial'] == 't')? true: false;
				$field->unique = ($rs['unique'] == "t")? true: false;

				if($field->key){
					$info->keys[$f] = $f;
				}// end if
				
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
			$q = $q.' LIMIT 0';
		}
		
		
		$result = @pg_query($this->c, $q);
		if (pg_last_error()){
			$this->errno = substr($this->error, 8, 5);
			$this->error = pg_last_error();
	      
			return false;
			
		
        }
		return $this->infoResult($result);
	}
	
	public function infoResult($result){
		
		$info = new InfoResult;
		$info->fields = array();
		$info->keys = array();		
		$info->tables = array();	
		$info->fieldCount = pg_num_fields($result);
	
		$dup = array();
		
		$infoTables = array();
		
		for($i=0; $i < $info->fieldCount; $i++){
			
			$t = pg_field_table($result, $i);	
			$f = pg_field_name($result, $i);

			if(isset($dup[$f])){
				$dup[$f]++;
				$name = $f.$dup[$f];
			}else{
				$dup[$f] = 1;
				$name = $f;
			}

			if(!isset($info->tables[$t]) and $t){
				$info->tables[$t] = $t;
				$infoTables[$t] = $this->infoTable($t);
			}
				
			$field = new InfoField();
			$field->table = $t;
			$field->field = $f;
			$field->name = $name;
			$field->orgname = $f;
			$field->orgtable = $t;
			$field->type = pg_field_type($result, $i);
			$field->mtype = $this->getMetaType($field->type);
			$field->notNull = (pg_field_is_null($result, $i))? false: true;
			
			if(isset($infoTables[$t]->fields[$f])){
				$_field = $infoTables[$t]->fields[$f];
				
				$field->decimals = $_field->decimals;			
				$field->default = $_field->default;
				$field->key = $_field->key;
				$field->unique = $_field->unique;
				$field->serial = $_field->serial;
				$field->length = $_field->length;
			}else{
				$field->decimals = false;			
				$field->default = '';
				$field->key = false;
				$field->unique = false;
				$field->serial = false;
				$field->length =  pg_field_size($result, $i);
			}
			
			$field->position = $i;

			if($field->key){
				$info->keys[$name] = $f;
			}

			$info->fields[$name] = $field;
		}
			
		return $info;		
		
	}
	
	

    public function getTables($db = ''){

		if($db == ''){
			$db = $this->database;	
		}// end if
		
		$tables = array();
		$result = @pg_query("
			SELECT tablename,'T' 
			FROM pg_tables 
			WHERE tablename not like 'pg\_%'
				and tablename not in ('sql_features', 'sql_implementation_info', 'sql_languages',
	 			'sql_packages', 'sql_sizing', 'sql_sizing_profiles','sql_parts')
				
			");
		while($rs = pg_fetch_array($result)){
			$tables[] = $rs[0]; 
		}// end while
		return $tables;
		
    }// end function
    public function getFields($table){

		$fields = array();
		$result = @pg_query("
			SELECT column_name
			FROM information_schema.columns
			WHERE table_name ='$table';");
		while($rs = pg_fetch_array($result)){
			$fields[] = $rs[0]; 
		}// end while
		return $fields;

    }// end function

	private function _query($q){
		$q = $this->evalQuery($q);
		return @pg_query($q);
	}

	function begin(){
        
		@pg_query("BEGIN");

    }// end function

    function rollback(){
        
		@pg_query("ROLLBACK");

    }// end function

    function commit(){
		
        @pg_query("COMMIT");

    }// end function

	public function concat(){
		
		$args = func_get_args();
		$str = '';
		foreach($args as $arg){
			$str .= (($str!='')?" || ":'').$arg;
			
			
		}// next
		
		return $str;
		
	}	
	public function getMetaType($type){
		
		switch(strtolower($type)){
		//case "int":
		//case "bigint":
		//case "tinyint":
		case "serial":
		case "serial8":
		case "int2":
		case "int4":
		case "int8":
			return "I"; 
		case "date":
			return "D"; 
		case "datetime":
		case "timestamp":
			return "S"; 
		case "decimal":
		case "real":
		case "float":
		case "float4":
		case "float8":
		case "numeric":
		case "double":
			return "R"; 
		case "time":
			return "T"; 
		case "char":
			return "CH"; 
		case "varchar":
			return "C"; 
		case "text":
			return "B"; 		
		}// end switch

	}// end function
	
	public function addSlashes($string){
		
		return pg_escape_string($string);
		
	}
	
	function metaError($errno){

		switch ($errno){

		case "39004"://null_value_not_allowed
		case "42601"://syntax_error
		case "42804"://datatype_mismatch
		case "42P01"://undefined_table
		case "42712"://duplicate_alias
		case "42702"://ambiguous_column
		case "23503"://foreign_key_violation
			break;
		case "23505"://unique_violation
			break;
		case "00000":
			break;
		case "23505"://unique_violation
			return "unique_violation";
			break;
		case "42P01"://undefined_table
			break;
		case "25P02"://in_failed_sql_transaction
			break;
		default:
			return 1000;
		}// end switch
	}// end function		
	public function metaSql($name, $value){
		
		switch($name){
			case "IFNULL":
				return "COALESCE($value)";

				break;
			case "CONCAT":
			
			
				$exp="{(?:
					\( (?: (?>[^()]+) | (?R) )* \)
					|\'[^\']+\'
					|[^,\']+ \( (?: (?>[^()]+) | (?R) )* \) 
					|[^,()\'\s]+
				)}isx";
				if(preg_match_all($exp,$value,$c)){
					//print_r($c);
					//print_r($c);
					return implode(" || ", $c[0]);
					
				}// end if		
	
				return "conc".$value;
				break;
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
		hr("Postgres error");
		exit;
	}
}// end class


?>