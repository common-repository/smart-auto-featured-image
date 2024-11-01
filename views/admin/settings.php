<?php defined('ABSPATH') or die('Wrong path bro!'); ?>
<div class="wrap wpjoli-wrap">
    <div id="joli-title">
        <span class="h1-title"><?php echo esc_html(SAFI()::NAME) ?></span>
        <span class="h1-subtitle">Global settings</span>
    </div>
    <h1></h1>
    <?php settings_errors(); ?>

    <div class="safi-wrap">

        <header class="joli-header">
            <div class="joli-logo">
                <a href="https://wpjoli.com" title="WPJoli" target="_blank">
                    <img src="<?php echo esc_url($logo_url); ?>" alt="">
                </a>
            </div>
            <div class="joli-nav">
                <?php foreach ($tabs as $id => $data) : ?>
                    <a id="tab-<?php echo esc_attr($id) ?>" class="joli-nav-item" href="#<?php echo esc_attr($id); ?>">
                        <div class="joli-nav-title">
                            <?php echo esc_html($data['label']) ?>
                        </div>
                    </a>
                <?php endforeach; ?>
            </div>
            <div class="joli-version">
                <div class="joli-submit joli-submit-inline">
                    <div class="joli-save-info">
                        <?php submit_button(__('Save settings', 'wpjoli-safi'), 'primary joli-settings-submit joli-do-submit', 'submit-menu', false); ?>
                    </div>
                </div>
                <p>v<?php echo esc_html($version); ?></p>
            </div>
        </header>
        <section class="joli-content">
            <form id="safi-settings" method="post" action="<?php echo esc_url(admin_url('options.php')); ?>">
                <div class="tab-content joli-tab-content">
                    <div id="tab-settings" class="joli-settings-tab-pane">
                        <?php
                        $option_group = SAFI()::SETTINGS_SLUG;
                        settings_fields($option_group);
                        do_settings_sections($option_group);
                        ?>
                    </div>
                </div>
                <div class="joli-submit">
                    <div class="joli-save-info">
                        <div class="joli-info-text"><?php esc_html_e('Changes unsaved', 'wpjoli-safi'); ?></div>
                        <?php submit_button(__('Save settings', 'wpjoli-safi'), 'primary joli-settings-submit', 'submit-float', false); ?>
                    </div>
                </div>
            </form>
            <form action="<?php echo esc_url(sanitize_url($_SERVER['REQUEST_URI'])) ?>" method="post">
                <?php wp_nonce_field('safi_reset'); ?>
                <p>
                    <input type="submit" id="safi_reset_settings" name="safi_reset_settings" class="button button-link button-small" value="<?php esc_html_e("Reset settings", "wpjoli-safi"); ?>" data-prompt="<?php echo esc_attr__("Are you sure you want to reset settings ? All current settings will be lost.", "wpjoli-safi"); ?>">
                </p>
            </form>
        </section>
        <aside class="joli-sidebar">
            <div class="joli-sidebar-content">
                <?php if (safi_xy()->is_free_plan()) : ?>
                    <div class="joli-sidebar-item" style="background: #cafff7;">
                        <div class="joli-gopro-notice">
                            <h3><span style="font-size: small;">Get more with</span><br>Smart Auto Featured Image Pro</h3>
                            <ul>
                                <?php echo implode("\n", array_map(function ($feature) {
                                    return safi_tagify('li', esc_html($feature));
                                }, $pro_features)) ?>
                            </ul>
                            <p>
                                <a href="<?php echo sprintf('%sadmin.php?page=' . 'smart-auto-featured-image_template_editor' .  '-pricing', get_admin_url()); ?>" class="button button-primary"><?php esc_html_e('Get Pro now', 'wpjoli-safi'); ?></a>
                            </p>
                        </div>
                    </div>
                <?php endif; ?>
                <div class="joli-sidebar-item">
                    <h3><?php esc_html_e('Links', 'wpjoli-safi') ?></h3>
                    <ul>
                        <?php if (safi_xy()->is_free_plan()) : ?>
                            <li>
                                <a href="<?php echo esc_url($safi_review_url) ?>" target="_blank"><?php esc_html_e('You like the plugin ?', 'wpjoli-safi'); ?><br><?php esc_html_e('Please rate us ★★★★★ !', 'wpjoli-safi'); ?></a>
                            </li>
                        <?php endif; ?>
                        <?php if (safi_xy()->is_premium()) : ?>
                            <li>
                                <a href="<?php echo esc_url(safi_xy()->get_account_url()) ?>" target="_blank"><?php esc_html_e('Account', 'wpjoli-safi'); ?></a>
                            </li>
                            <li>
                                <a href="<?php echo esc_url(safi_xy()->contact_url()) ?>" target="_blank"><?php esc_html_e('Contact us', 'wpjoli-safi'); ?></a>
                            </li>
                        <?php endif; ?>
                        <li>
                            <a href="<?php echo esc_url($safi_doc_url) ?>" target="_blank"><?php esc_html_e('Documentation', 'wpjoli-safi'); ?></a>
                        </li>
                    </ul>
                </div>
                <div class="joli-sidebar-item">
                    <a href="<?php echo esc_url($joli_toc_url) ?>" class="joli-sidebar-header" target="_blank">
                        <img src="<?php echo esc_url(SAFI()->url('assets/admin/img/plugins/wpjoli-joli-table-of-contents.png')) ?>" alt="" />
                        <h3>Joli Table Of Contents</h3>
                    </a>
                    <div class="joli-sidebar-body">
                        <p class="joli-plugin-description">The most customizable & user friendly Table Of Contents for your website. Works with Gutenberg Block / Shortcode / Auto-insert.</p>
                        <p>
                            <a href="<?php echo esc_url($joli_toc_url) ?>" class="button button-secondary" target="_blank"><?php esc_html_e('Find out more', 'wpjoli-safi'); ?></a>
                        </p>
                    </div>
                </div>
                <div class="joli-sidebar-item">
                    <a href="<?php echo esc_url($joli_faq_seo_url) ?>" class="joli-sidebar-header" target="_blank">
                        <img src="<?php echo SAFI()->url('assets/admin/img/plugins/wpjoli-joli-faq-seo.png') ?>" alt="" />
                        <h3>Joli FAQ SEO</h3>
                    </a>
                    <div class="joli-sidebar-body">
                        <p class="joli-plugin-description">WordPress FAQ plugin:<br>Easy & fast single page drag-n-drop editor, lightweight, no jQuery, block-enabled, schema.org, optimized for SEO.</p>
                        <p>
                            <a href="<?php echo esc_url($joli_faq_seo_url) ?>" class="button button-secondary" target="_blank"><?php esc_html_e('Find out more', 'wpjoli-safi'); ?></a>
                        </p>
                    </div>
                </div>
                <div class="joli-sidebar-item">
                    <a href="<?php echo esc_url($joli_clear_lightbox_url) ?>" class="joli-sidebar-header" target="_blank">
                        <img src="<?php echo esc_url(SAFI()->url('assets/admin/img/plugins/wpjoli-joli-clear-lightbox.png')) ?>" alt="" />
                        <h3>Joli CLEAR Lightbox</h3>
                    </a>
                    <div class="joli-sidebar-body">
                        <p class="joli-plugin-description">Ultralight Lightbox for WordPress.<br>Designed for Speed. No jQuery. Responsive with gestures. Simple, Elegant & Powerful.</p>
                        <p>
                            <a href="<?php echo esc_url($joli_clear_lightbox_url) ?>" class="button button-secondary" target="_blank"><?php esc_html_e('Find out more', 'wpjoli-safi'); ?></a>
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    </div>
    <div id="safi-save-spinner" class="spinner"></div>
    <div id="safi-save-alert" class="joli-is-hidden"><?php esc_html_e('Settings saved !', 'wpjoli-safi') ?></div>
</div>