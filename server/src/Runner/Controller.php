<?php
namespace Runner;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

use Runner\Messages\Parser;
use Runner\Score\Repository as ScoreRepository;

class Controller implements MessageComponentInterface
{
    /**
     * Storage de conexões
     * @var SplObjectStorage de objetos ConnectionInterface
    */
    public static $connections;

    /**
     * Repositório para acesso ao banco de dados do Ranking
     * @var ScoreRepository
    */
    public static $scoreRepository;

    public function __construct()
    {
        self::$connections = new \SplObjectStorage;
        self::$scoreRepository = new ScoreRepository();
    }

    /**
     * Função executada quando o servidor recebe uma nova conexão
     *
     * @param ConnectionInterface $connection
     */
    public function onOpen(ConnectionInterface $connection)
    {
        $nickname = $connection->Session->get('nickname');

        if (empty($nickname)) {
            $nickname = Nickname::generate();
        }

        //Inicializa o novo jogador
        $connection->player = new Player($nickname, $connection);

        self::$connections->attach($connection);

        //Envia ao jogador algumas informações sobre ele mesmo
        Sender::me($connection);

        Log::d('Novo jogador conectado: ' . $connection->resourceId);
    }

    /**
     * Função executada quando o servidor recebe uma mensagem
     *
     * @param ConnectionInterface $connection
     * @param String $jsonMessage
     */
    public function onMessage(ConnectionInterface $connection, $jsonMessage)
    {
        $message = Parser::parse($jsonMessage, $connection);

        //A mensagem é do tipo 'move'
        if ($message->type == 'move') {
            //Envia aos outros jogadores a posição desse jogador
            foreach (self::$connections as $anotherConnection) {
                if ($anotherConnection !== $connection) {
                    Sender::move($message, $anotherConnection);
                }
            }
        } else if ($message->type == 'score') {
            //Armazena a nova pontuação
            self::$scoreRepository->addScore($connection->player->nickname, $message->time);

            //Envia para todos o novo ranking
            Broadcast::scoreTable();
        }

        Log::d($jsonMessage);
    }

    /**
     * Função executada quando a conexão é encerrada
     *
     * @param ConnectionInterface $connection
     */
    public function onClose(ConnectionInterface $connection)
    {
        //A conexão foi encerrada, remove do storage
        self::$connections->detach($connection);

        Log::d('Conexão encerrada: ' . $connection->resourceId);
    }

    /**
     * Função executada quando ocorre algum erro com a conexão
     *
     * @param ConnectionInterface $connection
     * @param \Exception $e
     */
    public function onError(ConnectionInterface $connection, \Exception $e)
    {
        $connection->close();

        Log::d('Ocorreu um erro: '. $e->getMessage());
    }
}