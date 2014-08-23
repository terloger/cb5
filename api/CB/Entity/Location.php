<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Entity
 */
namespace CB\Entity;

/**
 * Location entity
 *
 * @package CB\Entity
 *
 * @Entity
 * @Table(name="location")
 * @HasLifecycleCallbacks
 */
class Location extends AbstractEntity
{

    /**
     * @Id
     * @Column(type="integer")
     * @GeneratedValue
     */
    protected $id;

    /**
     * @Column(name="parent_id", type="integer", nullable=true)
     */
    protected $parentId;
    
    /**
     * @Column(name="user_id", type="integer")
     */
    protected $userId;
    
    /**
     * @Column(name="country_id", type="integer")
     */
    protected $countryId;

    /**
     * @Column(type="string")
     */
    protected $name;

    /**
     * @Column(type="text")
     */
    protected $description;

    /**
     * @Column(type="text")
     */
    protected $slug;

    /**
     * @Column(type="float")
     */
    protected $lat;

    /**
     * @Column(type="float")
     */
    protected $lng;

    /**
     * @Column(type="datetime")
     */
    protected $created;

    /**
     * @Column(type="boolean")
     */
    protected $confirmed;

    /**
     * @Column(type="boolean")
     */
    protected $deleted;

    /**
     * @OneToMany(targetEntity="Location", mappedBy="parent")
     */
    private $children;

    /**
     * @ManyToOne(targetEntity="Location", inversedBy="children")
     * @JoinColumn(name="parent_id", referencedColumnName="id", nullable=true)
     */
    private $parent;

    /**
     * @ManyToOne(targetEntity="User", inversedBy="locations")
     */
    protected $user;

    /**
     * @ManyToOne(targetEntity="Country", inversedBy="locations")
     */
    protected $country;

    /**
     * @ManyToMany(targetEntity="LocationType")
     * @JoinTable(name="location_types",
     *     joinColumns={@JoinColumn(name="location_id", referencedColumnName="id")},
     *     inverseJoinColumns={@JoinColumn(name="type_id", referencedColumnName="id")}
     * )
     **/
    protected $types;

    /**
     * @OneToMany(targetEntity="Route", mappedBy="location")
     */
    protected $routes;

    /**
     * @OneToMany(targetEntity="File", mappedBy="location")
     */
    protected $files;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->children = new \Doctrine\Common\Collections\ArrayCollection();
        $this->types = new \Doctrine\Common\Collections\ArrayCollection();
        $this->routes = new \Doctrine\Common\Collections\ArrayCollection();
        $this->files = new \Doctrine\Common\Collections\ArrayCollection();
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

    public function getParentId()
    {
        return $this->parentId;
    }
    
    public function getUserId()
    {
        return $this->userId;
    }
    
    public function getCountryId()
    {
        return $this->countryId;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getSlug()
    {
        return $this->slug;
    }

    public function getLat()
    {
        return $this->lat;
    }

    public function getLng()
    {
        return $this->lng;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function getConfirmed()
    {
        return $this->confirmed;
    }

    public function getDeleted()
    {
        return $this->deleted;
    }

    public function getParent()
    {
        return $this->parent;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function getChildren()
    {
        return $this->country;
    }

    public function getCountry()
    {
        return $this->country;
    }

    public function getTypes()
    {
        return $this->types;
    }

    public function getRoutes()
    {
        return $this->routes;
    }

    public function getFiles()
    {
        return $this->files;
    }

    public function getValues()
    {
        return [
            'id'          => $this->id,
            'parentId'    => $this->parentId,
            'userId'      => $this->userId,
            'countryId'   => $this->countryId,
            'name'        => $this->name,
            'description' => $this->description,
            'slug'        => $this->slug,
            'lat'         => $this->lat,
            'lng'         => $this->lng,
            'created'     => $this->created->format('Y-m-d H:i:s'),
            'confirmed'   => $this->confirmed,
            'deleted'     => $this->deleted,
        ];
    }

    /**
     * Setters
     */

    public function setName($name)
    {
        $this->name = $name;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function setSlug($slug)
    {
        $this->slug = $slug;
    }

    public function setLat($lat)
    {
        $this->lat = $lat;
    }

    public function setLng($lng)
    {
        $this->lng = $lng;
    }

    public function setConfirmed($confirmed)
    {
        $this->confirmed = $confirmed;
    }

    public function setDeleted($deleted)
    {
        $this->deleted = $deleted;
    }

    public function setParent($Location)
    {
        $this->parent = $Location;
        $this->parentId = $Location->getId();
    }

    public function setUser($User)
    {
        $this->user = $User;
        $this->userId = $User->getId();
    }

    public function setCountry($Country)
    {
        $this->country = $Country;
        $this->countryId = $Country->getId();
    }

    public function setValues($location)
    {
        if (is_array($location))
        {
            if(isset($location['name']))        $this->name        = $location['name'];
            if(isset($location['description'])) $this->description = $location['description'];
            if(isset($location['slug']))        $this->slug        = $location['slug'];
            if(isset($location['lat']))         $this->lat         = $location['lat'];
            if(isset($location['lng']))         $this->lng         = $location['lng'];
            if(isset($location['confirmed']))   $this->confirmed   = $location['confirmed'];
            if(isset($location['deleted']))     $this->deleted     = $location['deleted'];
        }
    }

}
