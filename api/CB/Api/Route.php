<?php

/**
 * Climbuddy API namespace
 *
 * @package CB\Api
 */
namespace CB\Api;

/**
 * API route controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Api
 */
class Route extends AbstractController
{

    /**
     * Read routes
     * 
     * @access public
     * @return array
     */
    public function read()
    {
        return $this->success('Read', []);
    }

}
