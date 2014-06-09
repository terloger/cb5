<?php

/**
 * Climbuddy namespace
 *
 * @package CB
 */
namespace CB;

/**
 * Climbuddy config class.
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB
 */
class Config
{

    /**
     * Configuration.
     *
     * @access private
     * @var    array
     */
    private static $_config = false;

    /**
     * Get config value.
     *
     * @param  string $key
     * @return mixed
     * @throws Exception
     */
    public static function get($key)
    {
        if (false === self::$_config)
        {
            self::_parseConfig('config.ini');
        }
        if (isset(self::$_config[$key]))
        {
            return self::$_config[$key];
        }
        else
        {
            throw new Exception('Config param "' . $key . '" does not exist!');
        }
    }

    /**
     * API functions.
     *
     * Use reflection class to scan through api controller functions.
     *
     * @access public
     * @return array
     * @static
     */
    public static function getApiFunctions()
    {
        $apiFunctions = array();
        foreach (scandir(Config::get('path.root') . '/CB/Api/') as $file)
        {
            if ($file === '.' || $file === '..')
            {
                continue;
            }

            $className = str_replace('.php', '', $file);
            $apiController = '\CB\Api\\' . $className;

            foreach (get_class_methods($apiController) as $methodName)
            {
                $class = new \ReflectionClass($apiController);
                $method = new \ReflectionMethod($apiController, $methodName);
                
                if (!$method->isStatic() && $class->getParentClass() && $class->getParentClass()->getName() === 'CB\Api\AbstractController')
                {
                    $apiFunctions[$className]['methods'][$methodName] = array(
                        'len' => count($method->getParameters())
                    );
                }
            }
        }
        
        return $apiFunctions;
    }

    /**
     * Parse config.
     *
     * @access private
     * @param  string $config
     * @return void
     * @static
     */
    private static function _parseConfig($config)
    {
        $config = parse_ini_file($config, true);
        foreach ($config as $section => $keys)
        {
            foreach ($keys as $k => $v)
            {
                self::$_config[$section . '.' . $k] = self::_parseConfigValue($v);
            }
        }
    }

    /**
     * Parse config value.
     *
     * @access private
     * @param  mixed $value
     * @return mixed
     * @static
     */
    private static function _parseConfigValue($value)
    {
        if ($value === '1')
        {
            return true;
        }
        else if ($value === '0')
        {
            return false;
        }
        else if (is_string($value) && strlen($value) > 0 && strstr($value, ','))
        {
            return explode(',', $value);
        }
        else if (is_array($value))
        {
            foreach ($value as $k => $v)
            {
                $value[$k] = self::_parseConfigValue($v);
            }
            return $value;
        }
        return $value;
    }

}

/**
 * Autoloader.
 *
 * @param  string $class
 * @return void
 */
function autoLoader($class)
{
    $class = Config::get('path.root') . '/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($class))
    {
        require_once $class;
    }
}

/**
 * Error handler.
 *
 *
 *
 * @access public
 * @param  integer $errno
 * @param  string  $errstr
 * @param  string  $errfile
 * @param  integer $errline
 * @return boolean
 */
function errorHandler($errno, $errstr, $errfile, $errline)
{
   $types = array(
       E_ERROR             => 'ERROR',
       E_WARNING           => 'WARNING',
       E_PARSE             => 'PARSING ERROR',
       E_NOTICE            => 'NOTICE',
       E_CORE_ERROR        => 'CORE ERROR',
       E_CORE_WARNING      => 'CORE WARNING',
       E_COMPILE_ERROR     => 'COMPILE ERROR',
       E_COMPILE_WARNING   => 'COMPILE WARNING',
       E_USER_ERROR        => 'USER ERROR',
       E_USER_WARNING      => 'USER WARNING',
       E_USER_NOTICE       => 'USER NOTICE',
       E_STRICT            => 'STRICT NOTICE',
       E_RECOVERABLE_ERROR => 'RECOVERABLE ERROR'
   );

   $message = (isset($types[$errno]) ? $types[$errno] : 'UNKNOWN ERROR') . ': ' . $errstr;

   $where = $errfile . ' at line ' . $errline;

   // use output buffering, needs some revision
   ob_start();
   debug_print_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
   $trace = ob_get_contents();
   $trace = nl2br($trace);
   ob_end_clean();

   showError($message, $where, $trace);

   // Don't execute PHP internal error handler
   return true;
}

/**
 * Show error.
 *
 * Return json if requested via ajax.
 *
 * @access public
 * @param  string $message
 * @param  string $where
 * @param  string $trace
 * @return void
 */
function showError($message, $where = null, $trace = null)
{
    // build error string
    $error = $message;
    $error .= $where ? ' in ' . $where : '';
    $error .= $trace ? '<br /><br />' . $trace : '';

    // write log
    $file = \CB\Config::get('path.root') . '/logs/error_log_' . date('Y-m-d') . '.log';
    file_put_contents($file, PHP_EOL . '******************** ' . date('Y-m-d H:i:s') . PHP_EOL, FILE_APPEND | LOCK_EX);
    file_put_contents($file, str_replace('<br />', "\n", $error) . PHP_EOL, FILE_APPEND | LOCK_EX);

    // dont show too much on production
    if (Config::get('cb.environment') === 'production')
    {
        $error = 'Error: a hold broke off and the server fell.';
    }

    // show ajax error
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest')
    {
        echo json_encode(array(
            'type'    => 'exception',
            'message' => $error
        ));
    }
    // show non ajax error ...
    else
    {
        echo 'Ext.ns("CB.init");CB.init.Error = ' . json_encode($error) .';';
    }

    // stop execution for sure :)
    exit;
    die;
}

/**
 * Show exception.
 *
 * Catch all uncaught exceptions in index.php
 *
 * @access public
 * @param  Exception $e
 * @return void
 */
function showException($e)
{
   $message = $e->getMessage();
   $where = $e->getFile() . ' at line ' . $e->getLine();
   $trace = nl2br($e->getTraceAsString());
   showError($message, $where, $trace);
}
