const { __ } = wp.i18n;
const { useState, useEffect, useContext } = wp.element;
import DrawingObject from "./objects/DrawingObject";
import Text from "./objects/Text";
import ImageObject from "./objects/ImageObject";
import Rect from "./objects/Rect";
import Circle from "./objects/Circle";

import { AppContext } from "../AppContext";



const SafiCanvas = ( { canvas, elements, tree, globalStyles, activeTool, showGrid, toolChanged, currentKey, selectedElement, selectedElementID, onCreateElement, onSelectElement, onChangeElement, onColumnsAdded, onTriggerSnapshot, onConditionalAdded, infoHelper, onDeselect, highlightedLayer } ) => {
    const isPro = useContext( AppContext );

    const [isDrawing, setIsDrawing] = useState( false );
    const [drawingRect, setDrawingRect] = useState( { x: 0, y: 0, width: 0, height: 0 } );
    const [drawingInitialPosition, setDrawingInitialPosition] = useState( { x: 0, y: 0 } );
    const [rerender, setRerender] = useState( false );

    // const mouseActionStarted = useRef( false );

    const [isPointerInCanvas, setIsPointerInCanvas] = useState( false );
    const [isMoving, setIsMoving] = useState( false );
    const [mouseDownPosition, setMouseDownPosition] = useState( false );
    const [movingInitialPosition, setMovingInitialPosition] = useState( { x: 0, y: 0 } );
    const [elementInitialPosition, setElementInitialPosition] = useState( { x: 0, y: 0 } );
    // const [movingDelta, setMovingDelta] = useState( { x: 0, y: 0 } );
    // const [layerComponents, setLayerComponents] = useState( [] );
    const [isElementResizing, setIsElementResizing] = useState( false );
    const [elementResizingInitialPosition, setElementResizingInitialPosition] = useState( { x: 0, y: 0 } );

    

    const [elementInitialData, setElementInitialData] = useState( { corner: null, x: 0, y: 0, width: 0, height: 0, angle: 0 } );

    const [columnLayoutSelecting, setColumnLayoutSelecting] = useState( false );
    // const [snapGridSpacing, setSnapGridSpacing] = useState( 10 ); // grid size
    let snapGridSpacing = canvas?.gridSize || 10; // grid size

    let layerComponents;
    let mousePosition;
    let newPosition;
    let dataResizing;

    const addHistory = true;

    useEffect( () => {
        snapGridSpacing = canvas?.gridSize || 10; // grid size
        // console.log( canvas );
    }, [canvas] ); //run this code when the value of template changes

    useEffect( () => {
        setRerender( !rerender );
    }, [elements] ); //run this code when the value of template changes

    

    useEffect( () => {
        //Current key pressed passed from the SafiEditor;
        if ( typeof currentKey !== 'undefined' && currentKey !== null ) {
            processKeyUp( currentKey );
        }

    }, [currentKey] );


    let elementIndex = 0;

    const getMousePositionNoSnap = ( e ) => {
        const canvasEl = document.getElementById( "safi-canvas" );

        const zoomFactor = canvas?.zoom || 1;
        var rect = canvasEl.getBoundingClientRect();
        var x = Math.round( ( e.clientX - rect.left ) / zoomFactor ); //x position within the element.
        var y = Math.round( ( e.clientY - rect.top ) / zoomFactor );  //y position within the element.

        let processedX = x;
        let processedY = y;

        return { x: processedX, y: processedY };
    };

    const getMousePosition = ( e ) => {
        const canvasEl = document.getElementById( "safi-canvas" );

        const zoomFactor = canvas?.zoom || 1;
        var rect = canvasEl.getBoundingClientRect();
        var x = Math.round( ( e.clientX - rect.left ) / zoomFactor ); //x position within the element.
        var y = Math.round( ( e.clientY - rect.top ) / zoomFactor );  //y position within the element.

        let processedX = x;
        let processedY = y;

        // //Keep a square ratio
        // if ( e.shiftKey === true ) {
        //     processedX = Math.min( x, y );
        //     processedY = Math.min( x, y );
        // }

        //Snap to grid
        if ( e.ctrlKey === true || e.metaKey === true ) {
            processedX = snapToGrid( processedX );
            processedY = snapToGrid( processedY );

            // console.log(processedX, canvas.width, x % snapGridSpacing);
            // if (processedX > canvas.width && x % snapGridSpacing < snapGridSpacing && x < canvas.width + snapGridSpacing){

            //snap to edges
            if ( x < canvas.width + 10 && x > canvas.width - 10 ) {
                processedX = canvas.width;
            } else if ( x < 10 && x > - 10 ) {
                processedX = 0;
            }
            if ( y < canvas.height + 10 && y > canvas.height - 10 ) {
                processedY = canvas.height;
            } else if ( y < 10 && y > - 10 ) {
                processedY = 0;
            }

            //snap to center
            if ( x < canvas.width / 2 + 10 && x > canvas.width / 2 - 10 ) {
                processedX = canvas.width / 2;
            }
            if ( y < canvas.height / 2 + 10 && y > canvas.height / 2 - 10 ) {
                processedY = canvas.height / 2;
            }
        }
        // console.log( processedX, processedY );

        return { x: processedX, y: processedY };
    };

    const calculateAspectRatioFit = ( srcWidth, srcHeight, maxWidth, maxHeight ) => {
        var ratio = Math.min( maxWidth / srcWidth, maxHeight / srcHeight );

        return {
            width: srcWidth * ratio,
            height: srcHeight * ratio
        };
    }

    const snapToGrid = ( val ) => {
        return snapGridSpacing * Math.round( val / snapGridSpacing );
    };

    const snapToGridX = ( x ) => {
        //snap to center
        if ( x < canvas.width / 2 + 10 && x > canvas.width / 2 - 10 ) {
            return canvas.width / 2;
        }
        return snapGridSpacing * Math.round( x / snapGridSpacing );
    };

    const snapToGridY = ( y ) => {
        //snap to center
        if ( y < canvas.height / 2 + 10 && y > canvas.height / 2 - 10 ) {
            return canvas.height / 2;
        }
        return snapGridSpacing * Math.round( y / snapGridSpacing );
    };

    // const handleClick = ( e ) => {
    //     //Deselect element
    //     if ( e.target.id === 'safi-canvas-wrap' ) {
    //         onSelectElement( null );
    //     }

    //     // if ( activeTool === "select" ) {
    //     //     const mousePos = getMousePosition( e );

    //     //     if ( e.target.classList.contains( 'safi-object' ) ) {

    //     //         const id = e.target.dataset.id;

    //     //         onSelectElement( id );

    //     //         // if (typeof layerComponents == "object"){let compEl = layerComponents.find( element => element.key === id );
    //     //         //     console.log(compEl);
    //     //         //     compEl.props.isSelected = true;
    //     //         //     setRerender( !rerender );
    //     //         // }
    //     //     } else {
    //     //         //Deselect element
    //     //         onSelectElement( null );
    //     //     }
    //     //     console.log( e, mousePos );
    //     // }
    // };


    const findById = ( data, id ) => {
        function iter( a ) {
            if ( a.props?.id === id ) {
                result = a;
                return true;
            }
            return Array.isArray( a.props.children ) && a.props.children.some( iter );
        }

        var result;
        data.some( iter );
        return result
    }

    const handleMouseDown = ( e ) => {
        // console.warn( 'MOUSEDOWN', e );
        // console.warn( e.target, e.target.type );

        if ( e.button !== 0 ) {
            return;
        }

        //Prevent moving text while editing
        if ( e.target.type === "textarea" ) {
            return;
        }
        // e.preventDefault();

        //Lets know to the mouseup event that the click originates from the canvas
        setIsPointerInCanvas( true );

        // mouseActionStarted.current = true;
        const mousePos = getMousePosition( e );
        setMouseDownPosition( mousePos );

        //Prepares to move object
        if ( activeTool === "conditional" ) {
            // onConditionalAdded();
            return;
        }

        if ( activeTool === "select" ) {

            const targetId = getIdFromMouseEvent( e, true ); // true will keep the selected element active even if it is under other layers
            // console.log( e, targetId );
            if ( targetId === selectedElementID && targetId.indexOf( "container" ) === -1 ) {

                // console.log( layerComponents );
                if ( typeof layerComponents === "object" ) {
                    // let targetEl = layerComponents.find( element => element.key === targetId );
                    let targetEl = findById( layerComponents, targetId );

                    if ( targetEl.props.locked === true ) {
                        return false;
                    }
                    //Start moving
                    setIsMoving( true );
                    setMovingInitialPosition( mousePos );
                    // console.log( targetEl, targetEl.props);
                    // console.log( targetEl2 );
                    // console.log( "ta grand mere" );

                    setElementInitialPosition( {
                        x: targetEl.props.x,
                        y: targetEl.props.y,
                    } )

                    // console.log( targetId, targetId.indexOf( "container" ), isMoving, movingInitialPosition, elementInitialPosition );
                    onTriggerSnapshot();
                }
            }
        }

        if ( activeTool !== "select" && activeTool !== "columns" ) {
            setIsDrawing( true );

            //Snap to grid
            // if ( e.altKey === true ) {
            //     setDrawingInitialPosition( {
            //         x: snapToGrid( mousePos.x, snapGridSpacing ),
            //         y: snapToGrid( mousePos.y, snapGridSpacing ),
            //     } );
            // } else {
            //store normal mouse pos
            setDrawingInitialPosition( mousePos );
            // }


            setDrawingRect( {
                x: mousePos.x,
                y: mousePos.y,
                width: 0,
                height: 0
            } );
            onTriggerSnapshot();
        }

    };

    const handleMouseMove = ( e ) => {

        //Prevent moving text while editing
        if ( e.target.type === "textarea" ) {
            return;
        }

        // console.log( e );
        // if (e.buttons === 0) {
        //     return false;
        // }
        // console.log( mouseActionStarted );
        mousePosition = getMousePosition( e );

        //Moving an object
        if ( activeTool === "select" && isMoving === true ) {
            //Prevents the bug of if create a new layer while holding shift before starting to draw, it would trigger a pointercancel event.
            e.preventDefault();
            const mousePos = getMousePositionNoSnap( e );
            const deltaMouseX = mousePos.x - movingInitialPosition.x;
            const deltaMouseY = mousePos.y - movingInitialPosition.y;

            newPosition = {
                x: elementInitialPosition.x + deltaMouseX,
                y: elementInitialPosition.y + deltaMouseY,
            }
            // console.log( mousePos, deltaMouseX, deltaMouseY, newPosition );

            infoHelper( __( "Hold Ctrl to snap to grid / Hold Shift to move along a fixed axis", "wpjoli-safi" ) );

            //Lock axis
            if ( e.shiftKey === true ) {
                infoHelper( __( "Hold Ctrl to snap to grid", "wpjoli-safi" ) );
                //lock vertival axis
                if ( Math.abs( deltaMouseY ) > Math.abs( deltaMouseX ) ) {
                    newPosition = {
                        x: elementInitialPosition.x,
                        y: elementInitialPosition.y + deltaMouseY,
                    }
                } else {
                    newPosition = {
                        x: elementInitialPosition.x + deltaMouseX,
                        y: elementInitialPosition.y,
                    }
                }
            }

            if ( e.ctrlKey === true || e.metaKey === true ) {
                newPosition = {
                    x: snapToGridX( newPosition.x ),
                    y: snapToGridY( newPosition.y ),
                }
            }


            // setMovingDelta( {
            //     x: deltaX,
            //     y: deltaY,
            // } );

            onChangeElement( selectedElementID, newPosition );
        }

        //Drawing an object
        else if ( activeTool !== "select" && isDrawing === true ) {
            const mousePos = getMousePosition( e );
            let width = mousePos.x - drawingInitialPosition.x;
            let height = mousePos.y - drawingInitialPosition.y;

            let processedWidth = width;
            let processedHeight = height;

            infoHelper( __( "Hold Shift to keep an even ratio", "wpjoli-safi" ) );

            //Keep a square ratio
            if ( e.shiftKey === true ) {
                processedWidth = Math.min( width, height );
                processedHeight = Math.min( width, height );
            }

            setDrawingRect( {
                x: drawingInitialPosition.x,
                y: drawingInitialPosition.y,
                width: processedWidth || width,
                height: processedHeight || height
            } );
        }

        

        //Resizing an object
        else if ( isElementResizing === true && elementResizingInitialPosition ) {
            const mousePos = getMousePosition( e );
            // console.log( mousePos );

            //BUG de resize while holding shift
            // let deltaMouseX = mousePos.x - elementResizingInitialPosition.x;
            // let deltaMouseY = mousePos.y - elementResizingInitialPosition.y;
            let deltaMouseXRightHandle = mousePosition.x - ( elementInitialData.width + elementInitialData.x );
            let deltaMouseYBottomHandle = mousePosition.y - ( elementInitialData.height + elementInitialData.y );
            let deltaMouseXLeftHandle = mousePosition.x - ( elementInitialData.x );
            let deltaMouseYTopHandle = mousePosition.y - ( elementInitialData.y );

            let deltaX = 0;
            let deltaY = 0;

            infoHelper( __( "Hold Ctrl to snap to grid / Hold Alt to resize from center.", "wpjoli-safi" ) );
            if ( e.ctrlKey || e.metaKey ) {
                deltaX = elementInitialData.x % ( snapGridSpacing );
                deltaY = elementInitialData.y % ( snapGridSpacing );
            }

            // const snappedValue = ( value, delta = 0 ) => {
            //     if ( e.ctrlKey || e.metaKey ) {
            //         return snapToGrid( value ) - delta;
            //     }
            //     return value;
            // }

            const axisDelta = ( value ) => {
                if ( e.altKey === true ) {
                    return value;
                }
                return 0;
            }

            const lengthDelta = ( value ) => {
                if ( e.altKey === true ) {
                    return value * 2;
                }
                return value;
            }

            if ( elementInitialData.corner === "top-left" ) {
                dataResizing = {
                    x: mousePosition.x,
                    y: mousePosition.y,
                    height: elementInitialData.height - lengthDelta( deltaMouseYTopHandle ),
                    width: elementInitialData.width - lengthDelta( deltaMouseXLeftHandle ),

                }
            } else if ( elementInitialData.corner === "top" ) {
                dataResizing = {
                    y: mousePosition.y,
                    height: elementInitialData.height - lengthDelta( deltaMouseYTopHandle ),
                }
            } else if ( elementInitialData.corner === "top-right" ) {
                dataResizing = {
                    y: mousePosition.y,
                    x: elementInitialData.x - axisDelta( deltaMouseXRightHandle ),
                    width: elementInitialData.width + lengthDelta( deltaMouseXRightHandle ),
                    height: elementInitialData.height - lengthDelta( deltaMouseYTopHandle ),
                }
            } else if ( elementInitialData.corner === "right" ) {
                dataResizing = {
                    x: elementInitialData.x - axisDelta( deltaMouseXRightHandle ),
                    width: elementInitialData.width + lengthDelta( deltaMouseXRightHandle ),
                }
            } else if ( elementInitialData.corner === "bottom-right" ) {

                infoHelper( __( "Hold Ctrl to snap to grid / Hold Shift to maintain aspect ratio / Hold Alt to resize from center", "wpjoli-safi" ) );
                if ( e.shiftKey === true ) {
                    const ratioLengths = calculateAspectRatioFit(
                        elementInitialData.width,
                        elementInitialData.height,
                        ( elementInitialData.width + lengthDelta( deltaMouseXRightHandle ) ),
                        ( elementInitialData.height + lengthDelta( deltaMouseYBottomHandle ) ),
                    );

                    const cdX = e.altKey === true ? ( ratioLengths.width - elementInitialData.width ) / 2 : axisDelta( deltaMouseXRightHandle );
                    const cdY = e.altKey === true ? ( ratioLengths.height - elementInitialData.height ) / 2 : axisDelta( deltaMouseYBottomHandle );
                    dataResizing = {
                        // x: elementInitialData.x - ( ratioLengths.width - elementInitialData.width ) / 2,
                        // y: elementInitialData.y - ( ratioLengths.height - elementInitialData.height ) / 2,
                        // x: elementInitialData.x - axisDelta( deltaMouseXRightHandle ),
                        // y: elementInitialData.y - axisDelta( deltaMouseYBottomHandle ),
                        x: elementInitialData.x - cdX,
                        y: elementInitialData.y - cdY,
                        width: ratioLengths.width,
                        height: ratioLengths.height,
                    }
                } else {
                    dataResizing = {
                        x: elementInitialData.x - axisDelta( deltaMouseXRightHandle ),
                        y: elementInitialData.y - axisDelta( deltaMouseYBottomHandle ),
                        width: elementInitialData.width + lengthDelta( deltaMouseXRightHandle ),
                        height: elementInitialData.height + lengthDelta( deltaMouseYBottomHandle ),
                    };

                }
                // console.log( ratioData );
            } else if ( elementInitialData.corner === "bottom" ) {
                dataResizing = {
                    y: elementInitialData.y - axisDelta( deltaMouseYBottomHandle ),
                    height: elementInitialData.height + lengthDelta( deltaMouseYBottomHandle ),

                }
            } else if ( elementInitialData.corner === "bottom-left" ) {
                dataResizing = {
                    x: mousePosition.x,
                    y: elementInitialData.y - axisDelta( deltaMouseYBottomHandle ),
                    width: elementInitialData.width - lengthDelta( deltaMouseXLeftHandle ),
                    height: elementInitialData.height + lengthDelta( deltaMouseYBottomHandle ),
                }
            } else if ( elementInitialData.corner === "left" ) {
                dataResizing = {
                    x: mousePosition.x,
                    width: elementInitialData.width - lengthDelta( deltaMouseXLeftHandle ),
                }
            }

            // console.log( "elementInitialData.width, deltaMouseX, snapToGrid( elementInitialData.x ), elementInitialData.x" );
            // console.log( elementInitialData.width, deltaMouseX, snapToGrid( elementInitialData.x ), elementInitialData.x );
            onChangeElement( selectedElementID, dataResizing );
            // setMovingDelta( {
            //     x: deltaX,
            //     y: deltaY,
            // } );

        }
    };

    const handleMouseUp = ( e ) => {
        if ( !e.button === 0 ) {
            return;
        }
        //prevents accidentl mouseup issues
        // if ( mouseActionStarted.current === false ) {
        //     return false;
        // }
        const mousePos = getMousePosition( e );
        const deltaMouseX = mousePos.x - mouseDownPosition.x;
        const deltaMouseY = mousePos.y - mouseDownPosition.y;

        const hasMoved = mouseDownPosition !== false && ( deltaMouseX !== 0 || deltaMouseY !== 0 );

        infoHelper( "" );

        if ( activeTool === "conditional" ) {
            onConditionalAdded();
            return;
        }

        //Draw a new Text layer
        // if ( activeTool === "text" & isDrawing === true ) {
        if ( activeTool !== "select" && isDrawing === true ) {

            const mousePos = getMousePosition( e );
            const width = mousePos.x - drawingInitialPosition.x;
            const height = mousePos.y - drawingInitialPosition.y;

            let processedWidth = width;
            let processedHeight = height;

            //Keep a square ratio
            if ( e.shiftKey === true ) {
                processedWidth = Math.min( width, height );
                processedHeight = Math.min( width, height );
            }

            // //Snap to grid
            // if ( e.altKey === true ) {
            //     processedWidth = snapToGrid( processedWidth, snapGridSpacing );
            //     processedHeight = snapToGrid( processedHeight, snapGridSpacing );
            // }

            //Create the element if it has a w or h > 0
            if ( width > 0 && height > 0 ) {

                const newElement = {
                    // type: "text",
                    x: drawingInitialPosition.x,
                    y: drawingInitialPosition.y,
                    width: processedWidth || width,
                    height: processedHeight || height
                }
                onCreateElement( newElement );
            }
        }

        if ( activeTool !== "select" ) {
            setIsDrawing( false );
            setDrawingRect( { x: 0, y: 0, width: 0, height: 0 } );
        }

        //Select an element
        // if ( isPointerInCanvas === true && activeTool === "select" && isMoving !== true && isElementResizing !== true && isElementRotating !== true ) {
        if ( isPointerInCanvas === true && activeTool === "select" && hasMoved !== true && isElementResizing !== true && isElementRotating !== true ) {
            // const mousePos = getMousePosition( e );

            const targetId = getIdFromMouseEvent( e );
            // console.log( targetId );
            if ( targetId !== false ) {

                onSelectElement( targetId );

                infoHelper( __( "Press Alt + D to duplicate layer.", "wpjoli-safi" ) );
                // if (typeof layerComponents == "object"){let compEl = layerComponents.find( element => element.key === id );
                //     console.log(compEl);
                //     compEl.props.isSelected = true;
                //     setRerender( !rerender );
                // }
            } else {
                //Deselect element
                if ( !isElementResizing === true && !isElementRotating === true ) {
                    onSelectElement( null );
                    infoHelper( "" );
                }
            }
            // console.log( e, mousePos );
        }

        //End of Moving an object
        if ( activeTool === "select" && isMoving === true ) {
            onChangeElement( selectedElementID, newPosition, addHistory );
            setIsMoving( false );
        }


        if ( isElementResizing === true ) {
            onChangeElement( selectedElementID, dataResizing, addHistory );
            setIsElementResizing( false );
        }


        

        //resets the variable
        setIsPointerInCanvas( false );
        // mouseActionStarted.current = false;
    };

    const getIdFromMouseEvent = ( e, selectedFirst = false ) => {

        if ( selectedFirst == true ) {

            //Check 
            let layersThrough = document.elementsFromPoint( e.clientX, e.clientY );
            if ( layersThrough ) {
                layersThrough = layersThrough.filter( element => element.classList.contains( 'safi-object' ) && element.classList.contains( '--selected' ) );
            }
            // console.log( layersThrough );

            if ( layersThrough.length > 0 ) {
                return layersThrough[0].dataset.id
            }
        }
        // console.log( e.target.closest( ".safi-object" ) );
        // console.log( e.target.classList.contains( 'safi-object-child' ) );

        if ( e.target.classList.contains( 'safi-object-child' ) ) {

            const id = e.target.parentNode.dataset.id;
            // console.log( id );

            return id;
        } else if ( e.target.classList.contains( 'safi-object' ) ) {

            const id = e.target.dataset.id;
            // console.log( id );

            return id;
        } else {
            const obj = e.target.closest( ".safi-object" );

            if ( obj ) {
                const id = obj.dataset.id;
                return id;
            }
        }
        return false;
    };

    const getStyles = ( () => {

        let cursor = "initial";

        if ( activeTool !== "select" ) {
            cursor = "crosshair";
        }

        return {
            color: "#000",
            backgroundColor: canvas?.backgroundColor,
            width: canvas?.width + "px",
            height: canvas?.height + "px",
            // transform: "scale(" + canvas?.zoom + ")",
            cursor: cursor,
            backgroundSize: snapGridSpacing + "px " + snapGridSpacing + "px"
        };
    } )();

    const handleResizingStart = ( e, data ) => {

        // console.log( e, data, mousePosition );
        // setElementInitialPosition( {
        //     x: selectedElementID.props.x,
        //     y: targetEl.props.y,
        // } )

        //data contains corner, coordinates and size
        setElementResizingInitialPosition( mousePosition );
        setElementInitialData( data );
        setIsElementResizing( true );
        onTriggerSnapshot();
    };

    


    const handleTextChanged = ( value, addHistory = false ) => {

        const data = {
            text: value
        }
        onChangeElement( selectedElementID, data, addHistory );

    };

    const createNewElement = ( data, children, parent ) => {
        if ( !data ) {
            return;
        }

        let propsData = { ...data };
        let layerObject;

        //Used for zIndex
        //we exclude columns from z index as thisi is a virtual cntainer and does not actually add an object to the cavnas
        if ( propsData.type !== 'columns' ) {
            elementIndex++;
        }

        //adds canvas to the props
        propsData['zIndex'] = elementIndex;
        propsData['canvas'] = canvas;
        propsData['key'] = data.id;
        propsData['onResizingStart'] = ( e, data ) => handleResizingStart( e, data );

        
        propsData['infoHelper'] = infoHelper;
        propsData['baseInfoHelper'] = infoHelper;

        // propsData['onStylesChanged'] = handleComputedStylesUpdate;
        // propsData['onResizingEnd'] = ( corner ) => handleResizingEnd( corner );

        // propsData['onChange'] = ( elementId, data, addHistory = true ) => {
        //     // console.log('ELEMENT CHANGED--------------------------');
        //     this.props.elementChanged( elementId, data, addHistory );
        // };
        // console.log(selectedElementID);
        if ( data.id == selectedElementID ) {
            propsData['isSelected'] = true;
        }

        if ( data.id == highlightedLayer ) {
            propsData['isHighlighted'] = true;
        }

        //create unique ID & key

        const currentType = data.type.toLowerCase();
        if ( currentType === 'text' ) {
            propsData['onTextChanged'] = handleTextChanged;
            layerObject = wp.element.createElement( Text, propsData );
        }
        else if ( currentType === 'image' ) {
            layerObject = wp.element.createElement( ImageObject, propsData );
        }
        else if ( currentType === 'rect' ) {
            layerObject = wp.element.createElement( Rect, propsData );
        }
        else if ( currentType === 'circle' ) {
            layerObject = wp.element.createElement( Circle, propsData );
        }

        

        //if children (recursive fn)
        if ( children !== null && typeof layerObject == 'object' ) {
            layerObject.props.children = children.slice( 0 ).reverse().map( child => {
                const element = elements.find( element => element.id == child.id );
                const children = child.hasOwnProperty( 'children' ) ? child.children : null;
                return createNewElement( element, children, layerObject );

            } )
        }

        return layerObject;
    }


    ( () => {
        if ( !tree || !tree.length ) {
            return;
        }
        //init counter
        elementIndex = 0;

        const reversedElements = tree.slice( 0 ).reverse();
        // console.log(reversedElements);
        const objElements = reversedElements.map( ( item ) => {
            const element = elements.find( element => element.id == item.id );
            // console.log('index------------------------------');
            // console.log(item);

            const children = item.hasOwnProperty( 'children' ) ? item.children : null;
            // setTimeout(() => {
            return createNewElement( element, children );
            // }, 50);
        } );

        // return objElements;
        // setLayerComponents(objElements);
        layerComponents = objElements;
    } )();

    // const addColumns = ( e ) => {
    //     // console.log(e);

    //     const container = e.target.closest( '#safi-area' );

    //     const data = {
    //         layout: e.target.dataset.value,
    //         position: container.dataset.areaPosition,
    //         top: container.dataset.areaTop,
    //         height: container.dataset.areaHeight,
    //     };

    //     // console.log( data );
    //     onColumnsAdded( data );

    //     //reset
    //     setColumnLayoutSelecting( false );
    // }

    // const setArea = ( e ) => {
    //     if ( columnLayoutSelecting == true ) {
    //         return;
    //     }

    //     const container = document.getElementById( 'safi-area-selection' );
    //     const area = document.getElementById( 'safi-area' );
    //     const areaLabel = document.getElementById( 'safi-area-label' );
    //     const relPos = container.getBoundingClientRect();
    //     const containerHeight = container.clientHeight;


    //     // 432 100
    //     // 50    

    //     const mouseY = e.clientY - relPos.top;
    //     const mouseBlock = Math.floor( mouseY * areas.length / containerHeight ); //between 0 and 10
    //     // console.log( mouseBlock );

    //     if ( mouseBlock < 0 ) {
    //         return;
    //     }
    //     areaLabel.innerText = areas[mouseBlock].label;

    //     const areaHeight = areas[mouseBlock].height * containerHeight
    //     area.style.height = areaHeight.toString() + "px";
    //     area.dataset.areaPosition = areas[mouseBlock].position;
    //     area.dataset.areaHeight = areaHeight;

    //     if ( areas[mouseBlock].position == "top" ) {
    //         area.style.top = 0;
    //         area.style.bottom = "";
    //         area.style.transform = "";
    //         area.dataset.areaTop = 0;
    //     } else if ( areas[mouseBlock].position == "bottom" ) {
    //         area.style.top = "";
    //         area.style.bottom = 0;
    //         area.style.transform = "";
    //         area.dataset.areaTop = containerHeight - areaHeight;
    //     } else if ( areas[mouseBlock].position == "center" ) {
    //         area.style.top = "50%"
    //         area.style.bottom = "";
    //         area.style.transform = "translateY(-50%)";
    //         area.dataset.areaTop = ( containerHeight / 2 ) - ( areaHeight / 2 );
    //     }

    // }

    

    // const cancelArea = ( e ) => {
    //     // console.log('CACELLLLLLLLLL');
    //     setColumnLayoutSelecting( false );
    // }

    const handleKeyDown = ( e ) => {

        //Prevent moving text while editing
        if ( e.target.type === "textarea" ) {
            return;
        }

        const allowedKeyCodes = [37, 38, 39, 40];
        if ( allowedKeyCodes.findIndex( element => element === e.keyCode ) === -1 ) {
            // e.preventDefault();
            // console.log("return false");
            return;
        }

        e.preventDefault();
        // processKeyUp( e );
    };

    const processKeyUp = ( e ) => {
        // console.log( e, e.target.type );
        // return;
        if ( typeof e === 'undefined' || e === null || e.type !== 'keyup' ) {
            // if ( typeof e === 'undefined' || e === null || e.type !== 'keydown' ) {
            // console.log( 'RETURN 1' );
            return;
        }

        //Does not process the text area and text fields
        if ( e.target.type === "text" || e.target.type === "textarea" || e.target.type === "number" ) {
            // console.log( 'RETURN 2' );
            return;
        }
        // e.preventDefault();

        let multiplier = 1;
        let targetEl;

        if ( e.shiftKey === true ) {
            multiplier = 10;
        } else if ( e.ctrlKey === true || e.metaKey === true ) {
            multiplier = 100;
        }
        //handles the selected element that's not a container
        if ( selectedElementID && selectedElementID.indexOf( "container" ) === -1 ) {
            //Only allows keys up down left right
            const allowedKeyCodes = [37, 38, 39, 40];
            if ( allowedKeyCodes.findIndex( element => element === e.keyCode ) === -1 ) {
                // e.preventDefault();
                // console.log("return false");
                return false;
            }

            if ( typeof layerComponents === "object" ) {
                // let targetEl = layerComponents.find( element => element.key === targetId );
                targetEl = findById( layerComponents, selectedElementID );
            }

            //Bail if layer is locked
            if ( targetEl?.props.locked === true ) {
                return false;
            }

            let newPosition;

            switch ( e.keyCode ) {
                case 38: //UP
                    newPosition = {
                        y: targetEl.props.y - 1 * multiplier,
                    }
                    break;
                case 40: // DOWN
                    newPosition = {
                        y: targetEl.props.y + 1 * multiplier,
                    }
                    break;
                case 39: // RIGHT
                    newPosition = {
                        x: targetEl.props.x + 1 * multiplier,
                    }
                    break;
                case 37: // LEFT
                    newPosition = {
                        x: targetEl.props.x - 1 * multiplier,
                    }
                    break;
            }

            onChangeElement( selectedElementID, newPosition );
        }

    };

    const processCanvasOuterStyles = ( () => {
        return {
            "--safi-zoom": canvas?.zoom,
            transform: "scale(" + canvas?.zoom + ")",
            width: ( canvas?.width || 1200 ) * 5 + "px",
            height: ( canvas?.height || 624 ) * 5 + "px",
        }
    } )();
    const canvasScaledHeight = ( () => {
        // console.log(state.canvas?.height);
        return canvas?.height;
    } )();

    const canvasScaledWidth = ( () => {
        return canvas?.width;
    } )();

    const canvasGetClasses = ( () => {
        let classes = [];
        if ( showGrid ) {
            classes.push( "--show-grid" );
        }
        if ( isElementCornering ) {
            classes.push( "--is-cornering" );
        }
        return classes.join( " " );
    } )();


    // const handlePaste = ( e ) => {
    //     // console.log( e.clipboardData.getData( 'text' ) );
    // };

    return (

        <div
            // ref={myRef}
            id="safi-canvas-wrap"
            tabIndex="0"
            onClick={( e ) => onDeselect( e )}
            // onKeyDown={handleCanvasKeyDown}
            // onKeyUp={(e) => setCurrentKeyPressed( e )}
            // onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        // onPaste={e => console.log(e)}
        >
            <div
                id="safi-canvas-outer"
                style={processCanvasOuterStyles}
            >
                <div
                    id="safi-canvas"
                    style={getStyles}
                    // contentEditable="true"
                    // onClick={handleClick}
                    className={canvasGetClasses}
                    tabIndex="1"
                    onKeyDown={handleKeyDown}
                // onPaste={e => console.log(e)}
                // onMouseDown={handleMouseDown}
                // onMouseMove={handleMouseMove}
                // onMouseUp={handleMouseUp}
                >
                    {
                        showGrid &&
                        <div id="safi-center-line-h" className="safi-center-line"></div>
                    }
                    {
                        showGrid &&
                        <div id="safi-center-line-v" className="safi-center-line"></div>
                    }
                    <style>
                        {globalStyles}
                    </style>
                    {/* <div id="safi-col-overlay" className={( activeTool === 'columns' ) ? '--active' : ''} style={{ opacity: 0 }}>
                        <div
                            id="safi-area-selection"
                            onMouseMove={setArea}
                        >
                            <div id="safi-area" className="safi-area" onClick={areaSelected}>
                                <span id="safi-area-label" className={columnLayoutSelecting ? '--hidden' : ''}></span>
                                <div className={`col-layouts ${!columnLayoutSelecting ? ' --hidden' : ''}`}>
                                    <span className="cancel" onClick={cancelArea}>Cancel</span>
                                    {columnLayouts.map( item => {
                                        return <div
                                            key={item.value}
                                            className="layout-item"
                                            data-value={item.value}
                                            onClick={addColumns}
                                        >{item.label}</div>
                                    } )}
                                </div>

                            </div>
                        </div>
                    </div> */}
                    {}
                    {elements && layerComponents}
                    <DrawingObject
                        isHidden={!isDrawing}
                        x={drawingRect.x || 0}
                        y={drawingRect.y || 0}
                        width={drawingRect.width || 0}
                        height={drawingRect.height || 0}
                    />
                </div>
                <div className="canvas-outer-background --top" style={{ position: "absolute", height: canvasScaledHeight * 2 }} onClick={( e ) => onDeselect( e )}></div>
                <div className="canvas-outer-background --right" style={{ width: canvasScaledWidth * 2, height: canvasScaledHeight }} onClick={( e ) => onDeselect( e )}></div>
                <div className="canvas-outer-background --bottom" style={{ height: canvasScaledHeight * 2 }} onClick={( e ) => onDeselect( e )}></div>
                <div className="canvas-outer-background --left" style={{ width: canvasScaledWidth * 2, height: canvasScaledHeight }} onClick={( e ) => onDeselect( e )}></div>

            </div>
        </div>
    );
};

export default SafiCanvas;