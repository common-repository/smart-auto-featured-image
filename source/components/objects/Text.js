const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;
import BaseObject from "./BaseObject";


const Text = ( { text, fontSize, lineHeight, fontFamily, infoHelper, onTextChanged, ...props } ) => {

    const [loremIpsum, setLoremIpsum] = useState( false );

    const [textValue, setTextValue] = useState( text );
    const [isEditing, setIsEditing] = useState( false );


    useEffect( () => {
        setTextValue( text );
    }, [text] ); //run this code when the value of template changes

    useEffect( () => {
        if ( text === "New text" ) {
            setIsEditing( true );
        }
    }, [] ); //run this code when text element is created

    const theLineHeight = lineHeight || 1;
    const getStyles = ( () => {

        return {
            ...props.styles, ...{
                // overflow: "hidden",
                display: "flex",
                fontSize: fontSize + "px",
                fontFamily: fontFamily,
                lineHeight: theLineHeight,
                // whiteSpace: "pre-wrap",
                whiteSpace: "pre-line",
            }
        };
    } )();

    const getProcessedText = () => {
        if ( loremIpsum === true ) {
            // return "Lorem ipsum dolor sit amet. Et illum earum aut voluptatem dolor hic harum voluptatibus eum consequatur voluptas.";
            return "Lorem ipsum dolor sit amet earum aut consequatur harum hic illum voluptas";
        }
        return ( textValue );
    };

    const textChanged = ( e ) => {
        const value = e.target.value;
        setTextValue( value );
        onTextChanged( value );
    };

    const handleKeyDown = ( e ) => {
        if ( e.keyCode === 13 && e.shiftKey === false ) { //enter
            e.preventDefault();
        }
    };

    const handleKeyUp = ( e ) => {
        if ( e.keyCode === 27 ) { //esc
            setTextValue( text );
            setIsEditing( false );
        }
        if ( e.keyCode === 13 && e.shiftKey === false ) { //enter
            onTextChanged( textValue );
            setIsEditing( false );
        }
    };

    const textChangedTriggerHistory = ( e ) => {
        // const value = e.target.value;
        onTextChanged( textValue, true );
    };

    const textInnerStyle = () => {
        if ( textValue == "" ) {
            return {
                width: "100%",
                height: "100%",
            }
        }

        if ( isEditing ) {
            return {
                padding: "inherit",
            };
        }
        return;
    };

    return (
        <BaseObject
            {...props}
            tag="div"
            styles={getStyles}
        >
            <div
                className={"safi-text-placeholder" + ( loremIpsum ? " --lipsum" : "" )}
                onClick={() => setLoremIpsum( !loremIpsum )}
                // title={__( "tada", "wpjoli-safi" )}
                onMouseEnter={() => infoHelper( __( "Activate a filler text to help you style", "wpjoli-safi" ) )}
                onMouseLeave={() => infoHelper( "" )}
            >Lorem ipsum</div>
            <div className="safi-text-inner"
                onDoubleClick={() => { setLoremIpsum( false ); setIsEditing( true ) }}
                onBlur={() => setIsEditing( false )}
                style={textInnerStyle()}
            >
                {!isEditing &&
                    getProcessedText()
                }
                {isEditing &&
                    <textarea
                        // cols="30"
                        // rows="5"
                        className="safi-text-edit safi-plain"
                        name="prop-text-content"
                        id="safi-text-content"
                        placeholder="Enter text here..."
                        value={getProcessedText()}
                        onChange={textChanged}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        onBlur={textChangedTriggerHistory}
                        autoFocus
                        onFocus={( e ) => e.target.select()}
                    // onFocus={() => onTriggerSnapshot()}
                    >
                    </textarea>
                }
            </div>
        </BaseObject>
    );
};

export default Text;