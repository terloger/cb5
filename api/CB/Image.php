<?php

/**
 * Climbuddy namespace
 *
 * @package CB
 */
namespace CB;

/**
 * Image manipulation class.
 *
 * @author  Bojan Hribernik <bojan.hribernik@gmail.com>
 * @version 1.0
 * @package CB
 */
class Image
{

    /**
     * Image resource.
     *
     * @access private
     * @var    resource
     */
    private $_image;

    /**
     * Image width.
     *
     * @access private
     * @var    string
     */
    private $_width;

    /**
     * Image height.
     *
     * @access private
     * @var    string
     */
    private $_height;

    /**
     * Image type.
     *
     * @access private
     * @var    integer
     */
    private $_type;

    /**
     * Check if GD library is available.
     *
     * @access public
     * @return void
     */
    public function __construct()
    {
        // check if gd library is available
        if (!function_exists('gd_info'))
        {
            throw new Exception('GD library is not available.');
        }
    }

    /**
     * Destroy image resource.
     *
     * @access public
     * @return void
     */
    public function __destruct()
    {
        // destroy image resource if loaded
        if (is_resource($this->_image))
        {
            imagedestroy($this->_image);
        }
    }

    /**
     * Load image.
     *
     * @param  string $image
     * @access public
     * @return boolean
     */
    public function load($image)
    {
        // check if file exists
        if (!file_exists($image))
        {
            throw new Exception('Image file "' . $image . '" does not exist!');
        }

        // get image info
        if (false === $info = getimagesize($image))
        {
            throw new Exception('Unable to get info for image "' . $image . '"!');
        }

        // set width, height and type
        $this->_width = $info[0];
        $this->_height = $info[1];
        $this->_type = $info[2];

        // create gd resource
        switch ($this->_type)
        {
            // gif
            case 1:
                $this->_image = imagecreatefromgif($image);
                break;

            // jpeg
            case 2:
                $this->_image = imagecreatefromjpeg($image);
                break;

            // png
            case 3:
                $this->_image = imagecreatefrompng($image);
                imagealphablending($this->_image, true);
                imagesavealpha($this->_image, true);
                break;

            // invalid
            default:
                throw new Exception('Unsupported image type "' . $this->_type . '"!');
        }
    }

    /**
     * Rotate image.
     *
     * @access public
     * @param  integer $degrees
     * @return boolean
     */
    public function rotate($degrees)
    {
        // rotate image
        if (false === $image = imagerotate($this->_image, $degrees, 0, 0))
        {
            throw new Exception('Unable to rotate image!');
        }

        // destroy old image resource
        if (!imagedestroy($this->_image))
        {
            throw new Exception('Unable to destroy rotated image resource!');
        }

        // set new image
        $this->_image = $image;
    }

    /**
     * Resize image.
     *
     * @access public
     * @param  integer $width
     * @param  integer $height
     * @param  boolean $force_resize
     * @param  boolean $crop
     * @return boolean
     */
    public function resize($width, $height, $force_resize = false, $crop = false)
    {
        // error
        if ($width == 0 && $height == 0)
        {
            throw new Exception('Invalid width or height!');
        }

        // do not resize
        if (!$force_resize && $this->_width <= $width && $this->_height <= $height)
        {
            return;
        }

        // calculate ratios
        $rx = $width / $this->_width;
        $ry = $height / $this->_height;

        // calculate new width
        if ($width == 0 || ($crop && $rx < $ry) || (!$crop && $rx > $ry))
        {
            $width = round($this->_width * $ry);
        }
        // calculate new height
        else
        {
            $height = round($this->_height * $rx);
        }

        // create image resource with new width and height
        if (false === $image = imagecreatetruecolor($width, $height))
        {
            throw new Exception('Unable to create resized image!');
        }

        // preserve transparency
        $this->_preserveTransparency($image);

        // resize old image into new image resource
        if (!imagecopyresampled($image, $this->_image, 0, 0, 0, 0, $width, $height, $this->_width, $this->_height))
        {
            throw new Exception('Unable to copy resized image!');
        }

        // destroy old image resource
        if (!imagedestroy($this->_image))
        {
            throw new Exception('Unable to destroy resized image resource.');
        }

        // set new image resource
        $this->_image = $image;

        // set new width and height
        $this->_width = $width;
        $this->_height = $height;
    }

    /**
     * Crop image.
     *
     * @access public
     * @param  integer $src_w
     * @param  integer $src_h
     * @param  integer $src_x
     * @param  integer $src_y
     * @return boolean
     */
    public function crop($src_w, $src_h, $src_x = null, $src_y = null)
    {
        // integers!
        $src_w = (int)$src_w;
        $src_h = (int)$src_h;

        // custom crop
        if (!is_null($src_x) && !is_null($src_y))
        {
            // cast to integer
            $src_x = (int)$src_x;
            $src_y = (int)$src_y;

            // invalid x/y offset
            if ($src_x > $this->_width || $src_y > $this->_height)
            {
                throw new Exception('Crop source offset out of range!');
            }

            // crop width outside image dimensions
            if (($src_x + $src_w) > $this->_width)
            {
                $src_w -= ($src_x + $src_w) - $this->_width;
            }

            // crop height outside image dimensions
            if (($src_y + $src_h) > $this->_height)
            {
                $src_h -= ($src_y + $src_h) - $this->_height;
            }

            // destination parameters
            $dst_x = 0;
            $dst_y = 0;
            $dst_w = $src_w;
            $dst_h = $src_h;
        }
        // generic crop (force image resize and crop out unnecessarry parts)
        else
        {
            // invalid size
            if ($src_w <= 0 || $src_h <= 0)
            {
                throw new Exception('Invalid crop width or height!');
            }

            // resize image
            $this->resize($src_w, $src_h, true, true);

            // no need to crop, already perfect size
            if ($src_w === $this->_width && $src_h === $this->_height)
            {
                return;
            }

            // destination parameters
            $dst_x = 0;
            $dst_y = 0;
            $dst_w = $src_w;
            $dst_h = $src_h;

            // calculate crop ratios
            $rx = $src_w / $this->_width;
            $ry = $src_h / $this->_height;

            // width ratio is smaller than height which means we need to offset x
            if ($rx < $ry)
            {
                // calculate x and y offset for source
                $src_x = round(($this->_width - $src_w) / 2);
                $src_y = 0;
            }
            // height ratio is smaller than width which means we need to offset y
            else
            {
                // calculate x and y offset for source
                $src_x = 0;
                $src_y = round(($this->_height - $src_h) / 2);
            }
        }

        //dump('imagecopyresampled($image, $this->_image, '.$dst_x.', '.$dst_y.', '.$src_x.', '.$src_y.', '.$dst_w.', '.$dst_h.', '.$src_w.', '.$src_h.')');die;

        // create image resource with new width and height
        if (false === $image = imagecreatetruecolor($dst_w, $dst_h))
        {
            throw new Exception('Unable to create cropped image!');
        }

        // preserve transparency
        $this->_preserveTransparency($image);

        // resize old image into new image resource
        if (!imagecopyresampled($image, $this->_image, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h))
        {
            throw new Exception('Unable to create cropped image!');
        }

        // destroy old image resource
        if (!imagedestroy($this->_image))
        {
            throw new Exception('Unable to destroy cropped image resource!');
        }

        // set new image resource
        $this->_image = $image;

        // set new width and height
        $this->_width = $dst_w;
        $this->_height = $dst_h;
    }

    /**
     * Save image.
     *
     * @access public
     * @param  string $destination
     * @param  integer $quality
     * @return void
     */
    public function save($destination, $quality = 90)
    {
        // save image based on file type
        switch (strrchr($destination, '.'))
        {
            // jpeg (default)
            default:
            case '.jpg':
            case '.jpeg':
                return (bool)imagejpeg($this->_image, $destination, $quality);

            // png
            case '.png':
                return (bool)imagepng($this->_image, $destination, 9);

            // gif
            case '.gif':
                return (bool)imagegif($this->_image, $destination, $quality);
        }

        throw new Exception('Unsupported image save type!');
    }

    /**
     * Displayimage.
     *
     * @access public
     * @param  integer $quality
     * @return void
     */
    public function display($quality = 90)
    {
        // send header
        header('content-type: '.image_type_to_mime_type($this->_type));

        // output image based on type
        switch ($this->_type)
        {
            // jpeg (default)
            default:
            case 2:
                imagejpeg($this->_image, '', $quality);
                break;
            // png
            case 3:
                imagepng($this->_image, '', 9);
                break;
            // gif
            case 1:
                imagegif($this->_image, '', $quality);
                break;
        }
    }


    /**
     * Preserve image transparency.
     *
     * @access public
     * @param  resource $image
     * @return void
     */
    private function _preserveTransparency($image)
    {
        // only applies for pngs and gifs
        if ($this->_type == IMAGETYPE_PNG || $this->_type == IMAGETYPE_GIF)
        {
            // create transparency index and color array
            if (false === $index = imagecolortransparent($this->_image))
            {
                throw new Exception('Unable to create transparency index!');
            }
            $color = array('red' => 255, 'green' => 255, 'blue' => 255);
            // check colors
            if ($index >= 0)
            {
                if (false === $color = imagecolorsforindex($this->_image, $index))
                {
                    throw new Exception('Unable to create transparency color index!');
                }
            }
            // check insex
            if (false === $index = imagecolorallocate($image, $color['red'], $color['green'], $color['blue']))
            {
                throw new Exception('Unable to allocate transparency color!');
            }
            // make transparency
            if (!imagefill($image, 0, 0, $index))
            {
                throw new Exception('Unable to fill transparency index!');
            }
            if (!imagecolortransparent($image, $index))
            {
                throw new Exception('Unable to create image transparent!');
            }
        }
    }

}
