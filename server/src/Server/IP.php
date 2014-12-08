<?php
namespace Server;

/**
 * Classe responsável por encontrar o IP da máquina servidor
 */
class IP
{
    /**
     * Retorna o IP do servidor
     * Somente funciona em Mac \o/
     *
     * @param Boolean $withV6 Utilize caso queira retornar IPs V6
     * @return String
     */
    public static function getIP($withV6 = false)
    {
        //Usa o retorno do ifconfig para encontrar os IPs
        preg_match_all('/inet'.($withV6 ? '6?' : '').' ?([^ ]+)/', `ifconfig`, $ips);

        $ips = $ips[1];

        foreach ($ips as $ip) {
            //É um IP local? Vamos utilizá-lo!
            if (strpos($ip, '192.168') !== false || strpos($ip, '10.') !== false) {
                return $ip;
            }
        }

        echo 'Nenhum IP local encontrado :-(';

        die();
    }
}