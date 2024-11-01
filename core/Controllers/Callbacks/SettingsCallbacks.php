<?php

/**
 * @package safi
 */
namespace WPJoli\SAFI\Controllers\Callbacks;

class SettingsCallbacks {
    public function sanitizeColor( $input ) {
        $value = strtolower( (string) $input );
        // return preg_match('/^#[0-9a-f]{6}$/', $value) ? $value : null;
        if ( preg_match( '/^#[0-9a-f]{6}$/', $value ) ) {
            return $value;
        } else {
            if ( preg_match( '/^rgb\\((\\d{1,3}),\\s*(\\d{1,3}),\\s*(\\d{1,3})\\)$/', $value ) ) {
                return $value;
            } else {
                if ( preg_match( '/^rgba\\((\\d{1,3}),\\s*(\\d{1,3}),\\s*(\\d{1,3}),\\s*(\\d*(?:\\.\\d+)?)\\)$/', $value ) ) {
                    return $value;
                }
            }
        }
        return null;
    }

    public function sanitizeCheckbox( $input ) {
        return filter_var( $input, FILTER_SANITIZE_NUMBER_INT );
    }

    public function sanitizeNumber( $input, $args = null ) {
        $value = filter_var( $input, FILTER_SANITIZE_NUMBER_INT );
        $pass = null;
        if ( isset( $args['min'] ) ) {
            $pass = $value >= $args['min'];
        }
        if ( $pass === false ) {
            return false;
        }
        if ( isset( $args['max'] ) ) {
            $pass = $value <= $args['max'];
        }
        if ( $pass === false ) {
            return false;
        }
        return $value;
    }

    public function sanitizeFloat( $input ) {
        return filter_var( $input, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION );
    }

    public function sanitizeTextarea( $input ) {
        return sanitize_textarea_field( $input );
    }

    public function sanitizeText( $input ) {
        return sanitize_text_field( $input );
    }

    public function sanitizeSelect( $input ) {
        return sanitize_text_field( $input );
    }

    public function sanitizeCheckboxes( $input ) {
        return sanitize_text_field( $input );
    }

    public function sanitizeUnit( $input ) {
        $value = $input;
        if ( substr_count( $value, '|' ) > 1 ) {
            return null;
        }
        $value = str_replace( ',', '.', $value );
        return $value;
    }

    public function sanitizeDimensions( $input, $args ) {
        if ( !$args ) {
            return null;
        }
        $dim = safi_sanitize_var( $input['dim'] );
        if ( !$dim ) {
            return null;
        }
        //check individual values
        foreach ( $dim as $key => $value ) {
            $type_compare = safi_sanitize_var( $args['dimensions'][$key] );
            if ( settype( $value, $type_compare ) === false ) {
                return null;
            }
        }
        $unit = safi_sanitize_var( $input['unit'] );
        if ( !$unit ) {
            return null;
        }
        //check individual values
        if ( !is_array( $args['units'] ) || is_array( $args['units'] ) && !in_array( $unit, $args['units'] ) ) {
            return null;
        }
        return $input;
    }

    private function doTemplate( $template, $data = [] ) {
        return str_replace( array_map( 'safi_mustache_key', array_keys( $data ) ), array_values( $data ), $template );
    }

    private function generateClassData( $classes = null, $data = null ) {
        $output = '';
        if ( !is_array( $data ) ) {
            return $classes;
        }
        if ( $data ) {
            foreach ( $data as $key => $value ) {
                $output .= sprintf( ' data-%s="%s"', $key, $value );
            }
            $output = rtrim( $output, '"' );
        }
        return $classes . '"' . $output;
    }

    /**
     * Echoes out the actual input field in the settings page
     */
    public function inputField( $args ) {
        // $option = explode('.', $args['id']);
        $option = $args['id'];
        $is_global = safi_sanitize_var( $args['is_global'] ) === true;
        // var_dump($is_global);
        $classes_data = $this->generateClassData( safi_sanitize_var( $args['classes'], true ), safi_sanitize_var( $args['data'] ) );
        $data = [
            'classes'          => $classes_data,
            'name'             => $args['name'],
            'placeholder'      => safi_sanitize_var( $args['placeholder'], true ),
            'option'           => $option,
            'value'            => safi_get_option( $option ),
            'is_global'        => $is_global,
            'active_post_type' => safi_sanitize_var( $_GET['safi_post_type'], true ),
        ];
        //echoes the corresponding field type
        echo $this->displayInput( $args, $data );
        //Adds a description if any [DEPRECATED 2.0.0]
        // if (isset($args['desc']) && $args['desc']) {
        //     if (is_array($args['desc'])) {
        //         foreach ($args['desc'] as $line) {
        //             echo sprintf('<p class="description">%s</p>', $line);
        //         }
        //     } else {
        //         echo sprintf('<p class="description">%s</p>', $args['desc']);
        //     }
        // }
        //Adds an image if any
        if ( isset( $args['img'] ) && $args['img'] ) {
            $img_path = SAFI()->path( 'assets/admin/img/' . $args['img'] );
            $img_url = SAFI()->url( 'assets/admin/img/' . $args['img'] );
            if ( file_exists( $img_path ) ) {
                echo sprintf( '<p><img class="joli-admin-image" src="%s"></p>', $img_url );
            }
        }
        //Adds a custom section if any
        if ( isset( $args['custom'] ) && $args['custom'] ) {
            echo sprintf( '<div class="joli-custom">%s</div>', $args['custom'] );
        }
    }

    /**
     * Returns the html tag corresponding to the $args['type']
     * Ex: 'text', 'select','checkbox', etc
     */
    public function displayInput( $args, $data ) {
        $method = 'process' . ucfirst( $args['type'] );
        if ( method_exists( $this, $method ) ) {
            //calls a matching function
            //ex: Call 'processText' for $args['type'] == 'text
            return call_user_func( [$this, $method], $args, $data );
        }
        return;
    }

    private function processPosttype( $args, $data ) {
        $pt_args = [
            'public'       => true,
            '_builtin'     => true,
            'show_in_rest' => true,
        ];
        $post_types = get_post_types( $pt_args, 'objects' );
        // $post_types = get_post_types_by_support(
        //     ['editor']
        // );
        // if (is_array($data['value'])) {
        // 'global_class' => ($data['is_global'] ? ' joli-is-global' : ''),
        $active_post_type = $data['active_post_type'];
        $is_global = $data['is_global'];
        $enabled = ( $args['pro'] ? ' disabled' : '' );
        $enabled = ( $active_post_type && $is_global ? ' disabled' : '' );
        $output = "<fieldset{$enabled}>";
        foreach ( $post_types as $post_type => $args ) {
            // pre($post_type);
            $checked = false;
            if ( is_array( $data['value'] ) ) {
                $checked = ( in_array( $post_type, $data['value'] ) ? true : false );
            }
            $output .= sprintf(
                '<div class="%s"><input type="checkbox" id="%s[%s]" name="%s[]" value="%s" class="joli-checkbox" %s><label for="%s[%s]">%s</label></div>',
                $data['classes'],
                $data['name'],
                $post_type,
                $data['name'],
                $post_type,
                ( $checked ? 'checked' : '' ),
                $data['name'],
                $post_type,
                $args->label . ' [ ' . $post_type . ' ]'
            );
        }
        $output .= '</fieldset>';
        return $output;
        // }
        return;
    }

    private function processTextarea( $args, $data ) {
        // pre($data);
        $ta_size = 'cols="100" rows="12"';
        if ( isset( $args['textarea-size'] ) ) {
            switch ( $args['textarea-size'] ) {
                case 'small':
                    $ta_size = 'cols="60" rows="6"';
                    break;
            }
        }
        $active_post_type = $data['active_post_type'];
        $is_global = $data['is_global'];
        $disabled = $active_post_type && $is_global;
        return sprintf(
            '<textarea class="%s" id="%s" name="%s" %s placeholder="%s"%s>%s</textarea><br>',
            $data['classes'],
            $data['name'],
            $data['name'],
            $ta_size,
            $data['placeholder'],
            ( $args['pro'] || $disabled ? ' disabled' : '' ),
            esc_textarea( $data['value'] )
        );
    }

    private function processText( $args, $data ) {
        // pre($args);
        // pre($data);
        $active_post_type = $data['active_post_type'];
        $is_global = $data['is_global'];
        $disabled = $active_post_type && $is_global;
        return sprintf(
            '<input type="text" class="%s" id="%s" name="%s" value="%s" placeholder="%s"%s>',
            $data['classes'],
            $data['name'],
            $data['name'],
            esc_attr( $data['value'] ),
            $data['placeholder'],
            ( $args['pro'] || $disabled ? ' disabled' : '' )
        );
    }

    private function processCheckbox( $args, $data ) {
        // pre($args);
        // pre($data);
        // var_dump($data['value']);
        $checked = ( isset( $data['value'] ) ? ( $data['value'] == 1 ? true : false ) : false );
        // var_dump($checked);
        return sprintf(
            '<div class="%s">
            <input type="checkbox" id="%s" class="joli-checkbox" %s data-linkedfield="%s"%s><label for="%s"></label>
            <input type="hidden" id="check_%s" name="%s" value="%d" %s/>
            </div>',
            $data['classes'],
            $data['name'],
            // $data['name'],
            ( $checked ? 'checked' : '' ),
            $data['option'],
            ( $args['pro'] ? ' disabled' : '' ),
            $data['name'],
            $data['option'],
            $data['name'],
            ( $checked ? 1 : 0 ),
            ( $args['pro'] ? ' disabled' : '' )
        );
    }

    private function processSwitch( $args, $data ) {
        $checked = ( isset( $data['value'] ) ? ( $data['value'] == 1 ? true : false ) : false );
        // pre($args);
        $tpl_data = [
            'classes'           => $data['classes'],
            'name'              => $data['name'],
            'checked'           => ( $checked ? ' checked' : '' ),
            'checked_value'     => ( $checked ? 1 : 0 ),
            'linkedfield'       => $data['option'],
            'disabled'          => ( $args['pro'] ? ' disabled' : '' ),
            'pro_class'         => ( $args['pro'] ? ' joli-pro' : '' ),
            'deactivates'       => ( safi_sanitize_var( $args['deactivates'] ) ? implode( ',', $args['deactivates'] ) : '' ),
            'children'          => ( safi_sanitize_var( $args['children'] ) ? implode( ',', $args['children'] ) : '' ),
            'children_sections' => ( safi_sanitize_var( $args['children_sections'] ) ? implode( ',', $args['children_sections'] ) : '' ),
        ];
        $template = '<div class="{{classes}}">
            <label class="joli-switch" for="{{name}}">
                <input type="checkbox" id="{{name}}" class="joli-checkbox"{{checked}} data-linkedfield="{{linkedfield}}" data-deactivates="{{deactivates}}" data-children="{{children}}" data-children-sections="{{children_sections}}"{{disabled}}>
                <span class="slider round"></span>
            </label>
            <input type="hidden" id="check_{{linkedfield}}" name="{{name}}" value="{{checked_value}}"{{disabled}}/>
        </div>';
        return $this->doTemplate( $template, $tpl_data );
        // return sprintf(
        //     '<div class="%s">
        //         <label class="joli-switch" for="%s">
        //             <input type="checkbox" id="%s" class="joli-checkbox" %s data-linkedfield="%s"%s>
        //             <span class="slider round"></span>
        //         </label>
        //         <input type="hidden" id="check_%s" name="%s" value="%d" %s/>
        //     </div>',
        //     $data['classes'],
        //     $data['name'],
        //     $data['name'],
        //     // $data['name'],
        //     ($checked ? 'checked' : ''),
        //     $data['option'][0] . '-' . $data['option'][1],
        //     $args['pro'] ? ' disabled' : '',
        //     $data['option'][0] . '-' . $data['option'][1],
        //     $data['name'],
        //     $checked ? 1 : 0,
        //     $args['pro'] ? ' disabled' : ''
        // );
    }

    private function processSelect( $args, $data ) {
        // <select name="" id="">
        //     <option selected="selected" value="">Example option</option>
        //     <option value="">Example option</option>
        // </select>
        // pre($args);
        // pre($data);
        $items = $args['values'];
        $items_pro = ( isset( $args['values_pro'] ) ? $args['values_pro'] : [] );
        $items_custom_js_var = ( isset( $args['values_custom'] ) ? $args['values_custom'] : [] );
        $output = sprintf(
            '<div class="%s">
                <select name="%s" id="%s" data-selector="%s"%s%s%s>',
            $data['classes'],
            $data['name'],
            $data['name'],
            $data['option'],
            ( $args['pro'] ? ' disabled' : '' ),
            ( $items_custom_js_var ? ' data-has-custom-values="1" data-custom-values-src="' . $items_custom_js_var . '"' : '' ),
            ( $data['value'] ? ' data-selected-value="' . $data['value'] . '"' : '' )
        );
        foreach ( $items as $id => $name ) {
            $is_pro = ( in_array( $id, $items_pro ) ? true : false );
            $output .= sprintf(
                '<option%s value="%s"%s%s>%s</option>',
                ( $id == $data['value'] ? ' selected' : '' ),
                ( $is_pro && safi_xy()->is_not_paying() ? 'none' : $id ),
                '',
                //$is_pro ? ' disabled' : '',
                ( isset( $args['media'][$id] ) ? 'data-media="' . $id . '"' : '' ),
                ( $is_pro && safi_xy()->is_not_paying() ? $name . ' [PRO]' : $name )
            );
        }
        $output .= '</select></div>';
        if ( isset( $args['media'] ) ) {
            $output .= '<p>';
            foreach ( $args['media'] as $media_id => $media_name ) {
                $output .= sprintf(
                    '<img id="%s" class="joli-admin-image joli-admin-image-%s%s" src="%s">',
                    $data['option'] . '-' . $media_id,
                    $data['option'],
                    ( $media_id !== $data['value'] ? ' hidden' : '' ),
                    SAFI()->url( 'assets/admin/img/' . $media_name )
                );
            }
            $output .= '</p>';
        }
        return $output;
    }

    private function processCheckboxes( $args, $data ) {
        // pre($args);
        // pre($data);
        // pre($data);
        // var_dump($data['value']);
        $checked = ( isset( $data['value'] ) ? ( $data['value'] == 1 ? true : false ) : false );
        // var_dump($checked);
        $items = $args['values'];
        $items_pro = ( isset( $args['values_pro'] ) ? $args['values_pro'] : [] );
        $output = sprintf( '<div class="%s">', $data['classes'] );
        $field_id = 'joli-checkboxes_' . $data['option'];
        $pre_template = '<input type="hidden" id="{{id}}" name="{{name}}" value="{{raw_value}}">';
        $output .= $this->doTemplate( $pre_template, [
            'id'        => $field_id,
            'name'      => $data['name'],
            'raw_value' => $data['value'],
        ] );
        $active_values = explode( ',', $data['value'] );
        if ( $active_values === false ) {
            $active_values = [];
        }
        foreach ( $items as $id => $name ) {
            $is_pro = ( in_array( $id, $items_pro ) ? true : false );
            $pro_suffix = ( $is_pro ? '-disabled' : '' );
            $tpl_data = [
                'id'           => $data['name'] . $id,
                'name'         => $data['name'] . $pro_suffix,
                'value'        => $id,
                'checked'      => ( in_array( $id, $active_values ) ? ' checked' : '' ),
                'label'        => $name,
                'linked_id'    => $field_id,
                'disabled'     => ( $is_pro ? ' disabled' : '' ),
                'pro_class'    => ( $is_pro ? ' joli-pro' : '' ),
                'global_class' => ( $data['is_global'] ? ' joli-is-global' : '' ),
            ];
            $template = '<label class="joli-checkboxes-item{{pro_class}}{{global_class}}" for="check_{{id}}">
                    <input type="checkbox" id="check_{{id}}" class="joli-check{{pro_class}}" value="{{value}}" data-linked-id="{{linked_id}}"{{checked}}{{disabled}}>
                    <div class="joli-html-label">{{label}}</div>
                </label>';
            $output .= $this->doTemplate( $template, $tpl_data );
        }
        $output .= '</div>';
        return $output;
        return $this->doTemplate( $template, $data );
    }

    private function processRadioicon( $args, $data ) {
        // pre($args);
        // pre('$data');
        // pre($data);
        // var_dump($data['value']);
        $checked = ( isset( $data['value'] ) ? ( $data['value'] == 1 ? true : false ) : false );
        // var_dump($checked);
        $items = $args['values'];
        $items_pro = ( isset( $args['values_pro'] ) ? $args['values_pro'] : [] );
        $output = sprintf( '<div class="%s">', $data['classes'] );
        //
        $styles = safi_sanitize_var( $args['styles'] );
        if ( $styles ) {
            $output .= '<style>' . $styles . '</style>';
        }
        foreach ( $items as $id => $name ) {
            $is_pro = ( in_array( $id, $items_pro ) ? true : false );
            $pro_suffix = ( $is_pro ? '-disabled' : '' );
            $tpl_data = [
                'id'        => $data['name'] . $id,
                'name'      => $data['name'] . $pro_suffix,
                'value'     => $id,
                'checked'   => ( $id == $data['value'] ? ' checked' : '' ),
                'label'     => $name,
                'disabled'  => ( $is_pro ? ' disabled' : '' ),
                'pro_class' => ( $is_pro ? ' joli-pro' : '' ),
            ];
            $template = '<label class="joli-radio-icon{{pro_class}}" for="radio_{{id}}">
                    <input type="radio" id="radio_{{id}}" name="{{name}}" class="joli-radio{{pro_class}}" value="{{value}}"{{checked}}{{disabled}}>
                    <div class="joli-html-label">{{label}}</div>
                </label>';
            $output .= $this->doTemplate( $template, $tpl_data );
        }
        $output .= '</div>';
        return $output;
        return $this->doTemplate( $template, $data );
    }

    // private function processRadioicon($args, $data)
    // {
    //     // pre($args);
    //     // pre($data);
    //     // var_dump($data['value']);
    //     $checked = isset($data['value']) ? ($data['value'] == 1 ? true : false) : false;
    //     // var_dump($checked);
    //     $items = $args['values'];
    //     $output = sprintf('<div class="%s">', $data['classes']);
    //     foreach ($items as $id => $name) {
    //         $output .= sprintf(
    //             '<label class="joli-radio-icon" for="radio_%s">
    //                 <input type="radio" id="radio_%s" name="%s" class="joli-radio" value="%s" %s>
    //                 <div>%s</div>
    //             </label>',
    //             //label
    //             $data['name'] . $id,
    //             //id
    //             $data['name'] . $id,
    //             //name
    //             $data['name'],
    //             //value
    //             $id,
    //             //selected
    //             $id == $data['value'] ? ' checked' : '',
    //             //name
    //             $name
    //         );
    //     }
    //     $output .= '</div>';
    //     return $output;
    //     return sprintf(
    //         '<div class="%s">
    //         <input type="radio" id="%s" class="joli-radio" %s data-linkedfield="%s"><label for="%s"></label>
    //         <input type="hidden" id="check_%s" name="%s" value="%d" />
    //         </div>',
    //         $data['classes'],
    //         $data['name'],
    //         // $data['name'],
    //         ($checked ? 'checked' : ''),
    //         $data['option'][0] . '-' . $data['option'][1],
    //         $data['name'],
    //         $data['option'][0] . '-' . $data['option'][1],
    //         $data['name'],
    //         $checked ? 1 : 0
    //     );
    // }
    // private function processSelect($args, $data)
    // {
    //     // <select name="" id="">
    //     //     <option selected="selected" value="">Example option</option>
    //     //     <option value="">Example option</option>
    //     // </select>
    //     // pre($args);
    //     // pre($data);
    //     $items = $args['values'];
    //     $output = sprintf(
    //         '<select name="%s" id="%s" data-selector="%s">',
    //         $data['name'],
    //         $data['name'],
    //         $data['option'][0] . '-' . $data['option'][1]
    //     );
    //     foreach ($items as $id => $name) {
    //         $output .= sprintf(
    //             '<option%s value="%s">%s</option>',
    //             $id == $data['value'] ? ' selected' : '',
    //             $id,
    //             $name
    //         );
    //     }
    //     $output .= '</select>';
    //     if (isset($args['media'])) {
    //         $output .= '<p>';
    //         foreach ($args['media'] as $media_id => $media_name) {
    //             $output .= sprintf(
    //                 '<img id="%s" class="joli-admin-image joli-admin-image-%s%s" src="%s">',
    //                 $data['option'][0] . '-' . $data['option'][1] . '-' . $media_id,
    //                 $data['option'][0] . '-' . $data['option'][1],
    //                 $media_id !== $data['value'] ? ' hidden' : '',
    //                 SAFI()->url('assets/admin/img/' . $media_name)
    //             );
    //         }
    //         $output .= '</p>';
    //     }
    //     return $output;
    // }
    private function processUnitinput( $args, $data ) {
        // pre($data);
        // pre($args);
        $items = $args['values'];
        $items_pro = ( isset( $args['values_pro'] ) ? $args['values_pro'] : [] );
        $value_text = null;
        $value_option = null;
        if ( $data['value'] != '' ) {
            $split_values = explode( '|', $data['value'] );
            if ( $split_values ) {
                $value_text = ( safi_sanitize_var( $split_values[0] ) === null ? '' : $split_values[0] );
                $value_option = ( safi_sanitize_var( $split_values[1] ) === null ? reset( $args['values'] ) : $split_values[1] );
            }
        }
        // var_dump($value_text);
        // var_dump($value_option);
        //options
        $options = '';
        foreach ( $items as $id => $name ) {
            $is_pro = ( in_array( $id, $items_pro ) ? true : false );
            $options .= sprintf(
                '<option%s value="%s"%s>%s</option>',
                ( $id == $value_option ? ' selected' : '' ),
                $id,
                ( $is_pro ? ' disabled' : '' ),
                ( $is_pro ? $name . ' [PRO]' : $name )
            );
        }
        $tpl_data = [
            'classes'     => $data['classes'],
            'option'      => $data['option'],
            'name'        => $data['name'],
            'placeholder' => $data['placeholder'],
            'raw_value'   => esc_attr( $data['value'] ),
            'value'       => esc_attr( $value_text ),
            'disabled'    => ( $args['pro'] ? ' disabled' : '' ),
            'options'     => $options,
        ];
        // pre($data);
        $template = '<fieldset class="joli-css-unit-field"{{disabled}}>
                <label class="{{classes}}" for="{{name}}">
                    <input type="hidden" class="{{classes}}" id="joli-css-unit_{{option}}" name="{{name}}" value="{{raw_value}}">
                    <input type="text" class="joli-css-unit-input" placeholder="{{placeholder}}" data-linkedfield="{{option}}" value="{{value}}">
                    <select class="joli-css-unit-values" data-linkedfield="{{option}}">
                        {{options}}
                    </select>
                </label>
            </fieldset>';
        return $this->doTemplate( $template, $tpl_data );
    }

    private function processDimensions( $args, $data ) {
        // pre($data);
        // pre('---------');
        // pre($args);
        $items = $args['units'];
        $items_pro = ( isset( $args['values_pro'] ) ? $args['values_pro'] : [] );
        $value_text = null;
        $value_unit = safi_sanitize_var( $data['value']['unit'] );
        // if ($data['value'] != '') {
        //     $split_values = explode('|', $data['value']);
        //     if ($split_values) {
        //         $value_text = $split_values[0];
        //         $value_option = $split_values[1];
        //     }
        // }
        // var_dump($value_text);
        // var_dump($value_option);
        //options
        $options = '';
        foreach ( $items as $id => $name ) {
            $is_pro = ( in_array( $id, $items_pro ) ? true : false );
            $options .= sprintf(
                '<option%s value="%s"%s>%s</option>',
                ( $id == $value_unit ? ' selected' : '' ),
                $id,
                ( $is_pro ? ' disabled' : '' ),
                ( $is_pro ? $name . ' [PRO]' : $name )
            );
        }
        $tpl_data = [
            'classes'     => $data['classes'],
            'option'      => $data['option'],
            'name'        => $data['name'],
            'placeholder' => $data['placeholder'],
            'disabled'    => ( $args['pro'] ? ' disabled' : '' ),
            'options'     => $options,
        ];
        // pre($data);
        $sub_template = '<li>
            <input type="number" id="{{id}}" name="{{name}}[dim][{{dimension}}]" class="joli-dimension-input" data-dimension="{{dimension}}" value="{{value}}">
            <label class="joli-dimension-label" for="{{id}}">{{dimension}}</label>
        </li>';
        $sub_dimensions = $args['sub_dimensions'];
        $sub_fields = '<ul>';
        foreach ( $sub_dimensions as $dimension ) {
            $sub_fields .= $this->doTemplate( $sub_template, [
                'id'        => 'joli_dimension_' . $data['option'] . '_' . $dimension,
                'name'      => $data['name'],
                'dimension' => $dimension,
                'value'     => safi_sanitize_var( $data['value']['dim'][$dimension] ),
            ] );
        }
        $sub_fields .= '</ul>';
        $tpl_data = [
            'classes'     => $data['classes'],
            'option'      => $data['option'],
            'name'        => $data['name'],
            'placeholder' => $data['placeholder'],
            'disabled'    => ( $args['pro'] ? ' disabled' : '' ),
            'options'     => $options,
            'sub_fields'  => $sub_fields,
            'lock_title'  => __( 'Link values together', 'wpjoli-safi' ),
            'clear_str'   => __( 'clear', 'wpjoli-safi' ),
        ];
        $template = '<fieldset class="joli-dimensions-field"{{disabled}}>
                <label class="{{classes}}" for="{{name}}">
                    <div class="joli-dimensions-control">
                        {{sub_fields}}
                        <span class="joli-dimensions-lock dashicons" title="{{lock_title}}"></span>
                        <select name="{{name}}[unit]" class="joli-dimensions-units" data-linkedfield="{{option}}">
                        {{options}}
                        </select>
                        <div>
                            <a href="#" class="joli-dimensions-clear button button-link">{{clear_str}}</a>
                        </div>
                    </div>
                </label>
            </fieldset>';
        return $this->doTemplate( $template, $tpl_data );
    }

}
