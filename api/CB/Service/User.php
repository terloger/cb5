<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Service
 */
namespace CB\Service;

/**
 * User service class.
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Service
 */
class User extends AbstractService
{

    /**
     * Session user entity.
     *
     * @access private
     * @var    object
     */
    private static $_sessionUser;

    /**
     * Get session user.
     *
     * @access public
     * @return object
     */
    public function getSession()
    {
        if (!isset(self::$_sessionUser))
        {
            // load user from session
            if (\CB\Session::get('userId'))
            {
                if (null === $User = $this->getEntityManager()->find('\CB\Entity\User', \CB\Session::get('userId')))
                {
                    // user not found, destroy session
                    \CB\Session::destroy();
                }
                else
                {
                    // set session user
                    self::$_sessionUser = $User;
                }
            }
            // load user from autologin cookie
            else if (\CB\Cookie::get('autologin'))
            {
                // load token
                if (null === $Token = $this->getService('Token')->get(\CB\Cookie::get('autologin')))
                {
                    // token not found, remove cookie
                    \CB\Cookie::remove('autologin');
                }
                // load user
                else if (null === $User = $this->getEntityManager()->find('\CB\Entity\User', \CB\Session::get('userId')))
                {
                    // user not found, remove token and cookie
                    $this->getService('Token')->remove(\CB\Cookie::get('autologin'));
                    \CB\Cookie::remove('autologin');
                }
                else
                {
                    // set session
                    \CB\Session::set('userId', $Token->getValue());

                    // set session user
                    self::$_sessionUser = $User;
                }
            }
        }

        return self::$_sessionUser;
    }

    /**
     * Load user by credentials.
     *
     * @access public
     * @param  string  $username
     * @param  string  $password
     * @param  boolean $autologin
     * @return void
     * @throws \CB\Service\Exception
     */
    public function login($username, $password, $autologin = false)
    {
        // load user
        $query = $this->getEntityManager()->createQuery('SELECT u from \CB\Entity\User u WHERE u.username = :username AND u.password = :password');
        $query->setParameters(array(
            'username' => $username,
            'password' => md5($password)
        ));

        try
        {
            $User = $query->getSingleResult();
        }
        catch (\Exception $e)
        {
            throw new \CB\Service\Exception('Invalid username and/or password!');
        }

        // check permission
        if (!$this->can($User, 'login'))
        {
            throw new \CB\Service\Exception('User does not have permission to sign in!');
        }

        // set session userId
        \CB\Session::set('userId', $User->getId());

        // autologin
        if ($autologin)
        {
            // create token
            if (null !== $Token = $this->getService('Token')->create($User->getId(), \CB\Service\Token::AUTOLOGIN))
            {
                // create autologin cookie
                $expires = new \DateTime();
                $expires->add(new \DateInterval('P1Y'));
                \CB\Cookie::set('autologin', $Token->getId(), $expires->getTimestamp());
            }
        }

        // set session user
        self::$_sessionUser = $User;

        // return session user
        return self::$_sessionUser;
    }

    /**
     * Logout user.
     *
     * @access public
     * @return void
     */
    public function logout()
    {
        // delete session
        \CB\Session::destroy();

        // delete autologin
        if (\CB\Cookie::get('autologin'))
        {
            // delete token
            $this->getService('Token')->remove(\CB\Cookie::get('autologin'));

            // delete cookie
            \CB\Cookie::remove('autologin');
        }
    }

    /**
     * Can user perform certain action?
     *
     * @access public
     * @param  \CB\Entity\User $User
     * @param  string $action
     * @return boolean
     */
    public function can($User, $action)
    {
        // invalid permission
        if (!isset(\CB\Config::get('user.permissions')[$action]))
        {
            throw new \CB\Service\Exception('Invalid permission "' . $action . '"!');
        }

        // check permission
        return (\CB\Config::get('user.permissions')[$action] & $User->getPermission());
    }

    /**
     * Check if user cannot perform certain action.
     *
     * @access public
     * @param  \CB\Entity\User $User
     * @param  string $action
     * @return boolean
     */
    public function cannot($User, $action)
    {
        return !$this->can($User, $action);
    }

    /**
     * Gran permission.
     *
     * @access public
     * @param  \CB\Entity\User $User
     * @param  string $action
     * @return boolean
     */
    public function grant($User, $action)
    {
        // invalid permission
        if (!isset(\CB\Config::get('user.permissions')[$action]))
        {
            throw new \CB\Service\Exception('Invalid permission "' . $action . '"!');
        }

        // user does not have this permission
        if ($this->can($action))
        {
            throw new \CB\Service\Exception('User already has "' . $action . '" permission!');
        }

        // grant it
        $User->setPermission($User->getPermission() | \CB\Config::get('user.permissions')[$action]);
        $this->em()->persist($User);
    }

    /**
     * Revoke (remove) permission.
     *
     * @access public
     * @param  \CB\Entity\User $User
     * @param  string          $action
     * @return boolean
     */
    public function revoke($User, $action)
    {
        // invalid permission
        if (!isset(\CB\Config::get('user.permissions')[$action]))
        {
            throw new \CB\Service\Exception('Invalid permission "' . $action . '"!');
        }

        // user has this permission
        if (!$this->can($action))
        {
            throw new \CB\Service\Exception('User does not have "' . $action .'" permission!');
        }

        // revoke it
        $User->setPermission($User->getPermission() ^ \CB\Config::get('user.permissions')[$action]);
        $this->em()->persist($User);
    }

}
