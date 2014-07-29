<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Entity
 */
namespace CB\Entity;

/**
 * File entity
 *
 * @package CB\Entity
 *
 * @Entity
 * @Table(name="file")
 */
class File extends AbstractEntity
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
     * @Column(type="string")
     */
    protected $name;

    /**
     * @Column(name="file_name", type="string")
     */
    protected $fileName;

    /**
     * @Column(type="string")
     */
    protected $extension;

    /**
     * @Column(name="mime_type", type="string")
     */
    protected $mimeType;

    /**
     * @Column(type="datetime")
     */
    protected $created;

    /**
     * @ManyToOne(targetEntity="User", inversedBy="locations")
     */
    protected $user;

    /**
     * @ManyToOne(targetEntity="Location", inversedBy="files")
     */
    protected $location;

    /**
     * @OneToMany(targetEntity="Layer", mappedBy="file")
     */
    protected $layers;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->layers = new \Doctrine\Common\Collections\ArrayCollection();
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

    public function getName()
    {
        return $this->name;
    }

    public function getFileName()
    {
        return $this->fileName;
    }

    public function getExtension()
    {
        return $this->extension;
    }

    public function getMimeType()
    {
        return $this->mimeType;
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

    public function getValues()
    {
        return [
            'id'         => $this->id,
            'locationId' => $this->locationId,
            'name'       => $this->name,
            'fileName'   => $this->fileName,
            'extension'  => $this->extension,
            'mimeType'   => $this->mimeType,
            'created'    => $this->created->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Setters
     */

    public function setName($name)
    {
        $this->name = $name;
    }

    public function setFileName($fileName)
    {
        $this->fileName = $fileName;
    }

    public function setExtension($extension)
    {
        $this->extension = $extension;
    }

    public function setMimeType($mimeType)
    {
        $this->mimeType = $mimeType;
    }

    public function setCreated($created)
    {
        $this->created = $created;
    }

    public function setUser($user)
    {
        $this->user = $user;
    }

    public function setLocation($location)
    {
        $this->location = $location;
        $this->locationId = $location->getId();
    }

    public function setValues($file)
    {
        if (is_array($file))
        {
            if (isset($file['name']))      $this->name      = $file['name'];
            if (isset($file['fileName']))  $this->fileName  = $file['fileName'];
            if (isset($file['extension'])) $this->extension = $file['extension'];
            if (isset($file['mimeType']))  $this->mimeType  = $file['mimeType'];
            if (isset($file['created']))   $this->created   = $file['created'];
        }
    }

}
