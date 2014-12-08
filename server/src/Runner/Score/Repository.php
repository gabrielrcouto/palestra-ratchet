<?php
namespace Runner\Score;

/**
 * Classe responsável por adicionar e retornar pontuação do banco de dados
 */
class Repository
{
    protected $colletion;
    protected $database;

    public function __construct()
    {
        $client = new \MongoLite\Client(__DIR__ . '/../../../../storage/database/');
        $this->database = $client->runner;
        $this->collection = $this->database->score;
    }

    /**
     * Adiciona uma pontuação
     *
     * @param String $nickname Apelido do jogador
     * @param int $time Tempo do jogador
     */
    public function addScore($nickname, $time)
    {
        $score = ['nickname' => $nickname, 'time' => $time];

        $registry = $this->collection->findOne(['nickname' => $nickname]);

        if (!empty($registry)) {
            $this->collection->update(['nickname' => $nickname], $score);
        } else {
            $this->collection->insert($score);
        }
    }

    /**
     * Retorna a melhor pontuação de um jogador
     *
     * @param String $nickname Apelido do jogador
     * @return Array ['nickname', 'time']
     */
    public function getScore($nickname)
    {
        return $this->collection->findOne(['nickname' => $nickname]);
    }

    /**
     * Retorna todas as pontuações
     *
     * @return Array
     */
    public function getScores()
    {
        return $this->collection->find();
    }
}