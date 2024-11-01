const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
import React from 'react';
import Panel from './Panel';
import IconButtons from '../controls/IconButtons';
import Utils from '../../Utils';

const PanelLayer = ( { element, elements, tree, canvas, ...props } ) => {

    const [currentElement, setCurrentElement] = useState( element );


    useEffect( () => {
        setCurrentElement( element );
    }, [element] );

    const fitToContainer = ( value ) => {
        if ( !value ) {
            return;
        }

        //1. Find parent container or root
        const parent = Utils.getParent( element, elements, tree );

        //2. Caluclate coordinates relative to parent
        let dataChanged = {};

        if ( value === 'fit' || value === 'fit_width' ) {
            if ( parent === 'root' ) {
                dataChanged.x = 0;
                dataChanged.width = canvas.width;
            } else {
                dataChanged.x = 0;
                if ( parent.type === 'container' ) {
                    dataChanged.width = parent.width;
                } else {
                    //set to canvas width if parent is condition
                    dataChanged.width = canvas.width;
                }
                // dataChanged.x = parent.x;
            }
        }

        if ( value === 'fit' || value === 'fit_height' ) {
            if ( parent === 'root' ) {
                dataChanged.y = 0;
                dataChanged.height = canvas.height;
            } else {
                // dataChanged.y = parent.y;
                dataChanged.y = 0;
                if ( parent.type === 'container' ) {
                    dataChanged.height = parent.height;
                } else {
                    //set to canvas width if parent is condition
                    dataChanged.height = canvas.height;
                }
            }

        }
        //3. Set the new data and update
        propDataChanged( dataChanged );
    };

    const alignVertical = ( value ) => {
        align( value, 'v' );
    };

    const alignHorizontal = ( value ) => {
        align( value, 'h' );
    };

    const align = ( value, mode = 'h' ) => {

        //1. Find parent container or root
        let parent = Utils.getParent( element, elements, tree );

        let dataChanged;

        if ( mode === 'h' ) {
            // const lockedAlready = value !== null || element.vAlign !== null;

            dataChanged = {
                hAlign: value,
                // locked: value !== null ? true : lockedAlready, //lock the layer if align
            };
        } else if ( mode === 'v' ) {
            // const lockedAlready = value !== null || element.hAlign !== null;

            dataChanged = {
                vAlign: value,
                // locked: value !== null ? true : lockedAlready, //lock the layer if align
            };
        }

        //
        if ( parent === 'root' ) {
            parent = {
                x: 0,
                y: 0,
                width: canvas.width,
                height: canvas.height,
            }
        }


        // const delta = mode === 'h' ? parent.x : parent.y;
        const delta = 0; // since the position is absolute with parent, no need

        //data to pass onto the actual canvas elements for visual change
        if ( mode === 'h' ) {
            switch ( value ) {
                case 'left':
                    dataChanged.x = 0 + delta;
                    break;

                case 'center':
                    dataChanged.x = ( 0 + delta ) + ( parent.width / 2 ) - ( element.width / 2 );
                    break;

                case 'right':
                    dataChanged.x = ( 0 + delta ) + ( parent.width ) - ( element.width );
                    break;
            }
        } else if ( mode === 'v' ) {
            switch ( value ) {
                case 'top':
                    dataChanged.y = 0 + delta;
                    break;

                case 'center':
                    dataChanged.y = ( 0 + delta ) + ( parent.height / 2 ) - ( element.height / 2 );
                    break;

                case 'bottom':
                    dataChanged.y = ( 0 + delta ) + ( parent.height ) - ( element.height );
                    break;
            }
        }


        propDataChanged( dataChanged );
    }


    /**
     * Passes on the changed data to the React parent
     * Using the onElementDataChange prop
     * @param {Object} data 
     */
    const propDataChanged = ( data, addHistory = true ) => {

        const elementId = currentElement.id;

        // console.log( elementId );
        if ( !elementId ) {
            return;
        }

        props.onElementDataChange( elementId, data, addHistory );
    }


    // console.warn(element.opacity);
    return (
        <Panel header={true} name="Layer">
            <div className="safi-prop-row">
                <div className="safi-prop-col">
                    <div className="safi-prop">
                        <IconButtons svg={true} segments={[
                            {
                                title: __( "Align left", "wpjoli-safi" ),
                                value: 'left',
                                icon: 'alignHorizontalLeft',
                                id: 'align-h-left'
                            },
                            {
                                title: __( "Align center horizontally", "wpjoli-safi" ),
                                value: 'center',
                                icon: 'alignHorizontalCenter',
                                id: 'align-h-center'
                            },
                            {
                                title: __( "Align right", "wpjoli-safi" ),
                                value: 'right',
                                icon: 'alignHorizontalRight',
                                id: 'align-h-right'
                            },
                        ]}
                            // selectedSegment={element.hAlign || -1}
                            // onChangeSegment={alignHorizontal} 
                            onButtonClick={alignHorizontal}
                        />
                    </div>
                </div>
                <div className="safi-prop-col">
                    <div className="safi-prop">
                        <IconButtons svg={true} segments={[
                            {
                                title: __( "Align top", "wpjoli-safi" ),
                                value: 'top',
                                icon: 'alignVerticalTop',
                                id: 'align-v-top'
                            },
                            {
                                title: __( "Align center vertically", "wpjoli-safi" ),
                                value: 'center',
                                icon: 'alignVerticalCenter',
                                id: 'align-v-center'
                            },
                            {
                                title: __( "Align bottom", "wpjoli-safi" ),
                                value: 'bottom',
                                icon: 'alignVerticalBottom',
                                id: 'align-v-bottom'
                            },
                        ]}
                            // selectedSegment={element.vAlign || -1}
                            // onChangeSegment={alignVertical} 
                            onButtonClick={alignVertical}
                        />
                    </div>
                </div>
            </div>
            <div className="safi-prop-row">
                <div className="safi-prop-col">
                    <div className="safi-prop">
                        <IconButtons svg={true} segments={[
                            {
                                title: __( "Fit to container", "wpjoli-safi" ),
                                value: 'fit',
                                icon: 'fit'
                            },
                            {
                                title: __( "Fit height to container", "wpjoli-safi" ),
                                value: 'fit_height',
                                icon: 'fitHeight'
                            },
                            {
                                title: __( "Fit width to container", "wpjoli-safi" ),
                                value: 'fit_width',
                                icon: 'fitWidth'
                            },
                        ]} onButtonClick={fitToContainer} />
                    </div>
                </div>
            </div>
        </Panel>

    );
};

export default PanelLayer;