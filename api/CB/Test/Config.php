<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Test
 */
namespace CB\Test;

/**
 * Type test class.
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Test
 */
class Config extends AbstractTest
{

    /**
     * Test config.
     *
     * @access public
     * @return void
     */
    public function test1Read()
    {
        $result = $this->getApiController('Config')->read();

        $this->assertTrue($result['success'], 'has config');
    }

}
