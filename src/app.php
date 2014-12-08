<?php
require_once __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Storage\Handler\PdoSessionHandler;
use Database\UserRepository;
use Network\IP;

$app = new Silex\Application();

$app['debug'] = true;

/**
 *
 * PROVIDERS
 *
 */

//TWIG
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));

//PDO SESSION PROVIDER
$app->register(new Silex\Provider\SessionServiceProvider());

$app['pdo.dsn'] = 'mysql:host=127.0.0.1;dbname=slides;';
$app['pdo.user'] = 'root';
$app['pdo.password'] = '';

$app['session.db_options'] = array(
    'db_table'      => 'session',
    'db_id_col'     => 'session_id',
    'db_data_col'   => 'session_value',
    'db_time_col'   => 'session_time',
);

$app['pdo'] = $app->share(function () use ($app) {
    return new PDO(
        $app['pdo.dsn'],
        $app['pdo.user'],
        $app['pdo.password']
    );
});

$app['pdo']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$app['session.storage.handler'] = $app->share(function () use ($app) {
    return new PdoSessionHandler(
        $app['pdo'],
        $app['session.db_options'],
        $app['session.storage.options']
    );
});

/**
 *
 * ROUTES
 *
 */

//Rota padrão, identifica as variáveis de sessão e renderiza o template dos slides
$app->get('/', function () use ($app) {
    $viewArray = [];

    $viewArray['nickname'] = false;
    $viewArray['presenter'] = false;

    if (!is_null($app['session']->get('presenter'))) {
        $viewArray['presenter'] = true;
    }

    if (!is_null($app['session']->get('nickname'))) {
        $viewArray['nickname'] = true;
    }

    $viewArray['ip'] = IP::getIP();

    return $app['twig']->render('slides.html.twig', $viewArray);
});

//Rota para definir o nome de usuário - Usada via AJAX
$app->post('/nickname', function (Request $request) use ($app) {
    $nickname = $request->get('nickname');

    if (!empty($nickname)) {
        $userRepository = new UserRepository();

        //consulta lista de apelidos
        while ($userRepository->getUser($nickname)) {
            //caso o apelido exista, gera um número aleatório no final
            $nickname .= rand(1, 9);
        }

        //Adiciona o apelido na lista de apelidos
        $userRepository->addUser($nickname);

        $app['session']->set('nickname', $nickname);

        //retorna mensagem de sucesso com apelido sendo usado
        return $app->json(['message' => 'Seu apelido é: ' . $nickname, 'success' => true]);
    }

    //retorna mensagem de erro
    return $app->json(['message' => 'Você não digitou um apelido!', 'success' => false], 404);
});

//Rota para autorizar o modo apresentador
$app->get('/presenter', function () use ($app) {
    $username = $app['request']->server->get('PHP_AUTH_USER', false);
    $password = $app['request']->server->get('PHP_AUTH_PW');

    //O usuário é 'admin' e a senha é 'phprules'?
    if ('admin' === $username && '27da247ac3132070bfe88338846955adf41955fc' === sha1($password)) {
        //Grava na sessão que o visitante é o apresentador
        $app['session']->set('presenter', true);

        //Redireciona de volta para a apresentação
        return $app->redirect('/');
    }

    //Avisa que o usuário e/ou a senha estão errados
    $response = new Response();
    $response->headers->set('WWW-Authenticate', sprintf('Basic realm="%s"', 'Presenter Mode'));
    $response->setStatusCode(401, 'Aqui não tem biscoito!');

    return $response;
});

//Rota do jogo, identifica as variáveis de sessão e renderiza o template
$app->get('/runner/', function () use ($app) {
    $viewArray = [];

    $viewArray['nickname'] = false;
    $viewArray['presenter'] = false;

    if (!is_null($app['session']->get('presenter'))) {
        $viewArray['presenter'] = true;
    }

    if (!is_null($app['session']->get('nickname'))) {
        $viewArray['nickname'] = true;
    }

    $viewArray['ip'] = IP::getIP();

    return $app['twig']->render('runner.html.twig', $viewArray);
});

return $app;