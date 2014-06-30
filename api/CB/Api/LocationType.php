<?php

/**
 * Climbuddy API namespace
 *
 * @package CB\Api
 */
namespace CB\Api;

/**
 * API type controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Api
 */
class LocationType extends AbstractController
{

    /**
     * Read type(s).
     *
     * @access public
     * @return array
     */
	public function read()
	{
        $locationTypes = [];
        try
        {
            foreach ($this->getEntityManager()->getRepository('\CB\Entity\LocationType')->findAll() as $LocationType)
            {
                $locationTypes[] = $LocationType->getValues();
            }
            return $this->success('Successfully read location types.', $locationTypes);
        }
        catch (\CB\Exception $e)
        {
            return $this->error($e->getMessage());
        }
        return $this->error('Unable to read types!');
	}
    
    public function create($data)
    {
        print_r($data);
    }
    
    public function update($data)
    {
        print_r($data);
    }
    
    public function destroy($data)
    {
        print_r($data);
    }

}
