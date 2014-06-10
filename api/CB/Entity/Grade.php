<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Entity
 */
namespace CB\Entity;

/**
 * Grade entity
 *
 * @package CB\Entity
 *
 * @Entity
 * @Table(name="grade")
 */
class Grade extends AbstractEntity
{
    /**
     * @Id
     * @Column(type="integer")
     * @GeneratedValue
     */
    protected $id;
    
    /**
     * @Column(name="type_id", type="integer")
     */
    protected $typeId;

    /**
     * @Column(type="integer")
     */
    protected $score;

    /**
     * @Column(type="string")
     */
    protected $grade;

    /**
     * @ManyToOne(targetEntity="GradeType", inversedBy="grades")
     */
    protected $type;

    /**
     * Getters
     */

    public function getId()
    {
        return $this->id;
    }
    
    public function getTypeId()
    {
        return $this->typeId;
    }

    public function getScore()
    {
        return $this->score;
    }

    public function getGrade()
    {
        return $this->grade;
    }

    public function getType()
    {
        return $this->type;
    }

    public function getValues()
    {
        return [
            'id'     => $this->id,
            'typeId' => $this->typeId,
            'score'  => $this->score,
            'grade'  => $this->grade,
        ];
    }

    /**
     * Setters
     */

    public function setGrade($grade)
    {
        $this->grade = $grade;
    }

    public function setScore($score)
    {
        $this->score = $score;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

}
