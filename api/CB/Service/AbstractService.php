<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Service
 */
namespace CB\Service;

/**
 * Abstract service class
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Service
 */
abstract class AbstractService
{

    /**
     * Service instances holder.
     *
     * @access private
     * @var    array
     */
    private static $_instances = array();

    /**
     * Get service instance.
     *
     * @access public
     * @return \CB\Service
     * @static
     */
    public static function getInstance()
    {
        $Service = get_called_class();
        if (!isset(self::$_instances[$Service]))
        {
            self::$_instances[$Service] = new $Service();
        }
        return self::$_instances[$Service];
    }

    /**
     * Prevent construction
     *
     * @access protected
     * @return void
     */
    protected function __construct() {}

    /**
     * Prevent cloning
     *
     * @access private
     * @return void
     */
    private function __clone() {}

    /**
     * Get entity manager.
     *
     * @access protected
     * @return \CB\Doctrine\EntityManager
     */
    protected function getEntityManager()
    {
        return \CB\Doctrine\EntityManager::getInstance();
    }

    /**
     * Get entity serializer.
     *
     * @access protected
     * @return \CB\Doctrine\EntitySerializer
     */
    protected function getEntitySerializer()
    {
        return \CB\Doctrine\EntitySerializer::getInstance();
    }

    /**
     * Get service.
     *
     * @access protected
     * @param  string $service
     * @return \CB\Service\Service
     */
    protected function getService($service)
    {
        $Service = '\CB\Service\\' . $service;
        return $Service::getInstance();
    }

    /**
     * Get controller.
     *
     * @access protected
     * @param  string $controller
     * @return \CB\Controller\Controller
     */
    protected function getController($controller)
    {
        $Controller = '\CB\Controller\\' . $controller;
        return new $Controller;
    }

    /**
     * Get api controller.
     *
     * @access protected
     * @param  string $controller
     * @return \CB\Api\Controller
     */
    protected function getApiController($controller)
    {
        $Controller = '\CB\Api\\' . $controller;
        return $Controller::getInstance();
    }

}
