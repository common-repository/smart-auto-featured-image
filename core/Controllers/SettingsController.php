<?php

/**
 * @package safi
 */
namespace WPJoli\SAFI\Controllers;

use WPJoli\SAFI\Application;
use WPJoli\SAFI\Controllers\Callbacks\SettingsCallbacks;
use WPJoli\SAFI\Config\Settings;
class SettingsController {
    protected $prefix;

    protected $page;

    protected $page_name;

    protected $settings = [];

    public $groups = [];

    public $sections = [];

    public $fields = [];

    protected $settings_cb;

    //will contain the options array stored in db
    protected $cached_settings;

    public function __construct() {
        $this->settings_cb = new SettingsCallbacks();
        //loads the default settings array
        $this->settings = $this->defaultSettings();
        $this->prefix = Application::SLUG . '_';
        $this->page_name = Application::SETTINGS_SLUG;
        $this->initSettings();
        //load the options array stored in db to prevent further SQL queries
        $this->cached_settings = get_option( Application::SETTINGS_SLUG );
    }

    public function handleResetSettings() {
        //Reset settings button clicked
        if ( isset( $_POST['safi_reset_settings'] ) && wp_verify_nonce( sanitize_text_field( $_POST['_wpnonce'] ), 'safi_reset' ) ) {
            $this->resetSettings();
        }
    }

    private function defaultSettings() {
        //Fetches templates and extract values into the settings
        $tpl = SAFI()->requestService( TemplatesController::class );
        $user_templates = $tpl->getTemplates( true );
        //load template;
        extract( [
            'templates' => $user_templates,
        ] );
        $settings = (include SAFI()->path( 'config/defaults.php' ));
        return $settings;
    }

    public function initSettings() {
        $settings = $this->settings;
        $this->groups = [];
        $this->sections = [];
        $this->fields = [];
        $cpt = 0;
        //Init Groups-----------------
        foreach ( $settings as $group ) {
            $_group = [
                'id'    => $group['group'],
                'name'  => $group['group'],
                'label' => $group['label'],
                'args'  => safi_sanitize_var( $group['args'] ),
            ];
            $this->groups[] = $_group;
            //Init Sections-------------------
            foreach ( $group['sections'] as $section ) {
                $_section = [
                    'name'  => $section['name'],
                    'group' => $group['group'],
                    'title' => $section['title'],
                    'desc'  => safi_sanitize_var( $section['desc'] ),
                ];
                $this->sections[] = $_section;
                //Init Fields-------------------
                foreach ( $section['fields'] as $field ) {
                    $_args = $field['args'];
                    // $active_post_type  = is_admin() ? safi_sanitize_var($_GET['safi_post_type'], true) : null;
                    $is_global = safi_sanitize_var( $_args['is_global'] );
                    //adds some args automatically
                    // $option_id = $section['name'] . '.' . $field['id'];
                    $option_id = str_replace( '-', '_', $field['id'] );
                    // $_args['name'] = $page_name . '[' . $section['name'] . '.' . $field['id'] . ']';
                    $_args['name'] = $this->page_name . '[' . $option_id . ']';
                    $_args['id'] = $option_id;
                    $pro_class = ( safi_sanitize_var( $_args['pro'] ) === true ? ' joli-pro' : '' );
                    $new_class = ( safi_sanitize_var( $_args['new'] ) === true ? ' joli-new' : '' );
                    $is_global_class = ( $is_global ? ' joli-is-global' : '' );
                    $_args['class'] = 'tab-' . $group['group'] . $pro_class . $new_class . $is_global_class . ' joli-field--' . $field['id'];
                    $_args['type'] = $field['type'];
                    $info_html = '<span class="joli-field-info dashicons dashicons-info-outline"></span>';
                    $info = ( safi_sanitize_var( $_args['desc'] ) ? $info_html . '<div class="joli-info-bubble">' . $_args['desc'] . '</div>' : '' );
                    $_field = [
                        'id'            => $field['id'],
                        'option_id'     => $option_id,
                        'section'       => $section['name'],
                        'group'         => $group['group'],
                        'label'         => $field['title'] . $info,
                        'type'          => $field['type'],
                        'default'       => safi_sanitize_var( $field['default'] ),
                        'initial_value' => safi_sanitize_var( $field['initial_value'] ),
                        'args'          => $_args,
                        'name'          => $this->page_name . '[' . $option_id . ']',
                        'sanitize'      => safi_sanitize_var( $field['sanitize'] ),
                        'sanitize_args' => safi_sanitize_var( $field['sanitize_args'] ),
                        'global'        => $is_global,
                    ];
                    // pre($_field);
                    $this->fields[] = $_field;
                    $cpt++;
                    // 'fields' => [
                    //     [
                    //         'id' => 'min-width',
                    //         'title' => esc_html__('Minimum width', 'wpjoli-safi'),
                    //         'type' => 'text',
                    //         'args' => [
                    //             'class' => 'ui-toggle'
                    //         ],
                    //         'default' => '300px',
                    //     ],
                    // ],
                }
            }
        }
    }

    public function registerSettings() {
        $this->registerSettingsGroup();
        return;
        $setting_name = $this->page_name;
        //--Register Sections-----
        // $_section = [
        //     'name' => $this->prefix . $section['name'],
        //     'group' => $this->prefix . $group['id'],
        //     'title' => $section['title'],
        //     'callback' => [ $this->settings_cb, 'sectionCallback'],
        //     // 'desc' => $section['desc'],
        // ];
        foreach ( $this->sections as $section ) {
            add_settings_section(
                $section['name'],
                $section['title'],
                [$this, 'sectionCallback'],
                $setting_name
            );
        }
        //--Register Fields-----
        // $_field = [
        //     'id' => $field['id'],
        //     'group' => $this->prefix . $group['id'],
        //     'section' => $this->prefix . $section['name'],
        //     'label' => $field['title'],
        //     // 'desc' => ArrayHelper::getValue($config, 'desc'),
        //     'type' => $field['type'],
        //     'default' => $field['default'],
        //     'args' => $field['args'],
        //     'callback' => $field['callback'],
        //     'name' => $this->prefix . $group['id'] . '[' . $field['id'] . ']',
        // ];
        register_setting( $setting_name, $setting_name, [
            'sanitize_callback' => [$this, 'sanitizeCallback'],
        ] );
        foreach ( $this->fields as $field ) {
            add_settings_field(
                $field['section'] . '.' . $field['id'],
                $field['label'],
                [$this->settings_cb, 'inputField'],
                // $this->assignFieldCallback( $field[ 'type' ] ),
                $setting_name,
                // $field[ 'group' ],
                $field['section'],
                $field['args']
            );
        }
        //--Register groups-----
        // $_group = [
        //     'id' => $this->prefix . $group['id'],
        //     'name' => $group['id'],
        //     'label' => $group['label'],
        //     'callback' => $group['label'],
        // ];
        // foreach ($this->groups as $group) {
        //     register_setting(
        //         $group[ 'id' ],
        //         $group[ 'id' ],
        //         [
        //             'sanitize_callback' => [ $this->settings_cb, 'sanitizeCallback']
        //         ]
        //     );
        // }
    }

    public function registerSettingsGroup( $group = null ) {
        $setting_name = $this->page_name;
        //--Register Sections-----
        // $_section = [
        //     'name' => $this->prefix . $section['name'],
        //     'group' => $this->prefix . $group['id'],
        //     'title' => $section['title'],
        //     'callback' => [ $this->settings_cb, 'sectionCallback'],
        //     // 'desc' => $section['desc'],
        // ];
        foreach ( $this->sections as $section ) {
            add_settings_section(
                $section['name'],
                $section['title'],
                [$this, 'sectionCallback'],
                $setting_name,
                [
                    'before_section' => '<div class="joli-section joli-section--' . $section['name'] . '">',
                    'after_section'  => '</div>',
                ]
            );
        }
        register_setting( $setting_name, $setting_name, [
            'type'              => 'array',
            'sanitize_callback' => [$this, 'sanitizeCallback'],
        ] );
        foreach ( $this->fields as $field ) {
            add_settings_field(
                $field['section'] . '.' . $field['id'],
                $field['label'],
                [$this->settings_cb, 'inputField'],
                // $this->assignFieldCallback( $field[ 'type' ] ),
                $setting_name,
                // $field[ 'group' ],
                $field['section'],
                $field['args']
            );
        }
    }

    public function sanitizeCallback( $input ) {
        // [
        //     "general.show-title" => "Title",
        //     ...
        // ]
        foreach ( $input as $option => $value ) {
            $field_item = safi_array_find( $option, 'option_id', $this->fields );
            $key = 'sanitize';
            $sanitization = safi_sanitize_var( $field_item[$key] );
            //Since 2.0.0
            $sanitize_args = safi_sanitize_var( $field_item['sanitize_args'] );
            //If no specific sanitation is passed, use the type as default sanitation
            if ( !$sanitization ) {
                $sanitization = safi_sanitize_var( $field_item['type'] );
            }
            //Calls the corresponding sanitization function
            if ( $sanitization ) {
                //builds the corresponding method name: ex: sanitizeText found in the SettingsCallbacks class
                $method_name = 'sanitize' . ucfirst( $sanitization );
                if ( method_exists( $this->settings_cb, $method_name ) ) {
                    $input[$option] = call_user_func( [$this->settings_cb, $method_name], $value, $sanitize_args );
                }
            }
        }
        return $input;
    }

    /**
     * Displays the section description if any
     */
    public function sectionCallback( $args ) {
        // pre($args);
        foreach ( $this->sections as $section ) {
            if ( $section['name'] === $args['id'] ) {
                if ( isset( $section['desc'] ) && $section['desc'] ) {
                    echo '<div class="joli-section-desc" style="display:none">' . $section['desc'] . '</div>';
                }
                break;
            }
        }
    }

    /**
     * Setup settings on plugin activation
     *
     * @return void
     */
    public function setupSettings() {
        if ( !$this->fields ) {
            $this->initSettings();
        }
        $options = [];
        //runs through each "prepared" option
        foreach ( $this->fields as $field ) {
            $option_item[$field['option_id']] = ( isset( $field['initial_value'] ) || $field['initial_value'] !== null ? $field['initial_value'] : $field['default'] );
            $options += $option_item;
            // $option_item[ $field[ 'option_id' ] ] = $field[ 'default' ];
            // $options[] = $option_item;
        }
        //add the option to the database if none
        if ( get_option( $this->page_name ) === false ) {
            add_option( $this->page_name, $options );
        }
        $this->cached_settings = $options;
    }

    public function resetSettings() {
        delete_option( $this->page_name );
        $this->setupSettings();
    }

    public function getFieldsIDs( $additional_options = null ) {
        $id_list = array_map( function ( $option ) {
            return $option['option_id'];
        }, $this->fields );
        if ( $additional_options && is_array( $additional_options ) ) {
            $keys = array_keys( $additional_options );
            // pre($keys);
            // pre($id_list);
            // $id_list = array_merge($keys, ['ppede', 'cucu']);
            $id_list = array_merge( $keys, $id_list );
        }
        return $id_list;
    }

    public function isOptionGlobal( $option_id ) {
        $field_item = safi_array_find( $option_id, 'option_id', $this->fields );
        return safi_sanitize_var( $field_item['global'] ) === true;
    }

    /**
     * Gets the global option from the database or from the local cache
     * Ex: getOption( 'general', 'prefix' );
     *
     * @param [type] identifier
     * @param [type] section (parent of identifier)
     * @param [type] default returns only the default value if true
     * @return mixed option value, default value, or null
     */
    public function getOption( $option_id, $default = false, $options_override = null ) {
        $field_item = safi_array_find( $option_id, 'option_id', $this->fields );
        $default_val = safi_sanitize_var( $field_item['default'] );
        if ( $default === true ) {
            return $default_val;
        }
        $cached_settings = $this->cached_settings;
        if ( $options_override ) {
            $options = $options_override;
        } else {
            if ( $cached_settings ) {
                $options = $cached_settings;
                //get option from cache
            } else {
                $options = get_option( $this->page_name );
                //get option from database
            }
        }
        $value = null;
        if ( $options && is_array( $options ) ) {
            $value = $this->fetchOption( $option_id, $options, $default_val );
        }
        if ( $value !== null ) {
            return $value;
        }
        return;
    }

    /**
     * Gets the option args from the defaults
     * Ex: getOption( 'general', 'prefix', 'key' );
     *
     * @param [type] identifier
     * @param [type] section (parent of identifier)
     * @param [type] $param
     * @return void
     */
    public function getOptionArgs( $name, $section, $key = null ) {
        $option_selector = $section . '.' . $name;
        $field_item = safi_array_find( $option_selector, 'option_id', $this->fields );
        if ( $field_item ) {
            $args = $field_item['args'];
            if ( $key ) {
                //return a spcific value from the args by specifying a key
                return safi_sanitize_var( $args[$key] );
            }
            //returns all the args as a fallback
            return $args;
        }
        return;
    }

    /**
     * Returns an array of all the options
     *
     * @return void
     */
    public function getOptions() {
        if ( $this->cached_settings ) {
            $options = $this->cached_settings;
            //get option from cache
        } else {
            $options = get_option( $this->page_name );
            //get option from database
        }
        if ( $options !== null ) {
            return $options;
        }
        return;
    }

    /**
     * Fetches the option from the unserialized array
     */
    public function fetchOption( $option_selector, $options, $default = null ) {
        $value = null;
        if ( is_array( $options ) && array_key_exists( $option_selector, $options ) ) {
            $value = $options[$option_selector];
        }
        if ( $value === null ) {
            return $default;
        }
        return $value;
    }

    public function getGroups() {
        // (
        //     [id] => general
        //     [name] => general
        //     [label] => General
        // )
        return $this->groups;
    }

}
