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

    public function getUser()
    {
        return $this->user;
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
            'userId'      => $this->userId,
            'countryId'   => $this->countryId,
            'name'        => $this->name,
            'description' => $this->description,
            'lat'         => $this->lat,
            'lng'         => $this->lng,
            'created'     => $this->created->format('Y-m-d H:i:s'),
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

    public function setLat($lat)
    {
        $this->lat = $lat;
    }

    public function setLng($lng)
    {
        $this->lng = $lng;
    }

    public function setUser($User)
    {
        $this->user = $User;
    }

    public function setCountry($Country)
    {
        $this->country = $Country;
    }

    public function setValues($location)
    {
        if (is_array($location))
        {
            $this->name         = isset($location['name'])        ? $location['name'] : null;
            $this->description  = isset($location['description']) ? $location['description'] : null;
            $this->lat          = isset($location['lat'])         ? $location['lat'] : null;
            $this->lng          = isset($location['lng'])         ? $location['lng'] : null;
        }
    }

}
