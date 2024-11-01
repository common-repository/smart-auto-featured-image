const { __ } = wp.i18n;
const { useState, useEffect, useContext, useRef } = wp.element;
import { AppContext } from "../../AppContext";
import Icon from '../Icon';
import UnsplashBrowser from "./UnsplashBrowser";


const ImagePicker = ( { element, canvas, propDataChanged, ...props } ) => {

    const isPro = useContext( AppContext );
    const [currentElement, setCurrentElement] = useState( element );
    const [showModalUnsplash, setShowModalUnsplash] = useState( false );
    const [showUrlInput, setShowUrlInput] = useState( false );

    const mediaUploaderRef = useRef( null );

    useEffect( () => {
        setCurrentElement( element );
    }, [element] );

    const getMediaName = ( url ) => {
        if ( !url ) {
            return "";
        }
        var filename = url.substring( url.lastIndexOf( '/' ) + 1 );
        return filename;
    };

    const mediaPop = () => {

        var frame = window.safiWpMedia;
        //   var frame2 = wp.media( {
        //     title: 'Select or Upload an image',
        //     button: {
        //         text: 'Use this image'
        //     },
        //     multiple: false  // Set to true to allow multiple files to be selected
        // } );
        // console.log( frame.on );
        // console.log( frame, frame2 );
        // console.log( frame.on( 'select' ) );
        // // if ( frame ) {
        //   frame.open();
        //   return;
        // }

        const onSelect = () => {

            // Get media attachment details from the frame state
            var attachment = frame.state().get( 'selection' ).first().toJSON();
            // console.log( attachment );

            if ( attachment ) {

                if ( attachment.type !== 'image' ) {
                    alert( 'Selected file must be an image !' );
                    return false;
                }

                //sets the media URL back to the parent
                const data = {
                    sourceType: "media",
                    srcMedia: attachment.url,
                    originalHeight: attachment.height,
                    originalWidth: attachment.width,
                    // height: attachment.height,
                    // width: attachment.width,
                }

                // that.setState( data );


                propDataChanged( data );

                frame.off( 'select', onSelect );
                // frame.remove();
                // frame.detach();
            }
        }

        // When an image is selected in the media frame...
        frame.on( 'select', onSelect );

        // Finally, open the modal on click
        frame.open();

        return false;
    };

    const renderImageSource = () => {

        if ( currentElement.sourceType === 'media' ) {
            return (
                <div>
                    {currentElement.srcMedia &&
                        <img
                            src={currentElement.srcMedia}
                            className="safi-image-picker-thumb"
                            title={getMediaName( currentElement.srcMedia ) || ''}
                        />
                    }
                </div>
            );
        }

        else if ( currentElement.sourceType === 'url' ) {
            let src = null;
            if ( currentElement.sourceFrom && currentElement.sourceFrom === "unsplash" ) {
                // src = srcUrl + "&q=90&w=" + ( props.width * 2 ).toString();
                src = currentElement.srcUrl + "&q=90&w=" + ( canvas?.width || "" ).toString();
            } else {
                src = currentElement.srcUrl;
            }
            return (
                <div>
                    {src &&
                        <img
                            src={src}
                            className="safi-image-picker-thumb"
                            title={getMediaName( currentElement.srcUrl ) || ''}
                        />
                    }
                </div>
            );
        }
    };

    const isValidUrl = ( urlString ) => {
        try {
            return Boolean( new URL( urlString ) );
        }
        catch ( e ) {
            return false;
        }
    }

    const handleUrlInput = ( e ) => {
        if ( e.keyCode === 13 ) { //enter
            const url = e.target.value;
            if ( isValidUrl( url ) ) {

                const dataChanged = {
                    sourceType: "url",
                    srcUrl: url
                };

                propDataChanged( dataChanged );
                setShowUrlInput( false );
            } else {
                alert( "Invalid URL" );
            }
        }
    };
    const handleSelectUnsplashImage = ( attachment ) => {

        // const unsplashSrc = isPro === true ? attachment.src : attachment.src + window.atob("JnE9NTAmdz0=");
        // console.log( attachment );
        const data = {
            sourceType: "url",
            sourceFrom: "unsplash",
            // srcUrl: unsplashSrc,
            srcUrl: attachment.src,
            // height: attachment.height,
            // width: attachment.width,
            originalHeight: attachment.originalHeight,
            originalWidth: attachment.originalWidth,
        }

        // that.setState( data );

        propDataChanged( data );
        setShowModalUnsplash( false );

    }

    const resetImageSource = ( e ) => {
        //newvalue
        const dataChanged = {
            sourceType: null
        };

        propDataChanged( dataChanged );
    }

    const getClasses = ( () => {
        let classes = ['safi-image-selector'];
        if ( currentElement.sourceType !== null ) {
            classes.push( "--image-selected" );
        }
        return classes.join( " " );
    } )();

    return (
        <div id="safi-image-selector" className={getClasses}>
            {currentElement.sourceType === null &&
                <p>{__("Select a source", "wpjoli-safi")}</p>
            }
            {currentElement.sourceType === null &&
                <div className="safi-image-sources flex justify-center">
                    <div>
                        <div className="uploader">
                            {/* <input id="_unique_name_button" className="button" name="_unique_name_button" type="text" value="Upload"
        onClick={mediaPop} /> */}
                            <button
                                ref={mediaUploaderRef}
                                id="safi-media-library-open"
                                className="button safi-tb-btn"
                                value="Upload"
                                onClick={mediaPop}
                            >{__("Media Library", "wpjoli-safi")}</button>
                        </div>
                    </div>
                    <div>
                        <button
                            id="btn-browse-unsplash"
                            className={"button safi-tb-btn"}
                            // className={"button" + ( isPro === false ? " --pro" : "" )}
                            value="Browse Unsplash"
                            onClick={() => setShowModalUnsplash( !showModalUnsplash )}
                        // disabled={isPro === false}
                        >Unsplash</button>
                        <UnsplashBrowser
                            isVisible={showModalUnsplash}
                            onSelect={handleSelectUnsplashImage}
                            canvas={canvas}
                            onClose={() => setShowModalUnsplash( false )}
                        />
                        {/* {
                  isPro && compUnsplashBrowser
                } */}
                    </div>
                    <div>
                        <button
                            id="btn-image-from-url"
                            className={"button safi-tb-btn" + ( isPro === false ? " --pro" : "" )}
                            value="Image from URL"
                            onClick={() => setShowUrlInput( !showUrlInput )}
                            disabled={isPro === false}
                        >URL</button>
                    </div>
                </div>
            }
            {showUrlInput &&
                <input type="text" name="" id="safi-img-url" placeholder={"https://..."} onKeyDown={e => handleUrlInput( e )} autoFocus />
            }
            {/* {currentElement.sourceType !== null &&
                <p>Selected image:</p>
            } */}
            <div className="safi-image-name">
                {renderImageSource()}
                {currentElement.sourceType !== null &&
                    <div className="flex flex-1 flex-center">
                        <button className="button safi-tb-btn" value="Change image" onClick={resetImageSource} >Change image</button>
                    </div>
                }
            </div>
        </div>
    );
};

export default ImagePicker;