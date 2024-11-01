const { __ } = wp.i18n;
const { useSelect, useDispatch } = wp.data;
const { useState } = wp.element;
const apiFetch = wp.apiFetch;
const { Modal, Button, PanelRow, SelectControl } = wp.components;
import SafiEditor from '../../../SafiEditor';
import { AppContext } from '../../../AppContext';
import Utils from '../../../Utils';

const SAFI_FI_Settings_Panel = ( props ) => {

    const [isPreviewOpen, setIsPreviewOpen] = useState( false );
    const [isEditingTemplate, setIsEditingTemplate] = useState( false );
    const [isEditingCustomTemplate, setIsEditingCustomTemplate] = useState( false );

    const [previewData, setPreviewData] = useState( {} );
    // const [saving, setSaving] = useState( false );
    const [saved, setSaved] = useState( false );
    const [imageGenerated, setImageGenerated] = useState( false );
    const templates = props.templates;

    //_safi_template_id
    //_safi_generate_on_save
    const { metas } = useSelect( ( select ) => {
        return {
            metas: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
        };
    } );

    const { editPost } = useDispatch( 'core/editor', [metas._safi_template_id] );

    const currentPost = wp.data.select( 'core/editor' ).getCurrentPost();
    const currentPostId = currentPost.id;

    const selectedTemplateID = metas._safi_template_id || window.SAFI.options.defaultTemplate;
    // console.log( metas._safi_template );
    let customTemplate = null;
    if ( metas._safi_template ) {
        customTemplate = JSON.parse( metas._safi_template );
    }
    const handleDemoTemplateLoad = ( template ) => {
        // console.log( template );
        // customTemplate = template.template;  
        // setCurrentTemplate( template.template );
        // setActiveID( 0 ); // Set ID at 0 to make it be a new template
        const demoTemplate = {
            'id': currentPost.id,
            'name': "custom_" + currentPost.id,
            'content': template.template.content
        };

        editPost( {
            meta: {
                _safi_template: JSON.stringify( demoTemplate ),
                _safi_template_id: currentPost.id.toString(),
            }
        } );
        setIsEditingCustomTemplate( true );
        // setIsEditingTemplate( true );
    }
    const templateList = ( () => {
        // const templates = props.templates;

        const tplSelectValues = templates.map( ( item ) => {
            return {
                label: item.name,
                value: item.id
            };
        } );

        let combined = [
            { label: "None", value: "none" },
            // { label: __( "[Use global setting]", "wpjoli-safi" ), value: "inherit" },
            ...tplSelectValues
        ];

        if ( customTemplate !== null ) {
            combined = [
                { label: customTemplate.name, value: customTemplate.id },
                ...combined
            ]
        }

        return combined;
    } )();

    const [isFetching, setIsFetching] = useState( false );
    // const [previewDimCss, setPreviewDimCss] = useState( '' );

    const getTemplateByID = ( id ) => {
        // const templates = props.templates;
        const template = templates.find( ( item ) => {
            return item.id == id;
        } );

        return template || null;
    };

    const currentTemplate = getTemplateByID( selectedTemplateID );
    // console.log(currentTemplate?.content?.elements[0]?.icon);
    /**
     * Queries the WP REST API for a specific post
     * @param {*} route 
     * @param {*} postId 
     * @returns 
     */
    const restRequest = ( route, postId = null ) => {
        return new Promise( ( resolve, reject ) => {
            const post_str = postId !== null ? '?post=' + postId.toString() : '';

            apiFetch( { path: '/wp/v2/' + route + post_str } )
                .then( ( response ) => {
                    resolve( response );
                } )
                .catch( ( error ) => {
                    reject( error );
                } );
        } );
    };


    /**
     * Sends the image generated from the preview to the API to create a new image in the media library
     */
    const handleImageCreated = ( imageData ) => {

        if ( !imageData ) {
            return false;
        }
        setIsFetching( true );

        apiFetch( {
            path: '/safi/v1/featured-image/upload',
            method: 'POST',
            data: {
                imageData: imageData,
            },
        } ).then( ( res ) => {
            // console.log( res );
            if ( res.attachment_id > 0 )
                //Sets the new feautred image id
                editPost( { featured_media: res.attachment_id } );

            setIsFetching( false );
            setIsPreviewOpen( false );
            // setIsPreviewOpen( true );
        } ).catch( ( e ) => {
            // console.log( e );
            alert( __( 'An error occured, try again.', 'wpjoli-safi' ) );
            setIsFetching( false );
        } );

    };

    
    const handleImageURLCreated = ( data, html, options ) => {
        
    };

    

    const checkAbility = ( template ) => {
        if ( window.SAFI.options.can === false && Utils.isProTemplate( template ) ) {
            alert( __( "This template is a Pro template and cannot be used with your current plan.", "wpjoli-safi" ) );
            return false;
        }
        return true;
    }

    /**
     * Fetch a preview via the API
     */
    const requestPreview = async () => {

        //Current post data
        // const currentPost = wp.data.select( 'core/editor' ).getCurrentPost();
        // const currentPostId = currentPost.id;
        const currentPostAuthor = currentPost.author;

        //Prepare the request
        //1. Get the selected template
        // const selectedTemplateID = metas._safi_template_id;

        if ( selectedTemplateID === 'none' ) {
            return;
        }

        //Template
        let template;
        if ( customTemplate ) {
            template = customTemplate;
        } else {
            template = getTemplateByID( selectedTemplateID );
        }


        if ( !checkAbility( template ) ) {
            return false;
        }

        //activate spinner
        setIsFetching( true );

        //Get Author, tags & categories
        let authorRequest = null;
        let tagsRequest = null;
        let catRequest = null;

        if ( currentPostAuthor ) {
            authorRequest = restRequest( 'users/' + currentPostAuthor.toString() );
        }

        if ( currentPost.hasOwnProperty( 'tags' ) ) {
            tagsRequest = restRequest( 'tags', currentPostId );
        }

        if ( currentPost.hasOwnProperty( 'categories' ) ) {
            catRequest = restRequest( 'categories', currentPostId );
        }
        // const cat = await catRequest;

        let author, tags, categories;
        try {
            //Waiting for both tags and cat request to complete
            [author, tags, categories] = await Promise.all( [authorRequest, tagsRequest, catRequest] );
        }
        catch ( e ) {
            // console.log( e );
            alert( __( 'An error occured, try again.', 'wpjoli-safi' ) + "\nMessage :" + e.message );
            //stops spinner
            setIsFetching( false );
            return false;
        }

        setIsPreviewOpen( true );

        setPreviewData( {
            template: ( template ),
            data: {
                post: currentPost,
                author: author,
                date: currentPost.date,
                categories: categories,
                meta: currentPost.meta,
                tags: tags,
                title: currentPost.title,
                type: currentPost.type,
            }
        } );


        return;
    };


    /**
     * Save a user modified template into a custom meta
     * @param {*} templateData 
     */
    async function saveTemplate( templateData, imageData ) {
        // setSaving( true );
        const currentPost = wp.data.select( 'core/editor' ).getCurrentPost();

        const template = {
            'id': currentPost.id,
            'name': "custom_" + currentPost.id,
            'content': JSON.parse( templateData )
        }

        await editPost( {
            meta: {
                _safi_template: JSON.stringify( template ),
                _safi_thumb: imageData
            }
        } );

        setSaved( !saved );
    };

    const closeEditor = () => {
        if ( isEditingCustomTemplate ) {
            setIsEditingCustomTemplate( false );
            setIsEditingTemplate( false );
        } else {
            setIsEditingTemplate( false );
        }
        // setActiveID( -1 );
    };

    const deleteCustomTemplate = () => {
        if ( confirm( __( 'Are you sure you want to delete custom template for this post ? (this will not delete the base template)', 'wpjoli-safi' ) ) ) {
            editPost( {
                meta: {
                    _safi_template: null,
                    _safi_thumb: null,
                }
            } );
        }
        return;
    };

    const closeme = () => {
        // console.trace();
        setIsPreviewOpen( false );
    };

    const handleClosePreview = () => {
        setIsFetching( false );
        setIsPreviewOpen( false );
    };



    const getEditingTemplate = ( () => {

        if ( isEditingCustomTemplate ) {
            return customTemplate;
        } else if ( isEditingTemplate ) {
            return currentTemplate;
        }

        return null;
    } )();

    const getTemplateName = ( () => {

        if ( customTemplate ) {
            return customTemplate.content.canvas.templateName + "*";
        } else {
            return templateList.filter( item => item.value === selectedTemplateID ).map( item => item.label );
        }

        return null;
    } )();

    const getScreenshot = ( id ) => {
        if ( customTemplate && metas._safi_thumb ) {
            const customThumb = metas._safi_thumb;
            // console.log( customTemplate );
            return customThumb;
        }
        // return templatesScreenshots[id];

        const theTemplate = templates.find( item => item.id === id );

        if ( !theTemplate ) {
            return false;
        }

        const lastModified = theTemplate.last_modified || null;

        if ( SAFI.templates_screenshots[id] ) {
            return SAFI.templates_screenshots_url + SAFI.templates_screenshots[id] + ( lastModified ? "?" + lastModified : "" );
        }
        return false;

    }


    const thumbnail = getScreenshot( metas._safi_template_id );

    return (
        <div className="safi-fi-panel">

            <p className="safi-fi-panel-title">Smart Auto Featured Image</p>

            <SelectControl
                // label={__( 'Template', 'wpjoli-safi' )}
                // labelPosition="top"
                value={metas._safi_template_id || window.SAFI.options.defaultTemplate}
                onChange={( value ) => editPost( { meta: { _safi_template_id: value } } )}
                options={templateList}
                disabled={customTemplate}
            />
            {customTemplate &&
                <p className="safi-select-tip">{__( 'Delete custom template to enable selection', 'wpjoli-safi' )}</p>
            }

            {( getTemplateName.length > 0 && metas._safi_template_id !== 'none' ) &&
                <div className="safi-active-template">
                    {
                        getTemplateName.length > 0 &&
                        <div
                            className="safi-template"
                            // data-tpl-id={item.id}
                            // key={item.id}
                            // onClick={editTemplate}
                            onClick={() => customTemplate ? setIsEditingCustomTemplate( true ) : setIsEditingTemplate( true )}
                            style={thumbnail !== false ? {
                                backgroundImage: "url(" + thumbnail + ")",
                            } : null}
                        ></div>
                    }
                    <PanelRow>
                        <span>{getTemplateName}</span>
                        {customTemplate &&
                            <div className="safi-custom-template-controls">
                                <Button
                                    className="safi-panel-button"
                                    variant="tertiary"
                                    icon="edit"
                                    isSmall={true}
                                    // disabled={metas._safi_template_id === 'none'}
                                    onClick={() => setIsEditingCustomTemplate( true )}
                                    label={__( 'Edit custom template', 'wpjoli-safi' )}
                                    showTooltip={true}
                                // isBusy={isFetching}
                                ></Button>
                                <Button
                                    className="safi-panel-button"
                                    variant="tertiary"
                                    icon="trash"
                                    isSmall={true}
                                    // disabled={metas._safi_template_id === 'none'}
                                    onClick={deleteCustomTemplate}
                                    label={__( 'Delete custom template for this post only (this will not delete the base template)', 'wpjoli-safi' )}
                                    showTooltip={true}
                                // isBusy={isFetching}
                                ></Button>
                            </div>
                        }

                    </PanelRow>
                    {
                        !customTemplate &&
                        <Button
                            className="safi-panel-button"
                            variant="link"
                            // icon="edit"
                            isSmall={true}
                            disabled={metas._safi_template_id === 'none'}
                            onClick={() => setIsEditingTemplate( true )}
                        // isBusy={isFetching}
                        >{__( 'Customize template', 'wpjoli-safi' )}</Button>
                    }
                </div>
            }

            {getTemplateName.length > 0 &&
                <div className="flex justify-center">
                    <Button
                        className="safi-panel-button"
                        variant="primary"
                        icon="visibility"
                        // isSmall={true}
                        disabled={metas._safi_template_id === 'none'}
                        onClick={requestPreview}
                        isBusy={isFetching}
                    >{__( 'Preview', 'wpjoli-safi' )}</Button>
                </div>
            }

            {checkAbility( getEditingTemplate ) && ( isPreviewOpen || isEditingTemplate || isEditingCustomTemplate ) &&
                <Modal
                    title="Featured Image Preview"
                    onRequestClose={closeme}
                    isFullScreen={true}
                    className="safi-modal"
                    isDismissible={false}
                    shouldCloseOnClickOutside={false}
                >
                    <AppContext.Provider value={window.SAFI.options.can}>
                        <SafiEditor
                            context="gutenberg"
                            showEditor={isEditingTemplate || isEditingCustomTemplate}
                            template={getEditingTemplate}
                            templateId={selectedTemplateID}
                            onClose={closeEditor}
                            onSaveTemplate={saveTemplate}
                            // isSaving={saving}
                            hasSaved={saved}
                            options={window.SAFI.options}
                            previewData={previewData}
                            showPreview={isPreviewOpen}
                            onPreviewLoaded={() => setIsFetching( false )}
                            onPreviewClose={handleClosePreview}
                            onImageCreated={handleImageCreated}
                            onImageURLCreated={handleImageURLCreated}
                            onFeaturedImageGenerated={imageGenerated}
                            onChangeDemoTemplate={handleDemoTemplateLoad}
                        />
                    </AppContext.Provider>,
                </Modal>
            }

        </div>
    );
};

export default SAFI_FI_Settings_Panel;
