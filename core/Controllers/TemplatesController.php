<?php

/**
 * @package safi
 */
namespace WPJoli\SAFI\Controllers;

use WPJoli\SAFI\Application;
class TemplatesController {
    private $tpl_opt;

    //Wordpress setting name containing our templates in JSON
    private $screenshot_tpl_opt;

    //Wordpress setting name containing our templates in JSON
    protected $templates;

    protected $screenshots;

    public function __construct() {
        $this->tpl_opt = Application::TEMPLATES_OPT;
        $this->screenshot_tpl_opt = Application::SCREENSHOT_TEMPLATES_OPT;
        $this->templates = $this->pullTemplates();
        $this->screenshots = $this->pullTemplatesScreenshots();
    }

    public function ajaxTemplatesRouteAction() {
        check_ajax_referer( 'SAFITemplateEditor', 'nonce' );
        $command = safi_sanitize_command( sanitize_key( safi_sanitize_var( $_POST['command'] ) ) );
        if ( !$command ) {
            die;
        }
        $tplid = safi_sanitize_template_id( sanitize_key( safi_sanitize_var( $_POST['tplid'] ) ) );
        if ( $command === 'duplicate' || $command === 'import' ) {
            //do nothing but skip the next elseif check
        } else {
            if ( $command !== 'reorder' && $tplid === false ) {
                //tplid not passed for command 'reorder'
                die;
            }
        }
        $data = ( isset( $_POST['data'] ) ? json_decode( stripslashes( $_POST['data'] ), true ) : null );
        if ( $command === 'save' || $command === 'update' || $command === 'import' ) {
            if ( !$data ) {
                die;
            }
        }
        //Sanitizes canvas data
        if ( isset( $data['canvas'] ) ) {
            array_walk_recursive( $data['canvas'], function ( &$value, $key ) {
                switch ( $key ) {
                    case 'googleFonts':
                        $value = filter_var( $value, FILTER_DEFAULT );
                        break;
                    case 'templateName':
                        $value = sanitize_text_field( $value );
                        break;
                    case 'width':
                    case 'height':
                        $value = filter_var( (int) $value, FILTER_DEFAULT, array(
                            'filter'  => FILTER_VALIDATE_INT,
                            'options' => array(
                                'min_range' => 1,
                                'max_range' => 5000,
                            ),
                        ) );
                        break;
                    case 'backgroundColor':
                        $value = sanitize_text_field( $value );
                        break;
                    case 'zoom':
                        $value = filter_var( (float) $value, FILTER_DEFAULT, array(
                            'filter'  => FILTER_VALIDATE_FLOAT,
                            'options' => array(
                                'min_range' => 0.1,
                                'max_range' => 10,
                            ),
                        ) );
                        break;
                    case 'gridSize':
                        $value = filter_var( (int) $value, FILTER_DEFAULT, array(
                            'filter'  => FILTER_VALIDATE_INT,
                            'options' => array(
                                'min_range' => 0,
                                'max_range' => 5000,
                            ),
                        ) );
                        break;
                    case 'globalCss':
                        // $value = filter_var($value, FILTER_CALLBACK, array('options' => 'sanitize_textarea_field'));
                        $value = ( $value === null ? null : sanitize_textarea_field( $value ) );
                }
            } );
        }
        //Sanitizes tree data
        if ( isset( $data['tree'] ) ) {
            // $data['tree'] = filter_var($data['tree'], FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
            $data['tree'] = ( is_array( $data['tree'] ) ? $data['tree'] : null );
        }
        //Sanitizes canvas data
        if ( isset( $data['elements'] ) ) {
            foreach ( $data['elements'] as &$element ) {
                // Filter base props
                if ( isset( $element['type'] ) ) {
                    $element['type'] = sanitize_key( $element['type'] );
                }
                if ( isset( $element['id'] ) ) {
                    $element['id'] = sanitize_key( $element['id'] );
                }
                if ( isset( $element['label'] ) ) {
                    $element['label'] = sanitize_text_field( $element['label'] );
                }
                if ( isset( $element['width'] ) ) {
                    $element['width'] = filter_var( (float) $element['width'], FILTER_DEFAULT, array(
                        'filter' => FILTER_VALIDATE_FLOAT,
                    ) );
                }
                if ( isset( $element['height'] ) ) {
                    $element['height'] = filter_var( (float) $element['height'], FILTER_DEFAULT, array(
                        'filter' => FILTER_VALIDATE_FLOAT,
                    ) );
                }
                if ( isset( $element['x'] ) ) {
                    $element['x'] = filter_var( (float) $element['x'], FILTER_DEFAULT, array(
                        'filter' => FILTER_VALIDATE_FLOAT,
                    ) );
                }
                if ( isset( $element['y'] ) ) {
                    $element['y'] = filter_var( (float) $element['y'], FILTER_DEFAULT, array(
                        'filter' => FILTER_VALIDATE_FLOAT,
                    ) );
                }
                if ( isset( $element['angle'] ) ) {
                    $element['angle'] = filter_var( (float) $element['angle'], FILTER_DEFAULT, array(
                        'filter'  => FILTER_VALIDATE_FLOAT,
                        'options' => array(
                            'min_range' => -360,
                            'max_range' => 360,
                        ),
                    ) );
                }
                if ( isset( $element['opacity'] ) ) {
                    $element['opacity'] = filter_var( (float) $element['opacity'], FILTER_DEFAULT, array(
                        'filter'  => FILTER_VALIDATE_FLOAT,
                        'options' => array(
                            'min_range' => 0,
                            'max_range' => 1,
                        ),
                    ) );
                }
                if ( isset( $element['classes'] ) ) {
                    $element['classes'] = sanitize_text_field( $element['classes'] );
                }
                if ( isset( $element['customCss'] ) ) {
                    $element['customCss'] = ( $element['customCss'] === null ? null : sanitize_textarea_field( $element['customCss'] ) );
                }
                //     };
                // SAFI()->log($element['type']);
                //filter type specific props
                if ( $element['type'] === 'image' ) {
                    if ( isset( $element['sourceType'] ) ) {
                        $element['sourceType'] = ( $element['sourceType'] === null ? null : sanitize_key( $element['sourceType'] ) );
                    }
                    if ( isset( $element['srcUrl'] ) ) {
                        $element['srcUrl'] = ( $element['srcUrl'] === null ? null : sanitize_url( $element['srcUrl'] ) );
                    }
                    if ( isset( $element['srcMedia'] ) ) {
                        $element['srcMedia'] = ( $element['srcMedia'] === null ? null : sanitize_url( $element['srcMedia'] ) );
                    }
                    if ( isset( $element['fit'] ) ) {
                        $element['fit'] = ( $element['fit'] === null ? null : sanitize_text_field( $element['fit'] ) );
                    }
                } else {
                    if ( $element['type'] === 'condition' ) {
                        if ( isset( $element['compareWith'] ) ) {
                            $element['compareWith'] = ( $element['compareWith'] === null ? null : sanitize_text_field( $element['compareWith'] ) );
                        }
                        if ( isset( $element['compareOperator'] ) ) {
                            $element['compareOperator'] = sanitize_text_field( $element['compareOperator'] );
                        }
                        if ( isset( $element['compareValue'] ) ) {
                            $element['compareValue'] = sanitize_text_field( $element['compareValue'] );
                        }
                    } else {
                        if ( $element['type'] === 'text' ) {
                            if ( isset( $element['text'] ) ) {
                                $allowed_html = array(
                                    'br'     => array(),
                                    'em'     => array(),
                                    'strong' => array(),
                                    'style'  => array(),
                                );
                                $element['text'] = wp_kses( $element['text'], $allowed_html );
                            }
                        }
                    }
                }
            }
        }
        // array_walk_recursive($data['elements'], function (&$value, $key) {
        //     // SAFI()->log($key);
        //     // SAFI()->log($value);
        //     switch ($key) {
        //         // case 'width':
        //         // case 'height':
        //         //     $value = filter_var((float) $value, FILTER_DEFAULT, array(
        //         //         'filter'    => FILTER_VALIDATE_FLOAT,
        //         //         'options'   => array('min_range' => 1, 'max_range' => 5000)
        //         //     ));
        //         //     break;
        //         case 'x':
        //         case 'y':
        //             $value = filter_var((float) $value, FILTER_DEFAULT, array(
        //                 'filter'    => FILTER_VALIDATE_FLOAT,
        //                 'options'   => array('min_range' => 0, 'max_range' => 5000)
        //             ));
        //             break;
        //         case 'color':
        //         case 'backgroundColor':
        //             $value = sanitize_text_field($value);
        //             break;
        //         case 'customCss':
        //             // $value = filter_var($value, FILTER_CALLBACK, array('options' => 'sanitize_textarea_field'));
        //             $value = $value === null ? null : sanitize_textarea_field($value);
        //     }
        // });
        //Sanatizes theroot  template data
        // array_walk($data, function (&$value, $key) {
        //     // SAFI()->log($key);
        //     // SAFI()->log($value);
        //     switch ($key) {
        //             // case 'elements':
        //             //     $value = filter_var($value, FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
        //             //     break;
        //         case 'tree':
        //             $value = filter_var($value, FILTER_CALLBACK, array(
        //                 'options' => 'sanitize_key',
        //                 'flags' => FILTER_REQUIRE_ARRAY,
        //             ));
        //             break;
        //     }
        // });
        // array_walk_recursive($data, function (&$value, $key) {
        //     // SAFI()->log($key);
        //     // SAFI()->log($value);
        //     switch ($key) {
        //         case 'googleFonts':
        //             $value = filter_var($value, FILTER_DEFAULT);
        //             break;
        //         case 'templateName':
        //             $value = sanitize_text_field($value);
        //             break;
        //         case 'width':
        //         case 'height':
        //             $value = filter_var((int) $value, FILTER_DEFAULT, array(
        //                 'filter'    => FILTER_VALIDATE_INT,
        //                 'options'   => array('min_range' => 1, 'max_range' => 5000)
        //             ));
        //             break;
        //         case 'x':
        //         case 'y':
        //             $value = filter_var((float) $value, FILTER_DEFAULT, array(
        //                 'filter'    => FILTER_VALIDATE_FLOAT,
        //                 'options'   => array('min_range' => 0, 'max_range' => 5000)
        //             ));
        //             break;
        //         case 'backgroundColor':
        //             $value = sanitize_text_field($value);
        //             break;
        //         case 'zoom':
        //             $value = filter_var((float) $value, FILTER_DEFAULT, array(
        //                 'filter'    => FILTER_VALIDATE_FLOAT,
        //                 'options'   => array('min_range' => 0.1, 'max_range' => 10) // zoom between 10 & 1000%
        //             ));
        //             break;
        //         case 'gridSize':
        //             $value = filter_var((int) $value, FILTER_DEFAULT, array(
        //                 'filter'    => FILTER_VALIDATE_INT,
        //                 'options'   => array('min_range' => 0, 'max_range' => 5000)
        //             ));
        //             break;
        //         case 'globalCss':
        //             // $value = filter_var($value, FILTER_CALLBACK, array('options' => 'sanitize_textarea_field'));
        //             $value = $value === null ? null : sanitize_textarea_field($value);
        //     }
        // });
        // SAFI()->log('-------------------------------------------');
        // SAFI()->log($data);
        // SAFI()->log('--------------------END-----------------------');
        // wp_send_json_success();
        // die;
        $screenshot = ( safi_is_screenshot_data_valid( safi_sanitize_var( $_POST['screenshot'] ) ) ? stripslashes( $_POST['screenshot'] ) : false );
        if ( $command === 'save' || $command === 'update' ) {
            if ( $screenshot === false ) {
                die;
            }
        }
        //SAVE
        if ( $command == 'save' ) {
            //id == 0 ? then it's a new template
            if ( $tplid == 0 ) {
                //Adds the new template to the collection
                $new_id = $this->addTemplate( $data, $screenshot );
                if ( $new_id !== false ) {
                    wp_send_json_success( [
                        'id' => $new_id,
                    ] );
                }
            }
        } else {
            if ( $command == 'duplicate' ) {
                //id == 0 ? then it's a new template
                //Adds the new template to the collection
                $new_id = $this->duplicateTemplate( $data, $tplid );
                if ( $new_id !== false ) {
                    wp_send_json_success( [
                        'id' => $new_id,
                    ] );
                }
            } else {
                if ( $command == 'reorder' ) {
                    //id == 0 ? then it's a new template
                    //Adds the new template to the collection
                    $response = $this->reorderTemplates( $data, $tplid );
                    wp_send_json_success( [
                        'reordered' => $response,
                    ] );
                } else {
                    if ( $command == 'import' ) {
                        //Adds the new template to the collection
                        $new_id = $this->importTemplate( $data );
                        if ( $new_id !== false ) {
                            wp_send_json_success( [
                                'id' => $new_id,
                            ] );
                        } else {
                            wp_send_json_error( [
                                'message' => 'Error while importing, make sure the template does not already exist',
                            ] );
                        }
                    } else {
                        if ( $command == 'update' ) {
                            //A normal template
                            if ( $tplid != -1 ) {
                                //Updates the current template
                                $added = $this->updateTemplate( $tplid, $data, $screenshot );
                                //true or false
                                wp_send_json_success( [
                                    'updated' => $added,
                                ] );
                            }
                        } else {
                            if ( $command == 'delete' ) {
                                //A normal template
                                if ( $tplid != -1 ) {
                                    $deleted = $this->deleteTemplate( $tplid );
                                    wp_send_json_success( [
                                        'deleted' => true,
                                    ] );
                                    //Updates the current template
                                    //true or false
                                    wp_send_json_success( [
                                        'deleted' => $deleted,
                                    ] );
                                }
                            }
                        }
                    }
                }
            }
        }
        // sleep(2);
        wp_send_json_success( $data );
        die;
    }

    /**
     * Creates a thumbnail png image of the full template image text data and writes it to the WP_UPLOAD_DIR/safi-thumbnails/
     *
     * @param [type] $tplid template ID used for the filename
     * @param [string] $screenshot base64 image data
     * @return mixed filename on success, false on failure
     */
    private function createTemplateThumbnail( $tplid, $screenshot ) {
        $data = base64_decode( substr( $screenshot, strlen( "data:image/png;base64," ) ) );
        $src = imagecreatefromstring( $data );
        if ( !$src ) {
            return false;
        }
        $size = 500;
        $width = imagesx( $src );
        $height = imagesy( $src );
        $aspect_ratio = $height / $width;
        if ( $width <= $size ) {
            $new_w = $width;
            $new_h = $height;
        } else {
            $new_w = $size;
            $new_h = abs( $new_w * $aspect_ratio );
        }
        //create new image
        $img = imagecreatetruecolor( $new_w, $new_h );
        imagesetinterpolation( $img );
        // imagesetinterpolation($img, IMG_SINC);
        //resize the image
        imagecopyresampled(
            $img,
            $src,
            0,
            0,
            0,
            0,
            $new_w,
            $new_h,
            $width,
            $height
        );
        ob_start();
        imagepng( $img );
        $image_data = ob_get_contents();
        ob_end_clean();
        $dir = SAFI_TEMPLATE_THUMB_DIR;
        if ( !is_dir( $dir ) ) {
            // dir doesn't exist, make it
            wp_mkdir_p( $dir );
        }
        $image_filename = "template-{$tplid}.png";
        if ( false !== file_put_contents( $dir . $image_filename, $image_data ) ) {
            return $image_filename;
        }
        return false;
    }

    private function copyTemplateThumbnail( $tplid, $template_src_id ) {
        if ( !$template_src_id ) {
            return false;
        }
        $dir = SAFI_TEMPLATE_THUMB_DIR;
        if ( !is_dir( $dir ) ) {
            // dir doesn't exist, make it
            wp_mkdir_p( $dir );
        }
        $image_filename_src = "template-{$template_src_id}.png";
        $image_filename = "template-{$tplid}.png";
        if ( false !== copy( $dir . $image_filename_src, $dir . $image_filename ) ) {
            return $image_filename;
        }
        return false;
    }

    private function deleteTemplateThumbnail( $tplid ) {
        if ( !$tplid ) {
            return false;
        }
        $dir = SAFI_TEMPLATE_THUMB_DIR;
        $image_filename = "template-{$tplid}.png";
        return unlink( $dir . $image_filename );
    }

    //fetches templates from the database
    public function pullTemplates() {
        $templates = get_option( $this->tpl_opt );
        if ( !$templates ) {
            return [];
        }
        //returns templates as an array
        $templates = json_decode( $templates, true );
        return $templates;
    }

    //fetches templates thumbsfrom the database
    public function pullTemplatesScreenshots() {
        $templates = get_option( $this->screenshot_tpl_opt );
        if ( !$templates ) {
            return [];
        }
        //returns templates as an array
        $templates = json_decode( $templates, true );
        return $templates;
    }

    //updates templates to the database
    public function pushTemplates() {
        return update_option( $this->tpl_opt, json_encode( $this->templates ) );
    }

    //updates templates to the database
    public function pushTemplatesScreenshots() {
        return update_option( $this->screenshot_tpl_opt, json_encode( $this->screenshots ) );
    }

    /**
     * Get templates from the database
     *
     * @param boolean $simple_listing returns only the list of templates nameID => name without the actual templates
     * @return void
     */
    public function getTemplates( $simple_listing = false ) {
        if ( $simple_listing ) {
            $templates = [];
            //no templates, we return an empty array
            if ( !$this->templates ) {
                return $templates;
            }
            //Populates the template array with id => name
            foreach ( $this->templates as $item ) {
                $templates[$item['id']] = $item['name'];
            }
            return $templates;
        }
        return $this->templates;
    }

    /**
     * Inserts a template in the template array and updates the database
     *
     * @param [type] $template JSON template
     * @return void
     */
    public function addTemplate( $template, $screenshot ) {
        if ( !$template ) {
            return;
        }
        //Creates a unique key
        $uid = safi_generate_uid();
        //prepares the data
        $data = [
            'id'      => $uid,
            'name'    => $template['canvas']['templateName'],
            'content' => $template,
        ];
        // $screenshot_data = [
        //     'id' => $uid,
        //     'screenshot' => $screenshot,
        // ];
        // $item = json_decode($template, true);
        $this->templates[] = $data;
        // $this->screenshots[$uid] = $screenshot;
        $filename = $this->createTemplateThumbnail( $uid, $screenshot );
        $this->screenshots[$uid] = $filename;
        $this->pushTemplatesScreenshots();
        //returns the new id on success
        if ( !$this->pushTemplates() === false ) {
            return $uid;
        }
        return;
    }

    /**
     * Inserts a template in the template array and updates the database
     *
     * @param [type] $template JSON template
     * @return void
     */
    public function duplicateTemplate( $template, $template_src_id ) {
        if ( !$template ) {
            return;
        }
        //Creates a unique key
        $uid = safi_generate_uid();
        //prepares the data
        $data = [
            'id'      => $uid,
            'name'    => $template['canvas']['templateName'],
            'content' => $template,
        ];
        // $screenshot_data = [
        //     'id' => $uid,
        //     'screenshot' => $screenshot,
        // ];
        // $item = json_decode($template, true);
        $this->templates[] = $data;
        // $this->screenshots[$uid] = $screenshot;
        $filename = $this->copyTemplateThumbnail( $uid, $template_src_id );
        $this->screenshots[$uid] = $filename;
        $this->pushTemplatesScreenshots();
        //returns the new id on success
        if ( !$this->pushTemplates() === false ) {
            return $uid;
        }
        return;
    }

    /**
     * Inserts a template in the template array and updates the database
     *
     * @param [type] $template JSON template
     * @return void
     */
    public function importTemplate( $template ) {
        if ( !$template ) {
            return;
        }
        //Creates a unique key
        $uid = $template['id'];
        //prepares the data
        $data = $template;
        //checks if there is already a template with the provided ID
        if ( safi_array_find( $uid, 'id', $this->templates ) !== null ) {
            return false;
        }
        $this->templates[] = $data;
        //returns the new id on success
        if ( !$this->pushTemplates() === false ) {
            return $uid;
        }
        return;
    }

    /**
     * Undocumented function
     *
     * @param Array $order collection of ids in the specified order
     * @return void
     */
    public function reorderTemplates( $order ) {
        if ( !$order ) {
            return false;
        }
        //Security precautions
        if ( count( $this->templates ) !== count( $order ) ) {
            return false;
        }
        // Index users by ID
        $tpls = $this->templates;
        //rebuilds the array accordingly to the requested order
        $templates = array_map( function ( $id ) use($tpls) {
            return safi_array_find( $id, 'id', $tpls );
        }, $order );
        $this->templates = $templates;
        //returns the new id on success
        if ( !$this->pushTemplates() === false ) {
            return true;
        }
        return false;
    }

    /**
     * Updates an existing template
     *
     * @param [type] $tplid template id
     * @param [type] $content
     * @param [type] $screenshot base64 image data for the template thumbnail
     * @return void
     */
    public function updateTemplate( $tplid, $content, $screenshot ) {
        $item = safi_array_find( $tplid, 'id', $this->templates );
        if ( !$item ) {
            return false;
        }
        // foreach ($this->screenshots as &$row) {
        //     if ($row['id'] == $tplid) {
        //         //replaces the row with new data
        //         $row_ss = [
        //             'id' => $tplid,
        //             'screenshot' => $screenshot,
        //         ];
        //         $this->pushTemplatesScreenshots();
        //         break;
        //     }
        // }
        foreach ( $this->templates as &$row ) {
            if ( $row['id'] == $tplid ) {
                //replaces the row with new data
                $row = [
                    'id'            => $tplid,
                    'name'          => $content['canvas']['templateName'],
                    'last_modified' => time(),
                    'content'       => $content,
                ];
                //replaces the row with new data
                // $row_ss = [
                //     'id' => $tplid,
                //     'screenshot' => $screenshot,
                // ];
                $filename = $this->createTemplateThumbnail( $tplid, $screenshot );
                $this->screenshots[$tplid] = $filename;
                $this->pushTemplatesScreenshots();
                if ( !$this->pushTemplates() === false ) {
                    return true;
                }
                return false;
            }
        }
    }

    public function deleteTemplate( $tplid ) {
        if ( !$tplid ) {
            return false;
        }
        //removes the itemm
        $this->templates = array_values( 
            //prevent from changing the array into an object
            array_filter( $this->templates, function ( $item ) use($tplid) {
                return $item['id'] !== $tplid;
            } )
         );
        //removes the itemm
        unset($this->screenshots[$tplid]);
        $filename = $this->deleteTemplateThumbnail( $tplid );
        $this->pushTemplatesScreenshots();
        //returns the new id on success
        if ( !$this->pushTemplates() === false ) {
            return true;
        }
        return false;
    }

    /**
     * Fetches the starter templates that are present in the templates/ folder
     *
     * @return array
     */
    public function getStarterTemplates() {
        $demo_templates_path = SAFI()->path( 'templates' );
        $demo_templates_url = SAFI()->url( 'templates' );
        if ( !is_dir( $demo_templates_path ) ) {
            return false;
        }
        $files = scandir( $demo_templates_path );
        if ( !count( $files ) > 0 ) {
            return false;
        }
        $templates = [];
        foreach ( $files as $file ) {
            if ( $file == '.' || $file == '..' || $file == 'pro' ) {
                continue;
            }
            $theme_json_path = $demo_templates_path . '/' . $file . '/' . $file . '.safi.json';
            $theme_thumb_path = $demo_templates_path . '/' . $file . '/' . 'thumbnail.jpg';
            $theme_thumb_url = $demo_templates_url . '/' . $file . '/' . 'thumbnail.jpg';
            //make sure the file exists
            if ( !is_file( $theme_json_path ) ) {
                continue;
            }
            $template = json_decode( file_get_contents( $theme_json_path ), true );
            //on parsing failure, skip this tmeplate
            if ( !$template ) {
                continue;
            }
            $template = [
                'id'        => $file,
                'template'  => $template,
                'thumbnail' => ( is_file( $theme_thumb_path ) ? $theme_thumb_url : null ),
            ];
            //Adds the current theme to the csutom themes array
            $templates[] = $template;
        }
        return $templates;
    }

}
