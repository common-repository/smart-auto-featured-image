<?php

/**
 * @package safi
 */
namespace WPJoli\SAFI\Engine;

use Exception;
class JsonToHtml {
    //Matches dyamic text to passed data in the Rest request
    private $entity_match = [
        'title'     => [
            'prop'         => 'title',
            'is_array'     => false,
            'optional_arg' => false,
        ],
        'domain'    => [
            'callback' => 'safi_get_domain',
        ],
        'post_type' => [
            'prop'         => 'type',
            'is_array'     => false,
            'optional_arg' => false,
        ],
        'category'  => [
            'prop'           => 'categories',
            'is_array'       => true,
            'default_offset' => 0,
            'child_prop'     => 'name',
        ],
        'author'    => [
            'prop'       => 'author',
            'is_array'   => false,
            'child_prop' => 'name',
        ],
        'meta'      => [
            'prop'        => 'meta',
            'is_array'    => false,
            'require_arg' => true,
        ],
        'date'      => [
            'prop'         => 'date',
            'is_array'     => false,
            'optional_arg' => true,
            'require_arg'  => false,
        ],
    ];

    private $prop_match = [
        'y'            => [
            'cssProp' => 'top',
            'suffix'  => 'px',
        ],
        'right'        => [
            'cssProp' => 'right',
            'suffix'  => 'px',
        ],
        'bottom'       => [
            'cssProp' => 'bottom',
            'suffix'  => 'px',
        ],
        'x'            => [
            'cssProp' => 'left',
            'suffix'  => 'px',
        ],
        'height'       => [
            'cssProp' => 'height',
            'suffix'  => 'px',
        ],
        'width'        => [
            'cssProp' => 'width',
            'suffix'  => 'px',
        ],
        'opacity'      => [
            'cssProp' => 'opacity',
        ],
        'fontFamily'   => [
            'cssProp'   => 'font-family',
            'useQuotes' => true,
        ],
        'fit'          => [
            'cssProp' => 'background-size',
        ],
        'fontWeight'   => [
            'cssProp' => 'font-weight',
        ],
        'fontSize'     => [
            'cssProp' => 'font-size',
            'suffix'  => 'px',
        ],
        'lineHeight'   => [
            'cssProp' => 'line-height',
        ],
        'textAlign'    => [
            'cssProp' => 'text-align',
        ],
        'padding'      => [
            'cssProp'  => 'padding',
            'callback' => 'safi_get_dimensions_value',
        ],
        'margin'       => [
            'cssProp'  => 'margin',
            'callback' => 'safi_get_dimensions_value',
        ],
        'borderRadius' => [
            'cssProp'      => 'border-radius',
            'callback'     => 'safi_get_dimensions_value',
            'callback_arg' => 'corner',
        ],
        'border'       => [
            'cssProp'     => 'border-width',
            'callback'    => 'safi_get_dimensions_value',
            'nullValue'   => '0',
            'linkedProps' => [
                'border-style' => 'solid',
            ],
        ],
        'borderStyle'  => [
            'cssProp' => 'border-style',
        ],
        'icon'         => [
            'cssProp'  => 'font-size',
            'suffix'   => 'px',
            'callback' => 'safi_get_fa_icon_font_size',
        ],
        'angle'        => [
            'cssProp'  => 'transform',
            'callback' => 'safi_get_transform_rotate',
        ],
    ];

    private $n = 14 / 15;

    private $common_base_styles = [
        'position'   => 'absolute',
        'box-sizing' => 'border-box',
    ];

    private $base_styles = [
        'text'         => [
            'white-space' => 'pre-line',
        ],
        'circle'       => [
            'border-radius' => '100%',
        ],
        'image'        => [
            'background-position' => "center",
            'background-repeat'   => "no-repeat",
            'user-select'         => "none",
        ],
        'dynamicimage' => [
            'background-position' => "center",
            'background-repeat'   => "no-repeat",
            'user-select'         => "none",
        ],
    ];

    private $fiq = "6";

    protected $json_template;

    protected $post_data;

    protected $options;

    private $has_met_condition;

    public function __construct( $jsonStr = '', $data = [], $options = [] ) {
        $this->post_data = $data;
        $this->options = $options;
        if ( $jsonStr && ($json = json_decode( $jsonStr )) !== null ) {
            $this->json_template = $json;
        }
    }

    public function renderHtml( $preview = false ) {
        //Check json
        if ( !$this->json_template ) {
            return;
        }
        //assigns the main variables
        $canvas = $this->json_template->content->canvas;
        $elements = $this->json_template->content->elements;
        $tree = $this->json_template->content->tree;
        $css = '';
        $dyn_elements = [];
        $html = $this->processNode(
            $tree,
            $elements,
            $css,
            $dyn_elements
        );
        $allowed_html = array(
            'div'    => array(
                'id'    => true,
                'class' => true,
            ),
            'p'      => true,
            'br'     => true,
            'em'     => true,
            'i'      => true,
            'strong' => true,
            'b'      => true,
            'span'   => array(
                'style' => true,
            ),
            'img'    => array(
                'src' => true,
            ),
        );
        $data = [
            'css'          => $css,
            'canvas'       => $canvas,
            'preview'      => $preview,
            'html'         => $html,
            'allowed_html' => $allowed_html,
        ];
        $template = SAFI()->render( [
            'public' => 'safi',
        ], $data, true );
        return [
            'template'      => $template,
            'dynamicFields' => $dyn_elements,
        ];
    }

    /**
     * Processes all the elements from the canvas recursively
     *
     * @param [type] $tree
     * @param [type] $elements
     * @param [type] $css
     * @return void
     */
    private function processNode(
        $tree,
        $elements,
        &$css,
        &$dyn_elements
    ) {
        //Reverses the tree to preserve the layers order
        $tree = array_reverse( $tree );
        $tree_total = count( $tree );
        //initializes the html string
        $html = '';
        //Walks the tree recursively
        for ($i = 0; $i < $tree_total; $i++) {
            $item = $tree[$i];
            //Get the whole object with each property
            $layer = $this->getElementFromId( $item->id, $elements );
            //Skips layers that are set to be invisible
            if ( $layer && safi_sanitize_var( $layer->hidden ) === true ) {
                continue;
            }
            $opening = '';
            $content = '';
            $item_css = '';
            if ( $layer && $layer->type !== "condition" && $layer->type !== "conditional" ) {
                //Generate HTML opening tag
                $opening = $this->generateOpeningTag( $layer );
                $content = $this->generateContent( $layer, $dyn_elements );
                $item_css = $this->generateCss( $layer, $dyn_elements );
                $css .= $item_css;
            }
            $children = '';
            //Generate HTML content
            if ( property_exists( $item, 'children' ) && is_array( $item->children ) === true ) {
                //do stuff
                $the_children = $item->children;
                $children .= $this->processNode(
                    $the_children,
                    $elements,
                    $css,
                    $dyn_elements
                );
                // $content .= $this->processNode($item->children, $elements, $css);
            }
            //Generate HTML closing tag
            $closing = '</div>';
            $html .= $opening . $content . $children . $closing;
        }
        return $html;
    }

    private function generateCss( $layer, &$dyn_elements = null ) {
        $props = [];
        $common_matches = ['margin', 'padding'];
        $matches = ['y', 'height'];
        $defaults = $this->common_base_styles;
        //Defines the base style per type
        if ( isset( $this->base_styles[$layer->type] ) ) {
            $defaults = array_merge( $defaults, $this->base_styles[$layer->type] );
        }
        if ( $layer->type === 'text' ) {
            $matches = [
                'y',
                'x',
                'width',
                'height',
                'fontFamily',
                'fontSize',
                'lineHeight',
                'opacity'
            ];
            $matches = array_merge( $common_matches, $matches );
        } else {
            if ( $layer->type === 'rect' ) {
                $matches = [
                    'y',
                    'x',
                    'width',
                    'height',
                    'opacity'
                ];
                $matches = array_merge( $common_matches, $matches );
            } else {
                if ( $layer->type === 'circle' ) {
                    $matches = [
                        'y',
                        'x',
                        'width',
                        'height',
                        'opacity'
                    ];
                    $matches = array_merge( $common_matches, $matches );
                } else {
                    if ( $layer->type === 'image' ) {
                        $matches = [
                            'y',
                            'x',
                            'width',
                            'height',
                            'opacity',
                            'fit'
                        ];
                        $matches = array_merge( $common_matches, $matches );
                    }
                }
            }
        }
        //1. Filter $layer with $matches array
        $layer_arr = (array) $layer;
        $properties = array_filter( $layer_arr, function ( $key ) use($matches) {
            return in_array( $key, $matches );
        }, ARRAY_FILTER_USE_KEY );
        // Combine with defaults
        // $properties = array_merge($defaults, $properties);
        //2. Replace keys with correspnding css keys
        $prop_match = $this->prop_match;
        $values = [];
        //Builds CSS for default values
        foreach ( $defaults as $key => $value ) {
            $values[] = sprintf( '%s: %s;', $key, $value );
        }
        foreach ( $properties as $key => $value ) {
            //for all other props
            $css_prop = $prop_match[$key]['cssProp'];
            $css_suffix = ( isset( $prop_match[$key]['suffix'] ) ? $prop_match[$key]['suffix'] : '' );
            $has_quotes = ( isset( $prop_match[$key]['useQuotes'] ) ? $prop_match[$key]['useQuotes'] : false );
            $css_value = ( $has_quotes ? '"' . $value . '"' : $value );
            $callback = ( isset( $prop_match[$key]['callback'] ) ? $prop_match[$key]['callback'] : false );
            $callback_arg = ( isset( $prop_match[$key]['callback_arg'] ) ? $prop_match[$key]['callback_arg'] : false );
            $linked_props = ( isset( $prop_match[$key]['linkedProps'] ) ? $prop_match[$key]['linkedProps'] : false );
            $null_value = ( isset( $prop_match[$key]['nullValue'] ) ? $prop_match[$key]['nullValue'] : false );
            // if ($layer->id == 'rect-1' && $key == 'border') {
            //     SAFI()->log($key);
            //     SAFI()->log($value);
            // }
            //check the nullValue first
            if ( $value === null && $null_value !== false ) {
                $css_value = $null_value;
            } else {
                if ( $callback ) {
                    $css_value = call_user_func_array( $callback, [$layer, (array) $value, $callback_arg] );
                    // if ($layer->id == 'rect-1' && $key == 'border') {
                    //     SAFI()->log($css_value);
                    // }
                }
            }
            if ( $linked_props ) {
                foreach ( $linked_props as $prop => $value ) {
                    if ( $value !== false && $value !== "" ) {
                        //same value as original prorp
                        if ( $value === '=' ) {
                            $value = $css_value . $css_suffix;
                        }
                        $values[] = sprintf( '%s: %s;', $prop, $value );
                    }
                }
            }
            //prevents empty values
            if ( $css_value !== false && $css_value !== "" && $css_value !== null ) {
                $values[] = sprintf(
                    '%s: %s%s;',
                    $css_prop,
                    $css_value,
                    $css_suffix
                );
            }
        }
        //Builds the styles fro the styles prop
        if ( isset( $layer->styles ) ) {
            $layer_styles = $layer->styles;
            // $keys = array_keys($this->prop_match);
            foreach ( $layer_styles as $prop => $value ) {
                if ( $value ) {
                    // if ($value && !in_array($prop, $keys)) {
                    // if ($value !== false && $value !== "") {
                    $values[] = sprintf( '%s: %s;', safi_camel_to_kebab_case( $prop ), $value );
                }
            }
        }
        //Custom Css under the form of a raw block of text
        if ( isset( $layer->customCss ) && $layer->customCss ) {
            $custom_values = explode( "\n", $layer->customCss );
            foreach ( $custom_values as $css_value ) {
                $values[] = $css_value;
            }
        }
        if ( $layer->type == 'image' ) {
            $values[] = sprintf( 'background-image: url(%s);', $this->getMediaUrl( $layer ) );
            $css = sprintf( '#%s { %s }', $layer->id, join( " ", $values ) );
            // $css = sprintf('#%s img { %s }', $layer->id, join(" ", $values));
        } else {
            //for all other props
            $css = sprintf( '#%s { %s }', $layer->id, join( " ", $values ) );
        }
        return $css;
    }

    private function generateOpeningTag( $layer ) {
        $layer_class = ( safi_sanitize_var( $layer->classes ) ? " " . $layer->classes : "" );
        switch ( $layer->type ) {
            case 'columns':
                return sprintf(
                    '<div id="%s" class="row %s_css%s">',
                    $layer->id,
                    $layer->id,
                    $layer_class
                );
            case 'container':
                return sprintf(
                    '<div id="%s" class="col %s_css%s">',
                    $layer->id,
                    $layer->id,
                    $layer_class
                );
            case 'text':
                return sprintf(
                    '<div id="%s" class="%s_css%s">',
                    $layer->id,
                    $layer->id,
                    $layer_class
                );
            case 'rect':
                return sprintf(
                    '<div id="%s" class="%s_css%s">',
                    $layer->id,
                    $layer->id,
                    $layer_class
                );
            case 'circle':
                return sprintf(
                    '<div id="%s" class="%s_css%s">',
                    $layer->id,
                    $layer->id,
                    $layer_class
                );
            case 'image':
                return sprintf(
                    '<div id="%s" class="%s_css%s">',
                    $layer->id,
                    $layer->id,
                    $layer_class
                );
            case 'dynamicimage':
                return sprintf(
                    '<div id="%s" class="%s_css%s">',
                    $layer->id,
                    $layer->id,
                    $layer_class
                );
            case 'icon':
                return sprintf(
                    '<div id="%s" class="%s_css %s fa-%s%s">',
                    $layer->id,
                    $layer->id,
                    $layer->iconPrefix,
                    $layer->icon,
                    $layer_class
                );
            case 'svg':
                return sprintf(
                    '<div id="%s" class="%s_css%s">',
                    $layer->id,
                    $layer->id,
                    $layer_class
                );
        }
    }

    private function generateContent( $layer, &$dyn_elements = null ) {
        $filtered_layer = apply_filters( 'safi_filter_layer', $layer, $this->post_data );
        switch ( $filtered_layer->type ) {
            case 'text':
                $the_text = apply_filters(
                    'safi_preprocess_text',
                    $filtered_layer->text,
                    $filtered_layer,
                    $this->post_data
                );
                $value = apply_filters(
                    'safi_postprocess_text',
                    $this->processText( $the_text ),
                    $filtered_layer,
                    $this->post_data
                );
                if ( isset( $filtered_layer->dynamic ) && $filtered_layer->dynamic === true ) {
                    $dyn_elements[$layer->id] = [
                        'content' => $value,
                    ];
                }
                //Allowed HTML for Text layers
                $allowed_html = array(
                    'p'      => true,
                    'br'     => true,
                    'em'     => true,
                    'i'      => true,
                    'strong' => true,
                    'b'      => true,
                    'span'   => array(
                        'style' => true,
                    ),
                );
                return '<div class="safi-text-inner">' . wp_kses( $value, $allowed_html ) . '</div>';
            case 'image':
                if ( isset( $filtered_layer->dynamic ) && $filtered_layer->dynamic === true ) {
                    $value = $this->getMediaUrl( $filtered_layer );
                    $dyn_elements[$layer->id] = [
                        'content' => $value,
                    ];
                }
                return '';
            // return sprintf('<img src="%s" />', esc_attr($this->getMediaUrl($layer)));
            case 'dynamicimage':
                return '';
            case 'icon':
                return '';
            // return $layer->icon;
            case 'svg':
                return '';
            default:
                return '';
        }
    }

    private function getMediaUrl( $layer ) {
        $src_type = $layer->sourceType;
        switch ( $src_type ) {
            case "media":
                return $layer->srcMedia;
            case "url":
                if ( safi_sanitize_var( $layer->sourceFrom ) === 'unsplash' ) {
                    //fetches the image  from unspalsh setting
                    $tpl_width = $this->json_template->content->canvas->width;
                    $request_width = min( $tpl_width * $this->n, $layer->width * $this->n );
                    return $layer->srcUrl . sprintf( "&q=%s&w=", $this->fiq . '0' ) . $request_width;
                    //50
                } else {
                    return $layer->srcUrl;
                }
            case "template":
                return SAFI()->url( 'assets/templates/' . $layer->srcTemplate );
        }
    }

    private function getElementFromId( $id, $array ) {
        $item = null;
        foreach ( $array as $row ) {
            if ( $row->id == $id ) {
                $item = $row;
                break;
            }
        }
        return $item;
    }

    private function processText( $text, $multiple_values = false ) {
        //Replaces lines
        $text = str_replace( "\n", "<br>", $text );
        //Looking for all {{strings}}
        preg_match_all(
            '/{{([a-zA-Z0-9 _.:\\/-\\[\\]]*(\\(\\))?)}}/',
            $text,
            $dynamic_matches,
            PREG_PATTERN_ORDER
        );
        //If no dynamic string, return the text as is
        if ( !$dynamic_matches ) {
            return $text;
        }
        // array(2) {
        //     [0]=>
        //     array(2) {
        //       [0]=>
        //       string(9) "{{title}}"
        //       [1]=>
        //       string(12) "{{category}}"
        //     }
        //     [1]=>
        //     array(2) {
        //       [0]=>
        //       string(5) "title"
        //       [1]=>
        //       string(8) "category"
        //     }
        //   }
        //Array of dynamic texts found
        $entities = $dynamic_matches[1];
        //Remove duplicates
        $entities = array_unique( $entities );
        //If the second regex capturing group equals "()" means we have a custom function
        // $is_func = safi_sanitize_var($dynamic_matches[2][0]) === '()';
        //Matches dyamic text to passed data in the Rest request
        // private $entity_match = [
        //     'title' => [
        //         'prop' => 'title',
        //         'is_array' => false,
        //     ],
        //     ...
        // ];
        foreach ( $entities as $entity ) {
            // $entity_key = substr($entity, 0, strpos($entity, ':'));
            //isolates the prop name of an entity in case it has an argument
            //this is necessary to match to the entity_match array
            $arr = explode( ':', $entity, 2 );
            $entity_key = $arr[0];
            //retires the rules corresponding
            $ent_array = $this->entity_match[$entity_key];
            if ( !$ent_array ) {
                continue;
            }
            //Generate the dynamic value
            $value = $this->fetchEntityData( $entity, $ent_array, $multiple_values );
            if ( is_array( $value ) ) {
                // $text = str_replace('{{' . $entity . '}}', "", $text);
                return $value;
            } else {
                //replaces entities within input text
                $text = str_replace( '{{' . $entity . '}}', $value, $text );
            }
        }
        return $text;
    }

    /**
     * Finds a matching string based on a variable and a dataset 
     *
     * @param string $offset first level property name to fetch data from the $data array
     * @param string $entity dynamic variable (without braces) ex: {{title}} or {{meta:ball_count}}
     * @param array $ent_array entity rule array from the private $entity_match array
     * @param array $data post data passed on from the client
     * @return string
     */
    private function fetchEntityData( $entity, $ent_array, $multiple_values = false ) {
        if ( !$entity || !$ent_array || !$this->post_data ) {
            return '';
        }
        $data = $this->post_data;
        //Initializes the output value
        $value = '';
        $offset = safi_sanitize_var( $ent_array['prop'] );
        //-Entity checks-----------------------------------
        $entity_key = null;
        $entity_arg = null;
        //Checking for an entity with argument ex {{meta:meta_name}}
        $colon_space = strpos( $entity, ':' );
        if ( $colon_space !== false ) {
            $parts = explode( ':', $entity, 2 );
            if ( $parts === false ) {
                return '';
            }
            $entity_key = $parts[0];
            //before ':'
            $entity_arg = $parts[1];
            //after ':'
        }
        //check if we have a callback that will take over the rest
        $callback = safi_sanitize_var( $ent_array['callback'] );
        if ( $callback && function_exists( $callback ) ) {
            //entity with argument after the :
            if ( $entity_arg ) {
                return call_user_func( $callback, $this->post_data, $entity_arg );
            } else {
                return call_user_func( $callback, $this->post_data );
            }
        }
        //Special case for date
        if ( $offset == 'date' ) {
            if ( isset( $data[$offset] ) ) {
                $post_date_str = $data[$offset];
                $value = $post_date_str;
                if ( $entity_arg !== null ) {
                    //Set the default format to Year by default if no format is specified
                    if ( $entity_arg === 'format' ) {
                        $entity_arg = 'Y';
                    }
                    $date_format = $entity_arg;
                    $timestamp = strtotime( $post_date_str );
                    //Tries to create date according to format, or default to original string
                    //Format : 'd/m/Y H:i:s'
                    //https://www.php.net/manual/en/datetime.format.php
                    $date = ( $timestamp ? date( $date_format, $timestamp ) : $post_date_str );
                    // $date = date('d/m/Y H:i:s', strtotime($post_date_str));
                    if ( $date ) {
                        $value = $date;
                    }
                }
            }
        } else {
            if ( !isset( $ent_array['child_prop'] ) && $ent_array['is_array'] === false && (!isset( $ent_array['require_arg'] ) || $ent_array['require_arg'] === false) ) {
                //Actual prop where to fetch the data from the $data array
                if ( isset( $data[$offset] ) ) {
                    $value = $data[$offset];
                    //ex data['title']
                }
            } else {
                if ( isset( $ent_array['child_prop'] ) && $ent_array['is_array'] === false ) {
                    //Actual prop where to fetch the data from the $data array
                    $prop = $ent_array['child_prop'];
                    if ( isset( $data[$offset][$prop] ) ) {
                        $value = $data[$offset][$prop];
                        //ex data['title']
                    }
                } else {
                    if ( $colon_space !== false && isset( $ent_array['require_arg'] ) && $ent_array['require_arg'] === true ) {
                        //Actual prop where to fetch the data from the $data array
                        if ( isset( $data[$offset][$entity_arg] ) ) {
                            $value = $data[$offset][$entity_arg];
                            //ex data['title']
                        }
                    } else {
                        if ( $ent_array['is_array'] === true && isset( $ent_array['child_prop'] ) && isset( $ent_array['default_offset'] ) ) {
                            //Actual prop where to fetch the data from the $data array
                            $prop = $ent_array['child_prop'];
                            $offset_number = $ent_array['default_offset'];
                            //Special case for categories that can return multiple values
                            if ( $multiple_values ) {
                                //check the offset
                                if ( isset( $data[$offset] ) ) {
                                    $values = $data[$offset];
                                    //ex data['title']
                                    $value = array_map( function ( $item ) use($prop) {
                                        return $item[$prop];
                                    }, $values );
                                }
                            } else {
                                //single value
                                //check the offset
                                if ( isset( $data[$offset][$offset_number][$prop] ) ) {
                                    $value = $data[$offset][$offset_number][$prop];
                                    //ex data['title']
                                }
                            }
                        }
                    }
                }
            }
        }
        return $value;
    }

}
