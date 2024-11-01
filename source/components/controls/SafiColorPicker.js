const { useState, useEffect } = wp.element;
const { ColorPicker } = wp.components;

const SafiColorPicker = ( { color, alpha, onColorChange, onColorChangeComplete, onTriggerSnapshot, ...props } ) => {
    const [currentColor, setCurrentColor] = useState( color );
    // const [alpha, setAlpha] = useState( alpha || null );
    const [showColorPicker, setShowColorPicker] = useState( false );

    useEffect( () => {
        setCurrentColor( color );
    }, [color] ); //run this code when the value of template changes


    const twoDigits = ( number ) => {
        return ( "0" + number ).slice( -2 );
    }

    // const hexColor = ( colorIn ) => {
    //     if ( colorIn === null ) {
    //         return;
    //     }

    //     let hex = '#' +
    //         twoDigits( colorIn.rgb.r.toString( 16 ) ) +
    //         twoDigits( colorIn.rgb.g.toString( 16 ) ) +
    //         twoDigits( colorIn.rgb.b.toString( 16 ) );

    //     hex += colorIn.rgb.a < 1 ? twoDigits( Math.round( colorIn.rgb.a * 255 ).toString( 16 ) ) : '';

    //     return hex;
    // }

    const handleChange = ( color ) => {

        // let hex = hexColor( color );
        // // console.log(color.rgb.a);
        setCurrentColor( color );

        if ( onColorChange ) {
            onColorChange( color );
        }
    };

    // const handleChangeComplete = ( color, event ) => {
    //     // console.log('-------------------CHANGE COMPLETE_____');

    //     let hex = hexColor( color );

    //     if ( onColorChangeComplete ) {
    //         onColorChangeComplete( hex );
    //     }
    // };

    const handleClick = () => {
        // console.log( 'picker click' );
        setShowColorPicker( !showColorPicker );
    };

    const handleClose = () => {
        setShowColorPicker( false );
    };

    const handleMouseDown = ( e ) => {
        // console.log( 'mousdown' );
        onTriggerSnapshot();
    };

    const handleMouseUp = ( e ) => {
        // console.log( 'mousup' );
        if ( onColorChangeComplete ) {
            onColorChangeComplete( currentColor );
        }
    };


    const popover = {
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: '2',
        // right: '150px',
        right: 'calc(100% + 10px)',
        top: 'calc(50% - 180px)',

    };

    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',

    };

    const reset = () => {
        // const resetColor = "#00000000";
        const resetColor = undefined;

        // setCurrentColor( resetColor );
        if ( onColorChangeComplete ) {
            onColorChangeComplete( resetColor );
        }
    };

    return (
        <div className="safi-input">
            <div className="safi-colorpicker--container">
                <div
                    className="color-sample"
                    onClick={handleClick}
                    style={{
                        backgroundColor: currentColor,
                    }}
                />
                <div className="color-hex">
                    <input
                        type="text"
                        className="color-hex-input"
                        value={currentColor || "unset"}
                    />
                </div>
                {showColorPicker ?
                    <div style={popover} >
                        <div
                            className="overlayCP"
                            style={cover}
                            onClick={handleClose}
                        />
                        <ColorPicker
                            color={currentColor || undefined}
                            onChange={handleChange}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            enableAlpha
                            defaultValue="#000"
                        />
                    </div> : null}
                <span
                    title="Clear"
                    className={"safi-box-control-icon icon-clear dashicons"}
                    onMouseDown={reset}
                ></span>
            </div>
        </div>
    );
};

export default SafiColorPicker;