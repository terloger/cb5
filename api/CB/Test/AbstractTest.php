<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Test
 */
namespace CB\Test;

/**
 * Unit test class.
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB
 */
abstract class AbstractTest extends \UnitTestCase
{

    /**
     * Get entity manager.
     *
     * @access protected
     * @return \CB\Doctrine\EntityManager
     */
    protected function getEntityManager()
    {
        return \CB\Doctrine\EntityManager::getInstance();
    }

    /**
     * Get entity serializer.
     *
     * @access protected
     * @return \CB\Doctrine\EntitySerializer
     */
    protected function getEntitySerializer()
    {
        return \CB\Doctrine\EntitySerializer::getInstance();
    }

    /**
     * Get service.
     *
     * @access protected
     * @param  string $service
     * @return \CB\Service\Service
     */
    protected function getService($service)
    {
        $Service = '\CB\Service\\' . $service;
        return $Service::getInstance();
    }

    /**
     * Get controller.
     *
     * @access protected
     * @param  string $controller
     * @return \CB\Controller\Controller
     */
    protected function getController($controller)
    {
        $Controller = '\CB\Controller\\' . $controller;
        return new $Controller;
    }

    /**
     * Get api controller.
     *
     * @access protected
     * @param  string $controller
     * @return \CB\Api\Controller
     */
    protected function getApiController($controller)
    {
        $Controller = '\CB\Api\\' . $controller;
        return $Controller::getInstance();
    }

    /**
     * Assert exception is thrown.
     *
     * Exception must be thrown by the function or test will fail.
     *
     * @access protected
     * @param  function $function
     * @param  string   $message
     */
    protected function assertException($function, $message = null)
    {
        $exception = false;
        try
        {
            $function();
        }
        catch (\Exception $e)
        {
            $message = $e->getMessage();
            $exception = true;
        }

        $this->assertTrue($exception, $message);
    }

    /**
     * Assert no exception.
     *
     * Exception must NOT be thrown by the function or test will fail.
     *
     * @access protected
     * @param  function $function
     * @param  string   $message
     */
    protected function assertNoException($function, $message = null)
    {
        $exception = false;
        try
        {
            $function();
        }
        catch (\Exception $e)
        {
            $message = $e->getMessage();
            $exception = true;
        }

        $this->assertFalse($exception, $message);
    }

}

/**
 * Unit test reporter class.
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB
 */
class UnitTestReporter extends \HtmlReporter
{

    /**
     * Reporter character set
     * @var type
     */
    private $character_set;

    /**
     * Constructor sets character set.
     *
     * @access public
     * @param  string $character_set
     * @return void
     */
    function __construct($character_set = 'UTF-8')
    {
        parent::__construct();
        $this->character_set = $character_set;
    }

    /**
     * Paint header.
     *
     * Use output buffering.
     *
     * @access public
     * @param  string $test_name
     * @return void
     */
    public function paintHeader($test_name)
    {
        ob_start();
        $this->sendNoCacheHeaders();
        print "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">";
        print "<html>\n<head>\n<title>$test_name</title>\n";
        print "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=" . $this->character_set . "\">\n";
        print "<style type=\"text/css\">\n";
        print $this->getCss() . "\n";
        print "</style>\n";
        print "</head>\n<body>\n";
        print "<h1>$test_name</h1>\n";
    }

    /**
     * Paint footer.
     *
     * Use output buffering.
     *
     * @access public
     * @param  string $test_name
     * @return void
     */
    public function paintFooter($test_name)
    {
        $colour = ($this->getFailCount() + $this->getExceptionCount() > 0 ? "red" : "green");
        print "<div style=\"";
        print "padding: 8px; margin-top: 1em; background-color: $colour; color: white;";
        print "\">";
        print $this->getTestCaseProgress() . "/" . $this->getTestCaseCount();
        print " test cases complete:\n";
        print "<strong>" . $this->getPassCount() . "</strong> passes, ";
        print "<strong>" . $this->getFailCount() . "</strong> fails and ";
        print "<strong>" . $this->getExceptionCount() . "</strong> exceptions.";
        print "</div>\n";
        print "</body>\n</html>\n";

        ob_end_flush();
    }

    /**
     * Paint pass
     *
     * @access public
     * @param  string $message
     * @return void
     */
    public function paintPass($message)
    {
        parent::paintPass($message);

        // use /api/test/?debug to debug ;)
        if (isset($_GET['debug']))
        {
            print "<span class=\"pass\">Pass</span>: ";
            $breadcrumb = $this->getTestList();
            array_shift($breadcrumb);
            print implode(" -&gt; ", $breadcrumb);
            print " -&gt; " . $this->htmlEntities($message) . "<br />\n";
        }
    }

    /**
     * Paint fail.
     *
     * @access public
     * @param  string $message
     * @return void
     */
    public function paintFail($message)
    {
        parent::paintFail($message);
        print "<span class=\"fail\">Fail</span>: ";
        $breadcrumb = $this->getTestList();
        array_shift($breadcrumb);
        print implode(" -&gt; ", $breadcrumb);
        print " -&gt; " . $this->htmlEntities($message) . "<br />\n";
    }

    /**
     * Paint error.
     *
     * @access public
     * @param  string $message
     * @return void
     */
    public function paintError($message)
    {
        parent::paintError($message);
        print "<span class=\"fail\">Exception</span>: ";
        $breadcrumb = $this->getTestList();
        array_shift($breadcrumb);
        print implode(" -&gt; ", $breadcrumb);
        print " -&gt; <strong>" . $this->htmlEntities($message) . "</strong><br />\n";
    }

    /**
     * Paint exception.
     *
     * @access public
     * @param  \Exception $exception
     * @return void
     */
    public function paintException($exception)
    {
        parent::paintException($exception);
        print "<span class=\"fail\">Exception</span>: ";
        $breadcrumb = $this->getTestList();
        array_shift($breadcrumb);
        print implode(" -&gt; ", $breadcrumb);
        $message = 'Unexpected exception of type [' . get_class($exception) .
                '] with message ['. $exception->getMessage() .
                '] in ['. $exception->getFile() .
                ' line ' . $exception->getLine() . ']';
        print " -&gt; <strong>" . $this->htmlEntities($message) . "</strong><br />\n";
    }

}
