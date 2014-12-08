<?php
namespace Runner\Messages;

/**
 * Mensagem contendo dados do jogador
*/
class MeMessage extends Message
{
    /**
     * @var int Tempo do recorde
    */
    public $time;

    public function __construct($message = null, $connection)
    {
        parent::__construct($message, $connection);

        $this->time = $connection->player->time;
    }
}