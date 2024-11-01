const { useState, useEffect, useRef, useContext, useCallback } = wp.element;
const { applyFilters, doAction, createHooks } = wp.hooks;
const { __ } = wp.i18n;

import SvgIcon from './components/SvgIcon';
import SafiToolbar from './components/SafiToolbar';
import SafiCanvas from './components/SafiCanvas';
import SafiSidebar from './components/SafiSidebar';
import Utils from './Utils';
import SafiTemplateSettings from './components/SafiTemplateSettings';
import Panel from './components/panels/Panel';
import SafiLayers from './components/SafiLayers';
import PanelColors from './components/panels/PanelColors';
import PanelLayer from './components/panels/PanelLayer';
import PanelProperties from './components/panels/PanelProperties';
import PanelText from './components/panels/PanelText';
import PanelCSS from './components/panels/PanelCSS';
import PanelBorder from './components/panels/PanelBorder';
import PanelImage from './components/panels/PanelImage';
import ElementDefaults from './ElementDefaults';
import PanelMarginPadding from './components/panels/PanelMarginPadding';
import ToggleIconButton from './components/ToggleIconButton';

import useUndoRedo from './use-undo-redo';

// import apiFetch from '@wordpress/api-fetch';
const apiFetch = wp.apiFetch;
import Preview from './components/Preview';
import PanelSVG from './components/panels/PanelSVG';

import svgPathIcons from './SvgPathIcons';
import { AppContext } from './AppContext';
import SafiModal from './components/ui/SafiModal';
import HelpMenu from './components/HelpMenu';
import ShortcutsPane from './components/ShortcutsPane';

// localStorage.clear();
// localStorage.setItem("safi-intro", null);
const isFirstTime = localStorage.getItem( "SAFI_INTRO" ) === null;

const SafiEditor = ( { context, showEditor, template, templateId, options, isSaving, hasSaved, onSaveTemplate, onClose, previewHTML, previewData, showPreview, onPreviewLoaded, onPreviewClose, onImageCreated, onImageURLCreated, onFeaturedImageGenerated, onChangeDemoTemplate } ) => {
    const [activeTool, setActiveTool] = useState( 'select' );
    const [selectedLayer, setSelectedLayer] = useState( null );
    const [selectedElement, setSelectedElement] = useState( null );
    const [hoveringLayer, setHoveringLayer] = useState( null );
    const [isEditing, setIsEditing] = useState( false );
    const [showGrid, setShowGrid] = useState( false );
    const [startedSaving, setStartedSaving] = useState( false );

    const [faIcons, setFaIcons] = useState( [] );

    const [showExitModal, setShowExitModal] = useState( false );

    // const data = template?.content || null;

    const [currentKeyPressed, setCurrentKeyPressed] = useState( null );
    const [infoHelper, setInfoHelper] = useState( "" );

    const starterTemplates = window.SAFI.demo_templates || [];

    const [isTourMode, setIsTourMode] = useState( false );
    const [showShortcuts, setShowShortcuts] = useState( false );

    const isPro = useContext( AppContext );

    const initialData = useRef( {
        canvas: template?.content?.canvas || null,
        tree: template?.content?.tree || [],
        elements: template?.content?.elements || [],
    } );


    const {
        resetState,
        state,
        setState,
        setTreez,
        setElementz,
        setCanvaz,
        setStateNH,
        setTreeNH,
        setElementsNH,
        setCanvasNH,
        setStateSnapshot,
        undo,
        redo,
        isUndoPossible,
        isRedoPossible,
        // pastStates,
        // futureStates
    } = useUndoRedo( initialData.current );

    const canvasRef = useRef();
    let isMouseDown = useRef( false );

    const safiWrapper = useRef( null );

    const untitledTemplateStr = "Untitled template";

    const zoomLevels = [
        0.1,
        0.2,
        0.25,
        0.333333,
        0.5,
        0.666666,
        0.75,
        0.8,
        0.9,
        1,
        1.1,
        1.2,
        1.25,
        1.5,
        1.75,
        2,
        2.5,
        3,
        3.5,
        4,
        4.5,
        5,
    ]

    /**
     * Alt + wheel to zoom in/out
     * @param {*} e 
     */
    const handleWheel = ( e ) => {
        if ( e.altKey ) {
            e.preventDefault();

            if ( e.deltaY < 0 ) {
                increaseZoom();
            } else if ( e.deltaY > 0 ) {
                decreaseZoom();
            }

        }
    };

    useEffect( () => {
        //Creates a new wp.media instance and only one
        window.safiWpMedia = wp.media( {
            title: 'Select or Upload an image',
            button: {
                text: 'Use this image'
            },
            multiple: false  // Set to true to allow multiple files to be selected
        } );

        return () => {
            //delete our instance of wp.media on compnent unmount 
            window.safiWpMedia.detach();
            window.safiWpMedia = null;
        }
    }, [] );

    const canvasRefCallback = useCallback(
        ( node ) => {
            // console.log( node );
            if ( node == null ) {
                if ( canvasRef.current != null ) {
                    /* This happens when the <div> component tries to detach the old divRefCallback.
                     * Since we are inside a `useCallback`, the `onWheel` callback being remove is still the old one here.
                     */
                    canvasRef.current.removeEventListener( 'wheel', handleWheel, { passive: false } );
                }
                return;
            }
            canvasRef.current = node;
            node.addEventListener( 'wheel', handleWheel, { passive: false } );
        },
        [handleWheel],
    );

    

    // async function fetchSiteLogo() {

    //     apiFetch( {
    //         path: '/safi/v1/site-logo',
    //         method: 'GET',
    //         // data: {
    //         //     imageData: imageData,
    //         // },
    //     } ).then( ( res ) => {
    //         // console.log( res );
    //         setSiteLogo( res.logo )

    //     } ).catch( ( e ) => {
    //         // console.log( e );
    //         alert( __( 'An error occured, try again.', 'wpjoli-safi' ) );
    //     } );
    // }

    // useEffect( () => {

    //     const handleDocKeyPress = (e) => {
    //         // e.preventDefault();
    //         handleCanvasKeyDown(e);
    //     };

    //     document.addEventListener( 'keydown', handleDocKeyPress, true );

    //     return () => {
    //         document.removeEventListener( 'keydown', handleDocKeyPress );
    //     };

    // }, [] );


    /**
     * Load a template
     */
    useEffect( () => {
        if ( template && !isEditing && template.id !== '00000000' ) {
            // console.log( "loadTemplate" )
            loadTemplate();
        }
    }, [template] ); //run this code when the value of template changes

    /**
     * Centers the canvas as soon as we load a new template 
     */
    useEffect( () => {
        if ( isEditing ) {
            centerCanvas();
        }
    }, [isEditing] );

    /**
     * Show either the Help or Shortcut panel
     */
    useEffect( () => {
        if ( isTourMode === true ) {
            if ( showShortcuts === true ) {
                setIsTourMode( false );
            }
        }
    }, [showShortcuts] );

    /**
     * Show either the Help or Shortcut panel
     */
    useEffect( () => {
        if ( showShortcuts === true ) {
            if ( isTourMode === true ) {
                setShowShortcuts( false );
            }
        }
    }, [isTourMode] );


    /**
     * 
     */
    useEffect( () => {
        if ( showEditor ) {
            //Sets the focus to the app to allow keypress directly such as esc etc
            canvasRef.current.focus();
        }

        if ( showEditor && !template ) {

            try {
                // data = JSON.parse(sample);
                // data = template;

                setActiveTool( 'select' );
                setSelectedLayer( null );
                setSelectedElement( null );

                resetState();
                setStateNH( {
                    ...state,
                    elements: [],
                    tree: [],
                } );

                initialData.current = {
                    canvas: template?.content?.canvas || null,
                    tree: template?.content?.tree || [],
                    elements: template?.content?.elements || [],
                };
                // initCanvas( null );


                // options: this.props.options,

            } catch ( e ) {
                // console.warn( e ); // error in the above string (in this case, yes)!
                return false;
            }
        }//
    }, [showEditor] );

    

    useEffect( () => {
        const element = state.elements.find( element => element.id == selectedLayer );
        if ( element ) {
            setSelectedElement( element );
        }
        // }
    }, [state.elements] ); //


    

    const handleClose = () => {
        //Check for changes since the template has loaded
        //if no start screen and some changes occured
        if ( !showWelcomeOverlay && JSON.stringify( initialData.current ) !== JSON.stringify( state ) ) {
            setShowExitModal( true );
            return;
        }

        setIsEditing( false );
        setIsTourMode( false );
        setShowShortcuts( false );

        onClose();
    }

    /**
     * Handles the modal response upopn closing and some changes happened
     * @param {*} response 
     */
    const handleExit = ( response ) => {
        //YES
        if ( response === 1 ) {
            saveTemplate( true );
        }
        //NO
        else if ( response === 0 ) {
            setIsEditing( false );
            setIsTourMode( false );
            setShowShortcuts( false );
            onClose();
            setShowExitModal( false );
        }
        //CANCEL
        else if ( response === -1 ) {
            setShowExitModal( false );
        }
    }

    const loadDemoTemplate = ( template ) => {
        onChangeDemoTemplate( template );
    }

    const loadTemplate = () => {
        // if ( template === null ) {
        //     return;
        // }

        

        try {
            // data = JSON.parse(sample);
            // data = template;

            setActiveTool( 'select' );
            setSelectedLayer( null );
            setSelectedElement( null );

            resetState();

            // const elems = template?.content?.elements.map( item => {
            //     item.type = item.type.toLowerCase();
            //     item.id = item.id.toLowerCase();
            //     return item;
            // } );
            // console.log(template?.content?.elements);
            setStateNH( {
                ...state,
                elements: template?.content?.elements || [],
                tree: template?.content?.tree || [],
            } );

            

            if ( isPro === false ) {
                initCanvas( template );
            }

            // options: this.props.options,

        } catch ( e ) {
            // console.warn( e ); // error in the above string (in this case, yes)!
            return false;
        }

    };

    const initCanvas = ( template ) => {

        setCanvasNH( {
            templateName: template?.content?.canvas.templateName || untitledTemplateStr,
            width: parseFloat( template?.content?.canvas.width || options.defaultWidth || 1200 ),
            height: parseFloat( template?.content?.canvas.height || options.defaultHeight || 624 ),
            // options: {
            googleFonts: template?.content?.canvas.googleFonts || [],
            backgroundColor: template?.content?.canvas.backgroundColor || options.defaultBackgroundColor || '#ffffff',
            zoom: parseFloat( template?.content?.canvas.zoom || 1 ),
            gridSize: parseInt( template?.content?.canvas.gridSize || options.defaultGridSize || 24 ),
            globalCss: ( template?.content?.canvas.globalCss || null ),
        } );

        setIsEditing( true );

        initialData.current = {
            canvas: template?.content?.canvas || null,
            tree: template?.content?.tree || [],
            elements: template?.content?.elements || [],
        };

        //Load the UI tour if first time
        if ( isFirstTime ) {
            setIsTourMode( true )
        }

    }

    const centerCanvas = () => {
        const canvasEl = document.getElementById( 'safi-canvas-wrap' );

        if ( canvasEl !== null && state.canvas ) {
            canvasEl.scrollTo(
                canvasEl.scrollWidth / 2 - state.canvas.width / 2 - ( canvasEl.offsetWidth - state.canvas.width ) / 2,
                canvasEl.scrollHeight / 2 - state.canvas.height / 2 - ( canvasEl.offsetHeight - state.canvas.height ) / 2
            );
        }
    }


    const [saveAndClose, setSaveAndClose] = useState( false );

    const saveTemplate = ( close = false ) => {

        //Catch an unnamed template to force the user to create a custom name
        if ( state.canvas.templateName === untitledTemplateStr ) {
            if ( confirm( "You haven't set a name for your template yet. Set a name now before saving ?" ) ) {
                doDeselect();
                setShowExitModal( false );
                setTimeout( () => {
                    const a = document.getElementById( 'safi-tpl-name' );
                    a.select();
                }, 50 );
                return;
            }
        }

        setSaveAndClose( close ); // let know that we want to close after saving
        setSelectedLayer( null );
        setSelectedElement( null );
        setShowGrid( false );
        setStartedSaving( true );

    }

    /**
     * Triggers avec the save has been completed
     */
    useEffect( () => {
        if ( isSaving === false && saveAndClose === true ) {
            setIsEditing( false );
            setIsTourMode( false );
            setShowShortcuts( false );
            setShowExitModal( false );
            onClose();
        }
    }, [isSaving] );

    useEffect( () => {
        if ( saveAndClose === true ) {
            setIsEditing( false );
            setIsTourMode( false );
            setShowShortcuts( false );
            setShowExitModal( false );
            onClose();
        }
    }, [hasSaved] );


    useEffect( () => {
        if ( startedSaving ) {

            const initialZoom = state.canvas.zoom;

            const jsonOutput = stringifyTemplate();

            //Get a screenshot of the canva
            const canvasOuterEl = document.getElementById( "safi-canvas-outer" );
            if ( initialZoom !== 1 ) {
                canvasOuterEl.style.transform = "scale(1)";
            }

            const canvasEl = document.getElementById( "safi-canvas" );

            const thumbWidth = context === "gutenberg" ? 250 : 500;
            //sets the scale so that the image will not exceed 500 in width. This prevents hugs image data from being sent to the server for the thumbnails
            const cScale = 1 / ( state.canvas.width / thumbWidth );

            const h2cOptions = {
                useCORS: true,
                width: state.canvas.width,
                height: state.canvas.height,
                scale: cScale,
            };

            html2canvas( canvasEl, h2cOptions ).then( function ( canvas ) {
                if ( initialZoom !== 1 ) {
                    canvasOuterEl.style.transform = "scale(" + initialZoom + ")";
                }

                var canvasResized = canvas;
                // var ctx = canvasResized.getContext( "2d" );
                // ctx.canvasResized.width = state.canvas.width / 2;
                // ctx.canvasResized.height = state.canvas.height / 2;

                //Low qual jpg for thumbs in gutemberg, better quality for the editor
                var imageData = context === "gutenberg" ? canvasResized.toDataURL( "image/jpeg", 0.5 ) : canvasResized.toDataURL( "image/png" );

                // console.log( imageData.length );

                // var img = document.createElement( "img" );

                // var ctx = canvasResized.getContext( "2d" );
                // ctx.drawImage( img, 0, 0, state.canvas.width / 2, state.canvas.height / 2 );

                // var dataurl = canvasResized.toDataURL( "image/png" );
                // console.log( jsonOutput );

                onSaveTemplate( jsonOutput, imageData );
                setStartedSaving( false );

                initialData.current = { ...state };

            } );
        }
    }, [startedSaving] );

    const stringifyTemplate = () => {
        const output = state;
        const jsonOutput = JSON.stringify( output );

        return jsonOutput;
    }

    const canvasName = ( () => {
        return state.canvas !== null ? state.canvas.templateName : untitledTemplateStr;
    } )();

    const canvasZoom = ( () => {
        return state.canvas !== null ? Math.round( state.canvas.zoom * 100 ) : 100;
    } )();

    const tools = svgPathIcons.tools;
    const gridIcon = svgPathIcons.gridIcon;

    /**
     * Checks the max number of elements for the free plan. Linit is 2
     * @returns boolean
     */
    const checkElementCount = () => {

        const currentElementCount = state.elements.length;

        if ( !isPro === true && currentElementCount >= ( 10 / 5 ) ) {
            alert( __( "Your current plan has a limit of 2 layers. Upgrade to Pro for unlimited layers.", "wpjoli-safi" ) );
            return false;
        }

        return true;
    }

    /**
     * Handles the key press in the UI as shortcuts for selecting a tool
     * @param {*} e 
     */
    const handleCreateElement = element => {

        if ( !checkElementCount() ) {
            return false;
        }

        let newObject;
        const generateNaming = Utils.generateIDLabel( activeTool, state.elements );

        // if ( activeTool === 'text' ) {
        const baseProps = Object.assign( {}, ElementDefaults.defaults[activeTool], {
            // type: "text",
            id: generateNaming.id,
            label: generateNaming.label,
        } );

        // text: "New text",
        newObject = { ...baseProps, ...element };
        // }

        addElements( [newObject] );
        setSelectedLayer( newObject.id );
        setSelectedElement( newObject );
        setActiveTool( "select" );

        const tuto = getDriverTuto();
        if ( !tuto ) return;
        if ( tuto === "tuto-dynamic-layers" ) {
            if ( driver.getActiveIndex() === 2 && newObject.type === "text" ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }
        if ( tuto === "tuto-dynamic-text" || tuto === "tuto-style-text" ) {
            if ( driver.getActiveIndex() === 1 && newObject.type === "text" ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }
        else if ( tuto === "tuto-image-background" ) {
            if ( driver.getActiveIndex() === 1 && newObject.type === "image" ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }
        else if ( tuto === "tuto-perfect-square" ) {
            if ( driver.getActiveIndex() === 2 && newObject.type === "rect" ) {
                // if ( newObject.width === newObject.height ) {
                setTimeout( () => driver.moveNext(), 100 );
                // }
            }
        }
        else if ( tuto === "tuto-move-fixed-axis" ) {
            if ( driver.getActiveIndex() === 1 && newObject.type === "rect" ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }
        else if ( tuto === "tuto-grid" ) {
            if ( driver.getActiveIndex() === 3 && newObject.type === "rect" ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }
        else if ( tuto === "tuto-rounded-corners" ) {
            if ( driver.getActiveIndex() === 1 && newObject.type === "rect" ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }
        else if ( tuto === "tuto-resize-from-center" ) {
            if ( driver.getActiveIndex() === 1 && newObject.type === "rect" ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }

    };

    const handleSelectElement = id => {
        const element = state.elements.find( element => element.id == id );
        setSelectedLayer( id );
        setSelectedElement( element );
    };

    const addElements = ( newElements, treeChunk = null ) => {
        // console.log( newElements );
        if ( !newElements ) {
            return;
        }

        let elementsData = [...state.elements];
        let treeData = [...state.tree];

        newElements.map( ( item ) => {
            elementsData.unshift( item );
        } )

        //if not supplied, we create a copy with only the ID
        if ( treeChunk == null ) {
            treeChunk = newElements.map( item => { return { id: item.id } } )
        }

        treeChunk.map( ( item ) => {
            treeData.unshift( item );
        } )

        setState( {
            ...state,
            elements: elementsData,
            tree: treeData,
        } );

        // this.pushHistory( 'addElements' );
    }

    const handleCanvasKeyDown = e => {

        if ( document.activeElement.tagName === "BODY" || e.target.id === "safi-layers-wrap" ) {
            switch ( e.keyCode ) {
                case 46: //DELETE
                    deleteActiveSelection();
                    break;
                case 68: // d
                    if ( e.altKey ) {
                        e.preventDefault();

                        duplicateLayer();
                    }
                    break;

            }
        }
        // console.log( e, e.keyCode, e.target.id, e.target.class );
        if ( (
            document.activeElement.tagName === "BODY"
            || e.target.id === "safi-app"
            || e.target.id === "safi-canvas"
            || e.target.id === "safi-wrap"
        ) &&
            (
                e.altKey === false &&
                ( e.ctrlKey === false || e.metaKey === false ) &&
                e.shiftKey === false
            )

        ) {

            switch ( e.keyCode ) {
                case 27: // esc
                    if ( !( isSaving || startedSaving ) ) {
                        handleClose();
                    }
                    break;
                case 46: //DELETE
                    deleteActiveSelection();
                    break;
                case 86: // v
                    setActiveTool( 'select' );
                    break;
                case 84: // t
                    setActiveTool( 'text' );
                    break;
                case 82: // r
                    setActiveTool( 'rect' );
                    break;
                case 67: // c
                    setActiveTool( 'circle' );
                    break;
                case 73: // i
                    setActiveTool( 'image' );
                    break;
                case 68: // d
                    isPro && setActiveTool( 'dynamicimage' );
                    break;
                case 70: // f
                    isPro && setActiveTool( 'icon' );
                    break;
                case 83: // s
                    isPro && setActiveTool( 'svg' );
                    break;
                case 88: // x
                    isPro && setActiveTool( 'conditional' );
                    break;
                case 222: // #
                    // console.log( showGrid );

                    setShowGrid( !showGrid );
                    break;
            }
        } else {

            switch ( e.keyCode ) {
                case 68: // d
                    if ( e.altKey ) {
                        e.preventDefault();
                        duplicateLayer();
                    }
            }
        }

        switch ( e.keyCode ) {
            case 89: // Y => ctrl + y
                if ( ( e.ctrlKey === true || e.metaKey === true ) && isRedoPossible ) {
                    redo();
                }
                break;
            case 90: // Z => ctrl + z
                if ( ( e.ctrlKey === true || e.metaKey === true ) && isUndoPossible ) {
                    undo();
                }
                break;
            case 68: // D
                if ( ( e.ctrlKey === true || e.metaKey === true ) ) {
                    e.preventDefault();
                    doDeselect();
                    setInfoHelper( "" );
                }
                break;
        }
    };


    const resetZoom = () => {
        let options = { ...state.canvas };
        options.zoom = 1;
        setCanvasNH( options );
    };

    const increaseZoom = () => {
        const currentIndex = zoomLevels.indexOf( state.canvas.zoom );
        if ( zoomLevels[currentIndex + 1] !== undefined ) {
            setZoom( zoomLevels[currentIndex + 1] );
        }
    };

    const decreaseZoom = () => {
        const currentIndex = zoomLevels.indexOf( state.canvas.zoom );
        if ( zoomLevels[currentIndex - 1] !== undefined ) {
            setZoom( zoomLevels[currentIndex - 1] );
        }
    };

    const setZoom = ( zoomValue ) => {
        let options = { ...state.canvas };
        options.zoom = zoomValue;
        setCanvasNH( options );
    };

    const elementsOrderChanged = ( elems, addHistory = false ) => {

        const orderedElements = elems;//.slice(0).reverse();

        // setTree( orderedElements );
        if ( addHistory ) {
            setTreez( orderedElements );
        } else {
            setTreeNH( orderedElements );
        }

    };


    const selectElementFromLayer = ( layerId ) => {

        if ( !layerId ) {
            return;
        }

        setSelectedLayer( layerId );

        const theSelectedElement = state.elements.find( element => element.id === layerId );

        setSelectedElement( theSelectedElement );

    };

    const deleteActiveSelection = ( elId = null ) => {
        let theElementId = selectedLayer;

        if ( elId !== null ) {
            const theElement = state.elements.find( element => element.id == elId );

            if ( theElement ) {
                theElementId = theElement.id;
            }
            // console.log( theElement );
        }
        if ( !theElementId ) {
            return;
        }

        let elementsNew = [...state.elements];
        let treeNew = [...state.tree];


        treeNew = Utils.deleteElementRecursive( treeNew, theElementId );

        // elementsNew = elementsNew.filter( item => item.id !== selectedLayer );

        const extractUids = ( o ) =>
            [o.id, ... ( o.children || [] ).flatMap( extractUids )];

        //Gathers all the element ids from the tree in a linear array
        var ids = [];
        for ( const element of treeNew ) {
            const eid = extractUids( element );
            ids = ids.concat( eid );
        }

        //remove all elements that are not present in the tree
        elementsNew = elementsNew.filter( item => true === ids.includes( item.id ) );
        // console.log( elementsNew );

        setState( {
            ...state,
            elements: elementsNew,
            tree: treeNew,
        } );

        setSelectedLayer( null );
        setSelectedElement( null );

        // this.pushHistory( 'deleteActiveSelection' );

    };

    const elementChanged = ( elementId, data, addHistory = false ) => {
        updateElement( elementId, data, addHistory );

        const tuto = getDriverTuto();
        if ( !tuto ) return;
        if ( tuto === "tuto-style-text" ) {
            // console.log( driver.getActiveIndex(), data );
            if ( driver.getActiveIndex() === 3 && data.text === "{{title}}" ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
            else if ( driver.getActiveIndex() === 5 && data?.lineHeight == 1.3 ) {
                setTimeout( () => driver.moveNext(), 100 );
                data.padding = {};
                updateElement( elementId, data, addHistory );
            }
            else if ( driver.getActiveIndex() === 6 && data?.padding?.top == 20 ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }
        else if ( tuto === "tuto-dynamic-layers" ) {
            if ( driver.getActiveIndex() === 3 && data.dynamic === true ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }
        else if ( tuto === "tuto-image-background" ) {
            if ( driver.getActiveIndex() === 3 && data.srcMedia ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }
        else if ( tuto === "tuto-grid" ) {
            if ( addHistory === true && driver.getActiveIndex() === 4 ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }
        else if ( tuto === "tuto-rounded-corners" ) {
            if ( driver.getActiveIndex() === 2 && data.borderRadius?.topLeft ) {
                driver.moveNext();
            }
            if ( driver.getActiveIndex() === 3 && addHistory ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }
        else if ( tuto === "tuto-resize-from-center" ) {
            if ( driver.getActiveIndex() === 5 && ( data.x || data.y ) ) {
                driver.moveNext();
            }
        }
    }

    const updateStyle = ( elementId, property, value, addHistory = false ) => {
        let items = [...state.elements];

        //Find the element by ID
        for ( let i = 0; i < items.length; i++ ) {
            if ( items[i].id == elementId ) {
                let item = { ...items[i] };

                let elementStyles = { ...item.styles };
                elementStyles[property] = value;

                item.styles = elementStyles;
                //merge new values (data) with old ones
                items[i] = item;

                if ( addHistory ) {
                    setElementz( items );
                } else {
                    setElementsNH( items );
                }
                // setElements( items );
                break;
            }
        }

        //Tutorial specific actions
        const tuto = getDriverTuto();
        if ( !tuto ) return;
        if ( tuto === "tuto-style-text" ) {
            if ( driver.getActiveIndex() === 7 && property == "alignItems" && value == 'center' ) {
                setTimeout( () => driver.moveNext(), 100 );
            }
        }

    }

    const updateStyles = ( elementId, newStyles, addHistory = false ) => {
        let items = [...state.elements];

        //Find the element by ID
        for ( let i = 0; i < items.length; i++ ) {
            if ( items[i].id == elementId ) {
                let item = { ...items[i] };

                let elementStyles = { ...item.styles, ...newStyles };

                item.styles = elementStyles;
                //merge new values (data) with old ones
                items[i] = item;
                if ( addHistory ) {
                    setElementz( items );
                } else {
                    setElementsNH( items );
                }
                break;
            }
        }

    }

    const updateElement = ( elementId, data, addHistory = false ) => {

        let items = [...state.elements];

        //Find the element by ID
        for ( let i = 0; i < items.length; i++ ) {
            if ( items[i].id == elementId ) {
                // console.log('ID FOUND--------------------------' + elementId);
                let item = { ...items[i] };

                //merge new values (data) with old ones
                const updatedValues = { ...item, ...data };
                // console.log(updatedValues);
                items[i] = updatedValues;

                if ( addHistory === true ) {
                    // console.warn( 'updateElement Add history', items );
                    setElementz( items );
                } else {
                    // console.warn( 'updateElement no history', items );
                    setElementsNH( items );
                }

                break;
            }
        }
    }

    const layersHovering = ( id ) => {
        if ( hoveringLayer !== id ) {
            // console.log('hovering', id);
            setHoveringLayer( id )
        }
    }

    const updateCanvas = ( data, addHistory = true ) => {
        if ( data.width > 5000 || data.height > 5000 ) {
            alert( __( "Max width/height of 5000 exceeded", "wpjoli-safi" ) );
            // return false;
        }
        if ( data.width > 5000 ) {
            data.width = 5000;
            // return false;
        }
        if ( data.height > 5000 ) {
            data.height = 5000;
            // return false;
        }
        // console.log( data );
        if ( addHistory === true ) {
            setCanvaz( data );
        } else {
            setCanvasNH( data );
        }

        setTimeout( () => centerCanvas(), 100 );
    }

    const renderPanels = ( () => {

        if ( !selectedLayer ) {
            return (
                <SafiTemplateSettings
                    canvas={state.canvas}
                    onCanvasDataChange={( canvasData, addHistory ) => { updateCanvas( canvasData, addHistory ) }}
                    onTriggerSnapshot={() => setStateSnapshot()}
                />
            );
        }

        const selectedElement = state.elements.find( element => element.id === selectedLayer );

        //If no element selected show template settings
        if ( !selectedElement ) {
            return;
        }

        switch ( selectedElement.type.toLowerCase() ) {

            
            case 'text':
                return (
                    <div>
                        <PanelLayer
                            element={selectedElement}
                            elements={state.elements}
                            tree={state.tree}
                            canvas={state.canvas}
                            onElementDataChange={elementChanged}
                        />
                        <PanelProperties
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                        />
                        <PanelText
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                            onStyleUpdate={updateStyle}
                            onStylesUpdate={updateStyles}
                            onTriggerSnapshot={( val ) => setStateSnapshot( val )}
                            googleFonts={options.googleFonts}
                            isMouseDown={isMouseDown.current}
                        />
                        <PanelColors
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                            onStyleUpdate={updateStyle}
                            isMouseDown={isMouseDown.current}
                            onTriggerSnapshot={() => setStateSnapshot()}
                        />
                        <PanelBorder
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                            onStyleUpdate={updateStyle}
                            onTriggerSnapshot={() => setStateSnapshot()}
                        // isMouseDown={this.state.mouseIsDown}
                        />
                        <PanelMarginPadding
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                        />
                        <PanelCSS
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                        />
                    </div>
                );
            case 'rect':
            case 'circle':
                return (
                    <div>
                        <PanelLayer
                            element={selectedElement}
                            elements={state.elements}
                            tree={state.tree}
                            canvas={state.canvas}
                            onElementDataChange={elementChanged}
                        />
                        <PanelProperties
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                        />
                        <PanelColors
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                            onStyleUpdate={updateStyle}
                            onTriggerSnapshot={() => setStateSnapshot()}
                        // isMouseDown={this.state.mouseIsDown}
                        />
                        <PanelBorder
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                            onStyleUpdate={updateStyle}
                            onTriggerSnapshot={() => setStateSnapshot()}
                        // isMouseDown={this.state.mouseIsDown}
                        />
                        <PanelMarginPadding
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                        />
                        <PanelCSS
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                        />
                    </div>
                );
            case 'image':
                return (
                    <div>
                        <PanelLayer
                            element={selectedElement}
                            elements={state.elements}
                            tree={state.tree}
                            canvas={state.canvas}
                            onElementDataChange={elementChanged}
                        />
                        <PanelProperties
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                        />
                        <PanelImage
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                            canvas={state.canvas}
                        />
                        <PanelBorder
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                            onStyleUpdate={updateStyle}
                            onTriggerSnapshot={() => setStateSnapshot()}
                        // isMouseDown={this.state.mouseIsDown}
                        />
                        <PanelMarginPadding
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                        />
                        <PanelCSS
                            element={selectedElement}
                            onElementDataChange={elementChanged}
                        />
                    </div>
                );
            
        }
    } )();

    

    const duplicateLayer = ( elId = null ) => {
        let theElement = selectedElement;
        if ( elId !== null ) {
            theElement = state.elements.find( element => element.id == elId );
        }

        if ( !theElement ) {
            return;
        }

        if ( !checkElementCount() ) {
            return false;
        }

        //Duplicates only single layers, 
        if ( theElement.type === "conditional"
            || theElement.type === "condition"
            || theElement.type === "columns"
            || theElement.type === "container"
        ) {
            return;
        }

        var regExp = /\(([^)]+)\)/;
        let suffix = theElement.label

        var matches = regExp.exec( theElement.label );
        if ( matches ) {
            suffix = matches[1];
        }

        const layerIdLbl = Utils.generateIDLabel( theElement.type, state.elements, 0, " (" + suffix + ")" );

        const duplicateObject = {
            ...theElement, ...{
                id: layerIdLbl.id,
                label: layerIdLbl.label,
            }
        };

        const currentTree = [...state.tree];
        const currentElements = [...state.elements];

        currentElements.unshift( duplicateObject );
        currentTree.unshift( { id: layerIdLbl.id } );
        //inserts new condition before the last element (before the else element)

        setState( {
            ...state,
            elements: currentElements,
            tree: currentTree,
        } );

        selectElementFromLayer( duplicateObject.id );

    }

    

    const deselect = ( e ) => {
        // console.log( e );
        if ( e.target.id === 'safi-canvas-outer' || e.target.id === 'safi-canvas-wrap' ) {
            setSelectedLayer( null );
            setSelectedElement( null );
            setInfoHelper( "" );
        }
    };

    /**
     * Deselect from anywhere, without target control on click
     * @param {*} e 
     */
    const doDeselect = () => {
        setSelectedLayer( null );
        setSelectedElement( null );
    };

    const getHelper = ( () => {
        return infoHelper;
    } )();

    const showWelcomeOverlay = ( () => {
        if ( context === "gutenberg" ) {
            //if blank template is selected in the gutemberg editor
            return templateId === "00000000" && !isEditing;
        }
        return templateId === 0 && !isEditing;
    } )();

    const getImageQuality = ( () => {
        
        return 3655 / 4300;
    } )();

    const [driver, setDriver] = useState( null );
    const driverIsKeyDown = useRef( false );

    // REF TO https://dev.to/marcostreng/how-to-really-remove-eventlisteners-in-react-3och
    const tourListener = ( e ) => {
        if ( isTourMode === false ) {
            return;
        }

        if ( !driver.isActive() ) {
            return;
        }

        const activeStep = driver.getActiveStep();

        if ( activeStep && activeStep.autoNextClickElement === true ) {
            const elementSelector = activeStep.element; //css selector
            const element = document.querySelector( elementSelector );

            const clickedElement = e.target.closest( elementSelector );
            // console.log( clickedElement, element );
            if ( clickedElement !== null && clickedElement == element ) {
                // driver.moveNext();
                setTimeout( () => driver.moveNext(), 150 );
            }

            const hideHelpOnComplete = driver?.getConfig()?.hideHelpOnComplete;
            if ( activeStep.isLastStep && activeStep.isLastStep === true && hideHelpOnComplete && hideHelpOnComplete === true ) {
                setIsTourMode( false );
            }
        }
    };

    const tourListenerKeyDown = ( e ) => {
        if ( isTourMode === false ) {
            return;
        }

        if ( !driver.isActive() ) {
            return;
        }
        if ( driverIsKeyDown.current === true ) {
            return;
        }
        driverIsKeyDown.current = true

        const activeStep = driver.getActiveStep();
        if ( activeStep && activeStep.keyRequired && activeStep.keyRequired === true ) {
            if ( activeStep.keyCallback( e ) === true ) {
                driver.moveNext();
                // setTimeout( () => driver.moveNext(), 50 );
            }
        }

    };

    const tourListenerKeyUp = ( e ) => {
        if ( isTourMode === false ) {
            return;
        }

        if ( !driver.isActive() ) {
            return;
        }

        driverIsKeyDown.current = false;
    };
    // }, [] );

    // Removes the driver if helps is disabled
    useEffect( () => {
        if ( driver ) {
            const tuto = getDriverTuto();

            if ( tuto === "tuto-ui-tour" ) {
                setInfoHelper( __( "Contextual tips will be shown here", "wpjoli-safi" ) );
            }
        }
        if ( isTourMode === true ) {
            window.addEventListener( 'click', tourListener );
            window.addEventListener( 'keydown', tourListenerKeyDown );
            window.addEventListener( 'keyup', tourListenerKeyUp );
        }
        if ( isTourMode === false ) {
            // setDriver( false );
            window.removeEventListener( 'click', tourListener );
            window.addEventListener( 'keydown', tourListenerKeyDown );
            window.addEventListener( 'keyup', tourListenerKeyUp );
        }
        // 👇️ remove the event listener when the component unmounts
        return () => {
            window.removeEventListener( 'click', tourListener );
            window.addEventListener( 'keydown', tourListenerKeyDown );
            window.addEventListener( 'keyup', tourListenerKeyUp );
        };
    }, [driver] );

    useEffect( () => {
        if ( isTourMode === false ) {
            setDriver( false );
            // window.removeEventListener( 'click', tourListener );
        }
    }, [isTourMode] );

    const getDriverTuto = () => {
        if ( !driver ) {
            return;
        }
        return driver?.getConfig()?.tutorial;
    }


    const handleCurrentTuto = ( driverEl, autoStart = false ) => {
        setActiveTool( 'select' );
        setShowGrid( false );
        setDriver( driverEl );
    };


    /** 
     * SVG Code Pasting 
     * */
    const handlePaste = ( e ) => {
        
    };

    /**
     * 
     * @returns Recalculate the starter template layout
     */
    const starterTemplatesTotalHeight = () => {
        const thumbWidth = 280;
        const thumbGap = 12;
        const thumbRows = 3;
        const totalItems = starterTemplates?.length || 0;

        //Total scaled height of all starter templates
        const scaledHeight = starterTemplates.map( ( tpl ) => {
            const ratio = tpl.template.content.canvas.width / thumbWidth;
            return parseFloat( tpl.template.content.canvas.height ) / ratio;
        } )

        //Get the highest value to add it to the calculated height
        const tallestValue = Math.max( ...scaledHeight );

        //Sum of all templates scaled heights, including the gaps
        const totalHeight = scaledHeight.reduce( ( partialSum, a ) => partialSum + a, 0 ) + thumbGap * totalItems;

        return ( totalHeight / thumbRows ) + tallestValue;
    }


    return (
        <div id="safi-editor-wrap" ref={safiWrapper} style={{
            "--safi-grid-color": options.gridColor,
            "--safi-grid-opacity": options.gridOpacity,
        }}>
            <div id="safi-editor" className={"safi-editor" + ( showEditor ? ' --editing' : '' ) + " --tool-" + activeTool}>
                <div id="safi-wrap">
                    <div id="safi-app"
                        // ref={canvasRef}
                        ref={canvasRefCallback}
                        tabIndex="0"
                        onMouseDown={() => { isMouseDown.current = true; }}
                        onMouseUp={() => { isMouseDown.current = false; }}
                        onKeyDown={handleCanvasKeyDown}
                        onKeyUp={( e ) => setCurrentKeyPressed( e )}
                        // onWheel={handleWheel}
                        // onMouseUp={this.appMouseUp}
                        onPaste={handlePaste}
                    >
                        {/* HEADER */}
                        <div id="safi-header">
                            <div id="safi-template-name"><span>{canvasName}</span></div>
                            <div className="safi-toolbar-container">
                                <div className="safi-toolbar">
                                    <SvgIcon className="safi-tool" icon="undo" disabled={!isUndoPossible} onClick={isUndoPossible && undo} title={__( 'Undo (Ctrl+Z)', "wpjoli-safi" )} />
                                    <SvgIcon className="safi-tool" icon="redo" disabled={!isRedoPossible} onClick={isRedoPossible && redo} title={__( 'Redo (Ctrl+Y)', "wpjoli-safi" )} />
                                </div>
                                <SafiToolbar tools={tools} activeTool={activeTool} toolChanged={( tool ) => setActiveTool( tool )} />
                                <ToggleIconButton tools={gridIcon} isActive={showGrid} onSwitch={( val ) => setShowGrid( val )} />
                                {!isPro &&
                                    <a href={window.SAFI.gopro_url} target="_blank"><button id="safi-go-pro" className="safi-tb-btn safi-btn-primary">{__( "Upgrade to Pro now !", "wpjoli-safi" )}</button></a>
                                }
                            </div>

                            <div id="safi-template-controls">
                                {/* <button className="safi-tb-btn" id="safi-preview" onClick disabled={isSaving || startedSaving}>Preview</button> */}
                                <div className="safi-shortcuts-wrap">
                                    <button className={"safi-tb-btn" + ( showShortcuts ? " --active" : "" )} id="safi-shortcuts" onClick={() => setShowShortcuts( !showShortcuts )} >Shortcuts</button>
                                    {
                                        showShortcuts &&
                                        <ShortcutsPane
                                            onClose={() => setShowShortcuts( false )}
                                        />
                                    }
                                </div>
                                <div className="safi-help-wrap">
                                    <button className={"safi-tb-btn" + ( isTourMode ? " --active" : "" )} id="safi-help" onClick={() => setIsTourMode( !isTourMode )} >Help</button>
                                    {
                                        isTourMode &&
                                        <HelpMenu
                                            currentTuto={handleCurrentTuto}
                                            autoStartUITour={isFirstTime}
                                            tree={state.tree}
                                            onClose={() => setIsTourMode( false )}
                                        />
                                    }
                                </div>
                                <button className="safi-tb-btn" id="safi-settings" onClick={doDeselect} disabled={isSaving || startedSaving}>Settings</button>
                                <button className="safi-tb-btn" id="safi-save" onClick={saveTemplate} disabled={isSaving || startedSaving}>{context === "editor" ? "Save" : "Save (this post)"}</button>
                                {/* <button className="safi-tb-btn" id="safi-close" onClick={handleClose} disabled={isSaving || startedSaving}>Close</button> */}
                            </div>
                            <div className="close-btn" onClick={handleClose} disabled={isSaving || startedSaving}>
                                <div className="close-symbol"></div>
                            </div>
                        </div>

                        {/* MAIN */}
                        <div id="safi-main">
                            <SafiSidebar id="left" collapsible={true}>
                                <Panel id="safi-panel-layers" name="Layers" isCollapsible={false}>
                                    <div
                                        tabIndex="0"
                                        id="safi-layers-wrap"
                                    // onKeyDown={handleCanvasKeyDown}
                                    // onKeyUp={(e) => setCurrentKeyPressed( e )}
                                    >
                                        <SafiLayers
                                            elements={state.elements}
                                            tree={state.tree}
                                            tools={tools}
                                            selectedLayer={selectedLayer}
                                            // onLayerDragged={() => setLayerDragged(!layerDragged)}
                                            onOrderChanged={elementsOrderChanged}
                                            onLayerSelected={selectElementFromLayer}
                                            onElementDataChange={elementChanged}
                                            onAddNewCondition={handleNewCondition}
                                            onHovering={( id ) => layersHovering( id )}
                                            isMouseDown={isMouseDown.current}
                                            infoHelper={( message ) => setInfoHelper( message )}
                                        />

                                    </div>
                                    <div className="safi-layer-actions">
                                        <div className="safi-layer-action"
                                            onClick={() => duplicateLayer()}
                                            title={__( "Duplicate (Alt + D)", "wpjoli-safi" )}
                                            disabled={selectedLayer === null}
                                        >
                                            <SvgIcon className="safi-layer-action-icon" icon={'duplicate'} />
                                        </div>
                                        <div className="safi-layer-action"
                                            onClick={deleteActiveSelection}
                                            title={__( "Delete (Del)", "wpjoli-safi" )}
                                            disabled={selectedLayer === null}
                                        >
                                            <SvgIcon className="safi-layer-action-icon" icon={'trash'} />
                                        </div>
                                    </div>
                                </Panel>
                            </SafiSidebar>

                            <SafiCanvas
                                globalStyles={state.canvas?.globalCss}
                                activeTool={activeTool}
                                canvas={state.canvas}
                                elements={state.elements}
                                tree={state.tree}
                                showGrid={showGrid}
                                selectedElementID={selectedLayer}
                                selectedElement={selectedElement}
                                onColumnsAdded={insertColumns}
                                onConditionalAdded={insertConditional}
                                onCreateElement={( element ) => handleCreateElement( element )}
                                onSelectElement={handleSelectElement}
                                onChangeElement={( element, data, addHistory ) => elementChanged( element, data, addHistory )}
                                onTriggerSnapshot={() => setStateSnapshot()}
                                currentKey={currentKeyPressed}
                                infoHelper={( message ) => setInfoHelper( message )}
                                onDeselect={deselect}
                                highlightedLayer={hoveringLayer}
                            />

                            <div id="safi-bottom-bar">
                                {/* <div onClick={centerCanvas}>Center</div> */}
                                <div id="safi-zoom">
                                    <div id="safi-zoom-minus" className="safi-zoom-btn" onClick={decreaseZoom}>-</div>
                                    <div
                                        id="safi-zoom-value"
                                        onDoubleClick={resetZoom}
                                        onMouseEnter={() => setInfoHelper( "Double click to reset zoom" )}
                                        onMouseLeave={() => setInfoHelper( "" )}
                                    >{canvasZoom}%</div>
                                    <div id="safi-zoom-minus" className="safi-zoom-btn" onClick={increaseZoom}>+</div>
                                </div>
                                <span
                                    className="dashicons dashicons-align-center safi-tiny-btn"
                                    onClick={centerCanvas}
                                    onMouseEnter={() => setInfoHelper( "Recenter canvas" )}
                                    onMouseLeave={() => setInfoHelper( "" )}
                                ></span>
                                <div id="safi-info-helper">
                                    <span>{getHelper}</span>
                                </div>
                            </div>

                            <SafiSidebar
                                id="right"
                                activeElement={null}
                            // canvas={canvas}
                            // onCanvasChange={( canvas ) => setCanvas( canvas )}
                            >
                                {renderPanels}
                            </SafiSidebar>
                        </div>
                        <div className={"safi-overlay" + ( ( isSaving || startedSaving ) ? " --showing" : "" )}>
                            <p>Saving template...</p>
                            {/* <p>Please be patient while the image is being generated</p> */}
                            <span className="safi-loader"></span>
                        </div>

                        {showExitModal &&
                            <SafiModal
                                title={__( "Closing...", "wpjoli-safi" )}
                                message={__( "Save changes to the template before closing ?", "wpjoli-safi" )}
                                onButtonPressed={handleExit}
                            />
                        }
                        <div className={"safi-overlay" + ( ( showWelcomeOverlay ) ? " --showing" : "" )}>
                            <div className="template-selection --safi-scroll-thin">
                                <div className="template-picker">
                                    <h3>Start from scratch</h3>
                                    <div
                                        className="safi-template-blank"
                                        onClick={loadTemplate}
                                    >
                                        <span>BLANK</span>
                                    </div>
                                </div>
                                <div className="template-picker">
                                    <h3>Start from a template</h3>
                                    <div className="template-picker-wrap" style={{ height: starterTemplatesTotalHeight() }}>
                                        {
                                            starterTemplates.map( ( template ) => {
                                                return (
                                                    <div
                                                        className="safi-demo-template"
                                                        data-tpl-id={template.id}
                                                        onClick={() => loadDemoTemplate( starterTemplates.find( tpl => tpl.id === template.id ) )}
                                                    // style={template.thumbnail ? {
                                                    //     backgroundImage: "url(" + template.thumbnail + ")",
                                                    // } : null}
                                                    >
                                                        <img src={template.thumbnail} alt="" />
                                                    </div>
                                                );
                                            } )
                                        }
                                    </div>
                                    {
                                        !isPro &&
                                        <div style={{ padding: 20, backgroundColor: "#ffffff10" }}>
                                            <p>{__("Unlock dozens of premium templates with Smart Auto Featured Image Pro", "wpjoli-safi")}</p>
                                            <p>
                                                <a className="safi-tb-btn safi-btn-primary" target="_blank" href="https://wpjoli.com/smart-auto-featured-image/">Get Pro Now</a>
                                            </p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Preview
                previewData={previewData}
                showPreview={showPreview}
                onPreviewLoaded={( val ) => onPreviewLoaded( val )}
                onPreviewClose={( val ) => onPreviewClose( val )}
                onImageCreated={( image ) => onImageCreated( image )}
                onImageURLCreated={( data, html, options ) => onImageURLCreated( data, html, options )}
                featuredImageGenerated={onFeaturedImageGenerated}
                imageQuality={getImageQuality}
                faIcons={faIcons}
            />
        </div>
    );

};

export default SafiEditor;