const { useState, useEffect, useContext } = wp.element;
import { AppContext } from "../../AppContext";
import Icon from '../Icon';

const dynContent = [
    { value: '{{title}}', label: 'Post title' },
    { value: '{{author}}', label: 'Post author' },
    { value: '{{category}}', label: 'Post category' },
    { value: '{{post_type}}', label: 'Post type' },
    { value: '{{meta:meta_name}}', label: 'Meta' },
    { value: '{{date:format}}', label: 'Date' },
    { value: '{{domain}}', label: 'Site domain' },
];

const dynContentPro = [
    { value: '{{acf:field}}', label: 'ACF Field' },
    { value: '{{yoast_focus_kw}}', label: 'Yoast SEO focus keyphrase' },
    { value: '{{rankmath_focus_kw}}', label: 'RankMath SEO focus keyword' },
    { value: '{{my_function()}}', label: 'Custom function' },
];

const DynamicText = ( { value, ...props } ) => {

    const isPro = useContext( AppContext );

    const dynContentList = isPro ? [...dynContent, ...dynContentPro] : dynContent;

    const [expanded, setExpanded] = useState( false );
    const [dynamicContent, setDynamicContent] = useState( props.list || dynContentList );
    const [theValue, setTheValue] = useState( value || null );

    const [list, setList] = useState( null );
    const [listLabel, setListLabel] = useState( "Select a field" );

    useEffect( () => {
        if ( expanded === true ) {
            const panel = document.querySelector( '.safi-popover-container' );
            panel.focus();
        }
    }, [expanded] );

    const [ready, setReady] = useState( false );

    useEffect( () => {

        setReady( true );

    }, [] )
    useEffect( () => {

        if ( theValue && theValue.includes( "{{acf:" ) === true ) {
            //List of all post categories
            const acf = window.SAFI.acfFields || [];
            setList( acf );
            setListLabel( "Select an ACF field" );
        }
        // else if ( compareWith === "{{date:format}}" ) {
        //     const dateFormats = [
        //         { value: '{{date:d/m/Y}}', label: '01/01/2023' },
        //     ];
        //     setList( dateFormats );
        // }
        else {
            setList( null )
            setListLabel( "Select a field" );
        }
    }, [ready, theValue] );

    const onChange = ( selectedSegment ) => {
        // this.setState({ selectedSegment });

        const content = dynamicContent;
        const value = content[selectedSegment].value;
        setTheValue( value );

        if ( props.onTextSelected ) {
            props.onTextSelected( value );
        }

        setExpanded( !expanded );

    };

    const renderSegments = () => {
        const content = dynamicContent;

        return (
            content.map( ( segment, i ) => {
                return (
                    <div
                        className={`safi-dropdown-item flex`}
                        // aria-disabled={segment.isDisabled ? true : false}/
                        data-value={segment.value}
                        onClick={() => onChange( i )}
                    >
                        <div className="dropdown-label">{segment.label}</div>
                        <div className="dropdown-code">{segment.value}</div>

                    </div>
                );
            } )
        )
    }

    const expandPanel = ( e ) => {
        setExpanded( !expanded );
    }

    const getOptions = () => {
        if ( list && list.length > 0 ) {

            return list.map( ( item ) => {

                const acfMeta = theValue.slice( 0, -2 ).replace( "{{acf:", "" );
                return (
                    <option value={item.value} selected={item.value === acfMeta}>{item.label}</option>
                )
            } );
        }
    }

    const handleListChange = ( e ) => {

        const selectedValue = e.target.value;

        if ( selectedValue == "0" ) {
            return false;
        }

        if ( theValue && theValue.includes( "{{acf:" ) === true ) {

            const acfValue = "{{acf:" + selectedValue + "}}";

            setTheValue( acfValue );

            if ( props.onTextSelected ) {
                props.onTextSelected( acfValue );
            }

        }
    }


    return (
        <div>
            {list &&
                <div>
                    {/* <label for="dyn-options">Select a field</label> */}
                    <select
                        id="dyn-options"
                        className="safi-plain"
                        onChange={handleListChange}>
                        <option value="0">{listLabel}</option>
                        {getOptions()}
                    </select>
                </div>
            }
            <div className="safi-popover-wrap">
                {props.children}
                <div id="dynamic-text-dropdown" className="safi-popover-toggle" title="Insert content-based text" >
                    <Icon icon={expanded ? 'expand_less' : 'expand_more'} onIconClick={expandPanel} />
                </div>
                <div
                    className={`safi-popover-container` + ( expanded ? '' : ' --hidden' )}
                    tabIndex="0"
                // onBlur={this.onPanelBlur.bind(this)}
                >
                    {renderSegments()}
                </div>
            </div>
        </div>
    );

};

export default DynamicText;