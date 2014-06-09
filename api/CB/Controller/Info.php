<?php

/**
 * Climbuddy controller namespace
 *
 * @package CB\Controller
 */
namespace CB\Controller;

/**
 * Info controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Controller
 */
class Info extends AbstractController
{

    /**
     * Info controller
     *
     * @access public
     * @return void
     */
    public function __construct()
    {
        echo 'ClimBuddy API v0.1';
        exit;
        die;
    }

}
