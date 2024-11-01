<?php defined('ABSPATH') or die('Wrong path bro!'); ?>
<div class="wrap wpjoli-wrap">
    <div id="joli-title">
        <span class="h1-title"><?php echo esc_html(SAFI()::NAME) ?></span>
        <span class="h1-subtitle">Template manager</span>
    </div>

    <div class="safi-content-wrap">
        <h1></h1>
        <?php settings_errors(); ?>

        <div class="wrap-collabsible">
            <input id="collapsible" class="toggle" type="checkbox">
            <label for="collapsible" class="lbl-toggle"><span class="dashicons dashicons-info-outline" style="margin-right: 5px;"></span><?php esc_html_e('How to create Featured Images from templates ?', 'wpjoli-safi') ?></label>
            <div class="collapsible-content">
                <div class="content-inner">
                    <ol>
                        <li><?php esc_html_e('Create/edit templates on this page', 'wpjoli-safi') ?></li>
                        <li><?php esc_html_e('While editing a post in the block editor, under the Featured image section, select a template', 'wpjoli-safi') ?></li>
                        <li><?php esc_html_e('Optionally bring some minor changes to the template', 'wpjoli-safi') ?></li>
                        <li><?php esc_html_e('Preview and Generate the Feature Image', 'wpjoli-safi') ?></li>
                    </ol>
                    <p><?php esc_html_e('For more information, please refer to the', 'wpjoli-safi') ?> <a href="https://wpjoli.com/docs/smart-auto-featured-image/" target="_blank"><?php esc_html_e('documentation', 'wpjoli-safi') ?></a></p>
                </div>
            </div>
        </div>

        <h2><?php esc_html_e("Templates", "wpjoli-safi") ?></h2>
        <div id="safiapp"><span class="spinner is-active" style="float: left;margin-left: 0;padding-left: 28px;width: 200px;"><?php esc_html_e("Loading templates...", "wpjoli-safi") ?></span></div>
        <?php if (safi_xy()->is_free_plan()) : ?>
            <div class="joli-sidebar-item" style="background: #cafff7;padding: 15px 30px;margin-top: 20px;">
                <div class="joli-gopro-notice">
                    <h3><span style="font-size: small;">Get more with</span><br>Smart Auto Featured Image Pro</h3>
                    <ul style="list-style-type: disc; margin-left: 30px;">
                        <?php echo implode("\n", array_map(function ($feature) {
                            return safi_tagify('li', esc_html($feature));
                        }, $pro_features)) ?>
                    </ul>
                    <p>
                        <a href="<?php echo esc_url($pro_url) ?>" class="button button-primary" target="_blank"><?php esc_html_e('View Pro on WPJoli.com', 'wpjoli-safi'); ?></a>
                    </p>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>