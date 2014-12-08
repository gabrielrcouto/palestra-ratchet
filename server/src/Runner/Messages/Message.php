<?php
namespace Runner\Messages;

/**
 * Mensagem padrão
 */
class Message
{
    /**
     * @var String Apelido do jogador
    */
    public $nickname;

    /**
     * @var String Tipo da mensagem
    */
    public $type;

    /**
     * @var  ConnectionInterface Conexão do jogador
    */
    protected $connection;

    public function __construct($message = null, $connection)
    {
        if ($message != null) {
            $this->type = $message->type;
        }

        $this->nickname = $connection->Session->get('nickname');
        $this->connection = $connection;
    }
}