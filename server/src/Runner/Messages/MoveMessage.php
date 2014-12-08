<?php
namespace Runner\Messages;

/**
 * Mensagem de movimentação do jogador
 */
class MoveMessage extends Message
{
    /**
     * @var  int Posição do jogador no eixo X
    */
    public $x;

    /**
     * @var  int Posição do jogador no eixo Y
    */
    public $y;

    public function __construct($message, $connection)
    {
        parent::__construct($message, $connection);

        $this->x = $message->x;
        $this->y = $message->y;
    }
}