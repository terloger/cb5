<?php

/**
 * Climbuddy namespace
 *
 * @package CB
 */
namespace CB;

/**
 * Cookie class.
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB
 */
class Cookie
{

    /**
     * Get cookie.
     *
     * @access public
     * @param  mixed $key
     * @return mixed
     */
    public static function get($key)
    {
        return isset($_COOKIE[$key]) ? $_COOKIE[$key] : false;
    }

    /**
     * Set cookie.
     *
     * @access public
     * @param  string  $key
     * @param  string  $value
     * @param  integer $expires
     * @param  string  $path
     * @param  string  $domain
     * @param  boolean $secure
     * @param  boolean $httpOnly
     * @return boolean
     */
    public static function set($key, $value, $expires = null, $path = null, $domain = null, $secure = null, $httpOnly = null)
    {
        if (is_null($expires))  $expires = strtotime(\CB\Config::get('cookie.expires'));
        if (is_null($path))     $path    = \CB\Config::get('cookie.path');
        if (is_null($domain))   $domain  = \CB\Config::get('cookie.domain');
        if (is_null($secure))   $secure  = \CB\Config::get('cookie.secure');

        if (setcookie($key, $value, $expires, $path, $domain, $secure, $httpOnly))
        {
            $_COOKIE[$key] = $value;
        }
        else
        {
            throw new Exception('Unable to set cookie "' . $key . '"!');
        }
    }

    /**
     * Remove cookie.
     *
     * @access public
     * @param  string  $key
     * @param  string  $path
     * @param  string  $domain
     * @param  boolean $secure
     * @param  boolean $httpOnly
     * @return boolean
     */
    public static function remove($key, $path = null, $domain = null, $secure = null, $httpOnly = null)
    {
        if (is_null($path))     $path    = \CB\Config::get('cookie.path');
        if (is_null($domain))   $domain  = \CB\Config::get('cookie.domain');
        if (is_null($secure))   $secure  = \CB\Config::get('cookie.secure');

        if (setcookie($key, '', time() - 3600, $path, $domain, $secure, $httpOnly))
        {
            unset($_COOKIE[$key]);
        }
        else
        {
            throw new Exception('Unable to remove cookie "' . $key . '"!');
        }
    }

}
