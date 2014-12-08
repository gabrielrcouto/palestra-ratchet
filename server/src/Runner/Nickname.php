<?php
namespace Runner;

/**
 * Classe responsável por nicknames
 */
class Nickname
{
    /**
     * @var Array de nicknames
    */
    public static $nicknames = [
        'Ace',
        'Adonis',
        'Amor',
        'Badboy',
        'Bam Bam',
        'Bear',
        'Beast',
        'Beef',
        'Biggie',
        'Boner',
        'Boss',
        'Cowboy',
        'Daddy',
        'Elmo',
        'Gasoline',
        'Gangster',
        'Gizmo',
        'Godzilla',
        'Grandpa',
        'Grasshopper',
        'Handsome',
        'Harvard',
        'Hero',
        'Hercules',
        'Hollywood',
        'Hoss',
        'Hunk',
        'Jedi',
        'Macho',
        'Mayhem',
        'Motown',
        'Monster',
        'Moose',
        'Muscle',
        'Nemo',
        'Pickle',
        'Player',
        'Poker',
        'Pooh',
        'Pops',
        'Prince',
        'Pup',
        'Rockstar',
        'Romeo',
        'Scooter',
        'Skipper',
        'Sparkie',
        'Superfly',
        'Teddy',
        'Tiger',
        'Train',
        'Turtle',
        'Vegas',
        'Waldo',
        'Winner'
    ];

    /**
     * Gera nicknames aleatórios
     *
     * @return string
     */
    public static function generate()
    {
        return self::$nicknames[rand(0, count(Self::$nicknames) - 1)] . rand(1,99);
    }
}