<?php
namespace Runner;

use Runner\Messages\ScoreTableMessage;

/**
 * Classe para envio de mensagens para todas as conexões
 */
class Broadcast
{
    /**
     * Envia o ranking
     */
    public static function scoreTable()
    {
        //Pega os 5 primeiros
        $scores = Controller::$scoreRepository->getScores()->sort(['time' => 1])->limit(5);

        //Cria a mensagem para envio
        $scoreTable = new ScoreTableMessage($scores);

        //Para cada conexão, envia a mensagem
        foreach (Controller::$connections as $anotherConnection) {
            Sender::scoreTable($scoreTable, $anotherConnection);
        }
    }
}