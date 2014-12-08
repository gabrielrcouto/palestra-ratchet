<?php
namespace Runner\Messages;

use Runner\Messages\ScoreTable\ScoreTableRow;

/**
 * Mensagem da tabela de pontuação
 */
class ScoreTableMessage
{
    /**
     * @var  String Tipo da mensagem
    */
    public $type = 'score-table';

    /**
     * @var  Array de ScoreTableRow
    */
    public $table;

    public function __construct($table)
    {
        $this->table = [];

        foreach ($table as $score) {
            $obj = new ScoreTableRow();
            $obj->nickname = $score['nickname'];
            $obj->time = $score['time'];

            $this->table[] = $obj;
        }
    }
}