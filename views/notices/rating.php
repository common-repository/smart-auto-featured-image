<?php defined('ABSPATH') or die('Wrong path bro!'); ?>
<div class="notice notice-info wpjoli-safi wpjoli-safi-rating">
    <p>
        <?php esc_html_e('Hi! Thank you for using ', 'wpjoli-safi') ?><b><?php echo esc_html(SAFI()::NAME, 'wpjoli-safi') ?></b><?php esc_html_e(' ! 🙏', 'wpjoli-safi') ?>
        <br>
        <?php esc_html_e('Hopefully you are enjoying the plugin, and we would be very grateful if you could leave a review. It may not seem like much but it actually helps a lot!', 'wpjoli-safi'); ?>
    </p>

    <p>
        <a href="https://wordpress.org/support/plugin/smart-auto-featured-image/reviews/?rate=5#new-post" class="button button-primary" data-method="review" target="_blank"><?php esc_html_e('Leave a review', 'wpjoli-safi'); ?></a>
        <a href="" class="button button-secondary" data-method="remind" data-action="rating"><?php esc_html_e('Remind me later', 'wpjoli-safi'); ?></a>
        <a href="" class="button button-link" data-method="dismiss" data-action="rating"><?php esc_html_e('Dismiss', 'wpjoli-safi'); ?></a>
        <b><?php esc_html_e('Thank you :-)', 'wpjoli-safi'); ?></b>
    </p>
</div>