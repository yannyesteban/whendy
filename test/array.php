<?php



$array1 = array('blue'  => ["a"=>"yanny", "b"=>"esteban"], 'red'  => 2, 'green'  => 3, 'purple' => 4);
$array2 = array('green' => 3, 'blue' => ["c"=>4, "d"=>5], 'yellow' => 7, 'cyan'   => 8);

print_r(array_intersect_assoc($array1, $array2));
?>