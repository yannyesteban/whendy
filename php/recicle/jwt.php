<?php
$token = '*******-****-****-****-*********';
    
$header = array(
   "alg" => "HS256",
   "typ" => "JWT"
);
   
$header = json_encode($header);
$header = base64url_encode($header);

$payload = array(
  "id" => "XXXX"
);

$payload = json_encode($payload);
$payload = base64url_encode($payload);
$payload = str_replace('==', '', $payload);

$toHash = $header .'.'. $payload;

$signature = hash_hmac('sha256', $toHash, $token, true);
$signature = base64url_encode($signature);


echo "$toHash.$signature<hr>";


function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
  }
  
  function base64url_decode($data) {
    return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
  } 

$header = [
'alg'=>'HS256',
'typ'=>'JWT'

];

$payload = [
    'sub'=> '1234567890',
    'name'=> 'John Doe',
    'iat'=> 1516239022
];

// Encode text to Base64 standard
$header =  base64url_encode(json_encode($header)); //-> "PDw/Pz8+Pg=="
$payload =  base64url_encode(json_encode($payload)); //-> "PDw/Pz8+Pg=="
$sig = base64url_encode(hash_hmac('SHA256', $header.".".$payload, 'yanny', true));

echo "$header.$payload.$sig";



