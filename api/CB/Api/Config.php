<?php

/**
 * Climbuddy API namespace
 *
 * @package CB\Api
 */
namespace CB\Api;

/**
 * API config controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Api
 */
class Config extends AbstractController
{

    /**
     * Get app configuration.
     *
     * Send configuration to the client.
     *
     * @access public
     * @return array
     */
    public function read()
    {
        try
        {
            $config = [
                'cb.version'       => \CB\Config::get('cb.version'),
                'cb.build'         => \CB\Config::get('cb.build'),
                'cb.environment'   => \CB\Config::get('cb.environment'),
                'url.root'         => \CB\Config::get('url.root'),
                'url.uploads'      => \CB\Config::get('url.uploads'),
                'url.resources'    => \CB\Config::get('url.resources'),
                'folder.root'      => \CB\Config::get('folder.root'),
                'folder.uploads'   => \CB\Config::get('folder.uploads'),
                'folder.resources' => \CB\Config::get('folder.resources')
            ];

            return $this->success('Read configuration successful.', $config);
        }
        catch (\CB\Exception $e)
        {
            return $this->error($e->getMessage());
        }
    }

}
