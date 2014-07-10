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

        // send javascript headers
        header('Content-Type: text/javascript');

        // init api
        $response  = 'var CB = {}; CB.init = {};';
        $response .= 'CB.init.API=' . json_encode($api) . ';';
        
        // init config
        $config = $this->getApiController('Config')->read();
        if ($config['success'])
        {
            $response .= 'CB.init.Config=' . json_encode($config['data']) . ';';
        }
        
        // init session user
        $user = $this->getApiController('User')->readSession();
        if ($user['success'])
        {
            $response .= 'CB.init.User=' . json_encode($user['data']) . ';';
        }
        
        /*
        $countries = $this->getApiController('Country')->read()['data'];
        $response .= 'CB.init.Countries=' . json_encode($countries) . ';';
        
        $locations = $this->getApiController('Location')->read()['data'];
        $response .= 'CB.init.Locations=' . json_encode($locations) . ';';
        
        $locationTypes = $this->getApiController('LocationType')->read()['data'];
        $response .= 'CB.init.LocationTypes=' . json_encode($locationTypes) . ';';
        
        $gradeTypes = $this->getApiController('GradeTypes')->read()['data'];
        $response .= 'CB.init.GradeTypes=' . json_encode($gradeTypes) . ';';
        */
        
        echo $response;
        exit;
        die;
    }

}
