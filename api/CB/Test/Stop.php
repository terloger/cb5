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
class Stop extends AbstractTest
{

    /**
     * Test user sign in.
     *
     * @access public
     * @return void
     */
    public function test1Logout()
    {
        $result = $this->getApiController('User')->logout();

        $this->assertTrue($result['success'], 'sign out');
    }

}
