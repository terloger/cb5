<?php

use Phinx\Migration\AbstractMigration;

require_once __DIR__ . '/../CB/Core.php';
spl_autoload_register('\CB\autoLoader');
setlocale(LC_ALL, 'en_US.UTF8');

class MoveImages extends AbstractMigration
{
    /**
     * All files listed by file id
     *
     * @var array
     */
    private $files = [];

    /**
     * All locations listed by location id
     *
     * @var array
     */
    private $locations = [];

    /**
     * Files grouped by location id
     *
     * @var array
     */
    private $locationFiles = [];

    /**
     * Location slugs listed by location id
     *
     * @var array
     */
    private $locationSlugs = [];

    /**
     * All slugs
     *
     * @var array
     */
    private $existingSlugs = [];

    /**
     * Migrate Up.
     */
    public function up()
    {
        $locations = $this->fetchAll('SELECT * FROM location');

        $files = $this->fetchAll('SELECT * FROM file');

        foreach ($locations as $location)
        {
            $this->locations[$location['id']] = $location;
        }

        foreach ($files as $file)
        {
            $this->locationFiles[$file['location_id']][] = $file;
        }

        foreach ($this->locations as $location)
        {
            $this->generateSlug($location);
            $this->moveFiles($location);
        }

        foreach ($files as $file)
        {
            $this->registerFile($file);
        }

        $this->cleanFiles(\CB\Config::get('path.uploads'));
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        // nothing to do here ...
    }

    /**
     * Cleanup non-valid files from directory
     * also recurse into subdirectory
     *
     * @param $dir
     */
    private function cleanFiles($dir)
    {
        $files = scandir($dir);

        foreach ($files as $file)
        {
            if ($file === '.' || $file === '..')
            {
                continue;
            }

            $file = $dir . '/' . $file;

            if (isset($this->files[$file]))
            {
                continue;
            }

            if (is_dir($file))
            {
                $this->cleanFiles($file);
            }
            else
            {
                if (!unlink($file))
                {
                    die('Unable to remove invalid file ' . $file);
                }
            }

        }
    }

    /**
     * Generate location slug
     *
     * @param $location
     */
    private function generateSlug($location)
    {
        $slug = \CB\slug($location['name']);

        $exists = isset($this->existingSlugs[$slug]);

        if ($exists)
        {
            $tmp = $slug;
            $i = 2;
            while ($exists)
            {
                $tmp = $slug . '-' . $i;
                $exists = isset($this->existingSlugs[$tmp]);
                $i++;
            }
            $slug = $tmp;
        }

        $this->existingSlugs[$slug] = true;

        $this->locationSlugs[$location['id']] = $slug;

        $this->execute(sprintf(
            'UPDATE location SET slug = \'%s\' WHERE id = %d;',
            $slug,
            $location['id']
        ));
    }

    /**
     * Move location files into slug subfolder
     *
     * @param $location
     */
    private function moveFiles($location)
    {
        if (!isset($this->locationFiles[$location['id']]))
        {
            return;
        }

        $newLocationPath = $this->getNewLocationPath($location);

        if (!file_exists($newLocationPath))
        {
            if (!mkdir($newLocationPath, 0777, true))
            {
                die('Unable to create ' . $newLocationPath);
            }
        }

        $files = $this->locationFiles[$location['id']];

        foreach ($files as $file)
        {
            $from = $this->getOldFilePath($file);
            $to = $this->getNewFilePath($file, $location);

            $this->moveFile($from, $to);

            foreach (\CB\Config::get('image.sizes') as $suffix => $size)
            {
                $from = $this->getOldFilePath($file, $suffix);
                $to = $this->getNewFilePath($file, $location, $suffix);

                $this->moveFile($from, $to);
            }
        }
    }

    /**
     * Move file helper
     *
     * @param $from
     * @param $to
     */
    private function moveFile($from, $to)
    {
        if (file_exists($from))
        {
            if (!rename($from, $to))
            {
                die('Unable to move file from ' . $from . ' to ' . $to);
            }
        }
    }

    /**
     * Register file helper
     *
     * Registered files are not deleted during cleanFiles() call
     *
     * @param $file
     */
    private function registerFile($file)
    {
        $location = $this->locations[$file['location_id']];

        $this->files[$this->getNewFilePath($file, $location)] = true;

        foreach (\CB\Config::get('image.sizes') as $suffix => $size)
        {
            $this->files[$this->getNewFilePath($file, $location, $suffix)] = true;
        }
    }

    /**
     * Get file size name
     *
     * @param $file
     * @param null $size
     * @return string
     */
    private function getFileSizeName($file, $size = null)
    {
        return is_null($size) ? $file['name'] : $file['file_name'] . '_' . $size . '.' . $file['extension'];
    }

    /**
     * Get old location path, without slug
     *
     * @param $file
     * @param $size
     * @return string
     */
    private function getOldFilePath($file, $size = null)
    {
        return \CB\Config::get('path.uploads') . '/' . date('Y/m/d', strtotime($file['created'])) . '/' . $this->getFileSizeName($file, $size);
    }

    /**
     * Get new file path with slug
     *
     * @param $file
     * @param $location
     * @param $size
     * @return string
     */
    private function getNewFilePath($file, $location, $size = null)
    {
        return $this->getNewLocationPath($location) . '/' . $this->getFileSizeName($file, $size);
    }

    /**
     * Get new location path with slug
     *
     * @param $location
     * @return string
     */
    private function getNewLocationPath($location)
    {
        return \CB\Config::get('path.uploads') . '/' . date('Y/m/d', strtotime($location['created'])) . '/' . $this->locationSlugs[$location['id']];
    }

}