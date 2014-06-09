<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Test
 */
namespace CB\Test;

/**
 * Grades test class.
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Test
 */
class Grade extends AbstractTest
{

    /**
     * Test user sign in.
     *
     * @access public
     * @return void
     */
    public function test1Import()
    {
        /*
        $result = $this->getApiController('Grade')->import();

        $this->assertTrue($result['success'], 'got grades');
         *
         */
    }

    /**
     * Test user sign in.
     *
     * @access public
     * @return void
     */
    public function test2Read()
    {
        $result = $this->getApiController('Grade')->read();

        $this->assertTrue($result['success'], 'got grades');
    }

}
