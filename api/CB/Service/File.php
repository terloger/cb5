<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Service
 */
namespace CB\Service;

/**
 * Token service class.
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB\Service
 */
class File extends AbstractService
{

    /**
     * File creation date for upload path (Y/m/d).
     *
     * @access private
     * @var    string
     */
    private $_created;

    /**
     * Location slug.
     *
     * @access private
     * @var    string
     */
    private $_slug;

    /**
     * Upload file.
     *
     * @access public
     * @param  \CB\Entity\User $User
     * @param  \CB\Entity\Location $Location
     * @param  string $name
     * @return \CB\Entity\File
     * @throws \CB\Service\Exception
     */
    public function uploadFromStream($User, $Location, $name)
    {
        // set tmp file
        $fileName = \CB\slug(substr($name, 0, strrpos($name, '.')));
        $file = \CB\Config::get('path.uploads') . '/' . $fileName . time() . '.tmp';
        if (false === $target = fopen($file, 'w'))
        {
            throw new \CB\Service\Exception('Unable to write file!');
        }

        // read input stream
        if (false === $input = fopen('php://input', 'r'))
        {
            throw new \CB\Service\Exception('Error reading file!');
        }

        // write tmp file
        $data = '';
        while (false === feof($input))
        {
            $data = fread($input, 1024);
            fwrite($target, $data);
        }
        fclose($target);
        fclose($input);

        // upload file
        $File = $this->upload($User, $Location, $name, $file);

        // remove tmp file
        if (file_exists($file) && !unlink($file))
        {
            throw new \CB\Service\Exception('Unable to remove temporary file!');
        }

        return $File;
    }

    /**
     * @param $User
     * @param $Location
     * @param $name
     * @param $file
     * @return \CB\Entity\File
     * @throws Exception
     * @throws \Exception
     */
    public function upload($User, $Location, $name, $file)
    {
        // set created date
        $this->_slug = $Location->getSlug();
        $this->_created = $Location->getCreated();

        // check file size
        $fileSize = filesize($file);
        if ($fileSize === 0)
        {
            throw new \CB\Service\Exception('File "' . $name . '" is empty!');
        }
        if ($fileSize > $this->_stringToBytes(\CB\Config::get('upload.maxfilesize')) )
        {
            throw new \CB\Service\Exception('File "' . $name .'" is too big (' . $this->_bytesToString($fileSize) . '). Maximum allowed size is ' . \CB\Config::get('upload.maxfilesize') . '"!');
        }

        // get mime type
        if (false === $mimeType = $this->_getMimeType($file))
        {
            throw new \CB\Service\Exception('Unknown file "' . $name . '"!');
        }

        // check mime type
        if (!isset(\CB\Config::get('upload.mimetypes')[$mimeType]))
        {
            throw new \CB\Service\Exception('Invalid file type "' . $mimeType . '" for file "' . $name . '"!');
        }

        // prepare file variables
        $fileName = \CB\slug(substr($name, 0, strrpos($name, '.')));
        $extension = \CB\Config::get('upload.mimetypes')[$mimeType];
        $name = $fileName . '.' . $extension;
        $dir = $this->_getFileDir();
        $target = $this->_getFilePath($name);

        // make sure not to overwrite existing files ... append _number to fileName
        if (file_exists($target))
        {
            $originalName = $fileName;
            $j = 2;
            do
            {
                $fileName = $originalName.'-'.$j;
                $name = $fileName . '.' .$extension;
                $target = $this->_getFilePath($name);
                $j++;
            }
            while (file_exists($target));
        }

        // create destination folder
        //print_r(['dir', $dir]);

        if ( !is_dir($dir) && !mkdir($dir, 0777, true) )
        {
            throw new \CB\Service\Exception('Unable create upload path!');
        }

        //print_r([$file, $target]);die;

        // move file
        if (!copy($file, $target))
        {
            throw new \CB\Service\Exception('Unable move uploaded file "' . $name . '"!');
        }

        // resize image and create thumbnails
        $Image = new \CB\Image();
        try
        {
            $Image->load($target);

            foreach (\CB\Config::get('image.sizes') as $suffix => $size)
            {
                $Image->$size[0]($size[1], $size[2]);
                $Image->save($this->_getFileSizePath($fileName, $suffix, $extension));
            }

            unset($Image);
        }
        catch (\Exception $e)
        {
            // cleanup
            unset($Image);
            $this->_deleteFiles($fileName, $extension);
            throw new \CB\Service\Exception($e->getMessage());
        }

        // set file entity
        $File = new \CB\Entity\File();
        $File->setValues([
            'name'       => $name,
            'fileName'   => $fileName,
            'extension'  => $extension,
            'mimeType'   => $mimeType,
            'created'    => $this->_created,
        ]);
        $File->setUser($User);
        $File->setLocation($Location);
        $Location->getFiles()->add($File);

        // save file entity
        try
        {
            $this->getEntityManager()->persist($File);
        }
        catch (\Exception $e)
        {
            // cleanup
            $this->_deleteFiles($fileName, $extension);
            throw $e;
        }

        return $File;
    }

    /**
     * Remove file.
     *
     * @access public
     * @param  \CB\Entity\File $File
     * @return void
     */
    public function remove($File)
    {
        $Location = $File->getLocation();

        $this->_slug = $Location->getSlug();
        $this->_created = $Location->getCreated();

        $this->_deleteFiles($File->getFileName(), $File->getExtension());

        $this->_deleteDirIfEmpty($this->_getFileDir());

        foreach ($File->getLayers() as $Layer)
        {
            $this->getEntityManager()->remove($Layer);
        }

        $this->getEntityManager()->remove($File);
    }

    /**
     * Delete all files, original and size images.
     *
     * @access private
     * @param  type $fileName
     * @param  type $extension
     * @return void
     */
    private function _deleteFiles($fileName, $extension)
    {
        // remove original
        $file = $this->_getFilePath($fileName . '.' . $extension);
        if (file_exists($file))
        {
            unlink($file);
        }

        // remove size images
        foreach (\CB\Config::get('image.sizes') as $suffix => $size)
        {
            $file = $this->_getFileSizePath($fileName, $suffix, $extension);
            if (file_exists($file))
            {
                unlink($file);
            }
        }
    }

    /**
     * Delete directory if empty
     *
     * @param $dir
     * @throws Exception
     */
    private function _deleteDirIfEmpty($dir)
    {
        if ($this->_isEmptyDir($dir))
        {
            if (!rmdir($dir))
            {
                throw new \CB\Service\Exception('Unable to remove directory ' . $dir);
            }
        }
    }

    /**
     * Check if directory is empty
     *
     * @param $dir
     * @return bool
     */
    private function _isEmptyDir($dir)
    {
        if (!is_dir($dir))
        {
            return false;
        }

        $files = scandir($dir);

        if (is_array($files))
        {
            return count($files) <= 2;
        }

        return false;
    }

    /**
     * Get file directory.
     *
     * @access private
     * @return string
     */
    private function _getFileDir()
    {
        return \CB\Config::get('path.uploads') . '/' . $this->_created->format('Y/m/d') . '/' . $this->_slug;
    }

    /**
     * Get file path.
     *
     * @access private
     * @param  string  $name
     * @return string
     */
    private function _getFilePath($name)
    {
        return $this->_getFileDir() . '/' . $name;
    }

    /**
     * Get file size path.
     *
     * @access private
     * @param  string  $fileName
     * @param  string  $suffix
     * @param  string  $extension
     * @return string
     */
    private function _getFileSizePath($fileName, $suffix, $extension)
    {
        return $this->_getFileDir() . '/' . $fileName . '_' . $suffix . '.' . $extension;
    }

    /**
     * Get mime type of file.
     *
     * Use fileinfo if available or mime_content_type().
     *
     * @access private
     * @param  string $file
     * @return string
     */
    private function _getMimeType($file)
    {
        $mimeType = false;

        // get mime type using fileinfo
        if (extension_loaded('fileinfo'))
        {
            $finfo = new \finfo(FILEINFO_MIME);
            $mimeType = $finfo->file($file);
            if (strstr($mimeType, ';'))
            {
                list($mimeType,) = explode(';', $mimeType);
            }
            unset($finfo);
            // fileinfo was not successfull, try mime_content_type if it exists
            if (strstr($mimeType, 'application/octet-stream') && function_exists('mime_content_type'))
            {
                $mimeType = mime_content_type($file);
            }
        }
        // fileinfo is not available, try mime_content_type if it exists
        else if (function_exists('mime_content_type'))
        {
            $mimeType = mime_content_type($file);
        }

        return $mimeType;
    }

    /**
     * Converts bytes into string (1024 -> 1KB).
     *
     * @access private
     * @param  integer $bytes
     * @param  integer $precision
     * @return string
     */
    private function _bytesToString($bytes, $precision = 2)
    {
       $units = array('B', 'KB', 'MB', 'GB', 'TB');

       $bytes = max($bytes, 0);
       $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
       $pow = min($pow, count($units) - 1);

       $bytes /= pow(1024, $pow);

       return round($bytes, $precision).$units[$pow];
    }

    /**
     * Converts string into bytes (1KB -> 1024).
     *
     * @access private
     * @param  integer $str
     * @return string
     */
    private function _stringToBytes($str)
    {
        $bytes = 0;

        $bytes_array = array(
            'B' => 1,
            'KB' => 1024,
            'MB' => 1024 * 1024,
            'GB' => 1024 * 1024 * 1024,
            'TB' => 1024 * 1024 * 1024 * 1024,
            'PB' => 1024 * 1024 * 1024 * 1024 * 1024,
        );

        $bytes = floatval($str);

        if (preg_match('#([KMGTP]?B)$#si', $str, $matches) && !empty($bytes_array[$matches[1]]))
        {
            $bytes *= $bytes_array[$matches[1]];
        }

        $bytes = intval(round($bytes, 2));

        return $bytes;
    }

    /**
     * Convert string to alphanumeric.
     *
     * @access public
     * @param  string $str
     * @param  array  $replace
     * @param  string $delimiter
     * @return string
     */
    private function _toAscii($str, $replace = array(), $delimiter = '_')
    {
        if(!empty($replace))
        {
            $str = str_replace((array)$replace, ' ', $str);
        }

        $clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
        $clean = preg_replace('/[^a-zA-Z0-9\/_|+ -]/', '', $clean);
        $clean = trim($clean, '-');
        $clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);

        return $clean;
    }

}
