<?php
namespace Runner\Messages;

/**
 * Parser de Mensagens
 */
class Parser
{
    /**
     * Transforma um JSON de mensagem no objeto correto
     * @param String $json
     * @param ConnectionInterface $connection
     * @return Message ou algo que extende Message
     */
    public static function parse($json, $connection)
    {
        $message = json_decode($json);

        if ($message->type == 'move') {
            return new MoveMessage($message, $connection);
        } else if ($message->type == 'score') {
            return new ScoreMessage($message, $connection);
        } else {
            return new Message($message, $connection);
        }
    }
}