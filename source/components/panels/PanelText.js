const { __ } = wp.i18n;
const { useState, useEffect, useContext } = wp.element;
import Panel from './Panel';
import SegmentedButtons from '../controls/SegmentedButtons';
import DynamicText from '../controls/DynamicText'
import SafiColorPicker from '../controls/SafiColorPicker';
import { AppContext } from '../../AppContext';
import SvgIcons from '../../SvgIcons';
import FontPicker from '../controls/FontPicker';

const fontWeights = [
    { value: '100', label: 'ExtraLight' },
    { value: '200', label: 'Thin' },
    { value: '300', label: 'Light' },
    { value: '400', label: 'Regular' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'SemiBold' },
    { value: '700', label: 'Bold' },
    { value: '800', label: 'ExtraBold' },
    { value: '900', label: 'Black' },
];

const textTransforms = [
    { value: 'normal', label: 'Normal' },
    { value: 'uppercase', label: 'Uppercase' },
    { value: 'lowercase', label: 'Lowercase' },
    { value: 'capitalize', label: 'Capitalize' },
];

const PanelText = ( { element, isMouseDown, onTriggerSnapshot, ...props } ) => {

    const [currentElement, setCurrentElement] = useState( element );
    const [hasTextChanged, setHasTextChanged] = useState( false );
    const [valText, setValText] = useState( element.text == null ? "" : element.text );

    const isPro = useContext( AppContext );

    const proLabel = ( value ) => {
        return isPro ? value : value + " (Pro)";
    }

    // let textValue = '';
    // let hasTextChanged = false;
    // console.log(props.googleFonts);
    const gFonts = props.googleFonts.map( font => { return { value: font, label: font, type: 'gf' } } );

    const fonts = [
        {
            id: 1,
            label: 'Standard Fonts',
            options: [
                { value: 'Arial', label: 'Arial, sans serif' },
                // { value: 'Helvetica', label: 'Helvetica, sans serif' },
                { value: 'Arial Black', label: 'Arial Black, sans serif' },
                // { value: 'Bookman Old Style', label: 'Bookman Old Style, serif' },
                { value: 'Comic Sans MS', label: 'Comic Sans MS, cursive' },
                { value: 'Courier', label: 'Courier, monospace' },
                { value: 'Georgia', label: 'Georgia, serif' },
                { value: 'Garamond', label: 'Garamond, serif' },
                { value: 'Impact', label: 'Impact, sans-serif' },
                { value: 'Lucida Console', label: 'Lucida Console, monospace' },
                // { value: 'Monaco', label: 'Monaco, monospace' },
                { value: 'Lucida Sans Unicode', label: 'Lucida Sans Unicode, sans-serif' },
                // { value: 'Lucida Grande', label: 'Lucida Grande, sans-serif' },
                { value: 'MS Sans Serif', label: 'MS Sans Serif, sans-serif' },
                // { value: 'Geneva', label: 'Geneva, sans-serif' },
                { value: 'Tahoma', label: 'Tahoma, sans-serif' },
                { value: 'Times New Roman', label: 'Times New Roman, serif' },
                { value: 'Trebuchet MS', label: 'Trebuchet MS, sans-serif' },
                { value: 'Verdana', label: 'Verdana, sans-serif' },
            ]
        },
        {
            id: 2,
            label: proLabel( "Google fonts" ),
            options: gFonts,
        },
    ];

    useEffect( () => {
        setCurrentElement( element );
        setValText( element.text == null ? "" : element.text );
        // hasTextChanged = false;
        // console.log( 'USEFEFFCT', element );
    }, [element] );

    // const updateText = ( e ) => {

    //     // console.log(e);
    //     let element = { ...currentElement };

    // };

    const insertDynamicText = ( dynText ) => {
        //newvalue
        const dataChanged = {
            label: dynText,
            text: dynText
        };

        propDataChanged( dataChanged );
    }

    const textChanged = ( e ) => {
        const value = e.target.value;
        //let the component know we made some changes
        // hasTextChanged = true;
        setHasTextChanged( true );
        setValText( value );
        // textValue = value;
        //newvalue
        const dataChanged = {
            label: value,
            text: value,
        };

        propDataChanged( dataChanged, false );

    }

    const textChangedTriggerHistory = ( e ) => {
        const dataChanged = {
            text: e.target.value
        };

        if ( hasTextChanged ) {
            // hasTextChanged = false;
            setHasTextChanged( false );
            propDataChanged( dataChanged, true );
        }
        else {
            onTriggerSnapshot( false );
        }
    }

    const textAlignChanged = ( value ) => {
        const updatedValue = value === element.styles.justifyContent ? null : value;

        let textAlignVar = "left";
        if ( updatedValue === "start" ) {
            textAlignVar = "left";
        } else if ( updatedValue === "center" ) {
            textAlignVar = "center";
        } else if ( updatedValue === "end" ) {
            textAlignVar = "right";
        }

        props.onStylesUpdate( element.id, {
            justifyContent: updatedValue,
            textAlign: textAlignVar,
        } );
    }

    const textCaseChanged = ( e ) => {
        let theValue = e.target.value;

        if ( theValue === 'normal' ) {
            theValue = null;
        }

        props.onStyleUpdate( element.id, "textTransform", theValue );
    }


    const textVerticalAlignChanged = ( value ) => {

        const updatedValue = value === element.styles.alignItems ? null : value;

        props.onStyleUpdate( element.id, "alignItems", updatedValue );
    }

    const fontFamilyChanged = ( font ) => {

        
        if ( isPro !== true ) {
            updateFont( font.font );
        }
    }

    const fontFamilyPreviewChanged = ( font ) => {

        
        if ( isPro !== true ) {
            updateFont( font.font, null, false );
        }
        // }
    }

    /**
     * 
     * @param {*} fontName 
     * @param {*} fontType 'gf' for google font
     */
    const updateFont = ( fontName, fontType = null, addHistory = true ) => {
        //newvalue
        let dataChanged = {
            fontFamily: fontName,
            fontType: fontType
        };
        
        propDataChanged( dataChanged, addHistory );
    }

    const fontWeightChanged = ( e ) => {
        props.onStyleUpdate( element.id, "fontWeight", e.target.value );
    }

    // const fontSizeChanged = ( valueObj, actionObj ) => {

    //     // ActionTypes = | 'clear' | 'create-option' | 'deselect-option' | 'pop-value' | 'remove-value' | 'select-option' | 'set-value'

    //     if ( actionObj.action === 'select-option' || actionObj.action === 'create-option' ) {
    //         //newvalue
    //         const dataChanged = {
    //             fontSize: valueObj.value
    //         };

    //         // console.log( dataChanged );
    //         propDataChanged( dataChanged );
    //     }
    // }

    // const lineHeightChanged = ( valueObj, actionObj ) => {

    //     // ActionTypes = | 'clear' | 'create-option' | 'deselect-option' | 'pop-value' | 'remove-value' | 'select-option' | 'set-value'

    //     if ( actionObj.action === 'select-option' || actionObj.action === 'create-option' ) {
    //         //newvalue
    //         const dataChanged = {
    //             lineHeight: valueObj.value
    //         };

    //         // console.log( dataChanged );
    //         propDataChanged( dataChanged );
    //     }
    // }


    const colorChanged = ( hexColor ) => {

        props.onStyleUpdate( currentElement.id, "color", hexColor );
    }

    const colorChangeComplete = ( hexColor ) => {

        const addHistory = true;
        props.onStyleUpdate( currentElement.id, "color", hexColor, addHistory );
    }

    const getFonts = () => {
        return [
            { value: null, label: fonts[0].label },
            ...fonts[0].options,
            { value: null, label: fonts[1].label },
            ...fonts[1].options
        ].map( ( item ) => {
            return <option
                value={item.value}
                // selected={item.value === currentElement.sourceArg}
                selected={matchFontObjByValue( element.fontFamily )}
                style={{ fontFamily: ( item.value !== null ? item.value : 'initial' ) }}
                disabled={item.value === null}
            >{item.label}</option>
        } );
    }

    /**
     * Passes on the changed data to the React parent
     * Using the onElementDataChange prop
     * @param {Object} data 
     */
    const propDataChanged = ( data, addHistory = true ) => {

        const elementId = element.id;

        // console.log( elementId );
        if ( !elementId ) {
            return;
        }

        props.onElementDataChange( elementId, data, addHistory );
    }

    const matchFontObjByValue = ( fontName ) => {
        for ( let fontCat in fonts ) {
            let search = fonts[fontCat].options.find( item => item.value === fontName );
            if ( typeof ( search ) !== 'undefined' ) {
                return true;
            }
        }
        return false;
    }


    // const fontSizeValue = element.fontSize ? { value: element.fontSize, label: element.fontSize } : null;
    const fontSizeValue = element.fontSize ? element.fontSize : null;
    // const lineHeightValue = element.lineHeight ? { value: element.lineHeight, label: element.lineHeight } : null;
    const lineHeightValue = element.lineHeight ? element.lineHeight : 1;

    return (
        <Panel header={true} name="Text">

            <div className="safi-prop-row">
                <div className="safi-prop-col">
                    <div className="safi-prop">
                        <DynamicText value={valText} onTextSelected={insertDynamicText} >
                            <textarea
                                cols="30"
                                rows="5"
                                className="safi-plain"
                                name="prop-text-content"
                                id="safi-text-content"
                                placeholder="My text"
                                value={valText}
                                onChange={textChanged}
                                onBlur={textChangedTriggerHistory}
                                onFocus={() => onTriggerSnapshot()}
                            >

                            </textarea>
                        </DynamicText>
                    </div>
                </div>
            </div>

            <div className="safi-prop-row">
                <div className="safi-prop-col">
                    <div className="safi-input">
                        <div className="safi-prop">
                            <FontPicker
                                value={element.fontFamily}
                                onFontChange={fontFamilyChanged}
                                onFontPreview={fontFamilyPreviewChanged}
                                googleFonts={props.googleFonts}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="safi-prop-row">
                <div className="safi-prop-col">
                    <div className="safi-prop">
                        <SafiColorPicker
                            color={currentElement.styles?.color || null}
                            onColorChange={colorChanged}
                            onColorChangeComplete={colorChangeComplete}
                            onTriggerSnapshot={() => onTriggerSnapshot()}
                        />
                    </div>
                </div>
            </div>
            <div className="safi-prop-row">
                <div className="safi-prop-col">
                    <div className="safi-prop">
                        <label htmlFor="propFontSize">
                            <span className="svg-icon">{SvgIcons.fontSize}</span>
                            <input
                                type="number"
                                className="safi-plain --stealth"
                                name="propFontSize"
                                id="propFontSize"
                                value={fontSizeValue}
                                lang="en"
                                step="1"
                                onChange={e => propDataChanged( { fontSize: parseFloat( e.target.value ) } )}
                            />
                        </label>
                    </div>
                </div>
                <div className="safi-prop-col">
                    <div className="safi-prop">
                        <label htmlFor="propLineHeight">
                            <span className="svg-icon">{SvgIcons.lineHeight}</span>
                            <input
                                type="number"
                                className="safi-plain --stealth"
                                name="propLineHeight"
                                id="propLineHeight"
                                value={lineHeightValue}
                                lang="en"
                                step="0.1"
                                onChange={e => propDataChanged( { lineHeight: parseFloat( e.target.value ) } )}
                            />
                        </label>
                    </div>
                </div>
            </div>
            <div className="safi-prop-row">
                <div className="safi-prop-col">
                    <div className="safi-input">
                        <div className="safi-prop">
                            <label htmlFor="safi-font-weight">{__( "Font weight", "wpjoli-safi" )}</label>
                            <select
                                id="safi-font-weight"
                                className="safi-plain --stealth"
                                onChange={fontWeightChanged}
                            >
                                {fontWeights.map( ( item ) => {
                                    return <option
                                        value={item.value}
                                        selected={item.value === currentElement.styles.fontWeight}
                                    >{item.label}</option>
                                } )
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="safi-prop-col">
                    <div className="safi-input">
                        <div className="safi-prop">
                            <label htmlFor="safi-font-transform">{__( "Text transform", "wpjoli-safi" )}</label>
                            <select
                                id="safi-text-transform"
                                className="safi-plain --stealth"
                                onChange={textCaseChanged}
                                placeholder="Text transform..."
                            >
                                {/* <option value={null} disabled selected={currentElement.styles.textTransform = null}>{"Text transform..."}</option> */}
                                {textTransforms.map( ( item ) => {
                                    return <option
                                        value={item.value}
                                        selected={item.value === currentElement.styles.textTransform}
                                    >{item.label}</option>
                                } )
                                }
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="safi-prop-row">
                <div className="safi-prop-col">
                    <div className="safi-prop">
                        <SegmentedButtons segments={[
                            {
                                id: 'text-align-left',
                                value: 'start',
                                icon: 'format_align_left'
                            },
                            {
                                id: 'text-align-center',
                                value: 'center',
                                icon: 'format_align_center'
                            },
                            {
                                id: 'text-align-right',
                                value: 'end',
                                icon: 'format_align_right'
                            },
                        ]}
                            selectedSegment={currentElement.styles.justifyContent || -1}
                            onChangeSegment={textAlignChanged}
                        />
                    </div>
                </div>
                <div className="safi-prop-col">
                    <div className="safi-prop">

                        <SegmentedButtons segments={[
                            {
                                id: 'text-align-bottom',
                                value: 'end',
                                icon: 'vertical_align_bottom'
                            },
                            {
                                id: 'text-align-middle',
                                value: 'center',
                                icon: 'vertical_align_center'
                            },
                            {
                                id: 'text-align-top',
                                value: 'start',
                                icon: 'vertical_align_top'
                            },
                        ]}
                            selectedSegment={currentElement.styles.alignItems || -1}
                            onChangeSegment={textVerticalAlignChanged} />
                    </div>
                </div>
            </div>

        </Panel>

    );
};

export default PanelText;