( function ( $ ) {
    $( document ).ready( function () {


        // if($(this).closest('form').data('changed')) {
        //     //do something
        //  }

        var safiRoot = $( '.safi-wrap' );

        if ( !safiRoot.length ) {
            return false;
        }

        $( '.joli-color-picker' ).wpColorPicker( {
            'change': function ( event, ui ) {
                $( '.joli-info-text' ).addClass( 'open' );
            }
        } );

        $( '.joli-pro .wp-picker-container button' ).each( function ( index, value ) {
            $( this ).attr( 'disabled', true );
        } );

        $( '.joli-do-submit' ).on( 'click', function ( e ) {
            // $('#safi-settings').submit();
            document.getElementById( "safi-settings" ).dispatchEvent( new Event( 'submit' ) );
        } );

        var joliNavTabs = $( '.safi-wrap .joli-nav' );
        var joliRows = $( '#tab-settings table.form-table tr' );

        var hash = window.location.hash;

        if ( hash.length > 0 ) {
            var currentTabID = 'tab-' + hash.substr( 1 );
            setActiveTab( currentTabID );
        } else {
            var firstTabID = $( joliNavTabs ).children().first().attr( 'id' );
            setActiveTab( firstTabID );
        }

        var scrolling = false;
        const wpbar = $( '#wpadminbar' );
        var wpbarHeight = $( wpbar ).outerHeight( true );
        const header = $( '.joli-header' );
        var headerPosition = $( header ).offset().top;
        var position = $( document ).scrollTop();

        const joliSidebar = $( '.joli-gopro-notice' );

        $( window ).on( 'scroll', function () {
            scrolling = true;
        } );
        $( window ).on( 'resize', function () {
            headerPosition = $( header ).offset().top;
            wpbarHeight = $( wpbar ).outerHeight( true );
        } );

        setInterval( function () {
            if ( scrolling ) {
                scrolling = false;

                updateLayout();
            }
        }, 50 );


        function updateLayout( e ) {
            position = $( document ).scrollTop();

            if ( position + wpbarHeight > headerPosition ) {
                $( header ).css( 'position', 'fixed' );
                $( header ).css( 'top', wpbarHeight + 'px' );

                // if ($(joliSidebar).length){
                //     $( joliSidebar ).css( 'position', 'fixed' );
                //     $( joliSidebar ).css( 'top', wpbarHeight + 'px' );
                // }
            } else {
                $( header ).css( 'position', '' );
                $( header ).css( 'top', '' );

                // if ($(joliSidebar).length){
                //     $( joliSidebar ).css( 'position', '' );
                //     $( joliSidebar ).css( 'top', '' );
                // }
            }

        }
        $( '.joli-nav-item' ).on( 'click', function ( e ) {
            // e.preventDefault();
            // hash = $(this).data("anchor");
            // window.location.hash = hash;

            var id = $( this ).attr( 'id' );
            setActiveTab( id );
            // console.log(id);
        } );

        function setActiveTab( id ) {
            //Nav-tabs
            $( joliNavTabs ).find( '.joli-nav-item' ).removeClass( 'nav-tab-active' );
            $( joliNavTabs ).find( '#' + id ).addClass( 'nav-tab-active' );

            //Tab-contents
            $( joliRows ).removeClass( 'active' );
            $( '#tab-settings table.form-table tr.' + id ).addClass( 'active' );
            // $(joliRows).removeClass('active');
            // $('#tab-settings table.form-table tr.' + id).addClass('active');
            //joli-section-desc
            // var sectionsTable = $( '#tab-settings h2' ).next('table');
            var sectionsTable = $( '#tab-settings table.form-table' );
            var sectionsDesc = $( '.joli-section-desc' );
            var sections = $( '#tab-settings h2' );

            var tabPanes = $( '.joli-tab-pane' );
            // var sectionsDesc = $('#tab-settings h2').next('.joli-section-desc');

            $( sectionsDesc ).hide();
            $( sectionsTable ).hide();
            $( sections ).hide();
            $( tabPanes ).hide();
            // $(sectionsDesc).hide();

            var activeSections = sections.filter( function ( index, item ) {

                return $( this ).nextAll( 'table' ).first().find( 'tr' ).hasClass( 'active' );
            } );

            var activeSectionsDesc = $( activeSections ).map( function ( index, item ) {

                var desc = $( this ).next( '.joli-section-desc' )
                if ( $( desc ).length ) {

                    return $( desc )[ 0 ];
                }
                return null;
            } );


            var activeSectionsTables = sectionsTable.filter( function () {
                return $( this ).find( 'tr' ).hasClass( 'active' );
            } );

            var activeTabPane = tabPanes.filter( function () {
                return $( this ).attr( 'data-key' ) == id;
            }, id );

            $( activeSectionsTables ).show();
            $( activeSections ).show();
            $( activeSectionsDesc ).show();
            $( activeTabPane ).show();
            // $(activeSectionsDesc).fadeIn();

            if ( id == 'tab-general' ) {
                $( '.joli-quickstart-notice' ).show();
            } else {
                $( '.joli-quickstart-notice' ).hide();
            }


            if ( position + wpbarHeight > headerPosition ) {
                $( "html, body" ).animate( {
                    scrollTop: headerPosition - wpbarHeight - 15
                }, 600, function () {}( document ) );
            }
        }

        function updateChildrenSections( childrenSections, isChecked ) {
            if ( typeof childrenSections === 'undefined' ) {
                return;
            }

            const childrenSectionsList = childrenSections.split( ',' );
            for ( const item of childrenSectionsList ) {
                var itemEl = $( '.joli-section--' + item );
                if ( isChecked === 0 ) {
                    $( itemEl ).addClass( 'hidden' );
                } else {
                    $( itemEl ).removeClass( 'hidden' );
                }
                // console.log( itemEl );
            }
        }

        function updateChildren( children, isChecked ) {
            if ( typeof children === 'undefined' ) {
                return;
            }
            const childrenList = children.split( ',' );
            for ( const item of childrenList ) {
                var itemEl = $( '.joli-field--' + item );
                if ( isChecked === 0 ) {
                    $( itemEl ).addClass( 'hidden' );
                } else {
                    $( itemEl ).removeClass( 'hidden' );
                }

            }
        }


        var updateSwitch = function ( el ) {
            var thisId = $( el ).attr( 'data-linkedfield' );
            var hidden = $( '#check_' + thisId );

            const isChecked = $( el ).prop( 'checked' ) ? 1 : 0;
            $( hidden ).val( isChecked );
            var deactivates = $( el ).attr( 'data-deactivates' );

            const isFree = $( el ).closest( 'tr' ).hasClass( 'joli-pro' );

            // if (typeof hidden !== 'undefined' ) {
            // }

            if ( !isFree ) {

                var childrenSections = $( el ).attr( 'data-children-sections' );
                // if ( childrenSections === '' ) {
                //     return;
                // }

                updateChildrenSections( childrenSections, isChecked );

                //-----------------------------

                var children = $( el ).attr( 'data-children' );
                if ( children === '' ) {
                    return;
                }
                updateChildren( children, isChecked );
            }
        }

        $( 'input:checkbox.joli-checkbox' ).on( 'change', function () {
            updateSwitch( this );

        } );



        $( document ).on( 'change', '.joli-content textarea, .joli-content input, .joli-content select', function () {
            $( '.joli-info-text' ).addClass( 'open' );
        } );

        $( document ).on( 'change', '.joli-content select', function () {
            var selector = '.joli-admin-image-' + $( this ).attr( 'data-selector' );

            if ( $( selector ).length > 0 ) {
                var selectedItem = $( this ).find( ':selected' ).attr( 'data-media' );
                $( selector ).addClass( 'hidden' );

                var mediaToShow = '#' + $( this ).attr( 'data-selector' ) + '-' + selectedItem;
                $( mediaToShow ).removeClass( 'hidden' );
            }
        } );




        $( document ).on( 'click', '#safi_reset_settings', function ( e ) {
            // e.preventDefault();

            var alertMessage = $( this ).data( 'prompt' );

            var proceed = confirm( alertMessage );

            if ( !proceed ) {
                e.preventDefault();
                return false;
            }

        } );

        $( document ).on( 'click', '.joli-post-type-check', function ( e ) {

            const activePT = $( '.joli-post-type-check' ).map( function ( index, element ) {
                return $( element ).is( ':checked' ) ? $( element ).attr( 'data-post-type' ) : null;
            } ).toArray().filter( function ( index, element ) {
                return element !== null;
            } );

            $.ajax( {
                url: safiAdmin.ajaxUrl,
                method: "post",
                data: {
                    nonce: safiAdmin.nonce,
                    action: 'wpjoli_safi_update_active_post_type_setting',
                    active_post_type: activePT,
                },
                // beforeSend: function() {

                // },
                success: function ( response ) {

                }
            } )
        } );
        /** unit input handling */
        $( document ).on( 'change', 'input.joli-css-unit-input, select.joli-css-unit-values', function () {
            // $(document).on('change', '.joli-css-unit-input', function () {
            var el = $( this ).closest( '.joli-css-unit-field' );
            var hiddenID = $( this ).attr( 'data-linkedfield' );
            var hiddenEl = $( '#joli-css-unit_' + hiddenID );
            var inputEl = $( el ).find( 'input.joli-css-unit-input' );
            var unitEl = $( el ).find( 'select.joli-css-unit-values' );

            var actualVal = '';
            if ( $( inputEl ).val() !== '' ) {
                actualVal = $( inputEl ).val() + '|' + $( unitEl ).val();
            }

            // if (typeof hidden !== 'undefined' ) {
            $( hiddenEl ).val( actualVal ? actualVal : '' )
            // }

        } );

        $( '.joli-checkboxes-item > input[type=checkbox]' ).on( 'change', function ( e ) {

            const multipleValue = $( '.joli-checkboxes-item > input[type=checkbox]' ).map( function ( index, element ) {
                return $( element ).is( ':checked' ) ? $( element ).val() : null;
            } ).toArray().filter( function ( index, element ) {
                return element !== null;
            } ).join( ',' );

            // var stringified = 
            // if (multipleValue.length){

            // }

            const targetID = $( this ).data( 'linked-id' );
            const target = $( '#' + targetID );

            if ( !target.length ) {
                return false;
            }

            $( target ).val( multipleValue );
        } );

        $( '.joli-dimensions-lock' ).on( 'click', function ( e ) {
            $( this ).toggleClass( '--joli-is-locked' );

        } );

        $( '.joli-dimensions-clear' ).on( 'click', function ( e ) {
            e.preventDefault();
            const fields = $( this ).closest( '.joli-dimensions-control' ).find( '.joli-dimension-input' );
            $( fields ).val( '' );
        } );

        $( '.joli-dimension-input' ).on( 'input', function ( e ) {
            const lockEl = $( this ).closest( '.joli-dimensions-control' ).find( '.joli-dimensions-lock' );

            if ( !lockEl.length ) {
                return false;
            }
            const isLocked = $( lockEl ).hasClass( '--joli-is-locked' );

            if ( isLocked === true ) {

                const siblings = $( this ).closest( 'ul' ).find( '.joli-dimension-input' );
                if ( !siblings.length ) {
                    return false;
                }

                const currentValue = $( this ).val();

                $( siblings ).each( function () {
                    $( this ).val( currentValue );
                }, currentValue );
            }
            // console.log( isLocked );

        } );


        $( '#safi-settings' ).on( 'submit', function ( e ) {
            // return;
            e.preventDefault();


            const wrap = $( '.safi-wrap' );
            const spinner = $( '#safi-save-spinner' );
            const alertEl = $( '#safi-save-alert' );

            $( wrap ).addClass( 'joli-is-saving' );
            $( spinner ).addClass( 'is-active' );

            const data = $( this ).serialize();
            // console.log( data );
            // return;
            jQuery.post( 'options.php', data )
                .done( function () {
                    $( wrap ).removeClass( 'joli-is-saving' );
                    $( spinner ).removeClass( 'is-active' );
                    $( alertEl ).removeClass( 'joli-is-hidden' );
                    $( alertEl ).show();
                    setTimeout( function () {
                        $( alertEl ).fadeOut( 1500, function () {
                            $( alertEl ).addClass( 'joli-is-hidden' );
                        } );
                    }, 1500 );
                    $( '.joli-info-text' ).removeClass( 'open' );
                } )
                .fail( function () {
                    alert( 'Error while saving, please reload the page and try saving again.' );
                } )
                .always( function () {
                    $( wrap ).removeClass( 'joli-is-saving' );
                    $( spinner ).removeClass( 'is-active' );
                } );
        } );

        var selectControls = $( '.joli-content select[data-has-custom-values=1]' );
        // console.log( $( selectControls ) );
        if ( selectControls.length ) {
            $( selectControls ).each( function ( index, value ) {
                const src = $( this ).attr( 'data-custom-values-src' );
                const selectedValue = $( this ).attr( 'data-selected-value' );
                // console.log( window[ src ] );
                const customData = window[ src ];

                if ( !customData.length ) {
                    return;
                }
                const currentSelect = this;

                $( customData ).each( function ( index, value ) {
                    var name = this.id;
                    var author = '';
                    var info = this.hasOwnProperty( 'info' ) ? this.info : null;

                    if ( info !== null ) {
                        name = info.hasOwnProperty( 'name' ) ? info.name : name;
                        author = info.hasOwnProperty( 'author' ) ? info.author : '';
                    }

                    var customThemeID = null;
                    if ( selectedValue.startsWith( 'custom-' ) ) {
                        customThemeID = selectedValue.substr( 'custom-'.length );
                    }
                    $( currentSelect ).append( $( '<option>', {
                        value: 'custom-' + this.id,
                        text: name + ' (by ' + author + ')',
                        selected: customThemeID === this.id
                    } ) );

                } );
            } );

        }

        // console.log($( 'input:checkbox.joli-checkbox' ));
        $( 'input:checkbox.joli-checkbox' ).each( function ( item, value ) {
            updateSwitch( this );
        } );

        $( '#safi-import-export' ).on( 'click', function ( e ) {
            $( '#joli-export-import-wrap' ).toggle();
        } );

        $( '#joli-export-import-close' ).on( 'click', function ( e ) {
            $( '#joli-export-import-wrap' ).hide();
        } );

        $( '.joli-field-info' ).on( 'click', function ( e ) {
            var text = $( this ).next().text();
            navigator.clipboard.writeText( text );
        } );

        $( '#safi-export-settings' ).on( 'click', function ( e ) {
            e.preventDefault();

            const activePT = typeof safi_active_post_type !== 'undefined' ? safi_active_post_type : '';

            // console.log( activePT );

            $.ajax( {
                url: safiAdmin.ajaxUrl,
                method: "post",
                data: {
                    nonce: safiAdmin.nonce,
                    action: 'wpjoli_safi_export_user_settings',
                    active_post_type: activePT,
                },
                // beforeSend: function() {

                // },
                success: function ( response ) {
                    // console.log(response.data.settings);
                    const filename = activePT === '' ? 'smart-auto-featured-image-settings-global' : 'smart-auto-featured-image-settings-' + activePT;
                    safiDownloadSettings( filename + '.json', response.data.settings );
                }
            } )
        } );

        $( '#safi-import-settings' ).on( 'click', function ( e ) {
            e.preventDefault();

            const activePT = typeof safi_active_post_type !== 'undefined' ? safi_active_post_type : '';


            const dataSrc = document.getElementById( 'safi-import-settings-file' );
            const fileData = dataSrc.files[ 0 ];
            // console.log( fileData );

            if ( typeof fileData === 'undefined' ) {
                alert( 'Please select a file.' );
                return false;
            }

            const fileReader = new FileReader();
            fileReader.onload = function ( progressEvent ) {
                var stringData = fileReader.result;
                // console.log( stringData );

                $.ajax( {
                    url: safiAdmin.ajaxUrl,
                    method: "post",
                    data: {
                        nonce: safiAdmin.nonce,
                        action: 'wpjoli_safi_import_user_settings',
                        active_post_type: activePT,
                        file: stringData,
                    },
                    // beforeSend: function() {

                    // },
                    success: function ( response ) {
                        if ( response.data.updated == true ) {
                            alert( 'Settings imported successfully. Page will reload.' )
                            window.location.reload();
                        } else {
                            alert( 'Settings were not updated.' )
                        }
                        // console.log( response.data );
                    }
                } )
            }

            fileReader.readAsText( fileData );
            fileReader.addEventListener( 'error', () => {
                console.error( `Error occurred reading file: ${fileData.name}` );
            } );
            // $.get($(fileData).name, function(data) {
            //     console.log(data);
            //  }, 'text');

        } );

        function safiDownloadSettings( filename, text ) {
            var element = document.createElement( 'a' );
            element.setAttribute( 'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( text ) );
            element.setAttribute( 'download', filename );

            element.style.display = 'none';
            document.body.appendChild( element );

            element.click();

            document.body.removeChild( element );
        }



    } );

} )( jQuery );

( function ( $ ) {
    $( document ).ready( function () {

        
    } );

} )( jQuery );