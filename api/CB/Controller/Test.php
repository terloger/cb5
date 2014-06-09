<?php

/**
 * Climbuddy controller namespace
 *
 * @package CB\Controller
 */
namespace CB\Controller;

/**
 * Test controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Controller
 */
class Test extends AbstractController
{

    /**
     * Test controller.
     *
     * Execute climbuddy tests :)
     *
     * @access public
     * @return void
     */
    public function __construct()
    {
        // disable tests in production
        if (\CB\Config::get('cb.environment') === 'production')
        {
            header('location: ' . \CB\Config::get('folder.root') . '/api/info');
        }

        // buffer output
        ob_start();

        // start tests
        $Start = new \CB\Test\Start();
        $Start->run(new \CB\Test\UnitTestReporter());

        // run other test suites
        $testDir = \CB\Config::get('path.root') . '/CB/Test/';
        $excludeFiles = array('.', '..', 'AbstractTest.php', 'Start.php', 'Stop.php');
        foreach (scandir($testDir) as $file)
        {
            // run single test with $_GET['suite']
            $class = str_replace('.php', '', $file);
            $Class = '\CB\Test\\' . $class;

            // test suite?
            if (isset($_GET['suite']) && $class !== $_GET['suite'])
            {
                continue;
            }

            // skip some files and all folders
            if (in_array($file, $excludeFiles) || is_dir($testDir . '/' . $file))
            {
                continue;
            }

            $Test = new $Class();
            $Test->run(new \CB\Test\UnitTestReporter());
        }

        // stop tests
        $Stop = new \CB\Test\Stop();
        $Stop->run(new \CB\Test\UnitTestReporter());

        // output results
        ob_end_flush();
        exit;
        die;
    }

}
