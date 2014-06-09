<?php

/**
 * Climbuddy namespace
 *
 * @package CB
 */
namespace CB;

/**
 * Session class
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB
 */
class Session
{

    /**
     * Private constructor; prevent direct creation of the object.
     *
     * @access private
     * @return void
     */
    public static function start()
    {
        session_start();
    }

    /**
     * Destroy session.
     *
     * @access public
     * @return void
     */
    public static function destroy()
    {
        foreach ($_SESSION as $key => $value)
        {
            unset($_SESSION[$key]);
        }
        session_destroy();
    }

    /**
     * Get session variable.
     *
     * @access public
     * @param  string $key
     * @return mixed
     */
    public static function get($key)
    {
        return isset($_SESSION[$key]) ? $_SESSION[$key] : false;
    }

    /**
     * Set session variable.
     *
     * @access public
     * @param  string $key
     * @param  mixed  $value
     * @return void
     */
    public static function set($key, $value)
    {
        $_SESSION[$key] = $value;
    }

    /**
     * Remove session variable.
     *
     * @access public
     * @param  string $key
     * @return void
     */
    public static function remove($key)
    {
        unset($_SESSION[$key]);
    }

}
