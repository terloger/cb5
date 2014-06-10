<?php

/**
 * Climbuddy API namespace
 *
 * @package CB\Api
 */
namespace CB\Api;

/**
 * API grades controller
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Api
 */
class GradeType extends AbstractController
{

    /**
     * Read GradeTypes and Grades
     *
     * @access public
     * @return array
     */
    public function read()
    {
        $gradeTypes = array();
        try
        {
            $gradeTypes = [];
            foreach ($this->getEntityManager()->createQuery('SELECT gt, g FROM \CB\Entity\GradeType gt LEFT JOIN gt.grades g ORDER BY g.score')->getResult() as $GradeType)
            {
                $gradeType = $GradeType->getValues();
                foreach ($GradeType->getGrades() as $Grade)
                {
                    $gradeType['grades'][] = $Grade->getValues();
                }
                $gradeTypes[] = $gradeType;
            }
        }
        catch (\Exception $e)
        {
            return $this->error($e->getMessage());
        }
        return $this->success('Successfully read grades.', $gradeTypes);
    }

    /**
     * Import grades from grades.csv
     *
     * @access public
     * @return array
     */
    public function import()
    {
        $query = $this->getEntityManager()->getConnection()->query('TRUNCATE TABLE route_grades');
        $query->execute();
        unset($query);

        $query = $this->getEntityManager()->getConnection()->query('TRUNCATE TABLE grade');
        $query->execute();
        unset($query);

        $query = $this->getEntityManager()->getConnection()->query('TRUNCATE TABLE grade_type');
        $query->execute();
        unset($query);

        $types = [
            'uiaa'     => 'UIAA',
            'usa'      => 'Yosemite',
            'french'   => 'French',
            'font'     => 'Font',
            'hueco'    => 'Hueco',
            'waterice' => 'Water-Ice',
            'mixed'    => 'Mixed',
            'aid'      => 'Aid',
        ];

        $grades = [
            'uiaa'     => [],
            'usa'      => [],
            'french'   => [],
            'font'     => [],
            'hueco'    => [],
            'waterice' => [],
            'mixed'    => [],
            'aid'      => [],
        ];

        $file = \CB\Config::get('path.root') . '/grades.csv';
        if (false !== $handle = fopen($file, 'r'))
        {
            $score = 1;
            while (false !== $data = fgetcsv($handle, 1000, ';'))
            {
                list($uiaa, $usa, $french, $mixed, $waterice, $aid, $font, $hueco) = $data;
                if ($uiaa === 'UIAA')
                {
                    continue;
                }

                $score++;

                // uiaa
                if (!empty($uiaa))
                {
                    $grades['uiaa'][] = [
                        'score' => $score,
                        'grade' => $uiaa,
                    ];
                }

                // usa
                if (!empty($usa))
                {
                    $grades['usa'][] = [
                        'score' => $score,
                        'grade' => $usa,
                    ];
                }

                // french
                if (!empty($french))
                {
                    $grades['french'][] = [
                        'score' => $score,
                        'grade' => $french,
                    ];
                }

                // mixed
                if (!empty($mixed))
                {
                    $grades['mixed'][] = [
                        'score' => $score,
                        'grade' => $mixed,
                    ];
                }

                // waterice
                if (!empty($waterice))
                {
                    $grades['waterice'][] = [
                        'score' => $score,
                        'grade' => $waterice,
                    ];
                }

                // font
                if (!empty($font))
                {
                    $grades['font'][] = [
                        'score' => $score,
                        'grade' => $font,
                    ];
                }

                // hueco
                if (!empty($hueco))
                {
                    $grades['hueco'][] = [
                        'score' => $score,
                        'grade' => $hueco,
                    ];
                }

                // aid
                if (!empty($aid))
                {
                    $grades['aid'][] = [
                        'score' => $score,
                        'grade' => $aid,
                    ];
                }
            }
            fclose($handle);
        }

        foreach ($types as $type => $name)
        {
            $GradeType = new \CB\Entity\GradeType();
            $GradeType->setName($name);
            $GradeType->setType($type);

            $this->getEntityManager()->persist($GradeType);

            $types[$type] = $GradeType;
        }

        foreach ($grades as $type => $section)
        {
            foreach ($section as $grade)
            {
                $Grade = new \CB\Entity\Grade();
                $Grade->setScore($grade['score']);
                $Grade->setGrade($grade['grade']);
                $Grade->setType($types[$type]);

                $this->getEntityManager()->persist($Grade);
            }
        }

        $this->getEntityManager()->flush();

        return $this->success('Grades imported!');
    }

}
