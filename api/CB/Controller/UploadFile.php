<?php

/**
 * Climbuddy controller namespace
 *
 * @package CB\Controller
 */
namespace CB\Controller;

/**
 * Upload file controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Controller
 */
class UploadFile extends AbstractController
{

    /**
     * Info controller
     *
     * @access public
     * @return void
     */
    public function __construct()
    {
        $result = $this->getApiController('Location')->uploadFile();
        echo json_encode($result);
        exit;
        die;
    }

}
