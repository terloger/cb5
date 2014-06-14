<?php

/**
 * Climbuddy controller namespace
 *
 * @package CB\Controller
 */
namespace CB\Controller;

/**
 * API controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Controller
 */
class Api extends AbstractController
{

    /**
     * Api info controller
     *
     * @access public
     * @return void
     */
    public function __construct()
    {
        // convert API functions to Ext.Direct specs
        $actions = array();
        $api = \CB\Config::getApiFunctions();
        foreach($api as $aname => &$a)
        {
            $methods = array();
            foreach($a['methods'] as $mname => &$m)
            {
                if (isset($m['len']))
                {
                    $md = array(
                        'name' => $mname,
                        'len'  => $m['len']
                    );
                }
                else
                {
                    $md = array(
                        'name'   => $mname,
                        'params' => $m['params']
                    );
                }
                if(isset($m['formHandler']) && $m['formHandler'])
                {
                    $md['formHandler'] = true;
                }
                $methods[] = $md;
            }
            $actions[$aname] = $methods;
        }

        // API specs
        $api = array(
            'url'       => \CB\Config::get('folder.root') . '/api/router/',
            'namespace' => 'CB.api',
            'type'      => 'remoting',
            'actions'   => $actions
        );

        // initial data
        //$user = (null !== $User = $this->getService('User')->getSession()) ? $User->getValues() : null;
        $user = $this->getApiController('User')->readSession()['data'];
        $config = $this->getApiController('Config')->read()['data'];
        /*
        $countries = $this->getApiController('Country')->read()['data'];
        $locations = $this->getApiController('Location')->read()['data'];
        $locationTypes = $this->getApiController('LocationType')->read()['data'];
        $gradeTypes = $this->getApiController('GradeTypes')->read()['data'];
        */

        // send javascript headers
        header('Content-Type: text/javascript');

        // build response
        $response  = 'Ext.ns("CB.init");';
        $response .= 'CB.init.API=' . json_encode($api) . ';';
        $response .= 'CB.init.User=' . json_encode($user) . ';';
        $response .= 'CB.init.Config=' . json_encode($config) . ';';
        /*
        $response .= 'CB.init.Countries=' . json_encode($countries) . ';';
        $response .= 'CB.init.Locations=' . json_encode($locations) . ';';
        $response .= 'CB.init.LocationTypes=' . json_encode($locationTypes) . ';';
        $response .= 'CB.init.GradeTypes=' . json_encode($gradeTypes) . ';';
        */
        echo $response;
        exit;
        die;
    }

}
