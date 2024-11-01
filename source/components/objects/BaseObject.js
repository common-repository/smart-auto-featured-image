const { __ } = wp.i18n;
import Utils from "../../Utils";
import { cssToJS } from "../../CssUtils";
import { AppContext } from "../../AppContext";

const { useContext, useState, useEffect } = wp.element;


const BaseObject = ( { type, label, width, height, x, y, angle, margin, padding, border, borderRadius, isSelected, locked, hidden, tag, styles, zIndex, opacity, classes, customCss, onResizingStart, onResizingEnd, onRotateStart, onRotateEnd, onCornerStart, onCornerEnd, isHighlighted, highlightPadding, onActionEnd, baseInfoHelper, ...props } ) => {
    const [isMouseOver, setIsMouseOver] = useState( false );
    const [isRotating, setIsRotating] = useState( false );
    const [isCornering, setIsCornering] = useState( false );

    const isPro = useContext( AppContext );
    const Tag = tag;

    const theAngle = angle ? parseFloat( angle ) : 0;


    

    const getMargin = () => {
        const top = ( margin?.top ) ? margin.top : 0;
        const right = ( margin?.right ) ? margin.right : 0;
        const bottom = ( margin?.bottom ) ? margin.bottom : 0;
        const left = ( margin?.left ) ? margin.left : 0;

        return top + "px " + right + "px " + bottom + "px " + left + "px";
    };

    const getPadding = () => {
        const top = ( padding?.top ) ? padding.top : 0;
        const right = ( padding?.right ) ? padding.right : 0;
        const bottom = ( padding?.bottom ) ? padding.bottom : 0;
        const left = ( padding?.left ) ? padding.left : 0;

        return top + "px " + right + "px " + bottom + "px " + left + "px";
    };

    

    const getBaseStyles = ( () => {

        let baseStyles = {
            position: "absolute",
            userSelect: "none",
            width: ( width !== null ? width : 100 ) + "px",
            height: ( height !== null ? height : 100 ) + "px",
            top: y || 0 + "px",
            left: x || 0 + "px",
            borderWidth: getBorder() || null,
            borderStyle: "solid",
            borderRadius: getBorderRadius() || null,
            margin: getMargin() || null,
            padding: getPadding() || null,
            zIndex: zIndex || null,
            opacity: opacity,
            boxSizing: "border-box",
        };

        baseStyles["transform"] = "rotate(" + theAngle + "deg)";

        return baseStyles;
    } )();

    const getClasses = ( () => {
        let className = "safi-object safi-object-" + type;

        if ( isSelected === true ) {
            className += " --selected";
        }

        if ( locked === true ) {
            className += " --locked";
        }

        if ( hidden === true ) {
            className += " --hidden";
        }

        if ( highlightPadding === true ) {
            className += " --show-padding";
        }

        return className + ( props.className != null ? " " + props.className : "" ) + ( classes != null ? " " + classes : "" );
    } )();

    const handleResizeMouseDown = ( e, corner ) => {
        //prevent mouse click from going up to the actual object, we wawnt to keep in the handles only
        e.stopPropagation();
        e.preventDefault();

        const data = {
            corner: corner,
            x: parseFloat( x ),
            y: parseFloat( y ),
            width: parseFloat( width ),
            height: parseFloat( height ),
        }
        onResizingStart( e, data );
    };


    

    // const handleResizeMouseMove = ( e ) => {
    //     setIsResizing( false );
    // };

    // const handleResizeMouseUp = ( e, corner ) => {
    //     onResizingEnd( corner );
    // };
    const getComputedStyles = () => {
        return { ...getBaseStyles, ...styles, ...getCustomCss }
    };

    const getLayerSizePosition = () => {

        return {
            // left: -border?.left || 0,
            // top: -border?.top || 0,
            width: width + 4,
            height: height + 4,
            left: x - 2 || -2,
            top: y - 2 || -2,
            width: "calc(" + width.toString() + "px + 4px / var(--safi-zoom))",
            height: "calc(" + height.toString() + "px + 4px / var(--safi-zoom))",
            left: "calc(" + x.toString() + "px - 2px / var(--safi-zoom))" || "calc(-2px / var(--safi-zoom))",
            top: "calc(" + y.toString() + "px - 2px / var(--safi-zoom))" || "calc(-2px / var(--safi-zoom))",
            transform: "rotate(" + theAngle + "deg)",
        };
    };

    
    
    return (
        <div
            onMouseEnter={() => setIsMouseOver( true )}
            onMouseLeave={() => setIsMouseOver( false )}
        // onMouseUp={handleCornerMouseUp}
        >
            <Tag
                className={getClasses}
                style={getComputedStyles()}
                data-id={props.id}
            // onMouseDown={handleMouseDown}
            >
                {props.children}
            </Tag>
            {( isMouseOver || isHighlighted ) && !isSelected && type !== "container" && //prevent container from being resized
                // {isMouseOver && //prevent container from being resized
                <div className="safi-highlight" style={getLayerSizePosition()}>
                </div>
            }
            {!locked && isSelected && type !== "container" && //prevent container from being resized
                // {isMouseOver && //prevent container from being resized
                <div className="safi-handles" style={getLayerSizePosition()}>
                    <div className="safi-handle --handle-top-left"
                        onMouseDown={e => handleResizeMouseDown( e, 'top-left' )}
                    ></div>
                    <div className="safi-handle --handle-top"
                        onMouseDown={e => handleResizeMouseDown( e, 'top' )}
                    ></div>
                    <div className="safi-handle --handle-top-right"
                        onMouseDown={e => handleResizeMouseDown( e, 'top-right' )}
                    ></div>
                    <div className="safi-handle --handle-right"
                        onMouseDown={e => handleResizeMouseDown( e, 'right' )}
                    ></div>
                    <div className="safi-handle --handle-bottom-right"
                        onMouseDown={e => handleResizeMouseDown( e, 'bottom-right' )}
                    ></div>
                    <div className="safi-handle --handle-bottom"
                        onMouseDown={e => handleResizeMouseDown( e, 'bottom' )}
                    ></div>
                    <div className="safi-handle --handle-bottom-left"
                        onMouseDown={e => handleResizeMouseDown( e, 'bottom-left' )}
                    ></div>
                    <div className="safi-handle --handle-left"
                        onMouseDown={e => handleResizeMouseDown( e, 'left' )}
                    ></div>
                    {}
                </div>
            }
            {
                locked && isSelected && type !== "container" &&
                <div className="safi-handles" style={getLayerSizePosition()}>

                </div>
            }
        </div >
    );
};

export default BaseObject;