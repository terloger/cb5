<?php

/**
 * Climbuddy API namespace
 *
 * @package CB\Api
 */
namespace CB\Api;

/**
 * API country controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Api
 */
class Country extends AbstractController
{

    /**
     * Read grades
     *
     * @access public
     * @return array
     */
    public function read()
    {
        $countries = [];
        try
        {
            foreach ($this->getEntityManager()->getRepository('\CB\Entity\Country')->findAll() as $Country)
            {
                $countries[] = $Country->getValues();
            }
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
        return $this->success('Successfully read countries.', $countries);
    }

}
