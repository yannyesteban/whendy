<?php

class Tool
{

	public static function getFileName($name, $pattern = null)
	{

		if (substr($name, 0, 1) === '/') {
			$name = substr($name, 1);

			if ($pattern) {
				$name = str_replace('{name}', $name, $pattern);
			}

			return $name;
		}

		return null;
	}

	public static function loadFile($fileName, $userData = null)
	{

		$file = file_get_contents($fileName, false);

		if ($userData !== null) {
			$file = self::varCustom($file, $userData, '@');
		}

		return $file;
	}

	public static function loadJsonFile($fileName, $userData = null, $mode = false)
	{

		$file = @file_get_contents($fileName, true);

		if ($userData !== null) {
			$file = self::varCustom($file, $userData, '@');
		}

		return json_decode($file, $mode);
	}

	public static function defineConstants($file)
	{

		$json = self::loadJsonFile($file, null, true);

		foreach ($json as $key => $value) {
			define($key, $value);
		}

		return $json;
	}

	public static function varCustom($q, $data, $token, $default = false)
	{
		return self::vars($q, [
			[
				'token' 	=> $token,
				'data' 		=> $data,
				'default' 	=> $default
			]
		]);
	}

	static function vars($q, $info)
	{

		foreach ($info as $i) {
			$q = self::evalVar($q, $i["token"], $i["data"], $i["default"]);
		}
		return $q;
	}

	static function evalVar($q, $t, $data, $default = false)
	{

		if ($q == "" or count((array)$data) == 0) {
			return $q;
		} // end if

		$exp = "{
			(?:(?<![\{\\\])$t(\w++))
			|
			(?:\{$t(\w++)\})
			|
			(?:([\\\]($t\w++)))

		}isx";
		if (is_array($data)) {
			$q = preg_replace_callback(
				$exp,
				function ($i) use (&$data, $default) {
					if (isset($data[$i[1]])) {
						return $data[$i[1]];
					} elseif (isset($i[2]) and $i[2] != "" and isset($data[$i[2]])) {
						return $data[$i[2]];
					} elseif (isset($i[4])) {
						return $i[4];
					} else {
						if ($default !== false) {
							return $default;
						} else {
							return $i[0];
						} // end if
					} // end if
				},
				$q
			);
		} else {
			$q = preg_replace_callback(
				$exp,
				function ($i) use (&$data, $default) {
					if (isset($data->{$i[1]})) {
						return $data->{$i[1]};
					} elseif (isset($i[2]) and $i[2] != "" and isset($data->$i[2])) {
						return $data->{$i[2]};
					} elseif (isset($i[4])) {
						return $i[4];
					} else {
						if ($default !== false) {
							return $default;
						} else {
							return $i[0];
						} // end if
					} // end if
				},
				$q
			);
		}

		return $q;
	}

	public static function hr($msg, $colox = 'black', $back = 'inherit')
	{
		if (is_array($msg) or is_object($msg)) {
			$msg = print_r($msg, true);
		}

		echo "<pre>$msg</pre>";
	}

	public static function hx($msg, $colox = 'black', $back = 'inherit')
	{
		if (is_array($msg) or is_object($msg)) {
			$msg = print_r($msg, true);
		}

		echo "<pre>$msg</pre>";
		exit;
	}
}
