<?php

/**
 * Climbuddy controller namespace
 *
 * @package CB\Controller
 */
namespace CB\Controller;

/**
 * Abstract controller
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Controller
 */
abstract class AbstractController
{

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
