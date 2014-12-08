<?php
namespace Runner;

use Runner\Messages\Message;

/**
 * Enviador de mensagens
 */
class Sender
{
    /**
     * Envia uma mensagem para o jogador com os dados dele
     *
     * @param ConnectionInterface $connection
     */
    public static function me($connection)
    {
        $message = new Message(null, $connection);
        $message->type = 'me';
        $connection->send(strip_tags(json_encode($message)));
    }

    /**
     * Envia uma mensagem de movimentação
     *
     * @param MoveMessage $moveMessage
     * @param ConnectionInterface $connection
     */
    public static function move($moveMessage, $connection)
    {
        $connection->send(strip_tags(json_encode($moveMessage)));
    }

    /**
     * Envia uma mensagem de pontuação da tabela de ranking
     *
     * @param ScoreTableMessage $scoreTable
     * @param ConnectionInterface $connection
     */
    public static function scoreTable($scoreTable, $connection)
    {
        $connection->send(strip_tags(json_encode($scoreTable)));
    }
}