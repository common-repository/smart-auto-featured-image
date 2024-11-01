<?php

defined( 'ABSPATH' ) or die( 'Wrong path bro!' );
use WPJoli\SAFI\Controllers\SettingsController;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Returns an instance of the applciation
 * @return WPJoli\SAFI\Application
 */
function SAFI() {
    return WPJoli\SAFI\Application::instance();
}

if ( !function_exists( 'safi_array_find' ) ) {
    /**
     * Returns the first sub_array from an array matching $key and $value
     * @param string $key Comparison key
     * @param mixed $value Value to search
     * @param array $array The array to search from
     * @return array
     */
    function safi_array_find(  $value, $key, $array  ) {
        $item = null;
        foreach ( $array as $row ) {
            if ( $row[$key] == $value ) {
                $item = $row;
                break;
            }
        }
        return $item;
    }

}
if ( !function_exists( 'safi_get_option' ) ) {
    /**
     * Returns the first sub_array from an array matching $key and $value
     *
     * @param [type] $name
     * @param [type] $section
     * @param [type] $options override global options with an array of options
     * @return void
     */
    function safi_get_option(  $option_id, $options = null, $global_options = null  ) {
        /** @var SettingsController $settings */
        $settings = SAFI()->requestService( SettingsController::class );
        // }
        if ( $global_options !== null ) {
            $is_global = $settings->isOptionGlobal( $option_id );
            if ( $is_global ) {
                return $settings->getOption( $option_id, false, $global_options );
            }
        }
        if ( $options ) {
            // error_log('getOption(' . $option_id . ', false, $options))');
            return $settings->getOption( $option_id, false, $options );
        }
        // error_log('getOption(' . $option_id . ')');
        return $settings->getOption( $option_id );
    }

}
if ( !function_exists( 'safi_sanitize_var' ) ) {
    /**
     * Returns $var or null if $var is not set
     * $empty_string = true returns an empty string instead of null
     */
    function safi_sanitize_var(  &$var, $empty_string = null  ) {
        return ( isset( $var ) ? $var : (( $empty_string ? '' : null )) );
    }

}
if ( !function_exists( 'safi_minify_html' ) ) {
    /**
     * Removes line breaks and excessive empty spaces from a string
     */
    function safi_minify_html(  $html  ) {
        // return preg_replace('/\v(?:[\v\h]+)/', '', $string);
        return preg_replace( '#(?ix)(?>[^\\S ]\\s*|\\s{2,})(?=(?:(?:[^<]++|<(?!/?(?:textarea|pre)\\b))*+)(?:<(?>textarea|pre)\\b|\\z))#', '', $html );
    }

}
if ( !function_exists( 'safi_get_host_url' ) ) {
    function safi_get_host_url() {
        $_url = parse_url( site_url() );
        return ( $_url ? urlencode( $_url['host'] ) : false );
    }

}
if ( !function_exists( 'safi_sanitize_notice_method' ) ) {
    /**
     * Sanitizes the command passed thorugh ajax
     *
     * @param [string] $method
     * @return mixed command if valid, false if command is not permitter
     */
    function safi_sanitize_notice_method(  $method  ) {
        if ( !$method ) {
            return false;
        }
        $allowed = ['dismiss', 'review', 'remind'];
        return ( in_array( $method, $allowed ) ? $method : false );
    }

}
if ( !function_exists( 'safi_sanitize_command' ) ) {
    /**
     * Sanitizes the command passed thorugh ajax
     *
     * @param [string] $command
     * @return mixed command if valid, false if command is not permitter
     */
    function safi_sanitize_command(  $command  ) {
        if ( !$command ) {
            return false;
        }
        $allowed = [
            'save',
            'duplicate',
            'reorder',
            'import',
            'update',
            'delete'
        ];
        return ( in_array( $command, $allowed ) ? $command : false );
    }

}
if ( !function_exists( 'safi_sanitize_template_id' ) ) {
    /**
     * Sanitizes the template id passed through ajax
     *
     * @param [string] $id
     * @return mixed id if valid, false otherwise
     */
    function safi_sanitize_template_id(  $id  ) {
        if ( $id === null ) {
            return null;
        }
        return ( ctype_xdigit( $id ) ? $id : false );
    }

}
if ( !function_exists( 'safi_is_screenshot_data_valid' ) ) {
    /**
     * Sanitizes the template id passed through ajax
     *
     * @param [string] $id
     * @return mixed id if valid, false otherwise
     */
    function safi_is_screenshot_data_valid(  $data  ) {
        if ( !$data ) {
            return false;
        }
        $needle = "data:image/png;base64,";
        //must start with the needle
        if ( stripos( $data, $needle ) !== 0 ) {
            return false;
        }
        return true;
    }

}
if ( !function_exists( 'safi_camel_to_kebab_case' ) ) {
    function safi_camel_to_kebab_case(  $input  ) {
        return strtolower( preg_replace( '/(?<!^)[A-Z]/', '-$0', $input ) );
    }

}
if ( !function_exists( 'safi_get_dimensions_value' ) ) {
    /**
     * Returns the first sub_array from an array matching $key and $value
     */
    function safi_get_dimensions_value(  $layer, $array, $type = null  ) {
        // $dim = safi_sanitize_var($array['dim']);
        // $unit = safi_sanitize_var($array['unit']);
        $unit = 'px';
        // if (!$dim || !$unit) {
        //     return false;
        // }
        $offset1 = ( $type == 'corner' ? 'topLeft' : 'top' );
        $offset2 = ( $type == 'corner' ? 'topRight' : 'right' );
        $offset3 = ( $type == 'corner' ? 'bottomRight' : 'bottom' );
        $offset4 = ( $type == 'corner' ? 'bottomLeft' : 'left' );
        $top = safi_sanitize_var( $array[$offset1] );
        $right = safi_sanitize_var( $array[$offset2] );
        $bottom = safi_sanitize_var( $array[$offset3] );
        $left = safi_sanitize_var( $array[$offset4] );
        //if 4 values are the same
        if ( $top === $right && $top === $bottom && $top === $left ) {
            //any of values are unset, '0' means set by the user
            if ( $top === null || $top === false ) {
                // if ($top && $top !== '0') {
                return false;
            }
            return ( $top ? $array[$offset1] . $unit : 0 );
            //any of 4
        }
        return sprintf(
            '%s %s %s %s',
            ( $top ? $array[$offset1] . $unit : 0 ),
            ( $right ? $array[$offset2] . $unit : 0 ),
            ( $bottom ? $array[$offset3] . $unit : 0 ),
            ( $left ? $array[$offset4] . $unit : 0 )
        );
    }

}
if ( !function_exists( 'safi_mustache_key' ) ) {
    function safi_mustache_key(  $string  ) {
        return '{{' . $string . '}}';
    }

}
if ( !function_exists( 'safi_tagify' ) ) {
    /**
     * Returns the first sub_array from an array matching $key and $value
     */
    function safi_tagify(  $tag, $string, $attrs = null  ) {
        if ( !$tag ) {
            return $string;
        }
        $attr_str = [];
        if ( $attrs && is_array( $attrs ) ) {
            $callback = function ( $key, $value ) {
                if ( gettype( $value ) === 'array' ) {
                    $str_value = implode( ' ', $value );
                } else {
                    $str_value = $value;
                }
                return sprintf( ' %1$s="%2$s"', $key, $str_value );
            };
            $attr_str = array_map( $callback, array_keys( $attrs ), array_values( $attrs ) );
        }
        return sprintf(
            '<%1$s%3$s>%2$s</%1$s>',
            $tag,
            $string,
            implode( ' ', $attr_str )
        );
    }

}
if ( !function_exists( 'safi_generate_uid' ) ) {
    /**
     * Get the ID back from salting
     */
    function safi_generate_uid(  $val_length = 8  ) {
        $result = '';
        $module_length = 40;
        // we use sha1, so module is 40 chars
        $steps = round( $val_length / $module_length + 0.5 );
        for ($i = 0; $i < $steps; $i++) {
            $result .= sha1( uniqid() ) . md5( rand() );
        }
        return substr( $result, 0, $val_length );
    }

}
if ( !function_exists( 'safi_get_plugin_version' ) ) {
    /**
     * Returns the plugin's version or '0' if not found
     *
     * @return string plugin's version number.
     */
    function safi_get_plugin_version() {
        $plugin_info = get_plugin_data( SAFI()->path( 'smart-auto-featured-image.php' ) );
        return ( isset( $plugin_info['Version'] ) ? $plugin_info['Version'] : '0' );
    }

}
if ( !function_exists( 'safi_get_domain' ) ) {
    /**
     * Returns the plugin's version or '0' if not found
     *
     * @return string plugin's version number.
     */
    function safi_get_domain() {
        $_url = parse_url( site_url() );
        return ( $_url ? urlencode( $_url['host'] ) : false );
    }

}
if ( !function_exists( 'safi_get_attachment_by_name' ) ) {
    function safi_get_attachment_by_name(  $filename  ) {
        if ( !$filename ) {
            return '';
        }
        $name = pathinfo( $filename, PATHINFO_FILENAME );
        $args = array(
            'post_type'      => 'attachment',
            'name'           => $name,
            'posts_per_page' => 1,
            'post_status'    => 'inherit',
        );
        $_header = get_posts( $args );
        // var_dump(($name));
        $header = ( $_header ? $_header[0] : null );
        $img_url = ( $header ? wp_get_attachment_image_src( $header->ID, 'medium' ) : '' );
        if ( $img_url ) {
            return '<img src="' . $img_url[0] . '" />';
        }
        return $img_url;
    }

}
if ( !function_exists( 'safi_escape_css' ) ) {
    function safi_escape_css(  $css  ) {
        $escaped_css = strtr( wp_filter_nohtml_kses( $css ), [
            '&gt;' => '>',
            "\\'"  => "'",
            '\\"'  => '"',
        ] );
        return $escaped_css;
    }

}
if ( !function_exists( 'safi_file_get_contents_curl' ) ) {
    function safi_file_get_contents_curl(  $url, $retries = 5  ) {
        // $ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.82 Safari/537.36';
        // $ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36';
        $ua = 'WPJoli/SAFI/' . safi_get_plugin_version();
        if ( extension_loaded( 'curl' ) === true ) {
            $ch = curl_init();
            curl_setopt( $ch, CURLOPT_URL, $url );
            // The URL to fetch. This can also be set when initializing a session with curl_init().
            curl_setopt( $ch, CURLOPT_BUFFERSIZE, 262144 );
            // 256kb
            curl_setopt( $ch, CURLOPT_RETURNTRANSFER, TRUE );
            // TRUE to return the transfer as a string of the return value of curl_exec() instead of outputting it out directly.
            curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, 10 );
            // The number of seconds to wait while trying to connect.
            curl_setopt( $ch, CURLOPT_USERAGENT, $ua );
            // The contents of the "User-Agent: " header to be used in a HTTP request.
            curl_setopt( $ch, CURLOPT_FAILONERROR, TRUE );
            // To fail silently if the HTTP code returned is greater than or equal to 400.
            curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, TRUE );
            // To follow any "Location: " header that the server sends as part of the HTTP header.
            curl_setopt( $ch, CURLOPT_AUTOREFERER, TRUE );
            // To automatically set the Referer: field in requests where it follows a Location: redirect.
            curl_setopt( $ch, CURLOPT_TIMEOUT, 180 );
            // The maximum number of seconds to allow cURL functions to execute.
            curl_setopt( $ch, CURLOPT_MAXREDIRS, 5 );
            // The maximum number of redirects
            // curl_setopt($ch, CURLOPT_NOPROGRESS, 0);
            // curl_setopt($ch, CURLOPT_PROGRESSFUNCTION, 'my_progress_handler');
            $result = curl_exec( $ch );
            curl_close( $ch );
        } else {
            $result = file_get_contents( $url );
        }
        if ( empty( $result ) === true ) {
            $result = false;
            if ( $retries >= 1 ) {
                sleep( 1 );
                return safi_file_get_contents_curl( $url, --$retries );
            }
        }
        return $result;
    }

}
// function my_progress_handler($handler, $dltotal, $dlnow, $ultotal, $ulnow)
// {
//     SAFI()->log([$handler, $dltotal, $dlnow, $ultotal, $ulnow]);
//     // SAFI()->log($dlnow);
// }
// add_filter('safi_editor_capability', function ($capability) {
//     return 'edit_posts';
// }, 1);