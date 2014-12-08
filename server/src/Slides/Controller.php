<?php
namespace Slides;

use Slides\Messages\MessageManager;
use Slides\Messages\SlideMessage;
use Slides\Messages\PingMessage;
use Slides\Messages\PollMessage;
use Slides\Messages\PollResultMessage;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

/**
 * Controller para todas as mensagens da rota /slides
 */
class Controller implements MessageComponentInterface
{
    /**
     * Storage de conexões
     * @var SplObjectStorage de objetos ConnectionInterface
    */
    public static $connections;

    /**
     * Última mensagem de troca de slide recebida
     * @var SlideMessage
    */
    public static $lastMessage;

    /**
     * Array das enquetes
     * @var Array de Poll
    */
    public static $polls;

    public function __construct()
    {
        self::$connections = new \SplObjectStorage;
        self::$polls = [];
    }

    /**
     * Função executada quando o servidor recebe uma nova conexão
     *
     * @param ConnectionInterface $connection
     */
    public function onOpen(ConnectionInterface $connection)
    {
        //Quando um usuário é conectado, armazenamos sua conexão em um
        //SplObjectStorage
        self::$connections->attach($connection);

        //Se já houve uma troca de slides, envia para o usuário ir até o slide
        //atual
        if (isset(Controller::$lastMessage)) {
            Sender::send(Controller::$lastMessage, $connection);
        }

        //Captura o nickname definido na sessão
        $nickname = $connection->Session->get('nickname');

        Log::d('Espectador ' . $nickname . ' conectado: ' . $connection->resourceId);
        Log::d(count(self::$connections) . ' conectados');
    }

    /**
     * Função executada quando o servidor recebe uma mensagem
     *
     * @param ConnectionInterface $connection
     * @param String $jsonMessage
     */
    public function onMessage(ConnectionInterface $connection, $jsonMessage)
    {
        //Envia a mensagem para o MessageManager, ele identificará qual o tipo
        //dela
        $message = MessageManager::createMessage($jsonMessage, $connection);

        if ($message instanceof SlideMessage) {
            Controller::$lastMessage = $message;
        } else if ($message instanceof PollMessage) {
            //Se é uma mensagem de enquete, inicia a enquete e computa o voto

            if (!isset(self::$polls[$message->number])) {
                self::$polls[$message->number] = new Poll($message->number);
            }

            $poll = self::$polls[$message->number];
            $poll->addVote($message->value);

            $message = new PollResultMessage($poll);
        }

        if ($message instanceof PollResultMessage) {
            Log::d('Broadcast to everybody');

            //Broadcast para todos
            foreach (self::$connections as $anotherConnection) {
                Sender::send($message, $anotherConnection);
            }
        } else if ( $message instanceof PingMessage) {
            Log::d('Send back');
            Sender::send($message, $connection);
        } else {
            Log::d('Broadcast to others');
            //Broadcast para todos, menos para quem enviou
            foreach (self::$connections as $anotherConnection) {
                if ($anotherConnection !== $connection) {
                    Sender::send($message, $anotherConnection);
                }
            }
        }

        $nickname = $connection->Session->get('nickname');

        Log::d($jsonMessage . ' - ' . $nickname . ' - ' . time());
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

        $nickname = $connection->Session->get('nickname');

        Log::d('Conexão ' . $nickname . ' encerrada: ' . $connection->resourceId);
        Log::d(count(self::$connections) . ' conectados');
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