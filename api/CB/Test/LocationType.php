<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Test
 */
namespace CB\Test;

/**
 * LocationType test class.
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Test
 */
class LocationType extends AbstractTest
{

    /**
     * Test type read.
     *
     * @access public
     * @return void
     */
    public function test1Read()
    {
        $result = $this->getApiController('LocationType')->read();

        $this->assertTrue($result['success'], 'got location types');
    }

}
