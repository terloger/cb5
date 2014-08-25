<?php

/**
 * Climbuddy API namespace
 *
 * @package CB\Api
 */
namespace CB\Api;

/**
 * API abstract controller
 *
 * Every api controller must extend this one!
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Api
 */
abstract class AbstractController
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
     * @return \CB\Api\Controller
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
     * Get current session user.
     *
     * @access protected
     * @return \CB\Entity\User
     */
    protected function getSessionUser()
    {
        return $this->getService('User')->getSession();
    }

    /**
     * Success response.
     *
     * @access protected
     * @param  string $message
     * @param  mixed  $data
     * @param  mixed  $total
     * @return array
     */
    protected function success($message = null, $data = null, $total = null)
    {
        return $this->_response(true, $message, $data, $total);
    }

    /**
     * Error response.
     *
     * @access protected
     * @param  string $message
     * @param  mixed  $data
     * @return array
     */
    protected function error($message = null, $data = null)
    {
        return $this->_response(false, $message, $data, null);
    }

    /**
     * Format response.
     *
     * @param  boolean $success
     * @param  string  $message
     * @param  mixed   $data
     * @param  mixed   $total
     * @return array
     */
    private function _response($success, $message, $data, $total)
    {
        $response['success'] = (bool)$success;
        if (!is_null($message))
        {
            $response['message'] = $message;
        }
        if (!is_null($data))
        {
            $response['data'] = $data;
        }
        if (!is_null($total))
        {
            $response['total'] = $total;
        }
        return $response;
    }

}
