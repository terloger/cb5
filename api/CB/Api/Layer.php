<?php

/**
 * Climbuddy API namespace
 *
 * @package CB\Api
 */
namespace CB\Api;

/**
 * API layer controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Api
 */
class Layer extends AbstractController
{

    /**
     * Read layers
     * 
     * @access public
     * @return array
     */
    public function read()
    {
        return $this->success('Read', []);
    }
    
    /**
     * Create layer(s)
     * 
     * @access public
     * @param array $layers
     * @return array
     */
    public function create($layers)
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
            
            // loop through all layers
            foreach ($layers as $layer)
            {
                // remember client id
                if (!isset($layer['id']))
                {
                    return $this->error('Invalid layer clientId!');
                }
                $clientId = $layer['id'];
                
                // must have file
                if (!isset($layer['fileId']) || null === $File = $em->getRepository('\CB\Entity\File')->find($layer['fileId']))
                {
                    return $this->error('Unable to find layer file!');
                }
                
                // must have route
                if (!isset($layer['routeId']) || null === $Route = $em->getRepository('\CB\Entity\Route')->find($layer['routeId']))
                {
                    return $this->error('Unable to find layer route!');
                }

                // create new layer
                $Layer = new \CB\Entity\Layer();
                $Layer->setValues($layer);
                $Layer->setUser($User);
                $Layer->setFile($File);
                $Layer->setRoute($Route);
                
                // persist layer
                $em->persist($Layer);
                
                // store layers by clientId
                $entities[$clientId] = $Layer;
            }
            
            // save changes
            $em->flush();
            
            // build response data
            $data = [];
            foreach ($entities as $clientId => $Layer)
            {
                $layer = $Layer->getValues();
                $layer['clientId'] = $clientId;
                $data[] = $layer;
            }
            
            return $this->success('Create', $data);
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
    }
    
    /**
     * Update layer(s)
     * 
     * @access public
     * @param array $layers
     * @return array
     */
    public function update($layers)
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
            
            // loop through all layers
            foreach ($layers as $layer)
            {
                // load layer
                if (!isset($layer['id']) || null === $Layer = $em->getRepository('\CB\Entity\Layer')->find($layer['id']))
                {
                    return $this->error('Unable to find layer to update!');
                }
                $layerId = $layer['id'];
                
                // update values
                $Layer->setValues($layer);

                // persist layer
                $em->persist($Layer);
                
                // store layers by layerId
                $entities[$layerId] = $Layer;
            }
            
            // save changes
            $em->flush();
            
            // build response data
            $data = [];
            foreach ($entities as $layerId => $Layer)
            {
                $data[] = $Layer->getValues();
            }
            
            return $this->success('Update', $data);
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
    }
    
    /**
     * Destroy layer(s)
     * 
     * @access public
     * @param array $layers
     * @return array
     */
    public function destroy($layers)
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
            
            // loop through all layers
            foreach ($layers as $layer)
            {
                // load layer
                if (!isset($layer['id']) || null === $Layer = $em->getRepository('\CB\Entity\Layer')->find($layer['id']))
                {
                    return $this->error('Unable to find layer to destroy!');
                }
                
                // remove layer
                $em->remove($Layer);
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
