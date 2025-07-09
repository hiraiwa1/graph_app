<?PHP

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Conten-Type: application/json; charset-UTF-8');

$json = file_get_contents('php://input');

// if($json === null) exit;

$jsonData = json_decode($json, true);
$inputs = json_encode($jsonData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

file_put_contents(__DIR__ . '/data/graphData.json', $inputs);

exit;

 ?>