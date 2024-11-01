const { __ } = wp.i18n;
const { useState, useEffect, useContext, useRef } = wp.element;

const apiFetch = wp.apiFetch;
import { AppContext } from '../AppContext';
import FontAwesomeIconPicker from './controls/FontAwesomeIconPicker';
import ImagePicker from './controls/ImagePicker';
import SvgPicker from './controls/SvgPicker';
import { Editor } from '@tinymce/tinymce-react';


const Preview = ( { imageQuality, previewData, showPreview, onPreviewLoaded, onPreviewClose, onImageCreated, onImageURLCreated, featuredImageGenerated, faIcons, ...props } ) => {

    const isPro = useContext( AppContext );
    const [isFetching, setIsFetching] = useState( false );
    const [iframeLoaded, setIframeLoaded] = useState( false );
    const [isPreviewOpen, setIsPreviewOpen] = useState( false );
    const [htmlContent, setHtmlContent] = useState( null );
    const [dynamicContent, setDynamicContent] = useState( [] );
    // const [updatedDynamicContent, setUpdatedDynamicContent] = useState( [] );
    const [previewContent, setPreviewContent] = useState( null );
    const [previewDimensions, setPreviewDimensions] = useState( {} );
    const [previewDimCss, setPreviewDimCss] = useState( '' );
    const [imageStatus, setImageStatus] = useState( 0 );
    const [templateEl, setTemplateEl] = useState( previewData?.template || null );

    const [currentImageFormat, setCurrentImageFormat] = useState( window.SAFI.options.imageFormat );
    const [currentImageQuality, setCurrentImageQuality] = useState( window.SAFI.options.imageQuality );
    const [currentImageHD, setCurrentImageHD] = useState( window.SAFI.options.imageHD );
    const [creditsUsage, setCreditsUsage] = useState( window.SAFI.credits?.count || 0 );

    const hdDisabled = ( () => previewData?.template?.content?.canvas?.width > 2500 || previewData?.template?.content?.canvas?.height > 2500 )();

    //Add custom colors:
    //https://www.tiny.cloud/docs-4x/plugins/textcolor/
    // const tinyMceOptions = {
    //     tinymce: {
    //         inline: true,
    //         // wpautop: false,
    //         // force_br_newlines : true,
    //         forced_root_block: false, //prevents paragraphs
    //         // height: 100,
    //         // theme: 'modern',
    //         // skin: 'lightgray',
    //         // language: 'en',
    //         // placeholder: 'Dynamic text...',
    //         // relative_urls: false,
    //         // remove_script_host: false,
    //         // convert_urls: false,
    //         // browser_spellcheck: false,
    //         // fix_list_elements: true,
    //         // entities: '38,amp,60,lt,62,gt',
    //         // entity_encoding: 'raw',
    //         // keep_styles: false,
    //         // paste_webkit_styles: 'font-weight font-style color',
    //         // preview_styles: 'font-family font-size font-weight font-style text-decoration text-transform',
    //         // tabfocus_elements: ':prev,:next',
    //         // plugins: 'charmap,hr,media,paste,tabfocus,textcolor,fullscreen,wordpress,wpeditimage,wpgallery,wplink,wpdialogs,wpview,lists',
    //         plugins: 'textcolor',
    //         resize: 'vertical',
    //         menubar: false,
    //         // indent: false,
    //         // toolbar1: 'formatselect,bold,italic,strikethrough,bullist,numlist,blockquote,hr,alignleft,aligncenter,alignright,link,unlink,wp_more,spellchecker,fullscreen,wp_adv',
    //         toolbar1: 'forecolor | bold italic underline strikethrough',
    //         // toolbar3: 'style-p style-h1 style-h2 style-h3 style-pre style-code',
    //         // toolbar4: '',
    //         body_class: 'safi-dynamic-fields',
    //         // wpeditimage_disable_captions: false,
    //         // wpeditimage_html5_captions: true,

    //         setup: ( editor ) => {
    //             // editor.on( "blur", ( e ) => {
    //             //     // console.log( e );
    //             //     // handleDynTextChange( e );
    //             // } );
    //             editor.on( "change", ( e ) => {
    //                 // console.log( e );
    //                 handleDynTextChange( e );
    //             } );

    //         },
    //     },
    //     // quicktags: false,
    //     // mediaButtons: false,

    // };

    useEffect( () => {

        if ( showPreview === true ) {
            requestPreview( true );
        }
        // console.log('requestPreview first');

        if ( hdDisabled ) {
            setCurrentImageHD( false );
        }

        // return () => {
        // setTemplateEl(null);

        // const elements = templateEl?.content?.elements;
        // if ( !elements ) {
        //     return;
        // }
        // const dynamicFields = elements.filter( item => item.dynamic && item.dynamic === true && item.type === "text" );

        // if ( !dynamicFields.length ) {
        //     return;
        // }

        // dynamicFields.map( element => {
        //     if ( !tinymce ) {
        //         return;
        //     }
        //     // tinymce.execCommand('mceRemoveControl', true, '#safi-tmce-' + element.id);
        //     // console.log( tinymce.remove( '#safi-tmce-' + element.id ) );
        //     const theMce = tinymce.get( 'safi-tmce-' + element.id );

        //     if ( !theMce ) {
        //         return;
        //     }
        //     theMce.remove();
        // } )
        // }

    }, [] ); //

    // useEffect( () => {

    //   console.log(previewData);

    // }, [previewData] ); //

    useEffect( () => {

        if ( showPreview === true ) {
            // requestPreview();
        } else if ( showPreview === false ) {
            setIsPreviewOpen( false );
        }

    }, [showPreview] ); //

    //Trigger when an image has been generated
    useEffect( () => {
        setIsFetching( false );
    }, [featuredImageGenerated] ); //

    //Trigger when the HD switch is triggered
    useEffect( () => {
        if ( showPreview === true ) {
            requestPreview();
        }
    }, [currentImageHD] ); //

    //Trigger when the template changed
    useEffect( () => {
        if ( showPreview === true && templateEl ) {
            requestPreview();
        }
    }, [templateEl] ); //

    const handleIframeLoad = () => {
        setIframeLoaded( true );
        onPreviewLoaded( true );
    };

    const handleClosePreview = () => {
        setIsPreviewOpen( false );
        setIframeLoaded( false );
        onPreviewClose( true );
    };

    /**
     * Fetch a preview via the API
     */
    const generateFeaturedImage = async () => {
        setIsFetching( true );
        setImageStatus( 1 );

        // const pixelRatio = window.devicePixelRatio;
        const pixelRatio = 1;
        // const canvasEl = document.getElementById( "safi-preview-content" ).contentWindow.document.body;
        // const canvasEl = document.querySelector("#safi-preview-content > iframe").contentWindow.document.body;
        let canvasEl = document.getElementById( "iframe-preview" );

        let vCanvas = document.createElement( "canvas" );
        vCanvas.width = previewDimensions?.width * pixelRatio;
        vCanvas.height = previewDimensions?.height * pixelRatio;

        //Removes the preview class before generating the image
        let root = canvasEl.contentWindow.document.body.querySelector( '.root-container' );
        root.classList.remove( "rcp" );

        canvasEl.contentWindow.document.body.append( vCanvas );

        const theWidth = isPro ? vCanvas.width : Math.min( vCanvas.width, 1200 )
        const theHeight = isPro ? vCanvas.height : Math.min( vCanvas.height, 800 )
        // components-sandbox
        const h2cOptions = {
            useCORS: true,
            width: theWidth,
            height: theHeight,
            canvas: vCanvas,
            scale: pixelRatio,
        };

        // console.log( h2cOptions );

        html2canvas( canvasEl.contentWindow.document.body, h2cOptions ).then( function ( canvas ) {
            var canvasResized = canvas;
            // var imageData = canvasResized.toDataURL( "image/png" );
            var imageData = canvasResized.toDataURL( "image/jpeg", imageQuality );

            setImageStatus( 2 );
            onImageCreated( imageData );
            setIsFetching( true );

        } );

    };

    

    const requestPreview = async ( start = false ) => {

        apiFetch( {
            path: '/safi/v1/featured-image/preview',
            method: 'POST',
            data: {
                template: JSON.stringify( templateEl ),
                // template: JSON.stringify( previewData.template ),
                data: previewData.data,
                options: {
                    hd: currentImageHD
                }
            },
        } ).then( ( res ) => {

            const width = templateEl.content.canvas.width.toString();
            const height = templateEl.content.canvas.height.toString();

            const targetMaxWidth = 500;
            const scale = targetMaxWidth / templateEl.content.canvas.width;

            setPreviewDimensions( {
                width: width,
                height: height,
            } )
            // const style = `style="width: ${width}px; height: ${height}px;"`;
            const style = {
                width: width + 'px',
                height: height + 'px',
                transform: "scale(" + scale.toString() + ")",
            };
            setPreviewDimCss( style );

            setHtmlContent( res.html );
            if ( start === true ) {
                setDynamicContent( res.dynamicFields );
            }
            //  else {
            //     setUpdatedDynamicContent( res.dynamicFields );
            // }

            const transformScale = 1 / scale;
            let finalHtml = res.html.replace( "</style><!--SAFIEOS-->", `.root-container.rcp::after {
                content: '';
                position: absolute;
                z-index: 999999999999;
                background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogICAgPGRlZnM+CiAgICAgICAgPHBhdHRlcm4gaWQ9InRleHRzdHJpcGUiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI1NjAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoLTQ1KSI+IDx0ZXh0IHk9IjgwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjIwIiBmaWxsPSIjMDAwMDAwMjAiPndwam9saS5jb20gLSBzbWFydCBhdXRvIGZlYXR1cmVkIGltYWdlIC0gcHJldmlldyAtIDwvdGV4dD4gPC9wYXR0ZXJuPgogICAgICAgIDxwYXR0ZXJuIGlkPSJ0ZXh0c3RyaXBlMiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjU2MCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgtNDUpIj4gPHRleHQgeT0iMzAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNmZmZmZmYyMCI+d3Bqb2xpLmNvbSAtIHNtYXJ0IGF1dG8gZmVhdHVyZWQgaW1hZ2UgLSBwcmV2aWV3IC0gPC90ZXh0PiA8L3BhdHRlcm4+CiAgICA8L2RlZnM+CiAgICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3RleHRzdHJpcGUpIiAvPgogICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN0ZXh0c3RyaXBlMikiIC8+Cjwvc3ZnPg==");
                width: ` + width + `px !important;
                height: ` + height + `px !important;
                transform: scale(` + transformScale.toString() + `);
              }</style><!--SAFIEOS-->`);

            finalHtml = finalHtml.replace( 'class="root-container', 'class="root-container rcp' );

            //HTML content with no preview css
            //Echoes HTML preview
            setPreviewContent( finalHtml );

            //Opens the modal
            setIsPreviewOpen( true );
        } ).catch( ( e ) => {
            console.error( 'An error occured', e );
            alert( __( 'An error occured, try again.', 'wpjoli-safi' ) );
            setIsPreviewOpen( false );
            setIsFetching( false );
            setIframeLoaded( false );
            onPreviewClose( true );
        } );
    }

    let generateCallback = generateFeaturedImage;

    

    const creditsUsageString = ( () => {
        

        return "";
    } )();

    const handleHDChange = () => {
        setCurrentImageHD( !currentImageHD );
    };

    const handleIconSelect = ( elementId, prefix, icon ) => {
        //newvalue
        const dataChanged = {
            iconPrefix: prefix,
            icon: icon,
        };

        overrideElementData( elementId, dataChanged );
        // propDataChanged( dataChanged );
    }

    // const handleDynTextChange = ( e ) => {

    //     const value = ( e.target.value );

    //     if ( !value ) {
    //         return;
    //     }

    //     const dataType = e.target.dataset.type;
    //     const dataId = e.target.dataset.id;
    //     let newData;

    //     if ( dataType === 'text' ) {




    //         newData = {
    //             text: value,
    //         };

    //         overrideElementData( dataId, newData );
    //     }
    //     // console.log( dataType, editedTemplate );
    // }

    // const mceInit = ( evt, editor, editorRef ) => {
    //     // console.log('mceInit', evt, editor);
    //     editorRef.current = editor
    // }

    const handleDynTextChangeMce = ( value, editor, elemId, elemType ) => {
        // console.log( value, editor, elemId, elemType );
        // if (value === undefined) {
        //     return;
        // }

        const content = value;

        let newData;

        if ( elemType === 'text' ) {
            // console.log( dynamicContent );
            if ( typeof dynamicContent !== 'object' || dynamicContent.length === 0 ) {
                return;
            }

            let editedDynContent = JSON.parse( JSON.stringify( dynamicContent ) );
            // console.log( editedDynContent );
            // console.log( typeof editedDynContent[elemId]["content"] );

            editedDynContent[elemId]["content"] = value;

            // if (editedDynContent.length){
            setDynamicContent( editedDynContent );
            // }

            newData = {
                text: content,
            };
            overrideElementData( elemId, newData );
        }
        // console.log( dataType, editedTemplate );
    }

    const createDynamicFieldDOM = ( item ) => {

        if ( !item ) {
            return;
        }

        let classes = [
            'safi-preview-dynamic-field',
            '--field-' + item.type,
        ];

        const editorRef = useRef( null );

        const index = previewData?.template.content.elements.findIndex( ( el ) => {
            return el.id == item.id;
        } );
        // console.log(item, item.type === 'conditional' || item.type === 'columns')
        return (
            <div
                key={item.id}
                id={"#safi-mce-" + item.id}
                className={classes.filter( item => { return item !== '' } ).join( ' ' )}
                data-layer-id={item.id}
            >
                <label htmlFor={item.id}>{item.label}</label>
                {item.type === 'text' &&
                    <div>

                        <Editor
                            // data-type={item.type}
                            // data-id={item.id}
                            id={"safi-text-editor-" + item.id}
                            key={item.id}
                            onInit={( evt, editor ) => editorRef.current = editor}
                            initialValue={previewData?.template.content.elements[index].text}
                            // initialValue={"sida"}
                            // value={item.text}
                            value={dynamicContent[item.id]?.content}
                            init={{
                                menubar: false,
                                inline: true,
                                forced_root_block: false, //prevents paragraphs
                                height: 150,
                                plugins: ['textcolor'],
                                toolbar: 'forecolor | bold italic underline strikethrough',
                                body_class: 'safi-dynamic-fields',
                                // event_root: "#safi-text-editor-" + item.id,
                                // toolbar: 'undo redo | forecolor | bold italic underline strikethrough',
                                // content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                            onEditorChange={( value, editor ) => handleDynTextChangeMce( value, editor, item.id, item.type )}
                        />

                    </div>
                }
                {item.type === 'image' &&
                    <ImagePicker
                        element={item}
                        canvas={templateEl?.content?.canvas}
                        propDataChanged={data => handleDynImageChanged( item.id, data )}
                    />
                }
                {item.type === 'svg' &&
                    <SvgPicker
                        element={item}
                        propDataChanged={data => handleDynImageChanged( item.id, data )}
                    />
                }
                {item.type === 'icon' &&
                    <FontAwesomeIconPicker
                        element={item}
                        // propDataChanged={data => handleDynImageChanged( item.id, data )}
                        icons={faIcons}
                        onSelectIcon={( prefix, icon ) => handleIconSelect( item.id, prefix, icon )}
                    />
                }
            </div>
        );
    }

    const getDynamicFields = ( () => {
        const elements = templateEl?.content?.elements;
        if ( !elements ) {
            return null;
        }


        const dynamicFields = elements.filter( item => item.dynamic && item.dynamic === true );
        // console.log( dynamicFields );
        // return dynamicFields;

        if ( !dynamicFields.length ) {
            return null;
        }

        return dynamicFields.map( element => {

            if ( !element ) {
                return;
            }
            const field = createDynamicFieldDOM( element );
            // element.type === "text" && wp.editor.initialize( 'safi-tmce-' + element.id, tinyMceOptions );
            // element.type === "text" && tinymce.init( {
            //     selector: '#safi-tmce-' + element.id,
            //     ...tinyMceOptions.tinymce
            // } );
            return field;
        } )
    } )();

    // const onchangemce = ( inst ) => {
    //     console.log( inst.getBody().innerHTML );
    // }

    const handleDynImageChanged = ( elementId, data ) => {

        // console.log( elementId, data );

        overrideElementData( elementId, data );
        // console.log( dataType, editedTemplate );
    }

    const overrideElementData = ( elementId, data ) => {

        // let editedTemplate = { ...templateEl };
        // Deep clone using JSON.parse and stringify
        let editedTemplate = JSON.parse( JSON.stringify( templateEl ) );

        const index = editedTemplate.content.elements.findIndex( ( item ) => {
            return item.id == elementId;
        } );

        if ( index === -1 ) {
            return;
        }

        const element = editedTemplate.content.elements[index];

        //Merge new data with current element data
        const newElement = { ...element, ...data };
        editedTemplate.content.elements[index] = newElement;

        setTemplateEl( editedTemplate );
    };

    return (
        isPreviewOpen &&
        <div id="safi-preview-wrap">
            <div id="safi-preview-header" >
                {
                    isPro &&
                    <span id="safi-credits-usage">{__( "Credits usage this month: ", "wpjoli-safi" )}<strong style={{ color: 'white' }}>{creditsUsageString}</strong></span>
                }
                <button className="safi-tb-btn" onClick={handleClosePreview} disabled={isFetching}>{__( "Close", "wpjoli-safi" )}</button>
            </div>
            <div id="safi-preview-body">
                {getDynamicFields !== null &&
                    <div id="safi-preview-dynamic-fields" className="safi-dynamic-fields">
                        <div className="safi-preview-dynamic-fields--body --safi-scroll-thin">
                            <div className="safi-panel-name">Dynamic fields</div>
                            <div className="safi-preview-dynamic-fields--list">
                                {getDynamicFields}
                            </div>
                        </div>
                    </div>
                }
                <div id="safi-preview-main" className="flex flex-column">
                    <div id="safi-preview-content" className={iframeLoaded ? "" : " --hidden"} style={previewDimCss} >
                        <iframe id="iframe-preview"
                            srcdoc={previewContent}
                            frameborder="0"
                            width={previewDimensions.width}
                            height={previewDimensions.height}
                            onLoad={handleIframeLoad}
                        />
                    </div>
                    <div id="safi-preview-footer" >
                        {}
                        <div>
                            <button
                                className="safi-tb-btn safi-btn-primary safi-btn-lg"
                                onClick={generateCallback}
                                disabled={isFetching}
                                style={{ marginBottom: "20px" }}
                            >{__( "Generate featured image", "wpjoli-safi" )}</button>
                            <p>{__( 'Previews are scaled-down. Watermark will be removed in the final image.', 'wpjoli-safi' )}</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className={"safi-overlay" + ( ( isFetching ) ? " --showing" : "" )}>
                {imageStatus === 1 &&
                    <div>
                        <p>{__( "Please wait while the image is being generated.", "wpjoli-safi" )}</p>
                        <p>{__( "This may take a few seconds.", "wpjoli-safi" )}</p>
                    </div>
                }
                {imageStatus === 2 &&
                    <div>
                        <p>{__( "The featured image is being downloaded.", "wpjoli-safi" )}</p>
                        <p>{__( "Please wait...", "wpjoli-safi" )}</p>
                    </div>
                }
                <span className="safi-loader"></span>
            </div>
        </div>
    );
};

export default Preview;