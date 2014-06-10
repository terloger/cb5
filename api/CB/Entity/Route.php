<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Entity
 */
namespace CB\Entity;

/**
 * Route entity
 *
 * @package CB\Entity
 *
 * @Entity
 * @Table(name="route")
 * @HasLifecycleCallbacks
 */
class Route extends AbstractEntity
{
    /**
     * @Id
     * @Column(type="integer")
     * @GeneratedValue
     */
    protected $id;
    
    /**
     * @Column(name="location_id", type="integer")
     */
    protected $locationId;

    /**
     * @Column(type="integer")
     */
    protected $pos;

    /**
     * @Column(type="string")
     */
    protected $name;

    /**
     * @Column(name="file_id", type="integer")
     */
    protected $fileId;

    /**
     * @Column(type="datetime")
     */
    protected $created;

    /**
     * @ManyToOne(targetEntity="User", inversedBy="routes")
     */
    protected $user;

    /**
     * @ManyToOne(targetEntity="Location", inversedBy="routes")
     */
    protected $location;

    /**
     * @OneToMany(targetEntity="Layer", mappedBy="route")
     */
    protected $layers;

    /**
     * @ManyToMany(targetEntity="Grade", fetch="EXTRA_LAZY")
     * @JoinTable(name="route_grades",
     *     joinColumns={@JoinColumn(name="route_id", referencedColumnName="id")},
     *     inverseJoinColumns={@JoinColumn(name="grade_id", referencedColumnName="id")}
     * )
     **/
    protected $grades;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->layers = new \Doctrine\Common\Collections\ArrayCollection();
        $this->grades = new \Doctrine\Common\Collections\ArrayCollection();
    }

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
    
    public function getLocationId()
    {
        return $this->locationId;
    }

    public function getPos()
    {
        return $this->pos;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getFileId()
    {
        return $this->fileId;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function getLocation()
    {
        return $this->location;
    }

    public function getLayers()
    {
        return $this->layers;
    }

    public function getGrades()
    {
        return $this->grades;
    }

    public function getValues()
    {
        return [
            'id'         => $this->id,
            'locationId' => $this->locationId,
            'pos'        => $this->pos,
            'name'       => $this->name,
            'fileId'     => $this->fileId,
            'created'    => $this->created->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Setters
     */

    public function setPos($pos)
    {
        $this->pos = $pos;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function setUser($User)
    {
        $this->user = $User;
    }

    public function setLocation($Location)
    {
        $this->location = $Location;
    }

    public function setValues($route)
    {
        if (is_array($route))
        {
            $this->pos    = isset($route['pos']) ? $route['pos'] : null;
            $this->name   = isset($route['name']) ? $route['name'] : null;
            $this->fileId = isset($route['fileId']) ? $route['fileId'] : null;
        }
    }


}
