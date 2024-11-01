<?php

/**
 * @package safi
 */
namespace WPJoli\SAFI\Controllers;

use WP_REST_Response;
use WPJoli\SAFI\Engine\JsonToHtml;
class RestApi {
    protected $namespace;

    private $remote_image_url;

    public function __construct() {
        $this->namespace = 'safi/v1';
    }

    public function registerRestRoutes() {
        //Featured Image Generation from JSON Template
        register_rest_route( $this->namespace, '/' . 'featured-image/preview', [
            'methods'             => 'POST',
            'callback'            => [$this, 'getFeaturedImagePreviewFromTemplate'],
            'permission_callback' => function () {
                return current_user_can( 'edit_posts' );
            },
        ] );
        //Featured Image Generation from JSON Template
        register_rest_route( $this->namespace, '/' . 'featured-image/upload', [
            'methods'             => 'POST',
            'callback'            => [$this, 'uploadFeaturedImage'],
            'permission_callback' => function () {
                return current_user_can( 'edit_posts' );
            },
        ] );
    }

    public function uploadFeaturedImage( $request ) {
        $params = $request->get_params();
        if ( is_object( $params ) ) {
            // return null;
        }
        // Upload dir.
        $upload_dir = wp_upload_dir();
        $upload_path = str_replace( '/', DIRECTORY_SEPARATOR, $upload_dir['path'] ) . DIRECTORY_SEPARATOR;
        $post_data = safi_sanitize_var( $params['post'] );
        //Image from base65 data
        if ( isset( $params['imageData'] ) ) {
            // $template = $params['template'];
            $base64_img = $params['imageData'];
            if ( !$base64_img ) {
                return new WP_Error('safi_no_image_data', 'No image data', array(
                    'status' => 400,
                ));
            }
            $img_type = strstr( $base64_img, ",", true );
            //ex: 'data:image/jpeg;base64,' we need to add +1 to include the coma
            $img = substr( $base64_img, strlen( $img_type ) + 1 );
            $img = str_replace( ' ', '+', $img );
            $decoded = base64_decode( $img );
            $extension = ( stripos( $img_type, 'png' ) !== false ? 'png' : 'jpg' );
            $title = uniqid( 'safi-image-' );
            $filename = $title . '.' . $extension;
            // $filename        = 'safi-65bcd1ed8de81.png';
            // $hashed_filename = md5($filename . microtime()) . '_' . $filename;
            // Save the image in the uploads directory.
            $upload_file = file_put_contents( $upload_path . $filename, $decoded );
        }
        //Improves UX
        usleep( rand( 25, 100 ) * 10000 );
        $mime_type = ( $extension == 'jpg' ? 'jpeg' : $extension );
        $file_type = 'image/' . $mime_type;
        // $file_type       = $extension === 'png' ? 'image/png' : 'image/jpeg';
        $attachment = array(
            'post_mime_type' => $file_type,
            'post_title'     => preg_replace( '/\\.[^.]+$/', '', basename( $filename ) ),
            'post_content'   => '',
            'post_status'    => 'inherit',
            'guid'           => $upload_dir['url'] . '/' . basename( $filename ),
        );
        $filepath = $upload_dir['path'] . '/' . $filename;
        $attach_id = wp_insert_attachment( $attachment, $filepath );
        // Make sure that this file is included, as   wp_generate_attachment_metadata() depends on it.
        require_once ABSPATH . 'wp-admin/includes/image.php';
        // Generate the metadata for the attachment, and update the database record.
        $attach_data = wp_generate_attachment_metadata( $attach_id, $filepath );
        wp_update_attachment_metadata( $attach_id, $attach_data );
        return new WP_REST_Response([
            'attachment_id' => $attach_id,
        ]);
    }

    public function cancelFeaturedImage( $request ) {
        $params = $request->get_params();
        if ( is_object( $params ) ) {
            // return null;
        }
        $data = safi_sanitize_var( $params['data'] );
        $image_url = safi_sanitize_var( $data['imageURL'] );
        if ( $image_url ) {
            //error
            $message = 'Error while creating the image';
            $err_data = [
                'imageUrl' => $image_url,
                'message'  => $message,
            ];
            return $this->safiRestError__premium_only( $err_data, 500 );
        }
        return new WP_REST_Response([
            'html'          => $output['template'],
            'dynamicFields' => $output['dynamicFields'],
        ]);
    }

    public function getFeaturedImagePreviewFromTemplate( $request ) {
        $params = $request->get_params();
        if ( is_object( $params ) ) {
            // return null;
        }
        $template = $params['template'];
        $data = $params['data'];
        $options = safi_sanitize_var( $params['options'] );
        /**
         * @var JsonToHtml
         */
        $engine = new JsonToHtml($template, $data, $options);
        $output = $engine->renderHtml( true );
        return new WP_REST_Response([
            'html'          => $output['template'],
            'dynamicFields' => $output['dynamicFields'],
        ]);
    }

}
