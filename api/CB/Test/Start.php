<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Test
 */
namespace CB\Test;

/**
 * Initial test class.
 *
 * Put global stuff here.
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Test
 */
class Start extends AbstractTest
{

    /**
     * Test user sign in.
     *
     * @access public
     * @return void
     */
    public function test1Login()
    {
        $User = $this->getService('User')->getSession();

        // already signed in
        if ($User)
        {
            $this->assertTrue($User->getId() > 0, 'got user');
        }
        // sign in
        else
        {
            $user = [
                'username'  => 'HriBB',
                'password'  => md5('jebiga'),
                'autologin' => true,
            ];

            $result = $this->getApiController('User')->login($user, true);

            $this->assertTrue(isset($result['data']['id']) && $result['data']['id'] > 0, 'got user');
        }
    }

}
