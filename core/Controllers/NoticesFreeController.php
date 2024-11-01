<?php

/**
 * @package safi
 */

namespace WPJoli\SAFI\Controllers;


class NoticesFreeController
{

    const WPREPO_PLUGIN_URL = 'https://wordpress.org/support/plugin/smart-auto-featured-image/reviews/?rate=5#new-post';

    private $can_display_rating;
    private $can_display_gopro;
    private $options;


    public function __construct()
    {
        $this->options = SAFI()->requestService(OptionsController::class);
    }

    public function initNotices()
    {
        
        // $this->options->set('gopro_time', time() - WEEK_IN_SECONDS);
        // $this->options->set('rating_time', time() - WEEK_IN_SECONDS);
        if ($this->canDisplayRating()) {
            $this->showRatingNotice();
        }
        if ($this->canDisplayGoPro()) {
            $this->showGoProNotice();
        }
    }

    public function showRatingNotice()
    {

        add_action('admin_notices', [$this, 'makeRatingNotice']);
    }

    public function showGoProNotice()
    {

        add_action('admin_notices', [$this, 'makeGoProNotice']);
    }

    public function makeRatingNotice()
    {
        return SAFI()->render(['notices' => 'rating']);
    }

    public function makeGoProNotice()
    {
        $base_url = 'https://wpjoli.com/smart-auto-featured-image/';
        $params = '?utm_source=' . safi_get_host_url() . '&utm_medium=admin-notice';

        $data = [
            'pro_url' => $base_url . $params,
            'pro_url_v' => $base_url . '#visibilities' . $params,
        ];
        return SAFI()->render(['notices' => 'go-pro'], $data);
    }

    public function canDisplayRating()
    {

        if ($this->can_display_rating === null) {

            if (current_user_can('manage_options')) {

                $time = $this->options->get('rating_time');

                if (!$time) {

                    $this->options->set('rating_time', time() + DAY_IN_SECONDS);
                    $this->can_display_rating = false;
                } else {

                    $this->can_display_rating = time() > $time;
                }
            } else {

                $this->can_display_rating = false;
            }
        }

        return $this->can_display_rating;
    }

    public function canDisplayGoPro()
    {

        if ($this->can_display_gopro === null) {

            if (current_user_can('manage_options')) {

                $time = $this->options->get('gopro_time');

                if (!$time) {

                    $this->options->set('gopro_time', time() + WEEK_IN_SECONDS);
                    $this->can_display_gopro = false;
                } else {

                    $this->can_display_gopro = time() > $time;
                }
            } else {

                $this->can_display_gopro = false;
            }
        }

        return $this->can_display_gopro;
    }

    public function safiHandleNotice()
    {
        check_ajax_referer( 'safi_admin_notices', 'nonce' );

        if (isset($_POST)) {

            if (sanitize_key(safi_sanitize_var($_POST['handler'])) == 'gopro') {
                if (safi_sanitize_notice_method(sanitize_key(safi_sanitize_var($_POST['method']))) == 'dismiss') {
                    $this->dismissNotice('gopro');
                    wp_send_json_success();
                }
            } else if (sanitize_key((safi_sanitize_var($_POST['handler']))) == 'rating') {

                if (safi_sanitize_notice_method(sanitize_key(safi_sanitize_var($_POST['method']))) == 'review') {
                    $this->clickedReview();
                    wp_send_json_success();
                } else if (safi_sanitize_notice_method(sanitize_key(safi_sanitize_var($_POST['method']))) == 'remind') {
                    $this->remindLater();
                    wp_send_json_success();
                } else if (safi_sanitize_notice_method(sanitize_key(safi_sanitize_var($_POST['method']))) == 'dismiss') {
                    $this->dismissNotice('rating');
                    wp_send_json_success();
                }
            }
        }
    }

    public function clickedReview()
    {
        $this->options->set('rating_time', time() + YEAR_IN_SECONDS * 10);
    }

    public function remindLater()
    {
        $this->options->set('rating_time', time() + WEEK_IN_SECONDS);
    }

    public function dismissNotice($notice_id)
    {
        $this->options->set($notice_id .'_time', time() + YEAR_IN_SECONDS * 3);
    }

}
