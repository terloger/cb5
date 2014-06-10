<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Entity
 */
namespace CB\Entity;

/**
 * Layer entity
 *
 * @package CB\Entity
 *
 * @Entity
 * @Table(name="layer")
 * @HasLifecycleCallbacks
 */
class Layer extends AbstractEntity
{
    /**
     * @Id
     * @Column(type="integer")
     * @GeneratedValue
     */
    protected $id;

    /**
     * @Column(name="file_id", type="integer")
     */
    protected $fileId;
    
    /**
     * @Column(name="route_id", type="integer")
     */
    protected $routeId;

    /**
     * @Column(type="text")
     */
    protected $data;

    /**
     * @Column(type="datetime")
     */
    protected $created;

    /**
     * @ManyToOne(targetEntity="User")
     */
    protected $user;

    /**
     * @ManyToOne(targetEntity="File", inversedBy="layers")
     */
    protected $file;

    /**
     * @ManyToOne(targetEntity="Route", inversedBy="layers")
     */
    protected $route;

    /**
     * @PrePersist
     */
    public function onPrePersist()
    {
        $this->created = new \DateTime();
    }

    /**
     * Getters
     */

    public function getId()
    {
        return $this->id;
    }
    
    public function getFileId()
    {
        return $this->fileId;
    }

    public function getRouteId()
    {
        return $this->routeId;
    }

    public function getData()
    {
        return $this->data;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function getRoute()
    {
        return $this->route;
    }

    public function getFile()
    {
        return $this->file;
    }

    public function getValues()
    {
        return array(
            'id'        => $this->id,
            'fileId'    => $this->fileId,
            'routeId'   => $this->routeId,
            'data'      => $this->data,
            'created'   => $this->created->format('Y-m-d H:i:s'),
        );
    }

    /**
     * Setters
     */

    public function setData($data)
    {
        $this->data = $data;
    }

    public function setUser($user)
    {
        $this->user = $user;
    }

    public function setRoute($route)
    {
        $this->route = $route;
    }

    public function setFile($file)
    {
        $this->file = $file;
    }

    public function setValues($layer)
    {
        if (is_array($layer))
        {
            $this->data = isset($layer['data']) ? $layer['data'] : '';
        }
    }

}
