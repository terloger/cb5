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
                return $this->success('Successfully read all locations.', $this->readAll());
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
     * Create location
	 *
     * @access public
     * @param  array $locations
     * @return array
     */
    public function create($locations)
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
            
            // loop through all locations
            foreach ($locations as $location)
            {
                // remember client id
                if (!isset($location['id']))
                {
                    return $this->error('Invalid location clientId!');
                }
                $clientId = $location['id'];
                
                // load country
                $countryId = isset($location['countryId']) ? $location['countryId'] : 0;
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
                
                // store routes by clientId
                $entities[$clientId] = $Location;
            }
            
            // save changes
            $em->flush();
            
            // build response data
            $data = [];
            foreach ($entities as $clientId => $Location)
            {
                $location = $Location->getValues();
                $location['clientId'] = $clientId;
                $data[] = $location;
            }
            
            // return response
            return $this->success('Location successfully created.', $data);
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
    public function update($locations)
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
            
            // loop through all locations
            foreach ($locations as $location)
            {
                // load location
                if (!isset($location['id']) || null === $Location = $em->getRepository('\CB\Entity\Location')->find($location['id']))
                {
                    return $this->error('Unable to find location!');
                }
                $locationId = $location['id'];

                // update location
                $Location->setValues($location);

                // do we need to change country?
                if (isset($location['countryId']))
                {
                    if (null === $Country = $em->getRepository('\CB\Entity\Country')->find($location['countryId']))
                    {
                        return $this->error('Unable to change location country!');
                    }
                    $Location->setCountry($Country);
                }

                // save it
                $em->persist($Location);
                
                // store routes by routeId
                $entities[$locationId] = $Location;
            }
            
            // flush changes
            $em->flush();
            
            // build response data
            $data = [];
            foreach ($entities as $locationId => $Location)
            {
                $data[] = $Location->getValues();
            }
            
            // return response
            return $this->success('Location successfully updated.', $data);
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
     * @param  array $locations
     * @return array
     */
    public function destroy($locations)
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
            
            // loop through locations
            foreach ($locations as $location)
            {
                // load location
                if (empty($location['id']) || null === $Location = $em->find('\CB\Entity\Location', $location['id']))
                {
                    return $this->error('Unable to delete location!');
                }

                // remove routes
                foreach ($Location->getRoutes() as $Route)
                {
                    $em->remove($Route);
                }

                // remove files
                foreach ($Location->getFiles() as $File)
                {
                    $this->getService('File')->remove($File);
                }

                // remove location
                $em->remove($Location);
            }

            // remove entities
            $em->flush();

            return $this->success('Delete');
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

        return $this->error('Test error');

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
        try
        {
            // response message
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

                            $sql = 'INSERT IGNORE INTO location_types (location_id, type_id) VALUES ' . implode(',', $values);

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
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
    }

}
