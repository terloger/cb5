<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Entity
 */
namespace CB\Entity;

/**
 * User entity
 *
 * @package CB\Entity
 *
 * @Entity
 * @Table(name="user")
 * @HasLifecycleCallbacks
 */
class User extends AbstractEntity
{
    /**
     * @Id
     * @Column(type="integer")
     * @GeneratedValue
     */
    protected $id;

    /**
     * @Column(type="string")
     */
    protected $username;

    /**
     * @Column(type="string")
     */
    protected $password;

    /**
     * @Column(name="first_name", type="string")
     */
    protected $firstName;

    /**
     * @Column(name="last_name", type="string")
     */
    protected $lastName;

    /**
     * @Column(type="string")
     */
    protected $email;

    /**
     * @Column(type="integer")
     */
    protected $permission;

    /**
     * @Column(type="datetime")
     */
    protected $created;

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

    public function getUsername()
    {
        return $this->username;
    }

    public function getFirstName()
    {
        return $this->firstName;
    }

    public function getLastName()
    {
        return $this->lastName;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getPermission()
    {
        return $this->permission;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function getValues()
    {
        return [
            'id'         => $this->id,
            'username'   => $this->username,
            'firstName'  => $this->firstName,
            'lastName'   => $this->lastName,
            'email'      => $this->email,
            'permission' => $this->permission,
            'created'    => $this->created->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Setters
     */

    public function setUsername($username)
    {
        $this->username = $username;
    }

    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;
    }

    public function setLastName($lastName)
    {
        $this->lastName = $lastName;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function setPermission($permission)
    {
        $this->permission = $permission;
    }

    public function setValues($user)
    {
        if (is_array($user))
        {
            $this->username   = isset($user['username'])   ? $user['username'] : null;
            $this->firstName  = isset($user['firstName'])  ? $user['firstName'] : null;
            $this->lastName   = isset($user['lastName'])   ? $user['lastName'] : null;
            $this->email      = isset($user['email'])      ? $user['email'] : null;
            $this->permission = isset($user['permission']) ? $user['permission'] : null;
        }
    }

}
