(function ($) {
    $(document).ready(function () {
        var wpjSafiNotice = $('.wpjoli-safi');

        if (!wpjSafiNotice.length) {
            return false;
        }

        $(document).on('click', '.notice.wpjoli-safi .button', function (e) {
            if (e.target.href == ""){
                e.preventDefault();
            }

            var notice = $(this).closest('.notice');

            $.ajax({
                url: safiAdminNotice.ajaxUrl,
                method: "post",
                data: {
                    nonce: safiAdminNotice.nonce,
                    action: 'wpjoli_safi_handle_notice',
                    handler: $(this).attr("data-action"),
                    method: $(this).attr("data-method")
                },
                // beforeSend: function() {

                // },
                success: function (response) {
                    $(notice).fadeOut('slow');
                }
            })
        });
    })
})(jQuery);