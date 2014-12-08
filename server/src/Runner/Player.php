<?php
namespace Runner;

/**
 * Classe representando um Jogador
 */
class Player
{
    /**
     * @var ConnectionInterface Conexão do jogador
    */
    protected $connection;

    /**
     * @var  String Apelido do jogador
    */
    public $nickname = '';

    /**
     * @var  int Menor tempo que o jogador conseguiu
    */
    public $time;

    public function __construct($nickname, $connection)
    {
        $this->nickname = $nickname;
        $this->connection = $connection;

        //Pega o último recorde do jogador
        $score = Controller::$scoreRepository->getScore($nickname);

        if ($score) {
            $this->time = $score['time'];
        }
    }
}