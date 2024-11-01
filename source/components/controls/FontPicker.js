const { __ } = wp.i18n;
const { useState, useEffect, useContext, useRef } = wp.element;
import { AppContext } from "../../AppContext";
import Icon from '../Icon';


const FontPicker = ( { value, onFontChange, onFontPreview, googleFonts, ...props } ) => {

    const isPro = useContext( AppContext );

    const proLabel = ( value ) => {
        return isPro ? value : value + " (Pro)";
    }

    const [expanded, setExpanded] = useState( false );
    // const [isScrolling, setIsScrolling] = useState( false );
    const [searchValue, setSearchValue] = useState( "" );

    const [theFont, setTheFont] = useState( value );
    const [initialFont, setInitialFont] = useState( value );
    // const [listLabel, setListLabel] = useState( "Select a field" );

    const loadedFonts = useRef( [] );
    // const initialFont = value;

    let gFonts = null;
    

    let fonts = [
        {
            id: 1,
            label: 'Standard Fonts',
            attrid: 'safi-fonts-std',
            type: 'std',
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
            options: [],
            type: 'gf',
            attrid: 'safi-fonts-gf',
        }
    ];

    

    const myInterval = useRef();
    const scrolling = useRef( false );

    // const [ready, setReady] = useState( false );
    const clickBlurListener = useRef();

    useEffect( () => {
        if ( expanded === true ) {
            const panel = document.querySelector( '.safi-popover-container' );
            // panel.focus();
            searchInputRef.current.focus();
            clickBlurListener.current = handleBlur;

            
            window.addEventListener( "click", clickBlurListener.current );
        }
        else {
            
            window.removeEventListener( "click", clickBlurListener.current );
            clickBlurListener.current = null;

        }
    }, [expanded] );


    useEffect( () => {

        return () => {
            clearInterval( myInterval.current );
            window.removeEventListener( "click", clickBlurListener.current );
            clickBlurListener.current = null;
        }
    }, [] )

    useEffect( () => {
        setTheFont( value );
    }, [value] )


    const handleScroll = ( e ) => {
        //Indicates that we are scrolling, if the updateScrollFetchFonts is active, it will allow its execution
        scrolling.current = e;
        setTimeout( () => {
            //Set the scrolling indicator at false to prevent from unnecessary requests
            scrolling.current = false;
        }, 500 );
    }

    

    const handleFontSelect = ( font ) => {
        setTheFont( font.font );
        onFontChange( font );

        //close the dropdown
        setExpanded( false );
    }

    const handleFontPreview = ( font ) => {
        // setTheFont( font.font );
        onFontPreview( font );

        //close the dropdown
        // setExpanded( false );
    }

    const handleSearch = ( e ) => {
        const value = e.target.value;
        setSearchValue( value );

        if ( !isPro ) {
            return;
        }
        const filteredFonts = fonts[1].options.filter( item => value === "" || item.value.search( new RegExp( value, "i" ) ) !== -1 );
        let fontFamilies = filteredFonts.slice( 0, 10 ).map( font => font.value ); // first 10
        // scrolling.current = e.target.scrollTop;
        // updateScrollFetchFonts(true);

        if ( value.length < 2 ) {
            return;
        }

        //removes fonts previously loaded
        fontFamilies = fontFamilies.filter( item => loadedFonts.current.includes( item ) === false )

        //Remove duplicates values
        loadedFonts.current = [...new Set( [...loadedFonts.current, ...fontFamilies] )];
        // console.log( fontFamilies, loadedFonts.current );

        //bail if no font to load
        if ( !fontFamilies.length > 0 ) {
            return;
        }

        WebFont.load( {
            google: {
                families: fontFamilies
            },
        } );
    }

    // const handleSearchFocus = ( e ) => {
    //     setSearchValue( "" );
    //     e.target.select();
    // }

    const renderSegments = () => {
        return (

            fonts.map( ( group ) => {
                const filteredFonts = group.options.filter( item => searchValue === "" || item.value.search( new RegExp( searchValue, "i" ) ) !== -1 );
                return (
                    <div className="safi-group">
                        <span id={group.attrid} htmlFor="" className="safi-group-label flex flex-center">{group.label}</span>
                        {filteredFonts.map( item => {
                            return <div
                                className={`safi-dropdown-item flex items-center`}
                                // aria-disabled={segment.isDisabled ? true : false}/
                                title={item.label}
                                data-value={item.value}
                                data-type={group.type}
                                style={{ fontFamily: ( item.value !== null ? item.value : 'initial' ) }}
                                onClick={() => handleFontSelect( {
                                    type: group.type,
                                    font: item.value,
                                } )}
                                onMouseEnter={() => handleFontPreview( {
                                    // type: group.type,
                                    font: item.value,
                                } )}
                            // onMouseLeave={() => handleFontPreview( {
                            //     // type: theFont.type,
                            //     font: initialFont,
                            // } )}
                            >
                                <div className="dropdown-label">{item.label}</div>
                                {/* <div className="dropdown-code">{segment.value}</div> */}

                            </div>
                        } )}
                        {!isPro && group.type === "gf" &&
                            <a href={window.SAFI.gopro_url} target="_blank" className="flex flex-center" style={{ marginBottom: "16px" }}><button id="safi-go-pro" className="safi-tb-btn safi-btn-primary">{__( "Upgrade to Pro now !", "wpjoli-safi" )}</button></a>

                        }
                    </div>
                )
            } )
        );
        // return (

        //     [
        //         { value: null, label: fonts[0].label },
        //         ...fonts[0].options,
        //         { value: null, label: fonts[1].label },
        //         ...fonts[1].options
        //     ].map( ( item ) => {
        //         return <div
        //         className={`safi-dropdown-item flex items-center`}
        //         // aria-disabled={segment.isDisabled ? true : false}/
        //         data-value={item.value}
        //         style={{ fontFamily: ( item.value !== null ? item.value : 'initial' ) }}
        //         onClick={() => onChange( i )}
        //         onMouseEnter={loadFont}
        //     >
        //         <div className="dropdown-label">{item.label}</div>
        //         {/* <div className="dropdown-code">{segment.value}</div> */}

        //     </div>

        //     } )
        // )
    }

    const expandPanel = ( e ) => {
        if ( e.target.type === "text" ) {
            return;
        }
        setExpanded( !expanded );
    }

    const handleBlur = ( e ) => {
        // console.log( e, e.target, e.target.closest( ".safi-font-picker" ) );
        if ( e.target.closest( ".safi-font-picker" ) !== null ) {
            // if ( e.target.classList.contains( "safi-popover-container" ) ) {
            return;
        }
        setExpanded( false );
    }

    const searchInputRef = useRef( null );
    return (
        <div>
            <div
                className="safi-popover-wrap safi-font-picker"
                onClick={expandPanel}
            // onBlur={handleBlur}
            >
                <div className="safi-selected-font"
                    style={{
                        fontFamily: ( theFont !== null ? theFont : 'initial' ),
                        display: ( expanded ? 'none' : 'initial' ),
                    }}
                >{theFont}</div>
                <input
                    type="text"
                    id="safi-font-filter"
                    // autoFocus
                    value={searchValue}
                    onChange={handleSearch}
                    // onFocus={handleSearchFocus}
                    placeholder={__( "Search font...", "wpjoli-safi" )}
                    ref={searchInputRef}
                    style={{
                        display: ( !expanded ? 'none' : 'initial' ),
                    }}
                />
                <div id="font-picker-dropdown" className="safi-popover-toggle" title="Insert content-based text" >
                    <Icon icon={expanded ? 'expand_less' : 'expand_more'} onIconClick={expandPanel} />
                </div>
                <div
                    className={`safi-popover-container` + ( expanded ? '' : ' --hidden' )}
                    tabIndex="0"
                    onScroll={handleScroll}
                    // onBlur={this.onPanelBlur.bind(this)}
                    onMouseLeave={() => handleFontPreview( {
                        // type: theFont.type,
                        font: initialFont,
                    } )}
                >
                    {renderSegments()}
                </div>
            </div>
        </div>
    );

};

export default FontPicker;