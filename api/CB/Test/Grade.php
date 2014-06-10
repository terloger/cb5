<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Test
 */
namespace CB\Test;

/**
 * GradeType test class.
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Test
 */
class GradeType extends AbstractTest
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
        $result = $this->getApiController('GradeType')->import();

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
        $result = $this->getApiController('GradeType')->read();

        $this->assertTrue($result['success'], 'got grades');
    }

}
