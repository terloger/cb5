<?php

/**
 * Climbuddy controller namespace
 *
 * @package CB\Controller
 */
namespace CB\Controller;

/**
 * Router controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Controller
 */
class Router extends AbstractController
{

    /**
     * Api info controller
     *
     * @access public
     * @return void
     */
    public function __construct()
    {
        // process request
        $isForm = false;
        $isUpload = false;
        if (false !== $data = file_get_contents('php://input'))
        {
            header('Content-Type: text/javascript');
            $data = json_decode($data, true);
        }
        else if (isset($_POST['extAction']))
        {
            // form post
            $isForm = true;
            $isUpload = $_POST['extUpload'] == 'true';
            $data = [
                'action' => $_POST['extAction'],
                'method' => $_POST['extMethod'],
                'tid' => isset($_POST['extTID']) ? $_POST['extTID'] : null,
                'data' => array($_POST, $_FILES),
            ];
        }
        else
        {
            die('Invalid request.');
        }

        // execute api function
        $response = null;
        if(is_array($data) && !isset($data['action']))
        {
            $response = array();
            foreach($data as $d)
            {
                $response[] = $this->_doRpc($d);
            }
        }
        else
        {
            $response = $this->_doRpc($data);
        }

        // show response
        if($isForm && $isUpload)
        {
            echo '<html><body><textarea>';
            echo json_encode($response);
            echo '</textarea></body></html>';
        }
        else
        {
            echo json_encode($response);
        }
        exit;
        die;
    }

    /**
     * Remote procedure call.
     *
     * Execute api function.
     *
     * @param  \stdObject $cdata
     * @return array
     * @throws \CB\Controller\Exception
     */
    private function _doRpc($cdata)
    {
        $api = \CB\Config::getApiFunctions();

        if(!isset($api[$cdata['action']]))
        {
            throw new \CB\Controller\Exception('Call to undefined action: ' . $cdata['action']);
        }

        $action = $cdata['action'];
        $a = $api[$action];

        $this->_doAroundCalls($a['before'], $cdata);

        $method = $cdata['method'];
        $mdef = $a['methods'][$method];
        if(!$mdef)
        {
            throw new \CB\Controller\Exception('Call to undefined method: ' . $method . ' on action $action');
        }
        $this->_doAroundCalls($mdef['before'], $cdata);

        $r = array(
            'type'   => 'rpc',
            'tid'    => $cdata['tid'],
            'action' => $action,
            'method' => $method
        );

        // load api controller
        $Class = '\CB\Api\\' . $action;
        $Controller = $Class::getInstance();

        // build function params
        if (isset($mdef['len']))
        {
            $params = isset($cdata['data']) && is_array($cdata['data']) ? $cdata['data'] : array();
        }
        else
        {
            $params = array($cdata['data']);
        }

        // prepare fields and values
        array_walk($params, function($param) {
            (array)$param;
        });

        // call api controller function
        $r['result'] = call_user_func_array(array($Controller, $method), $params);

        $this->_doAroundCalls($mdef['after'], $cdata, $r);
        $this->_doAroundCalls($a['after'], $cdata, $r);

        return $r;
    }

    /**
     * Do around calls.
     *
     * @param  type $fns
     * @param  type $cdata
     * @param  type $returnData
     * @return type
     */
    private function _doAroundCalls(&$fns, &$cdata, &$returnData=null)
    {
        if(!$fns)
        {
            return;
        }
        if(is_array($fns))
        {
            foreach($fns as $f)
            {
                $f($cdata, $returnData);
            }
        }
        else
        {
            $fns($cdata, $returnData);
        }
    }

}
