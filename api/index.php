<?php

// load composer autoloader
require_once 'vendor/autoload.php';

// load climbuddy core
require_once 'CB/Core.php';

// set json friendly error handler
set_error_handler('\CB\errorHandler');

// register climbuddy autoloader
spl_autoload_register('\CB\autoLoader');

// set locale
setlocale(LC_ALL, 'en_US.UTF8');

// setup development environment
if (\CB\Config::get('cb.environment') === 'development')
{
    // show all errors in development
    error_reporting(-1);

    /**
     * Dump object
     *
     * @param $data
     * @param $simple
     */
    function dump($data, $simple = true)
    {
        $ajax = (bool)(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest');
        echo $ajax ? '' : '<pre style="font-size:11px;border:1px solid #606060;color:#606060;background:#eee;margin:8px;padding:8px;">';
        $simple ? print_r($data) : var_dump($data);
        echo $ajax ? '' : '</pre>';
    }

    /**
     * Dump doctrine object
     *
     * @param type $data
     */
    function ddump($data)
    {
        \Doctrine\Common\Util\Debug::dump($data);
    }
}

// start session
\CB\Session::start();

// leave no exception uncaught
try
{
    // process request
    $request = rtrim(explode('?', $_SERVER['REQUEST_URI'])[0], '/\\');

    // simple request mapping
    switch ($request)
    {
        // default
        default:
        case \CB\Config::get('folder.root') . '/api/info':
            new \CB\Controller\Info();
            break;

        // extjs api string
        case \CB\Config::get('folder.root') . '/api':
            new \CB\Controller\Api();
            break;

        // extjs api router
        case \CB\Config::get('folder.root') . '/api/router':
            new \CB\Controller\Router();
            break;

        // upload file
        case \CB\Config::get('folder.root') . '/api/upload-file':
            new \CB\Controller\UploadFile();
            break;

        // test
        case \CB\Config::get('folder.root') . '/api/test':
            new \CB\Controller\Test();
            break;

        // info
        case \CB\Config::get('folder.root') . '/api/info':
            new \CB\Controller\Info();
            break;

    }
}
catch (\Exception $e)
{
    \CB\showException($e);
}
