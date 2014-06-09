<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Service
 */
namespace CB\Service;

/**
 * Token service class.
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Service
 */
class Token extends AbstractService
{
    /**#@+
     * Token types.
     */
    /**
     * Autologin token.
     */
    const AUTOLOGIN = 0;
    /**
     * Registration token.
     */
    const REGISTER = 1;
    /**
     * Lost password token.
     */
    const PASSWORD = 2;
    /**#@-*/

    /**
     * Type => duration array.
     *
     * @access private
     * @var    array
     */
    private $_types = array();

    /**
     * Constructor.
     *
     * @access protected
     * @return void
     */
    protected function __construct()
    {
        $this->_types = array(
            self::AUTOLOGIN => \CB\Config::get('token.duration')['autologin'],
            self::REGISTER  => \CB\Config::get('token.duration')['register'],
            self::PASSWORD  => \CB\Config::get('token.duration')['password'],
        );
    }

    /**
     * Create token.
     *
     * @access public
     * @param  mixed    $value
     * @param  integer  $type
     * @return \CB\Entity\Token
     * @throws \CB\Service\Exception
     */
    public function create($value, $type)
    {
        // check type
        if (isset($this->_types[$type]) === false)
        {
            throw new \CB\Service\Exception('Invalid token type.');
        }

        // garbage collector
        $query = $this->getEntityManager()->createQuery('DELETE \CB\Entity\Token t WHERE t.expires < :expires');
        $query->setParameters(array(
            'expires' => date('Y-m-d H:i:s')
        ));
        $query->execute();

        // create unique token
        do
        {
            $id = md5(time());
        }
        while (count($this->getEntityManager()->find('\CB\Entity\Token', $id)) > 0);

        // set expiration date based on type
        $expires = new \DateTime();
        $expires->add(new \DateInterval($this->_types[$type]));

        // set token values
        $Token = new \CB\Entity\Token();
        $Token->setId($id);
        $Token->setType($type);
        $Token->setValue($value);
        $Token->setExpires($expires);

        // store token
        $this->getEntityManager()->persist($Token);

        // write to db
        $this->getEntityManager()->flush();

        // return it
        return $Token;
    }

    /**
     * Get token by id.
     *
     * @access public
     * @param  string $id
     * @return boolean
     */
    public function get($id)
    {
        $query = $this->getEntityManager()->createQuery("SELECT t FROM \CB\Entity\Token t WHERE t.id = :id AND t.expires > :expires");
        $query->setParameters(array(
            'id' => $id,
            'expires' => date('Y-m-d H:i:s')
        ));

        try
        {
            $Token = $query->getSingleResult();
        }
        catch (\Exception $e)
        {
            $Token = null;
        }

        return $Token;
    }

    /**
     * Remove token from db.
     *
     * @access public
     * @param  string $id
     * @return void
     */
    public function remove($id)
    {
        if (null !== $Token = $this->getEntityManager()->find('\CB\Entity\Token', $id))
        {
            $this->getEntityManager()->remove($Token);
            $this->getEntityManager()->flush();
        }
    }

}
