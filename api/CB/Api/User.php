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
class User extends AbstractController
{
    /**
     * Read session user
     * 
     * @return array
     */
    public function readSession()
    {
        try
        {
            $User = $this->getService('User')->getSession();
            if ($User)
            {
                return $this->success('Got user.', $User->getValues());
            }
        }
        catch (\CB\Exception $e)
        {
            return $this->error($e->getMessage());
        }
        return $this->error();
    }

    /**
     * Login!
     *
     * @access public
     * @param  array $user
     * @return array
     */
    public function login($user)
    {
        if (isset($user['username']) && isset($user['password']))
        {
            if (!isset($user['autologin']))
            {
                $user['autologin'] = false;
            }
            try
            {
                $User = $this->getService('User')->login($user['username'], $user['password'], $user['autologin']);
                return $this->success('Successfully signed in.', $User->getValues());
            }
            catch (\CB\Exception $e)
            {
                return $this->error($e->getMessage());
            }
        }
        return $this->error('Invalid username and/or password!');
    }

    /**
     * Logout.
     *
     * @access public
     * @return array
     */
    public function logout()
    {
        try
        {
            $this->getService('User')->logout();
            return $this->success('Successfully signed out.');
        }
        catch (\CB\Exception $e)
        {
            return $this->error($e->getMessage());
        }
        return $this->error('Unable to sign out!');
    }

}
