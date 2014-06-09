<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Doctrine
 */
namespace CB\Doctrine;

/**
 * Climbuddy Doctrine class.
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Doctrine
 */
class EntityManager
{

    /**
     * Doctrine entity manager instance holder.
     *
     * @access private
     * @var    \Doctrine\ORM\EntityManager
     */
    private static $_instance;

    /**
     * Get Doctrine entity manager instance.
     *
     * @access public
     * @return \Doctrine\ORM\EntityManager
     */
    public static function getInstance()
    {
        if (!isset(self::$_instance))
        {
            // model paths
            $paths = array(\CB\Config::get('path.root') . '/CB/Entity');

            // development mode?
            $development = (\CB\Config::get('cb.environment') === 'development');

            // create entity manager
            $config = \Doctrine\ORM\Tools\Setup::createAnnotationMetadataConfiguration($paths, $development);

            // the connection configuration
            $dbParams = array(
                'driver'   => \CB\Config::get('doctrine.driver'),
                'host'     => \CB\Config::get('doctrine.host'),
                'user'     => \CB\Config::get('doctrine.user'),
                'password' => \CB\Config::get('doctrine.password'),
                'dbname'   => \CB\Config::get('doctrine.dbname'),
                'charset'  => \CB\Config::get('doctrine.charset')
            );

            // create doctrine entity manager
            self::$_instance = \Doctrine\ORM\EntityManager::create($dbParams, $config);

            // enable sql logger
            if ($development)
            {
                self::$_instance->getConfiguration()->setSQLLogger(new \CB\Doctrine\FileSQLLogger());
            }
        }

        return self::$_instance;
    }

}
