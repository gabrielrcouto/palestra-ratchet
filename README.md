# Ratchet - Usando WebSockets com PHP para jogos multiplayer

Os WebSockets estão sendo amplamente utilizados, sua popularização se iniciou com o node.js e o socket.IO, mas agora, programadores PHP não precisam mais se aventurar em outras linguagens para usar essa tecnologia, a biblioteca Ratchet chegou! 

Nessa palestra interativa é mostrado como desenvolver um jogo multiplayer e todos os truques que você precisa saber!


## Para rodar

Nas vezes que apresentei utilizei o Apache. Basta colocar todos os arquivos na raiz do **htdocs**, e na configuração do seu Apache é importante mudar o **DocumentRoot** e o **Directory** para apontar para a pasta web:

```xml
DocumentRoot "/caminho/ate/htdocs/web"
<Directory "/caminho/ate/htdocs/web">
```

É necessário ter o MySQL instalado. Crie uma database e execute o SQL que está no arquivo **session.sql**. No arquivo **src/app.php**, procure as linhas abaixo e troque pelos dados de acesso do seu servidor MySQL:

```php
$app['pdo.dsn'] = 'mysql:host=127.0.0.1;dbname=slides;';
$app['pdo.user'] = 'root';
$app['pdo.password'] = '';
```

Já no arquivo **server/bootstrap.php**, troque as linhas abaixo:

```php
$config['pdo.dsn'] = 'mysql:host=127.0.0.1;dbname=slides;';
$config['pdo.user'] = 'root';
$config['pdo.password'] = '';
```

No repositório não se encontra a pasta **vendor**, por isso, é necessário rodar o composer:

```console
cd /caminho/ate/htdocs
composer update

cd /caminho/ate/htdocs/server
composer update
```


Após isso, basta executar no terminal (de preferência, como root):

```console
cd /caminho/ate/htdocs
./start-server
```

E assim é iniciado o servidor WebSockets!


## Estrutura

* server/ - Arquivos PHP do servidor WebSockets
* src/ - Arquivos PHP da palestra e do jogo
* storage/ - Arquivos do banco de dados SQLite, que armazenam os nicknames e o ranking
* web/ - Arquivo HTML/SCSS/CSS/JS


## Modo do apresentador

Acesse a URL **/presenter** e use:

*Usuário: admin
*Senha: 


## Identificação automática de IPs

Existe uma classe (encontrada nos arquivos IP.php) que retorna o IP da máquina que está executando o servidor. Caso você utilize um sistema diferente do OSX, é necessário adaptá-la. Uma opção é trocar por:

```php
class IP
{
    public static function getIP($withV6 = false)
    {
        return 'COLOQUE.SEU.IP.AQUI';
    }
}
```

## Observações

Algumas classes serão encontradas de forma duplicada, isso se deve ao fato dessa palestra ser a união de vários projetos meus, estou ciente que o melhor seria utilizar um namespace genérico para elas.

Eu utilizei para uma parte do banco de dados um projeto muito legal chamado MongoLite. É uma pequena implementação da ideia do MongoDB, mas que utiliza o SQLite como forma de armazenamento dos dados.

## Autor

[@gabrielrcouto](http://www.twitter.com/gabrielrcouto)

[R3C Web](http://www.r3c.com.br)

## Licença

[MIT License](http://gabrielrcouto.mit-license.org/)