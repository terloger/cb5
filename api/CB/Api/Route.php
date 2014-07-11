<?php

/**
 * Climbuddy API namespace
 *
 * @package CB\Api
 */
namespace CB\Api;

/**
 * API route controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Api
 */
class Route extends AbstractController
{

    /**
     * Read routes
     * 
     * @access public
     * @return array
     */
    public function read()
    {
        return $this->success('Read', []);
    }
    
    /**
     * Create route(s)
     * 
     * @access public
     * @return array
     */
    public function create($routes)
    {
        try
        {
            // must be array
            if (!is_array($routes))
            {
                $routes = array($routes);
            }
            
            // must be logged in
            if (null === $User = $this->getSessionUser())
            {
                return $this->error('You must be signed-in to perform this action!');
            }
            
            // get entity manager
            $em = $this->getEntityManager();
            
            // store entities
            $entities = [];
            
            // loop through all routes
            foreach ($routes as $route)
            {
                // remember client id
                if (!isset($route['id']))
                {
                    return $this->error('Invalid route clientId!');
                }
                $clientId = $route['id'];
                
                // must have location
                $locationId = isset($route['locationId']) ? $route['locationId'] : null;
                if (null === $Location = $em->getRepository('\CB\Entity\Location')->find($locationId))
                {
                    return $this->error('Unable to find route location!');
                }

                // create new route
                $Route = new \CB\Entity\Route();
                $Route->setValues($route);
                $Route->setUser($User);
                $Route->setLocation($Location);
                
                // persist route
                $em->persist($Route);
                
                // store routes by clientId
                $entities[$clientId] = $Route;
            }
            
            // save changes
            $em->flush();
            
            // build response data
            $data = [];
            foreach ($entities as $clientId => $Route)
            {
                $route = $Route->getValues();
                $route['clientId'] = $clientId;
                $data[] = $route;
            }
            
            return $this->success('Create', $data);
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
    }
    
    /**
     * Update route(s)
     * 
     * @access public
     * @return array
     */
    public function update($routes)
    {
        try
        {
            // must be array
            if (!is_array($routes))
            {
                $routes = array($routes);
            }
            
            // must be logged in
            if (null === $User = $this->getSessionUser())
            {
                return $this->error('You must be signed-in to perform this action!');
            }
            
            // get entity manager
            $em = $this->getEntityManager();
            
            // store entities
            $entities = [];
            
            // loop through all routes
            foreach ($routes as $route)
            {
                // load route
                $routeId = isset($route['id']) ? $route['id'] : null;
                if (null === $Route = $em->getRepository('\CB\Entity\Route')->find($routeId))
                {
                    return $this->error('Unable to find route to update!');
                }
                
                // must have location
                $locationId = isset($route['locationId']) ? $route['locationId'] : null;
                if (null === $Location = $em->getRepository('\CB\Entity\Location')->find($locationId))
                {
                    return $this->error('Unable to find route location!');
                }

                // create new route
                $Route->setValues($route);
                
                // persist route
                $em->persist($Route);
                
                // store routes by routeId
                $entities[$routeId] = $Route;
            }
            
            // save changes
            $em->flush();
            
            // build response data
            $data = [];
            foreach ($entities as $routeId => $Route)
            {
                $data[] = $Route->getValues();
            }
            
            return $this->success('Update', $data);
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
    }
    
    /**
     * Destroy route(s)
     * 
     * @access public
     * @return array
     */
    public function destroy()
    {
        return $this->success('Update', []);
    }

}
