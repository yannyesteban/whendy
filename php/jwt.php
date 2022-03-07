<?php

class JWT
{
    private static $payload = [];
    private static $key = 'pre';

    private static $header = [
        'alg'=>'HS256',
        'typ'=>'JWT'
    ];
    public static function getPayload($payload){
        return self::$payload;
    }
    
    public static function generate($payload)
    {
        self::$payload = $payload;
        
        $header =  self::base64url_encode(json_encode(self::$header)); //-> "PDw/Pz8+Pg=="
        $payload =  self::base64url_encode(json_encode($payload)); //-> "PDw/Pz8+Pg=="
        $signature = self::base64url_encode(hash_hmac('SHA256', "$header.$payload", self::$key, true));

        return "$header.$payload.$signature";
    }

    public static function decode($token)
    {
        $str = explode('.', $token);
        $header = json_decode(self::base64url_decode($str[0]));
        $payload = json_decode(self::base64url_decode($str[1]));
        $signature = $str[2];

        return [
            'header'    => $header,
            'payload'   => $payload,
            'signature' => $signature
        ];
    }

    public static function verifyHeader():object | null{
        $headers = getallheaders();
        if($headers['Authorization']){
            $arr = explode(' ', $headers['Authorization']);
            return self::verify(array_pop($arr));
        }
        
        return null;
    }

    public static function verify($token):object | null
    {
        $str = explode('.', $token);
        $header = self::base64url_decode($str[0]);
        $payload = self::base64url_decode($str[1]);
        $signature = $str[2];

        $header1 =  self::base64url_encode($header);
        $payload1 =  self::base64url_encode($payload);
        $signature1 = self::base64url_encode(hash_hmac('SHA256', "$header1.$payload1", self::$key, true));

        if($signature === $signature1){
            return (object)[
                'header'    => json_decode($header),
                'payload'   => json_decode($payload),
                'signature' => $signature
            ];
        }

        return null;
    }

    public static function base64url_encode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    public static function base64url_decode($data)
    {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }
}