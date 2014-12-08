<?php
use Ratchet\WebSocket\WsServer;
use Ratchet\Http\HttpServer;
use Ratchet\Session\SessionProvider;
use Ratchet\Server\IoServer;
use Runner\Controller as RunnerController;
use Server\App;
use Server\IP;
use Slides\Controller as SlidesController;
use Symfony\Component\HttpFoundation\Session\Storage\Handler\PdoSessionHandler;

date_default_timezone_set('America/Sao_Paulo');

$loader = require __DIR__.'/vendor/autoload.php';

/**
 *
 * Variáveis de configuração
 *
 */
$config = [];

$config['pdo.dsn'] = 'mysql:host=127.0.0.1;dbname=slides;';
$config['pdo.user'] = 'root';
$config['pdo.password'] = '';

//Nome da tabela e colunas para encontrar a sessão
$config['session.db_options'] = array(
    'db_table'      => 'session',
    'db_id_col'     => 'session_id',
    'db_data_col'   => 'session_value',
    'db_time_col'   => 'session_time',
);

$config['pdo'] = new PDO(
    $config['pdo.dsn'],
    $config['pdo.user'],
    $config['pdo.password']
);

$config['pdo']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$config['session.storage.handler'] = new PdoSessionHandler(
    $config['pdo'],
    $config['session.db_options']
);

//IP do servidor
$serverIP = IP::getIP();

/**
 *
 * SERVER INIT
 *
 */

//Session provider para o servidor WebSocket utilizando PDO

//Provider para os Slider
$sessionSlides = new SessionProvider(
    new Slides\Controller,
    $config['session.storage.handler']
);

//Provider para o jogo
$sessionRunner = new SessionProvider(
    new Runner\Controller,
    $config['session.storage.handler']
);

//Temos dois servidores WebSockets que irão compartilhar a mesma URL
$wsSlides = new WsServer($sessionSlides);
$wsRunner = new WsServer($sessionRunner);

echo "Subindo servidor $serverIP:1000 \n";

//Definimos a porta do servidor WebSockets para a 1000
$server = new Server\App($serverIP, 1000, '0.0.0.0');

//São duas rotas, cada roda acessa um servidor WebSockets
$server->route('slides', $wsSlides, ['*']);
$server->route('runner', $wsRunner, ['*']);

//Servidor é iniciado
$server->run();