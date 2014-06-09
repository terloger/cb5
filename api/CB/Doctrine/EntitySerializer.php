<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Doctrine
 */
namespace CB\Doctrine;

/**
 * Doctrine entity serializer
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Doctrine
 */
class EntitySerializer
{

    /**
     * Doctrine entity serializer instance holder.
     *
     * @access private
     * @var    \CB\Doctrine\EntitySerializer
     */
    private static $_instance;

    /**
     * Get Doctrine entity manager instance.
     *
     * @access public
     * @return \Doctrine\ORM\EntityManager
     */
    public static function getInstance()
    {
        if (!isset(self::$_instance))
        {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Parse entity input
     *
     * @access private
     * @param  string $className
     * @param  array $input
     * @return array
     * @static
     */
    public function parse($className, $input)
    {
        $metadata = \CB\Doctrine\EntityManager::getInstance()->getClassMetadata($className);

        $output = [];

        foreach ($metadata->fieldMappings as $field => $mapping)
        {
            $output[$field] = isset($input[$field]) ? $input[$field] : null;
        }

        foreach ($metadata->associationMappings as $field => $mapping)
        {
            $output[$field] = [];
            if (isset($input[$field]))
            {
                switch ($mapping['type'])
                {
                    case \Doctrine\ORM\Mapping\ClassMetadata::MANY_TO_MANY:
                    case \Doctrine\ORM\Mapping\ClassMetadata::ONE_TO_MANY:
                        foreach ($input[$field] as $child)
                        {
                            array_push($output[$field], $this->parse($mapping['targetEntity'], $child));
                        }
                        break;
                    default:
                        $output[$field] = $this->parse($mapping['targetEntity'], $input[$field]);
                        break;
                }
            }
        }

        return $output;
    }

    /**
     * Convert entity to array
     *
     * @access private
     * @param  \CB\Entity\Entity $Entity
     * @return array
     * @static
     */
    public function serialize($Entity)
    {
        $metadata = \CB\Doctrine\EntityManager::getInstance()->getClassMetadata(get_class($Entity));

        $output = [];

        foreach ($metadata->fieldMappings as $field => $mapping)
        {
            $value = $metadata->reflFields[$field]->getValue($Entity);
            if ($value instanceof \DateTime)
            {
                $output[$field] = $value->format(\DateTime::ATOM);
            }
            else if (is_object($value))
            {
                $output[$field] = (string)$value;
            }
            else
            {
                $output[$field] = $value;
            }
        }

        return $output;
    }

}
