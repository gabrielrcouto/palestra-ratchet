<?php
namespace Database;

use MongoLite\Client;

/**
 * Classe responsável por adicionar e retornar usuários do banco de dados
 */
class UserRepository
{
    protected $colletion;
    protected $database;

    public function __construct()
    {
        $client = new \MongoLite\Client(__DIR__ . '/../../storage/database');
        $this->database = $client->slides;
        $this->collection = $this->database->users;
    }

    /**
     * Adiciona um novo usuário na lista de usuário do banco de dados
     * @param string $nickname
     */
    public function addUser($nickname)
    {
        $user = ['nickname' => $nickname];
        $this->collection->insert($user);
    }

    /**
     * Encontra um usuário no banco de dados
     * @param string $nickname
     * @return Array ou null
     */
    public function getUser($nickname)
    {
        return $this->collection->findOne(['nickname' => $nickname]);
    }
}