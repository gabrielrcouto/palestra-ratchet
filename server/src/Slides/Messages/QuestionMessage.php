<?php
namespace Slides\Messages;

/**
 * Mensagem de questão
 */
class QuestionMessage extends Message
{
    public $type = 'question';
    public $question;
    public $nickname;

    public function __construct($data, $connection)
    {
        parent::__construct($data, $connection);

        $this->question = $data->question;
        $this->nickname = $this->connection->Session->get('nickname');
    }
}