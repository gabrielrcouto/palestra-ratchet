<?php
namespace Runner\Messages;

/**
 * Mensagem de pontuação
 */
class ScoreMessage extends Message
{
    /**
     * @var  int Tempo do recorde
    */
    public $time;

    public function __construct($message, $connection)
    {
        parent::__construct($message, $connection);

        $this->time = $message->time;
    }
}