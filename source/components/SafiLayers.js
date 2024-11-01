const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;
// import React from 'react';
import { ReactSortable } from "react-sortablejs";
import Icon from './Icon';
import SvgIcon from './SvgIcon';
import Utils from '../Utils';


const SafiLayers = ( { elements, tree, selectedLayer, onLayerDragged, onOrderChanged, onLayerSelected, onHovering, onElementDataChange, onAddNewCondition, isMouseDown, infoHelper, onDuplicateLayer, onDeleteLayer, ...props } ) => {
    const [layers, setLayers] = useState( tree || [] );
    const [theSelectedLayer, setTheSelectedLayer] = useState( selectedLayer );
    const [isEditingLabel, setIsEditingLabel] = useState( false );
    const [editingLabel, setEditingLabel] = useState( null );


    const sortableOptions = {
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.65,
        ghostClass: "ghost",
        group: "shared"
    };

    useEffect( () => {
        if ( elements && JSON.stringify( layers ) !== JSON.stringify( tree ) ) {
            setLayers( tree );
        }
        if ( selectedLayer !== theSelectedLayer ) {
            setTheSelectedLayer( selectedLayer );
        }
    }, [tree, selectedLayer] ); //run this code when the value of template changes

    //update list recursively
    const sortList = ( currentList, sortedList, parent ) => {
        // console.log('--- SORTLIST ---');
        // console.log(currentList);
        // console.log(sortedList);
        // console.log(parent);


        for ( let key in currentList ) {

            // console.log(currentList[key].id);
            currentList[key] = currentList[key];
            if ( parent === 'root' ) {
                currentList = sortedList;
            } else if ( currentList[key].id === parent ) {
                currentList[key].children = sortedList;
            } else {
                if ( currentList[key].children ) {
                    sortList( currentList[key].children, sortedList, parent );
                }
            }

        }
        // console.log(currentList);
        return currentList.filter( x => x !== undefined );
    };

    /**
     * Removes 'selected' and 'chosen' props, that are automatically added by ReactSortable to the list
     * @param {*} obj 
     */
    const cleanListProps = ( arr ) => {
        return arr.map( item => {
            return Utils.removeKeys( item, ['selected', 'chosen'] );
        } );
    };

    const setList = ( sortedList, parent ) => {
        // console.log( 'setList ------------------------------' );
        // console.log( sortedList, parent );

        // if (sortedList[0].id === "image-1"){
        //     console.trace();

        // }

        // console.log( parent );
        if ( parent ) {
            // console.log('HAS PARENT');
            const list = sortList( layers, sortedList, parent );

            setLayers( list );
            // console.log( 'SETLAYERS', list );
            // 
            const cleanList = cleanListProps( list )
            onOrderChanged( cleanList, true );
        }
    };

    // const sortUpdated = ( e ) => {
    //     // console.warn( 'SORT UPDATED -----' );
    //     // console.log( [...layers] );
    //     // const cleanList = cleanListProps( [...layers] );
    //     // // console.log( 'onOrderChanged ------------------------------' );
    //     // // console.log( cleanList );
    //     // onOrderChanged( cleanList );
    //     // onLayerDragged( true );
    // };

    // const hasSorted = ( e ) => {
    //     // console.warn( 'HAS SORTED -----' );
    //     // console.log([...layers] );
    //     // console.log( e );
    //     // console.log( e.item.dataset.layerId );

    //     // Utils.getParent()
    //     // console.log( [...layers]  );
    //     // const cleanList = cleanListProps( [...layers] );
    //     // console.log( 'onOrderChanged ------------------------------' );
    //     // console.log( cleanList );
    //     // onOrderChanged( cleanList, true );
    // };

    const selectLayer = ( e ) => {

        //special case
        const isControl = e.target.closest( '.safi-layer-controls' );

        if ( isControl ) {
            //does not select if we clicked a control button
            return;
        }

        const layer = e.target.closest( '.safi-layer' );
        // console.log(e.target);
        const layerId = layer.dataset.layerId;
        // console.log(layerId);

        if ( layerId ) {
            onLayerSelected( layerId );

            setTheSelectedLayer( layerId );
            // this.highlightActiveLayer(layer);

        }

    };


    // highlightActiveLayer(layer) {

    //     const layers = document.getElementsByClassName('safi-layer');
    //     Object.keys(layers).map(index => {
    //         if (layers[index] === layer) {
    //             layers[index].classList.add('--selected')
    //         } else {
    //             layers[index].classList.remove('--selected')
    //         }
    //     });

    // }



    const createChildren = ( item, children, isRoot ) => {
        let childrenObj = {};
        // console.log(item);
        // console.log(item.hasOwnProperty('children') && (item.type === 'container' || item.type === 'columns'));
        // console.log(item.hasOwnProperty('children') ? item.children : {});
        if ( children !== null && ( item.type === 'container' || item.type === 'columns' || item.type === 'conditional' || item.type === 'condition' ) ) {
            childrenObj = {
                children: children.map( child => {
                    const element = elements.find( element => element.id.toLowerCase() == child.id.toLowerCase() );
                    const childrenArr = child.hasOwnProperty( 'children' ) ? child.children : null;
                    // console.log('-----------------------------createChikldnre-------');
                    // console.log(element);
                    // console.log(childrenArr);

                    return createElementDOM( element, childrenArr );
                } )
            }
        };
        // console.log(children);

        if ( ( item.type === 'container' || item.type === 'condition' ) ) {

            return (
                <ReactSortable
                    className="safi-layer-children"
                    {...sortableOptions}
                    list={children !== null ? children : []}
                    // setLiist={this.dragCompleted.bind(this)}
                    setList={
                        ( sortedList, element, store ) => {
                            // console.log('--SET LIST : CONTAINER ---');
                            // console.log('-------------------------element');
                            // console.log(element);
                            // console.log(sortedList);
                            if ( store.dragging && store.dragging.props && JSON.stringify( store.dragging.props.list ) !== JSON.stringify( sortedList ) ) {
                                if ( element ) setList( sortedList, element.options.parent );
                            }
                        }
                    }
                    // onUpdate={sortUpdated}
                    parent={isRoot ? 'root' : item.id.toLowerCase()}
                    // onSort={hasSorted}
                    {...childrenObj}
                />

            );
        } else if ( item.type === 'columns' || item.type === 'conditional' ) {
            return ( <div
                className="safi-layer-children"
                parent={isRoot ? 'root' : item.id.toLowerCase()}
                {...childrenObj}
            />
            );
        }
    };

    const createElementDOM = ( item, children, isRoot = false ) => {

        if ( !item ) {
            return;
        }

        let classes = [
            'safi-layer',
            ( theSelectedLayer == item.id.toLowerCase() ? '--selected' : '' ),
            '--layer-' + item.type.toLowerCase(),
            item.locked ? '--locked' : '',
            item.dynamic ? '--dynamic' : '',
            item.collapsed ? '--collapsed' : '',
            item.hidden ? '--invisible' : '',
            isEditingLabel !== false ? '--is-editing' : '',
        ];

        // console.log(item, item.type === 'conditional' || item.type === 'columns')
        return (
            <div
                key={item.id.toLowerCase()}
                className={classes.filter( item => { return item !== '' } ).join( ' ' )}
                data-layer-id={item.id.toLowerCase()}
                data-layer-label
                draggable="true"
                onClick={selectLayer}
                onMouseOver={( e ) => {
                    e.target.closest( '.safi-layer' ).dataset.layerId == item.id.toLowerCase() &&
                        // item.type !== 'container' && item.type !== 'columns' &&
                        onHovering( item.id.toLowerCase() )
                }}
                onMouseOut={() => { onHovering( null ) }}
            >
                <div className="safi-layer-container" title={item.label}
                    onMouseOver={() => infoHelper( __( "Double click to rename layer / Drag and drop to rearrange the order.", "wpjoli-safi" ) )}
                    onMouseLeave={() => infoHelper( "" )}
                >
                    {
                        ( item.type === 'conditional' || item.type === 'columns' ) &&
                        <div onClick={() => onElementDataChange( item.id.toLowerCase(), { collapsed: !item.collapsed } )} >
                            <Icon icon={!item.collapsed ? 'expand_less' : 'expand_more'} />
                        </div>
                    }
                    <SvgIcon className="safi-layer-icon" icon={item.type.toLowerCase()} />
                    {
                        isEditingLabel !== item.id.toLowerCase() &&
                        <div
                            className="safi-layer-label"
                            onDoubleClick={() => startEditingLabel( item )}
                        >{item.label}</div>
                    }
                    {
                        isEditingLabel === item.id.toLowerCase() &&
                        <div className="safi-layer-label-edit">
                            <input type="text"
                                autoFocus
                                onFocus={( e ) => e.target.select()}
                                value={editingLabel}
                                onChange={( e ) => setEditingLabel( e.target.value )}
                                onKeyDown={( e ) => handleLabelChange( e, item )}
                                onBlur={( e ) => handleLabelOut( e, item )}
                            // onBlur={() => setIsEditingLabel( false )}
                            />
                        </div>
                    }
                    <div className="safi-layer-controls">
                        {item.type !== 'container' && item.type !== 'columns' && item.type !== 'conditional' && item.type !== 'condition' &&
                            <div className="safi-layer-control safi-eye"
                                onClick={() => onElementDataChange( item.id.toLowerCase(), { hidden: !item.hidden } )}
                                title={!item.hidden ? __( "Hide", "wpjoli-safi" ) : __( "Unhide", "wpjoli-safi" )}
                            >
                                <SvgIcon className="safi-layer-icon" icon={!item.hidden ? 'eye' : 'eye_off'} />
                            </div>
                        }
                        {item.type !== 'container' && item.type !== 'columns' && item.type !== 'conditional' && item.type !== 'condition' &&
                            <div className="safi-layer-control safi-lock"
                                onClick={() => onElementDataChange( item.id.toLowerCase(), { locked: !item.locked } )}
                                title={!item.locked ? __( "Lock position & disable on-canvas selection", "wpjoli-safi" ) : __( "Unlock layer", "wpjoli-safi" )}
                            >
                                <SvgIcon className="safi-layer-icon" icon={!item.locked ? 'lock_open' : 'lock'} />
                            </div>
                        }
                        {( item.type === 'text' || item.type === 'image' || item.type === 'icon' || item.type === 'svg' ) &&
                            <div className="safi-layer-control safi-dynamic"
                                onClick={() => onElementDataChange( item.id.toLowerCase(), { dynamic: !item.dynamic } )}
                                title={!item.dynamic ? __( "Make dynamic", "wpjoli-safi" ) : __( "Make static", "wpjoli-safi" )}
                            >
                                <SvgIcon className="safi-layer-icon" icon={!item.dynamic ? 'bolt' : 'bolt'} />
                            </div>
                        }
                        {/* {item.type !== 'container' && item.type !== 'columns' &&
                            <div className="safi-delete-layer"
                                onClick={() => onElementDataChange( item.id, { locked: !item.locked } )}
                            >
                                <SvgIcon className="safi-layer-icon" icon={!item.locked ? 'lock_open' : 'lock'} />
                            </div>
                        } */}
                        { }
                    </div>
                    {/* <div className="safi-layer-actions">
                        <div className="safi-layer-action"
                            onClick={() => onDuplicateLayer( item.id )}
                            title={__( "Duplicate (Alt + D)", "wpjoli-safi" )}
                        >
                            <SvgIcon className="safi-layer-action-icon" icon={'duplicate'} />
                        </div>
                        <div className="safi-layer-action"
                            onClick={() => onDeleteLayer( item.id )}
                            title={__( "Delete (Del)", "wpjoli-safi" )}
                        >
                            <SvgIcon className="safi-layer-action-icon" icon={'trash'} />
                        </div>
                    </div> */}
                </div>
                {createChildren( item, children, isRoot )}
                {/* {(item.type === 'condition' ) && console.log(  item.id, children, item.type, children?.length )} */}
                {/* {<div> Drop layers here</div>} */}
                {( ( !children || !children?.length ) && ( item.type === 'condition' || item.type === 'container' ) ) &&
                    <div className="safi-layer-tip"> Drop layers here</div>
                }
            </div >
        );
    }

    const startEditingLabel = ( item ) => {
        setIsEditingLabel( item.id.toLowerCase() );
        setEditingLabel( item.label );
    }


    const handleLabelChange = ( e, item ) => {
        if ( e.keyCode === 27 ) { //esc
            setIsEditingLabel( false );
        }

        if ( e.keyCode === 13 ) { //enter
            if ( !editingLabel || editingLabel == "" ) {
                alert( "Label cannot be empty" );
                return false;
            }

            setIsEditingLabel( false );
            onElementDataChange( item.id.toLowerCase(), { label: editingLabel } );

        }
        // console.log( e, e.target.value );

    }

    const handleLabelOut = ( e, item ) => {
        if ( !editingLabel || editingLabel == "" ) {
            alert( "Label cannot be empty" );
            return false;
        }
        if ( editingLabel && editingLabel !== "" ) {
            onElementDataChange( item.id.toLowerCase(), { label: editingLabel } );
            setIsEditingLabel( false );
            // onLayerSelected( item.id );
            // setTheSelectedLayer( item.id );
        }

    }


    return (

        <div>
            {
                !tree.length &&
                <div className="no-layers flex flex-center" disabled>{__( "Select a tool to create a layer !", "wpjoli-safi" )}</div>
            }
            <ReactSortable
                id="safi-layers"
                {...sortableOptions}
                // animation={200}
                list={tree}
                setList={
                    ( sortedList, element ) => {
                        // console.log('--SET LIST : LEVEL 1 ---');
                        // console.log(sortedList);
                        // console.log(element);
                        if ( element ) setList( sortedList, 'root' );
                    }
                }
            // key={item.id}
            // parent={null}
            // onUpdate={sortUpdated}
            // onSort={hasSorted}
            >
                {tree.map( ( item ) => {
                    const element = elements.find( element => element.id.toLowerCase() == item.id.toLowerCase() );
                    const children = item.hasOwnProperty( 'children' ) ? item.children : null;
                    // console.log('-----------------------------createEle,emtRoot-------');
                    // console.log(element);
                    // console.log(children);
                    if ( !element ) {
                        return;
                    }
                    return createElementDOM( element, children, true );
                } )}
            </ReactSortable>
        </div>
    );
};

export default SafiLayers;