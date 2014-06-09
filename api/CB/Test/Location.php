<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Test
 */
namespace CB\Test;

/**
 * Location test class.
 *
 * @author Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Test
 */
class Location extends AbstractTest
{

    /**
     * Location
     *
     * @access private
     * @var    array
     */
    private $_location;

    /**
     * Route
     *
     * @access private
     * @var    array
     */
    private $_route;

    /**
     * File 1
     *
     * @access private
     * @var    array
     */
    private $_file1;

    /**
     * File 2
     *
     * @access private
     * @var    array
     */
    private $_file2;

    /**
     * Layer
     *
     * @access private
     * @var    array
     */
    private $_layer;

    /**
     * Test location read.
     *
     * @access public
     * @return void
     */
    public function test1Read()
    {
        // read locations
        $result = $this->getApiController('Location')->read();

        // test result
        $this->assertTrue($result['success'], 'read locations');
    }

    /**
     * Test location create.
     *
     * @access public
     * @return void
     */
    public function test2Create()
    {
        // set location parameters
        $location = [
            'id'          => -1,
            'name'        => '',
            'description' => '',
            'lat'         => 45.1235,
            'lng'         => 12.1234,

            'country' => [
                'id'   => 194,
                'name' => 'Slovenia',
                'iso'  => 'SI',
            ],
        ];

        // save location
        $result = $this->getApiController('Location')->save($location);

        // fetch data
        if (isset($result['data']))
        {
            $this->_location = $result['data'];
        }

        // test result
        $this->assertTrue($result['success'], 'create location');
        $this->assertTrue(isset($this->_location['id']) && $this->_location['id'] > 0, 'got location id');
    }


    /**
     * Test location file upload #1.
     *
     * @access public
     * @return void
     */
    public function test3UploadFile()
    {
        // create failed?
        if (!isset($this->_location['id']) || $this->_location['id'] <= 0)
        {
            $this->fail('skip location file upload #1');
            return;
        }

        // set upload parameters
        $_SERVER['HTTP_X_LOCATION_ID'] = $this->_location['id'];
        $_SERVER['HTTP_X_FILE_NAME'] = 'image1.jpg';
        $file = \CB\Config::get('path.resources') . '/test/image1.jpg';

        // upload test file
        $result = $this->getApiController('Location')->uploadFile($file);

        // set file id
        if (isset($result['data']))
        {
            $this->_file1 = $result['data'];
        }

        // test result
        $this->assertTrue($result['success'], 'upload file #1');
    }

    /**
     * Test location file upload #2.
     *
     * @access public
     * @return void
     */
    public function test4UploadFile()
    {
        // create failed?
        if (!isset($this->_location['id']) || $this->_location['id'] <= 0)

        {
            $this->fail('skip location file upload #2');
            return;
        }

        // set upload parameters
        $_SERVER['HTTP_X_LOCATION_ID'] = $this->_location['id'];
        $_SERVER['HTTP_X_FILE_NAME'] = 'image2.jpg';
        $file = \CB\Config::get('path.resources') . '/test/image2.jpg';

        // upload test file
        $result = $this->getApiController('Location')->uploadFile($file);

        // set file id
        if (isset($result['data']))
        {
            $this->_file2 = $result['data'];
        }

        // test result
        $this->assertTrue($result['success'], 'upload file #2');
    }

    /**
     * Test location update #1.
     *
     * @access public
     * @return void
     */
    public function test5Update()
    {
        // create failed?
        if (!isset($this->_location['id']) || $this->_location['id'] <= 0 || !isset($this->_file1['id']) || $this->_file1['id'] <= 0 || !isset($this->_file2['id']) || $this->_file2['id'] <= 0)
        {
            $this->fail('skip location update #1');
            return;
        }

        // set update parameters
        $location = [
            'id'          => $this->_location['id'],
            'name'        => 'name 123',
            'description' => 'description 123',
            'lat'         => 46.1235,
            'lng'         => 13.1234,

            'country' => [
                'id'   => 194,
                'name' => 'Slovenia',
                'iso'  => 'SI',
            ],

            'types' => [
                [
                    'id'   => 1,
                    'type' => 'sport',
                    'name' => 'Sport',
                ],
                [
                    'id'   => 2,
                    'type' => 'boulder',
                    'name' => 'Bouldering',
                ],
                [
                    'id'   => 3,
                    'type' => 'multipitch',
                    'name' => 'Multipitch',
                ],
            ],

            'routes' => [
                [
                    'id'     => -1,
                    'name'   => 'Test route 123',
                    'pos'    => 0,
                    'grades' => [
                        [
                            'id'    => 4,
                            'score' => 8,
                            'grade' => 'III+',
                        ]
                    ],
                ],
                [
                    'id'   => -2,
                    'pos'  => 1,
                    'name' => 'Test route 456',
                ],
            ],

            'files' => [
                array_merge($this->_file1, [
                    'layers' => [
                        [
                            'id'      => -1,
                            'data'    => '[DATA1.1]',
                            'routeId' => -1,
                        ],
                    ],
                ]),
                array_merge($this->_file2, [
                    'layers' => [
                        [
                            'id'      => -2,
                            'data'    => '[DATA2.1]',
                            'routeId' => -1,
                        ],
                        [
                            'id'      => -3,
                            'data'    => '[DATA2.2]',
                            'routeId' => -2,
                        ],
                    ],
                ]),
            ],
        ];

        // save location
        $result = $this->getApiController('Location')->save($location);

        // fetch route data
        if (isset($result['data']['routes'][0]))
        {
            $this->_route = $result['data']['routes'][0];
        }

        // fetch layer data
        if (isset($result['data']['files'][1]['layers'][0]))
        {
            $this->_layer = $result['data']['files'][1]['layers'][0];
        }

        // test result
        $this->assertTrue($result['success'], 'update location #1');
        $this->assertTrue(isset($this->_route['id']) && $this->_route['id'] > 0, 'got route id');
        $this->assertTrue(isset($result['data']['types']) && count($result['data']['types']) === 3, 'got 3 types');
        $this->assertTrue(isset($result['data']['routes']) && count($result['data']['routes']) === 2, 'got 2 routes');
        $this->assertTrue(isset($result['data']['files']) && count($result['data']['files']) === 2, 'got 2 files');
        $this->assertTrue(isset($result['data']['files'][0]['layers']) && count($result['data']['files'][0]['layers']) === 1, 'got 1 layer for file 1');
        $this->assertTrue(isset($result['data']['files'][1]['layers']) && count($result['data']['files'][1]['layers']) === 2, 'got 2 layers for file 1');
    }

    /**
     * Remove one location file.
     *
     * @access public
     * @return void
     */
    public function test6RemoveFile()
    {
        // create failed?
        if (!isset($this->_location['id']) || $this->_location['id'] <= 0 || !isset($this->_file1['id']) || $this->_file1['id'] <= 0)
        {
            $this->fail('skip location file delete');
            return;
        }

        // set delete file params
        $file = [
            [
                'fileId'     => $this->_file1['id'],
                'locationId' => $this->_location['id'],
            ]
        ];

        // delete file
        $result = $this->getApiController('Location')->removeFile($file);

        // test result
        $this->assertTrue($result['success'], 'delete file #1');
    }

    /**
     * Test location update #2.
     *
     * @access public
     * @return void
     */
    public function test7Update()
    {
        // create failed?
        if (!isset($this->_location['id']) || $this->_location['id'] <= 0 || !isset($this->_route['id']) || $this->_route['id'] <= 0)
        {
            $this->fail('skip location update #2');
            return;
        }

        $location = [
            'id'          => $this->_location['id'],
            'name'        => 'name 456',
            'description' => 'description 456',
            'lat'         => 46.1235,
            'lng'         => 13.1234,

            'country' => [
                'id'   => 193,
                'name' => 'Slovakia',
                'iso'  => 'SK',
            ],

            'types' => [
                [
                    'id'   => 2,
                    'type' => 'boulder',
                    'name' => 'Bouldering',
                ],
                [
                    'id'   => 5,
                    'type' => 'alpine',
                    'name' => 'Alpine',
                ],
            ],

            'routes' => [
                [
                    'id'   => $this->_route['id'],
                    'name' => 'Test route 789 one and only',
                    'pos'  => 0,
                    'grades' => [
                        [
                            'id'    => 5,
                            'score' => 10,
                            'grade' => 'IV',
                        ]
                    ],
                ],
            ],

            'files' => [
                array_merge($this->_file2, [
                    'layers' => [
                        array_merge($this->_layer, [
                            'data' => '[DATA2.1NEW]',
                        ]),
                        [
                            'id'      => -1,
                            'data'    => '[DATA2.2ROUTE]',
                            'routeId' => $this->_route['id'],
                        ]
                    ],
                ]),
            ],
        ];

        // update location
        $result = $this->getApiController('Location')->save($location);

        // test result
        $this->assertTrue($result['success'], 'update location #2');
        $this->assertTrue(isset($result['data']['types']) && count($result['data']['types']) === 2, 'got 3 types');
        $this->assertTrue(isset($result['data']['routes']) && count($result['data']['routes']) === 1, 'got 1 route');
        $this->assertTrue(isset($result['data']['files']) && count($result['data']['files']) === 1, 'got 1 file');
        $this->assertTrue(isset($result['data']['files'][0]['layers']) && count($result['data']['files'][0]['layers']) === 2, 'got 2 layers for file 2');
    }

    /**
     * Test location destroy.
     *
     * @access public
     * @return void
     */
    public function test8Destroy()
    {
        // create failed?
        if (!isset($this->_location['id']) || $this->_location['id'] <= 0)
        {
            $this->fail('skip location destroy');
            return;
        }

        // set delete parameters
        $location = [
            'id' => $this->_location['id']
        ];

        // delete location
        $result = $this->getApiController('Location')->destroy($location);

        // test result
        $this->assertTrue($result['success'], 'delete location');
    }

    /**
     * Test location destroy.
     *
     * @access public
     * @return void
     */
    public function test9Cleanup()
    {
        // create failed?
        if (!isset($this->_location['id']) || $this->_location['id'] <= 0)
        {
            $this->fail('skip location destroy');
            return;
        }

        // check if location is still present
        $Location = $this->getEntityManager()->find('\CB\Entity\Location', $this->_location['id']);
        $this->assertNull($Location, 'no location after delete');

        // check if any routes are still present
        $dql = 'SELECT r FROM \CB\Entity\Route r INNER JOIN r.location l WHERE l.id = :id';
        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('id', $this->_location['id']);
        $routes = $query->getResult();
        $this->assertTrue(count($routes) === 0, 'no routes after delete');

        // check if any files are still present
        $dql = 'SELECT f FROM \CB\Entity\File f INNER JOIN f.location l WHERE l.id = :id';
        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('id', $this->_location['id']);
        $files = $query->getResult();
        $this->assertTrue(count($files) === 0, 'no files after delete');
    }

}
