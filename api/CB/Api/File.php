<?php

/**
 * Climbuddy API namespace
 *
 * @package CB\Api
 */
namespace CB\Api;

/**
 * API file controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Api
 */
class File extends AbstractController
{

    /**
     * Read countries
     *
     * @access public
     * @return array
     */
    public function read()
    {
        $files = [];
        try
        {
            foreach ($this->getEntityManager()->getRepository('\CB\Entity\File')->findAll() as $File)
            {
                $files[] = $File->getValues();
            }
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
        return $this->success('Successfully read countries.', $files);
    }

}
