<?php

/**
 * Climbuddy API namespace
 *
 * @package CB\Api
 */
namespace CB\Api;

/**
 * API location controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Api
 */
class Location extends AbstractController
{
    /**
     * Read locations
     *
     * @param integer $id Location ID
     * @access public
     * @return array
     */
	public function read($data = null)
	{
        $id = isset($data['id']) ? (int)$data['id'] : null;
        
        try
        {
            if (!is_null($id))
            {
                return $this->success('Successfully read location #' . $id . '.', $this->readById($id));
            }
            else
            {
                return $this->success('Successfully read all locations.', $this->readAll($id));
            }
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
	}
    
    /**
     * Read all locations
     * 
     * We need to process data manually, so that we have more control over what is being returned to the client.
     * 
     * @access private
     * @return array
     */
    private function readAll()
    {
        $em = $this->getEntityManager();
        
        // fetch all routes
        $routes = [];
        $Routes = $em->createQuery('SELECT r, rg FROM \CB\Entity\Route r LEFT JOIN r.grades rg ORDER BY r.pos')->getResult();
        foreach ($Routes as $Route)
        {
            $route = $Route->getValues();
            foreach ($Route->getGrades() as $Grade)
            {
                $route['grades'][] = $Grade->getValues();
            }
            $routes[$Route->getLocation()->getId()][] = $route;
        }

        // fetch all files
        $files = [];
        $Files = $em->createQuery('SELECT f, fl FROM \CB\Entity\File f LEFT JOIN f.layers fl')->getResult();
        foreach ($Files as $File)
        {
            $file = $File->getValues();
            foreach ($File->getLayers() as $Layer)
            {
                $file['layers'][] = $Layer->getValues();    
            }
            $files[$File->getLocation()->getId()][] = $file;
        }

        // fetch all locations
        $locations = [];
        $Locations = $em->createQuery('SELECT l, c, t FROM \CB\Entity\Location l LEFT JOIN l.country c LEFT JOIN l.types t')->getResult();
        foreach ($Locations as $Location)
        {
            // build location data
            $location = $Location->getValues();
            
            // apply location country
            /*
            $location['country'] = array_merge($Location->getCountry()->getValues(), [
                'locationId' => $Location->getId()
            ]);
             * 
             */
            
            // apply location types
            foreach ($Location->getTypes() as $LocationType)
            {
                $location['types'][] = array_merge($LocationType->getValues(), [
                    'locationId' => $Location->getId()
                ]);
            }
            
            // aplly location routes
            if (isset($routes[$Location->getId()]))
            {
                $location['routes'] = $routes[$Location->getId()];
            }
            
            // apply location files
            if (isset($files[$Location->getId()]))
            {
                $location['files'] = $files[$Location->getId()];
            }

            // add location to collection
            $locations[] = $location;
        }
        
        return $locations;
    }
    
    /**
     * Read location by ID
     * 
     * We need to process data manually, so that we have more control over what is being returned to the client.
     * 
     * @param integer $id Location ID
     * @access private
     * @return array
     */
    private function readById($id)
    {
        // get entity manager
        $em = $this->getEntityManager();
        
        // fetch location
        $query = $em->createQuery('SELECT l, c, t FROM \CB\Entity\Location l LEFT JOIN l.country c LEFT JOIN l.types t WHERE l.id = :id ');
        $query->setParameter('id', $id);
        $Location = $query->getSingleResult();
        if (empty($Location))
        {
            throw new \Exception('Unable to find location #' . $id);
        }

        // fetch location routes
        $routes = [];
        $query = $em->createQuery('SELECT r, rg FROM \CB\Entity\Route r LEFT JOIN r.grades rg WHERE r.location = :location ORDER BY r.pos');
        $query->setParameter('location', $id);
        $Routes = $query->getResult();
        foreach ($Routes as $Route)
        {
            $route = $Route->getValues();
            foreach ($Route->getGrades() as $Grade)
            {
                $route['grades'][] = $Grade->getValues();
            }
            $routes[$Route->getLocation()->getId()][] = $route;
        }

        // fetch location files
        $files = [];
        $query = $em->createQuery('SELECT f, fl FROM \CB\Entity\File f LEFT JOIN f.layers fl WHERE f.location = :location');
        $query->setParameter('location', $id);
        $Files = $query->getResult();
        foreach ($Files as $File)
        {
            $file = $File->getValues();
            foreach ($File->getLayers() as $Layer)
            {
                $file['layers'][] = $Layer->getValues();
            }
            $files[$File->getLocation()->getId()][] = $file;
        }

        // build location data
        $location = $Location->getValues();
        
        // apply location country
        $location['country'] = array_merge($Location->getCountry()->getValues(), [
            'locationId' => $Location->getId()
        ]);
        
        // apply location types
        foreach ($Location->getTypes() as $LocationType)
        {
            $location['types'][] = array_merge($LocationType->getValues(), [
                'locationId' => $Location->getId()
            ]);
        }
        
        // apply location routes
        if (isset($routes[$Location->getId()]))
        {
            $location['routes'] = $routes[$Location->getId()];
        }
        
        // apply location files
        if (isset($files[$Location->getId()]))
        {
            $location['files'] = $files[$Location->getId()];
        }
        
        return $location;
    }
    
    /**
     * Save location
	 *
	 * This function receives entire location graph from client and creates/updates entity.
	 *
	 * TODO: update only changed stuff
     *
     * @access public
     * @param  array $location
     * @return array
     */
    public function save($location)
    {
        // parse input location
        $location = $this->getEntitySerializer()->parse('\CB\Entity\Location', $location);

        try
        {
            // must be logged in
            if (null === $User = $this->getSessionUser())
            {
                return $this->error('You must be signed-in to perform this action!');
            }

            //<editor-fold defaultstate="collapsed" desc="set location">
            if ($location['id'] > 0)
            {
                // update location
                if (null === $Location = $this->getEntityManager()->find('\CB\Entity\Location', $location['id']))
                {
                    return $this->error('Unable to find location #' . $location['id']);
                }
                $Location->setValues($location);
            }
            else
            {
                // create location
                $Location = new \CB\Entity\Location();
                $Location->setValues($location);

                // set location user
                $Location->setUser($User);
            }
            //</editor-fold>

            //<editor-fold defaultstate="collapsed" desc="set location country">
            if (isset($location['country']['id']) && null !== $Country = $this->getEntityManager()->find('\CB\Entity\Country', $location['country']['id']))
            {
                $Location->setCountry($Country);
            }
            else if (isset($location['country']['iso']) && null !== $Country = $this->getEntityManager()->findBy('\CB\Entity\Country', $location['country']['iso']))
            {
                $Location->setCountry($Country);
            }
            else
            {
                return $this->error('Unable to set location country');
            }
            //</editor-fold>

            //<editor-fold defaultstate="collapsed" desc="set location types">
            $Location->getTypes()->clear();
            foreach ($location['types'] as $type)
            {
                if (null !== $Type = $this->getEntityManager()->find('\CB\Entity\LocationType', $type['id']))
                {
                    $Location->getTypes()->add($Type);
                }
            }
            //</editor-fold>

            //<editor-fold defaultstate="collapsed" desc="set location routes">
            $routes = [];
            $newRoutes = [];
            $delRoutes = [];

            // create/update routes
            foreach ($location['routes'] as $route)
            {
                // update route
                if ($route['id'] > 0 && null !== $Route = $this->getEntityManager()->find('\CB\Entity\Route', $route['id']))
                {
                    $Route->setValues($route);
                }
                // create route
                else
                {
                    $Route = new \CB\Entity\Route();
                    $Route->setValues($route);
                    $Route->setUser($User);
                    $Route->setLocation($Location);
                    $Location->getRoutes()->add($Route);
                    $this->getEntityManager()->persist($Route);

                    // add to new routes array for layer association
                    $newRoutes[$route['id']] = $Route;
                }

                // route grades
                $Route->getGrades()->clear();
                foreach ($route['grades'] as $grade)
                {
                    if (null !== $Grade = $this->getEntityManager()->find('\CB\Entity\Grade', $grade['id']))
                    {
                        $Route->getGrades()->add($Grade);
                    }
                }

                // add to array so we can delete old routes
                $routes[] = $Route;
            }

            // delete routes but only for existing location
            if ($location['id'] > 0)
            {
                foreach ($Location->getRoutes() as $Route)
                {
                    if (!in_array($Route, $routes))
                    {
                        // add to deleted routes array for layer association
                        $delRoutes[$Route->getId()] = $Route;

                        // remove route from location
                        $Location->getRoutes()->removeElement($Route);

                        // remove layers associated with this route
                        foreach ($Route->getLayers() as $Layer)
                        {
                            $this->getEntityManager()->remove($Layer);
                        }

                        // remove route
                        $this->getEntityManager()->remove($Route);
                    }
                }
            }
            //</editor-fold>

            //<editor-fold defaultstate="collapsed" desc="set location files & layers">
            $newLayers = [];
            foreach ($location['files'] as $file)
            {
                if ($file['id'] > 0 && null !== $File = $this->getEntityManager()->find('\CB\Entity\File', $file['id']))
                {
                    $layers = [];

                    foreach ($file['layers'] as $layer)
                    {
                        // update layer
                        if ($layer['id'] > 0 && null !== $Layer = $this->getEntityManager()->find('\CB\Entity\Layer', $layer['id']))
                        {
                            $Layer->setValues($layer);
                            $layers[] = $Layer;
                        }
                        // create layer
                        else if (isset($layer['routeId']))
                        {
                            $Route = null;

                            // existing route
                            if ($layer['routeId'] > 0)
                            {
                                $Route = $this->getEntityManager()->find('\CB\Entity\Route', $layer['routeId']);
                            }
                            // new route
                            else if (isset($newRoutes[$layer['routeId']]))
                            {
                                $Route = $newRoutes[$layer['routeId']];
                            }

                            // got route
                            if ($Route)
                            {
                                // create layer
                                $Layer = new \CB\Entity\Layer();
                                $Layer->setValues($layer);
                                $Layer->setUser($User);
                                $Layer->setRoute($Route);
                                $Layer->setFile($File);

                                $File->getLayers()->add($Layer);
                                $Route->getLayers()->add($Layer);

                                $layers[] = $Layer;
                                $newLayers[$file['id']][$layer['id']] = $Layer;

                                $this->getEntityManager()->persist($Layer);
                            }
                        }
                    }

                    // delete layers
                    foreach ($File->getLayers() as $Layer)
                    {
                        if (!in_array($Layer, $layers) || isset($delRoutes[$Layer->getRouteId()]))
                        {
                            // remove layer
                            $this->getEntityManager()->remove($Layer);
                        }
                    }
                }
            }
            //</editor-fold>

            // save location
            $this->getEntityManager()->persist($Location);

            // write to db
            $this->getEntityManager()->flush();

            //<editor-fold defaultstate="collapsed" desc="build response">
            $location = $Location->getValues();

            $location['country'] = $Location->getCountry()->getValues();

            foreach ($Location->getTypes() as $LocationType)
            {
                $location['types'][] = $LocationType->getValues();
            }

            foreach ($Location->getRoutes() as $Route)
            {
                $r = $Route->getValues();
                /*
                if (false !== $clientId = array_search($Route, $newRoutes))
                {
                    $r['clientId'] = $clientId;
                }
                */
                foreach ($Route->getGrades() as $Grade)
                {
                    $r['grades'][] = $Grade->getValues();
                }
                $location['routes'][] = $r;
            }

            foreach ($Location->getFiles() as $File)
            {
                $f = $File->getValues();

                foreach ($File->getLayers() as $Layer)
                {
                    $l = $Layer->getValues();
                    $l['routeId'] = $Layer->getRoute()->getId();
                    /*
                    if (isset($newLayers[$File->getId()]) && false !== $clientId = array_search($Layer, $newLayers[$File->getId()]))
                    {
                        $l['clientId'] = $clientId;
                    }
                    */
                    $f['layers'][] = $l;
                }

                $location['files'][] = $f;
            }
            //</editor-fold>

            return $this->success('Location successfully saved.', $location);
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
    }

    /**
     * Create location
	 *
     * @access public
     * @param  array $location
     * @return array
     */
    public function create($location)
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
            
            // must have country
            $countryId = isset($location['countryId']) ? $location['countryId'] : null;
            if (null === $Country = $em->getRepository('\CB\Entity\Country')->find($countryId))
            {
                return $this->error('Unable to set location country!');
            }

            // create new location
            $Location = new \CB\Entity\Location();
            $Location->setValues($location);
            $Location->setUser($User);
            $Location->setCountry($Country);
            
            // save it
            $em->persist($Location);
            $em->flush();
            
            // return response
            return $this->success('Location successfully created.', $Location->getValues());
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
    }
    
    /**
     * Update location
	 *
     * @access public
     * @param  array $location
     * @return array
     */
    public function update($location)
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
            
            // load location
            $locationId = isset($location['id']) ? $location['id'] : null;
            if (null === $Location = $em->getRepository('\CB\Entity\Location')->find($locationId))
            {
                return $this->error('Unable to find location!');
            }
            
            // update location
            $Location->setValues($location);
            
            // do we need to change country?
            $countryId = isset($location['countryId']) ? $location['countryId'] : null;
            if ($countryId)
            {
                if (null === $Country = $em->getRepository('\CB\Entity\Country')->find($countryId))
                {
                    return $this->error('Unable to change location country!');
                }
                $Location->setCountry($Country);
            }
            
            // save it
            $em->persist($Location);
            $em->flush();
            
            // return response
            return $this->success('Location successfully updated.', $Location->getValues());
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
    }

    /**
     * Delete location
     *
     * @access public
     * @param  array $location
     * @return array
     */
    public function destroy($location)
    {
        // parse input location
        $location = $this->getEntitySerializer()->parse('\CB\Entity\Location', $location);

        try
        {
            // must be logged in
            if (null === $User = $this->getSessionUser())
            {
                return $this->error('You must be signed-in to perform this action!');
            }

            // load location
            if (empty($location['id']) || null === $Location = $this->getEntityManager()->find('\CB\Entity\Location', $location['id']))
            {
                return $this->error('Unable to delete location!');
            }

            // remove routes
            foreach ($Location->getRoutes() as $Route)
            {
                $this->getEntityManager()->remove($Route);
            }

            // remove files
            foreach ($Location->getFiles() as $File)
            {
                $this->getService('File')->remove($File);
            }

            // remove location
            $this->getEntityManager()->remove($Location);

            // write to db
            $this->getEntityManager()->flush();

            return $this->success('Location successfully deleted.');
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
    }

    /**
     * Upload file
     *
     * @access public
     * @param  string $file (test file)
     * @return array
     */
    public function uploadFile($file = null)
    {
        $locationId = (int)$_SERVER['HTTP_X_LOCATION_ID'];
        $name = $_SERVER['HTTP_X_FILE_NAME'];

        try
        {
            // must be logged in
            if (null === $User = $this->getSessionUser())
            {
                return $this->error('You must be signed-in to perform this action!');
            }

            // search for location
            if (null === $Location = $this->getEntityManager()->find('\CB\Entity\Location', $locationId))
            {
                return $this->error('Invalid location #' . $locationId);
            }

            // upload file
            if (is_null($file))
            {
                $File = $this->getService('File')->uploadFromStream($User, $Location, $name);
            }
            else
            {
                $File = $this->getService('File')->upload($User, $Location, $name, $file);
            }

            // write to db
            $this->getEntityManager()->flush();

            // success
            return $this->success('File uploaded!', $File->getValues());
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
    }

    /**
     * Remove file
     *
     * @access public
     * @param  array $files
     * @return array
     */
    public function removeFile($file)
    {
        // must be logged in
        if (null === $User = $this->getSessionUser())
        {
            return $this->error('You must be signed-in to perform this action!');
        }
        
        // parse input file
        $file = $this->getEntitySerializer()->parse('\CB\Entity\File', $file);

        // load file
        if (null === $File = $this->getEntityManager()->find('\CB\Entity\File', $file['id']))
        {
            return $this->error('File does not exist!');
        }

        // delete file
        try
        {
            $this->getService('File')->remove($File);
            $this->getEntityManager()->flush();
            return $this->success('File successfully deleted.');
        }
        catch (\Exception $e)
        {
            return $this->error('Unable to delete file: ' . $e->getMessage());
        }
        
        return $this->error('Unable to delete file!');
    }
    
    /**
     * Set types
     * 
     * @param array $data
     * @return array
     */
    public function setTypes($data)
    {
        $msg = [];
        
        if (is_array($data))
        {
            // get entity manager
            $em = $this->getEntityManager();
            
            // loop through actions
            foreach ($data as $action => $types)
            {
                switch ($action)
                {
                    // create
                    case 'C':
                        $values = [];
                        
                        foreach ($types as $typeId => $locationIds)
                        {
                            if ($typeId < 1 || $typeId > 9 || !is_array($locationIds))
                            {
                                continue;
                            }
                            foreach ($locationIds as $locationId)
                            {
                                $values[] = '(' . (int)$locationId . ',' . (int)$typeId . ')';
                            }
                        }
                        
                        $sql = 'INSERT INTO location_types (location_id, type_id) VALUES ' . implode(',', $values);
                        
                        $stmt = $em->getConnection()->prepare($sql);
                        $stmt->execute();
                        
                        $msg[] = $sql;
                        //$msg[] = 'Created: ' . count($values) . '.';
                        break;
                        
                    // delete
                    case 'D':
                        $values = [];
                        
                        foreach ($types as $typeId => $locationIds)
                        {
                            if ($typeId < 1 || $typeId > 9 || !is_array($locationIds))
                            {
                                continue;
                            }
                            foreach ($locationIds as $locationId)
                            {
                                $values[] = '(location_id = ' . (int)$locationId . ' AND type_id = ' . (int)$typeId . ')';
                            }
                        }
                        
                        $sql = 'DELETE FROM location_types WHERE ' . implode(' OR ', $values);
                        
                        $stmt = $em->getConnection()->prepare($sql);
                        $stmt->execute();
                        
                        $msg[] = $sql;
                        //$msg[] = 'Deleted: ' . count($values) . '.';
                        break;
                    
                    // invalid action
                    default:
                        $msg[] = 'Invalid action: ' . $action . '!';
                        break;
                }
            }
        }
        
        return $this->success(implode(' ', $msg));
    }

}
