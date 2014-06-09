<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Doctrine
 */
namespace CB\Doctrine;

/**
 * Climbuddy Doctrine file SQL logger.
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB
 */
class FileSQLLogger implements \Doctrine\DBAL\Logging\SQLLogger
{

    /**
     * SQL log file.
     *
     * @access private
     * @var    string
     */
    private $_file;

    /**
     * SQL execution start time.
     *
     * @access private
     * @var    float
     */
    private $_start;

    /**
     * Start SQL query.
     *
     * @access public
     * @param  string $sql
     * @param  array  $params
     * @param  array  $types
     * @return void
     */
    public function startQuery($sql, array $params = null, array $types = null)
    {
        // query start time
        $this->_start = microtime(true);

        // write sql to file
        file_put_contents($this->_getFile(), '**********************************' . PHP_EOL, FILE_APPEND | LOCK_EX);
        file_put_contents($this->_getFile(), $sql, FILE_APPEND | LOCK_EX);

        if (is_array($params) && count($params) > 0)
        {
            file_put_contents($this->_getFile(), PHP_EOL . print_r($params, true), FILE_APPEND | LOCK_EX);
        }

        if (is_array($types) && count($types) > 0)
        {
            file_put_contents($this->_getFile(), print_r($types, true), FILE_APPEND | LOCK_EX);
        }
    }

    /**
     * Stop SQL query.
     */
    public function stopQuery()
    {
        // write execution time to sql
        $text = PHP_EOL . 'EXECUTION TIME ' . round(microtime(true) - $this->_start, 4) . 's' . PHP_EOL . PHP_EOL . PHP_EOL;
        file_put_contents($this->_getFile(), $text , FILE_APPEND | LOCK_EX);
    }

    /**
     * Get SQL log file.
     *
     * @access private
     * @return string
     */
    private function _getFile()
    {
        if (!$this->_file)
        {
            $this->_file = \CB\Config::get('path.root') . '/logs/doctrine_sql_' . date('Y-m-d') . '.log';
        }
        return $this->_file;
    }

}
