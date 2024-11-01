<?php defined('ABSPATH') or die('Wrong path bro!'); ?>
<?php

return [
    // GENERAL TAB ---------------------------------------------------------------------------
    [
        'group' => 'general',
        'label' => __('General', 'wpjoli-safi'),
        'sections' => [

            //Post editing section
            [
                'name' => 'featured-image',
                'title' => __('Featured image', 'wpjoli-safi'),
                'fields' => [
                    //Default template
                    [
                        'id' => 'featured-image-max-display-width',
                        'title' => __('Max display width (in px)', 'wpjoli-safi'),
                        'type' => 'text',
                        'args' => [
                            'pro' => true,
                            'desc' => __('Setting this option correctly will prevent unnecessary too large images form being loaded. In order to optimize the delivery of the featured image on the front-end, it is recommanded to set the maximum width that your theme allows for the featured image, especially if you have the High definition images option activated.', 'wpjoli-safi'),
                            'placeholder' => '1000',
                            'custom' => safi_tagify(
                                'p',
                                __('It is recommanded to set a value if you have the High definition images option activated to prevent huge images from being loaded.This option will alter the "sizes" attribute of the featured image to optimize the delivery. Leave this field empty for maximum quality but this may increase loading times.', 'wpjoli-safi'),
                                ['class' => 'description']
                            ),
                        ],
                        'default' => '0',
                        // 'initial_value' => '1200',
                        'sanitize' => 'number',
                    ],
                ],
            ],

            //Post editing section
            [
                'name' => 'post-editing',
                'title' => __('Post editing', 'wpjoli-safi'),
                'fields' => [
                    //Default template
                    [
                        'id' => 'default-template',
                        'title' => __('Default template', 'wpjoli-safi'),
                        'type' => 'select',
                        'args' => [
                            'desc' => __('Pre-selects a default template in the SAFI module when editing a post with the block editor.', 'wpjoli-safi'),
                            'values' => ['none' => __('[None]', 'wpjoli-safi')] + $templates,
                            // 'values' => apply_filters( 'wpjoli_safi_template_list', [] ),

                        ],
                        // 'default' => 'none',
                        'default' => '00000000',
                    ],
                ],
            ],

            //Post editing section
            [
                'name' => 'interface',
                'title' => __('Interface', 'wpjoli-safi'),
                'fields' => [

                    [
                        'id' => 'enable-safi-post-types',
                        'title' => __('Enable SAFI module on', 'wpjoli-safi'),
                        'type' => 'posttype',
                        'args' => [
                            'desc' => __('Disables the Smart Auto Featured Imaged on specific post types', 'wpjoli-safi'),
                        ],
                        'default' => ['post', 'page'],
                        'initial_value' => ['post', 'page'],
                    ],
                    // //Post types
                    // [
                    //     'id' => 'disable-safi-post-types',
                    //     'title' => __('Disable SAFI module on', 'wpjoli-safi'),
                    //     'type' => 'posttype',
                    //     'args' => [
                    //         'desc' => __('Disables the Smart Auto Featured Imaged on specific post types', 'wpjoli-safi'),
                    //     ],
                    // ],
                ],
            ],

            //Uninstall
            [
                'name' => 'uninstall',
                'title' => __('Uninstall', 'wpjoli-safi'),
                'fields' => [
                    //Post types
                    [
                        'id' => 'uninstall-app',
                        'title' => __('Delete all on uninstall', 'wpjoli-safi'),
                        'type' => 'switch',
                        'args' => [
                            'desc' => __('Delete everything related to the plugin on uninstall', 'wpjoli-safi'),
                            'custom' => safi_tagify('p', __('If this option is switched on, everything will be deleted after uninstalling the plugin: options, database entries, templates, template thumbnails, post metas (templates created/modified within posts). This will not uninstall the plugin after saving the settings', 'wpjoli-safi'), ['class' => ['description', 'danger']]),
                        ],
                        'default' => 0,
                        'sanitize' => 'checkbox',
                    ],
                ],
            ],
        ],
    ],
    // TEMPLATES TAB ---------------------------------------------------------------------------
    [
        'group' => 'template',
        'label' => __('Template', 'wpjoli-safi'),
        'sections' => [
            [
                'name' => 'default-values',
                'title' => __('Default values', 'wpjoli-safi'),
                'desc' => safi_tagify(
                    'p',
                    __('Recommanded format: 1200 x 624. Grid size 8 / 12 / 16 / 24 / 48', 'wpjoli-safi')
                ),
                'fields' => [
                    //Background color
                    [
                        'id' => 'template-background-color',
                        'title' => __('Template background color', 'wpjoli-safi'),
                        'type' => 'text',
                        'args' => [
                            // 'class' => 'tab-appearance',
                            'placeholder' => '#ffffff',
                            // 'data' => ['alpha-enabled' => 'true'],
                            'classes' => 'joli-color-picker', //adds color picker
                            'data' => [
                                'alpha-enabled' => 'true',
                                'alpha-color-type' => 'hex',
                            ],
                        ],
                        'default' => '#ffffff',
                        'sanitize' => 'Color'
                    ],

                    // Width
                    [
                        'id' => 'template-width',
                        'title' => __('Template width (in pixels)', 'wpjoli-safi'),
                        'type' => 'text',
                        'args' => [
                            'desc' => __('min: 50, max: 1200.', 'wpjoli-safi'),
                            'placeholder' => '1200',
                            'custom' => safi_tagify('p', __('min: 50, max: 1200. (Go Pro for up to 5000)', 'wpjoli-safi'), ['class' => 'description']),
                        ],
                        'default' => '1200',
                        'initial_value' => '1200',
                        'sanitize' => 'number',
                        'sanitize_args' => [
                            'min' => 50,
                            'max' => 1200,
                        ],
                    ],

                    // Height
                    [
                        'id' => 'template-height',
                        'title' => __('Template height (in pixels)', 'wpjoli-safi'),
                        'type' => 'text',
                        'args' => [
                            'desc' => __('min: 50, max: 800.', 'wpjoli-safi'),
                            'placeholder' => '624',
                            'custom' => safi_tagify('p', __('min: 50, max: 800. (Go Pro for up to 5000)', 'wpjoli-safi'), ['class' => 'description']),
                        ],
                        'default' => '624',
                        'initial_value' => '624',
                        'sanitize' => 'number',
                        'sanitize_args' => [
                            'min' => 50,
                            'max' => 800,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'grid',
                'title' => __('Grid', 'wpjoli-safi'),
                // 'desc' => safi_tagify(
                //     'p',
                //     __('Recommanded format: 1200 x 624. Grid size 8 / 12 / 16 / 24 / 48', 'wpjoli-safi')
                // ),
                'fields' => [
                    // Grid size
                    [
                        'id' => 'template-grid-size',
                        'title' => __('Grid size (in pixels)', 'wpjoli-safi'),
                        'type' => 'text',
                        'args' => [
                            'desc' => __('min: 1, max: 800.', 'wpjoli-safi'),
                            'placeholder' => '24',
                            'custom' => safi_tagify('p', __('min: 1, max: 800.', 'wpjoli-safi'), ['class' => 'description']),
                        ],
                        'default' => '24',
                        'initial_value' => '24',
                        'sanitize' => 'number',
                        'sanitize_args' => [
                            'min' => 1,
                            'max' => 800,
                        ],
                    ],
                    //Background color
                    [
                        'id' => 'template-grid-color',
                        'title' => __('Grid color', 'wpjoli-safi'),
                        'type' => 'text',
                        'args' => [
                            // 'class' => 'tab-appearance',
                            'placeholder' => '#ffffff',
                            // 'data' => ['alpha-enabled' => 'true'],
                            'classes' => 'joli-color-picker', //adds color picker
                            // 'data' => [
                            //     'alpha-enabled' => 'true',
                            //     'alpha-color-type' => 'hex',
                            // ],
                        ],
                        'default' => '#444444',
                        'sanitize' => 'Color'
                    ],

                    // Width
                    [
                        'id' => 'template-grid-opacity',
                        'title' => __('Grid opacity', 'wpjoli-safi'),
                        'type' => 'text',
                        'args' => [
                            'desc' => __('min: 1, max: 100.', 'wpjoli-safi'),
                            'placeholder' => '15',
                            'custom' => safi_tagify('p', __('min: 1, max: 100.', 'wpjoli-safi'), ['class' => 'description']),
                        ],
                        'default' => '15',
                        'initial_value' => '15',
                        'sanitize' => 'number',
                        'sanitize_args' => [
                            'min' => 1,
                            'max' => 100,
                        ],
                    ],
                ],
            ],
        ],
    ],
    // IMAGE GEN TAB ---------------------------------------------------------------------------
    [
        'group' => 'image',
        'label' => __('Image', 'wpjoli-safi'),
        'sections' => [
            [
                'name' => 'image-generation',
                'title' => __('Image generation', 'wpjoli-safi'),
                'desc' => safi_tagify(
                    'p',
                    __('Higher quality will result in bigger file sizes & higher loading times. WEBP format should be privileged over JPG as the rendered file is 2x to 4x smaller (in average) for a similar quality level.', 'wpjoli-safi')
                ) . safi_tagify(
                    'p',
                    __('Recommanded settings: HD / WEBP / 85% quality`.', 'wpjoli-safi')
                ),
                'fields' => [
                    //HD image
                    [
                        'id' => 'image-hd',
                        'title' => __('High definition images', 'wpjoli-safi'),
                        'type' => 'switch',
                        'args' => [
                            // 'new' => true,
                            'pro' => true,
                            'desc' => __('This option will double the width/height of the template dimensions. If your template is 1200x624, the generated image will be 2400x1056 resulting in a higher quality file but a much higher file size. However, WordPress handles responsive images natively so that the most appropriate image format is served to the client in the browser.', 'wpjoli-safi'),
                            'custom' => safi_tagify(
                                'p',
                                __('Images will look sharper on high DPI screens but image size and loading time will increase.', 'wpjoli-safi'),
                                ['class' => 'description']
                            ),
                        ],
                        'default' => 0,
                        'sanitize' => 'checkbox',
                    ],

                    // Width
                    [
                        'id' => 'image-format',
                        'title' => __('Image format', 'wpjoli-safi'),
                        'type' => 'select',
                        'args' => [
                            'pro' => true,
                            'desc' => __('Image format for the featured image generation', 'wpjoli-safi'),
                            'values' => [
                                'jpg' => __('jpg', 'wpjoli-safi'),
                                'png' => __('png', 'wpjoli-safi'),
                                'webp' => __('webp', 'wpjoli-safi'),
                            ],
                        ],
                        'default' => 'jpg'
                    ],

                    // Height
                    [
                        'id' => 'image-quality',
                        'title' => __('Image quality', 'wpjoli-safi'),
                        'type' => 'text',
                        'args' => [
                            'pro' => true,
                            'desc' => __('Image quality between 1 and 100 (applies only to jpg and webp formats).', 'wpjoli-safi'),
                            'placeholder' => '80',
                        ],
                        'default' => '80',
                        'initial_value' => '80',
                        'sanitize' => 'number',
                        'sanitize_args' => [
                            'min' => 1,
                            'max' => 100,
                        ],
                    ],
                ],
            ],
        ],
    ],
];
