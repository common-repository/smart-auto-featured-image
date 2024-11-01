<?php defined('ABSPATH') or die('Wrong path bro!'); ?>
<div class="notice notice-info wpjoli-safi wpjoli-safi-gopro">
    <p>
        <?php esc_html_e('Unleash your creativity with the Pro version of ', 'wpjoli-safi'); ?><b><?php  echo esc_html( SAFI()::NAME, 'wpjoli-safi' ) ?></b><?php esc_html_e(' and generate stunning Featured Images for your blog posts', 'wpjoli-safi'); ?>
    </p>
    <p>
        <a href="<?php echo esc_url($pro_url); ?>" target="_blank" class="button button-primary" data-method="dismiss" data-action="gopro"><?php esc_html_e('View Pro features', 'wpjoli-safi'); ?></a>
        <a href="" class="button button-link" data-method="dismiss" data-action="gopro"><?php esc_html_e('Close', 'wpjoli-safi'); ?></a>
    </p>
</div>
