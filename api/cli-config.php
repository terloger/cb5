<?php

// composer autoloader
require_once 'vendor/autoload.php';

// load climbuddy core
require_once 'CB/Core.php';

// set json friendly error handler
set_error_handler('\CB\errorHandler');

// register climbuddy autoloader
spl_autoload_register('\CB\autoLoader');

$em = \CB\Doctrine\EntityManager::getInstance();

$helperSet = new \Symfony\Component\Console\Helper\HelperSet(array(
    'em' => new \Doctrine\ORM\Tools\Console\Helper\EntityManagerHelper($em)
));

return $helperSet;
