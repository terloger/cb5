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
     * @param array $routes
     * @return array
     */
    public function create($routes)
    {
        try
        {
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
                if (!isset($route['locationId']) || null === $Location = $em->getRepository('\CB\Entity\Location')->find($route['locationId']))
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
     * @param array $routes
     * @return array
     */
    public function update($routes)
    {
        try
        {
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
                if (!isset($route['id']) || null === $Route = $em->getRepository('\CB\Entity\Route')->find($route['id']))
                {
                    return $this->error('Unable to find route to update!');
                }
                $routeId = $route['id'];
                
                // update values
                $Route->setValues($route);
                
                // update location?
                if (false && isset($route['locationId']))
                {
                    if (null === $Location = $em->getRepository('\CB\Entity\Location')->find($route['locationId']))
                    {
                        return $this->error('Unable to find route location!');
                    }
                    $Route->setLocation($Location);
                }

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
     * @param array $routes
     * @return array
     */
    public function destroy($routes)
    {
        try
        {
            // must be logged in
            if (null === $User = $this->getSessionUser())
            {
                return $this->error('You must be signed-in to perform this action!');
            }
            
            // get entity manager
            $em = $this->getEntityManager();
            
            // loop through all routes
            foreach ($routes as $route)
            {
                // load route
                if (!isset($route['id']) || null === $Route = $em->getRepository('\CB\Entity\Route')->find($route['id']))
                {
                    return $this->error('Unable to find route to destroy!');
                }
                
                // remove grades
                foreach ($Route->getGrades() as $Grade)
                {
                    $Route->removeGrade($Grade);
                }
                
                // remove layers
                foreach ($Route->getLayers() as $Layer)
                {
                    $em->remove($Layer);
                }
                
                // remove route
                $em->remove($Route);
            }
            
            // save changes
            $em->flush();
            
            return $this->success('Destroy');
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
    }

}
