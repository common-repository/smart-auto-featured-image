// const { Component, render, useState, useEffect } = wp.element;
import BaseObject from "./BaseObject";


const ImageObject = ( { imageStyles, sourceType, sourceFrom, srcUrl, srcMedia, srcDynamic, srcTemplate, fit, ...props } ) => {
    const getSrc = ( () => {
        //default placeholder
        let src = null;
        // let src = SAFI.options.pluginUrl + "assets/admin/img/image-placeholder.png";

        switch ( sourceType ) {
            case 'url':
                if ( sourceFrom && sourceFrom === "unsplash" ) {
                    // src = srcUrl + "&q=90&w=" + ( props.width * 2 ).toString();
                    src = srcUrl + "&q=90&w=" + ( props.canvas?.width || "" ).toString();
                } else {
                    src = srcUrl;
                }
                break;
            case 'media':
                src = srcMedia;
                break;
            case 'dynamic':
                src = srcDynamic;
                break;
            case 'template':
                src = SAFI.options.pluginUrl + "assets/templates/" + srcTemplate;
                break;
        }
        // console.log( src );
        return src;
    } )();

    const getStyles = ( () => {
        if ( sourceType !== null ) {

            return {
                ...props.styles, ...{
                    // overflow: "hidden",
                    backgroundImage: "url(" + getSrc + ")",
                    backgroundPosition: "center center",
                    backgroundSize: fit,
                    backgroundRepeat: "no-repeat",
                    // backgroundOrigin: "border-box",
                }
            };
        }
        else {

            return {
                backgroundColor: "gray",
                backgroundImage: "url(" + SAFI.options.pluginUrl + "assets/admin/img/image-placeholder.png)",
                backgroundPosition: "center center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                // backgroundOrigin: "border-box",
            };
        }
    } )();

    // const getImageStyles = ( () => {
    //     // return fit ? fit : null;
    //     let imgStyles = {
    //         PointerEvents: "none",
    //     };

    //     if ( fit !== null ) {
    //         imgStyles.objectFit = fit;
    //     }

    //     return imgStyles;
    // } )();

    return (
        <BaseObject
            {...props}
            tag="div"
            styles={getStyles}
        >
            {/* {
                getSrc &&
                <img className="safi-object-child" src={getSrc} alt="" style={{ ...imageStyles, ...getImageStyles }} />
            } */}
            {/* {
                !getSrc &&
                <div>
                    <input type="button" value="Media library..." onClick={ } />
                    <input type="button" value="Unsplash..." />
                </div>
            } */}

        </BaseObject>
    );
};

export default ImageObject;