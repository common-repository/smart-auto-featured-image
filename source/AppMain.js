const { __ } = wp.i18n;
const { useState, useEffect, useContext } = wp.element;
import SafiEditor from "./SafiEditor";
import { AppContext } from "./AppContext";
import Utils from './Utils';
import { ReactSortable } from "react-sortablejs";

const AppMain = ( props ) => {
    // const [templates, setTemplates] = useState( ( [] ) );
    const [templates, setTemplates] = useState( ( SAFI.templates || [] ) );
    const [templatesScreenshots, setTemplatesScreenshots] = useState( SAFI.templates_screenshots || [] );
    const [editing, setEditing] = useState( false );
    const [saving, setSaving] = useState( false );
    const [activeID, setActiveID] = useState( -1 );

    const isPro = useContext( AppContext );

    // console.log(Object.values(SAFI.templates))
    /**
     * Removes 'selected' and 'chosen' props, that are automatically added by ReactSortable to the list
     * @param {*} obj 
     */
    const cleanListProps = ( arr ) => {
        return arr.map( item => {
            return Utils.removeKeys( item, ['selected', 'chosen'] );
        } );
    };

    /**
     * Prevents accidental closing of the browser tab while a template is being edited
     * @param {*} showExitPrompt 
     */
    const initBeforeUnLoad = ( showExitPrompt ) => {
        window.onbeforeunload = ( event ) => {
            // Show prompt based on state
            if ( showExitPrompt ) {
                const e = event || window.event;
                e.preventDefault();
                if ( e ) {
                    e.returnValue = ''
                }
                return '';
            }
        };
    };


    // Initialize the beforeunload event listener after the resources are loaded
    window.onload = function () {
        initBeforeUnLoad( editing );
    };

    // Re-Initialize the onbeforeunload event listener
    useEffect( () => {
        initBeforeUnLoad( editing );
    }, [editing] );

    useEffect( () => {
        const theTemplate = activeID !== -1 ? templates.find( item => item.id === activeID ) : null

        //Checks template if we are on a free plan
        if ( isPro === false && theTemplate ) {

            //Checks if the template matchs a Pro template criteria
            if ( Utils.isProTemplate( theTemplate ) === true ) {
                closeEditor();
                alert( __( "This template is a Pro template and cannot be edited with your current plan.", "wpjoli-safi" ) );
                // return false;
            } else {
                setCurrentTemplate( theTemplate );
            }
        } else {
            setCurrentTemplate( theTemplate );
        }

    }, [activeID] ); //run this code when the value of template changes

    const checkTemplateCountFreePlan = () => {
        return true;
        if ( !isPro && templates.length > 6 ) {
            alert( __( "You can create a maximum of 6 templates on the Free plan. Upgrade to Pro for unlimited templates.", "wpjoli-safi" ) );
            return false;
        }

        return true;
    }

    const newTemplate = () => {
        if ( checkTemplateCountFreePlan() === false ) {
            return;
        }

        //Sets activeID to 0 to mark it as a new template
        setActiveID( 0 );
        setEditing( true );
    }

    const editTemplate = e => {


        if ( e.target.closest( ".safi-template-control" ) !== null ) {
            return;
        }

        const template = e.target.closest( '.safi-template' );
        const templateID = template.dataset.tplId;
        if ( templateID !== -1 ) {
            setActiveID( templateID );
            setEditing( true );
        }
    };

    const [currentTemplate, setCurrentTemplate] = useState( activeID !== -1 ? templates.find( item => item.id === activeID ) : null );

    const handleDemoTemplateLoad = ( template ) => {
        // console.log( template );
        setCurrentTemplate( template.template );
        setActiveID( 0 ); // Set ID at 0 to make it be a new template
        setEditing( true );
    }

    const closeEditor = () => {
        setEditing( false );
        setCurrentTemplate( null );
        setActiveID( -1 );
    };

    /**
     * 
     * @param {*} templateData 
     * @param {*} screenshot base64 png image data 
     * @returns 
     */
    async function saveTemplate( templateData, screenshot ) {
        setSaving( true );
        try {

            let response;
            //If we save from a new unsaved template
            if ( activeID === 0 ) {
                response = await doAjax( 'save', templateData, screenshot );
            }
            //For an existing template being currently edited
            else if ( activeID !== -1 ) {
                response = await doAjax( 'update', templateData, screenshot );
            }
            setSaving( false );
            return response;
        } catch ( e ) {
            setSaving( false );
            return null;
        }

    }

    const handleDuplicateTemplate = ( templateID ) => {

        if ( checkTemplateCountFreePlan() === false ) {
            return;
        }

        duplicateTemplate( templateID );
    }
    /**
     * 
     * @param {*} templateData 
     * @param {*} screenshot base64 png image data 
     * @returns 
     */
    async function duplicateTemplate( templateID ) {

        let templateData = templates.find( item => item.id == templateID )

        templateData.content.canvas.templateName = templateData.content.canvas.templateName + " (copy)";
        const stringifedTemplate = JSON.stringify( templateData.content );
        try {

            let response;
            //If we save from a new unsaved template
            if ( templateID !== 0 ) {
                response = await doAjax( 'duplicate', stringifedTemplate, null, templateID );
            }
            return response;
        } catch ( e ) {
            return null;
        }
    }


    const downloadTemplate = ( templateID ) => {

        let templateData = templates.find( item => item.id == templateID )

        const stringifedTemplate = JSON.stringify( templateData );

        const templateName = templateData.content.canvas.templateName;
        const filename = "template-" + templateID + "-" + Utils.slugify( templateName ) + ".safi.json";
        var element = document.createElement( 'a' );
        element.setAttribute( 'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( stringifedTemplate ) );
        element.setAttribute( 'download', filename );

        element.style.display = 'none';
        document.body.appendChild( element );

        element.click();

        document.body.removeChild( element );

    }

    async function handleImportTemplate( e ) {
        if ( checkTemplateCountFreePlan() === false ) {
            return;
        }

        const fileData = e.target.files[0];

        if ( typeof fileData === 'undefined' ) {
            alert( 'Please select a file.' );
            return false;
        }

        const fileReader = new FileReader();
        fileReader.onload = async function ( progressEvent ) {
            var stringData = fileReader.result;

            try {
                let response;

                response = await doAjax( 'import', stringData );

                setSaving( false );
                return response;
            } catch ( e ) {
                setSaving( false );
                return null;
            }
        }

        fileReader.readAsText( fileData );
        fileReader.addEventListener( 'error', () => {
            console.error( `Error occurred reading file: ${fileData.name}` );
        } );

    }

    /**
     * 
     * @param {*} templateData 
     * @param {*} screenshot base64 png image data 
     * @returns 
     */
    async function deleteTemplate( templateID ) {

        if ( !confirm( "Are you sure you want to delete this template ? Template data will be permanently lost and cannot be recovered." ) ) {
            return;
        }
        
        setSaving( true );

        try {

            let response;
            response = await doAjax( 'delete', templateID );

            setSaving( false );
            return response;
        } catch ( e ) {
            setSaving( false );
            return null;
        }

    }

    const doAjax = ( command, data, screenshot = null, templateSrcId = null ) => {

        return new Promise( ( resolve, reject ) => {
            var xhr = new XMLHttpRequest();
            var action = 'safi_templates';
            var templateStr = data;

            xhr.open( 'POST', SAFI.ajaxurl );
            xhr.responseType = 'json';
            xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8' );
            xhr.onload = function () {
                //	DONE (numeric value 4)	The data transfer has been completed or something went wrong during the transfer (e.g., infinite redirects).
                if ( xhr.readyState === 4 ) {
                    if ( xhr.status >= 200 && xhr.status < 400 ) {
                        if ( xhr.response !== null && xhr.response.success === true ) {

                            if ( command === 'save' ) {

                                const templateObj = JSON.parse( templateStr )

                                //Adds the template to the collection
                                let currentTemplates = [...templates];
                                currentTemplates = cleanListProps( currentTemplates );
                                //gets and sets the new ID locally
                                const newID = xhr.response.data.id;

                                // console.warn( templateStr );

                                currentTemplates.push( {
                                    'id': newID,
                                    'last_modified': new Date().getTime(),
                                    'name': templateObj.canvas.templateName,
                                    'content': templateObj
                                } );

                                let currentTemplatesScreenshots = { ...templatesScreenshots };
                                currentTemplatesScreenshots[newID] = "template-" + newID + ".png";
    
                                setTemplates( currentTemplates );
                                setTemplatesScreenshots( currentTemplatesScreenshots );
                                setActiveID( newID );
                                resolve( newID );

                            } else if ( command === 'duplicate' ) {

                                const templateObj = JSON.parse( templateStr )

                                //Adds the template to the collection
                                let currentTemplates = [...templates];
                                currentTemplates = cleanListProps( currentTemplates );
                                //gets and sets the new ID locally
                                const newID = xhr.response.data.id;

                                currentTemplates.push( {
                                    'id': newID,
                                    'last_modified': new Date().getTime(),
                                    'name': templateObj.canvas.templateName,
                                    'content': templateObj
                                } );

                                let currentTemplatesScreenshots = { ...templatesScreenshots };
                                currentTemplatesScreenshots[newID] = "template-" + newID + ".png";
                              
                                setTemplates( currentTemplates );
                                setTemplatesScreenshots( currentTemplatesScreenshots );
                                resolve( newID );

                            } else if ( command === 'import' ) {
                                const templateObj = JSON.parse( templateStr )

                                if ( !templateObj.id || !templateObj.content ) {
                                    alert( "Invalid template" );
                                    return false;
                                }
                                //Adds the template to the collection
                                let currentTemplates = [...templates];
                                currentTemplates = cleanListProps( currentTemplates );
                                //gets and sets the new ID locally
                                const newID = templateObj.id;

                                currentTemplates.push( templateObj );
                                setTemplates( currentTemplates );
                                resolve( newID );

                            } else if ( command === 'reorder' ) {
                                if ( xhr.response.data.reordered ) {
                                    resolve( true );
                                }
                                else {
                                    reject( "Could not reorder" );
                                }

                            } else if ( command === 'update' ) {

                                const templateObj = JSON.parse( templateStr )

                                //Adds the template to the collection
                                let currentTemplates = [...templates];
                                currentTemplates = cleanListProps( currentTemplates );
                                //if backend was successfully updated
                                if ( xhr.response.data.updated == true ) {

                                    const updatedTemplate = {
                                        'id': activeID,
                                        'last_modified': new Date().getTime(),
                                        'name': templateObj.canvas.templateName,
                                        'content': templateObj
                                    };

                                    let updatedTemplateScreenshots = { ...templatesScreenshots };
                                    updatedTemplateScreenshots[activeID] = "template-" + activeID + ".png";

                                    //From the templates array, replaces the template corresponding to the active ID
                                    const updatedTemplates = currentTemplates.map( item => item.id === activeID ? updatedTemplate : item );

                                    // console.warn( updatedTemplates );
                                    setTemplates( updatedTemplates );
                                    setTemplatesScreenshots( updatedTemplateScreenshots );

                                    resolve( activeID );
                                } else {
                                    reject( 'did not update' );
                                }
                            } else if ( command === 'delete' ) {
                                //if backend was successfully updated
                                if ( xhr.response.data.deleted == true ) {

                                    let updatedTemplates = [...templates]
                                    let updatedTemplateScreenshots = { ...templatesScreenshots };

                                    const templateID = data;
                                    updatedTemplates = updatedTemplates.filter( item => item.id !== templateID );
                                    delete updatedTemplateScreenshots[templateID];

                                    setTemplates( updatedTemplates );
                                    setTemplatesScreenshots( updatedTemplateScreenshots );

                                    resolve( templateID );
                                } else {
                                    reject( 'did not delete' );
                                }
                            }

                        } else {
                            if ( xhr?.response?.data?.message != null ) {
                                alert( xhr?.response?.data?.message );
                                console.error( xhr?.response )
                            }
                            // Response error
                            reject( 'error' );
                        }
                    } else {
                        // Response error
                        reject( 'error' );
                    }
                }
            };
            xhr.onerror = function () {
                reject( 'error' );
            };

            var dataSend = ( data );

            if ( command === 'delete' ) {
                xhr.send( 'action=' + action
                    + '&nonce=' + SAFI.editor_nonce
                    + '&command=' + command
                    + '&tplid=' + data
                );
            } else if ( command === 'duplicate' ) {
                xhr.send( 'action=' + action
                    + '&nonce=' + SAFI.editor_nonce
                    + '&command=' + command
                    + '&tplid=' + templateSrcId
                    + '&data=' + encodeURIComponent( dataSend )
                );
            } else if ( command === 'import' ) {
                xhr.send( 'action=' + action
                    + '&nonce=' + SAFI.editor_nonce
                    + '&command=' + command
                    + '&data=' + encodeURIComponent( dataSend )
                );
            } else if ( command === 'reorder' ) {
                xhr.send( 'action=' + action
                    + '&nonce=' + SAFI.editor_nonce
                    + '&command=' + command
                    + '&data=' + encodeURIComponent( JSON.stringify( data ) )
                );
            } else {
                xhr.send( 'action=' + action
                    + '&nonce=' + SAFI.editor_nonce
                    + '&command=' + command
                    + '&tplid=' + activeID
                    + '&data=' + encodeURIComponent( dataSend )
                    + '&screenshot=' + encodeURIComponent( screenshot )
                );
            }
        } );
    }

    const getScreenshot = ( id ) => {

        const theTemplate = templates.find( item => item.id === id );

        const lastModified = theTemplate.last_modified || null;

        if ( templatesScreenshots[id] ) {
            return SAFI.templates_screenshots_url + templatesScreenshots[id] + ( lastModified ? "?" + lastModified : "" );
        }

        return false;
    }


    const handleReorderTemplates = ( newState ) => {

        const newOrder = newState.map( item => item.id );

        setTemplates( newState );
        doAjax( 'reorder', newOrder );

    }
    
    return (
        <div id="safi">
            {
                templates.length === 1 &&
                <div className="safi-tpl-info">
                    <span><span className="dashicons dashicons-warning" style={{ marginRight: "5px" }}></span>{__( "You have no template yet ! Start creating a new template of import a template using the buttons below.", "wpjoli-safi" )}</span>
                </div>
            }
            <div id="safi-templates">
                <ReactSortable
                    id="safi-template-list"
                    {...{
                        animation: 150,
                        fallbackOnBody: true,
                        swapThreshold: 0.65,
                        ghostClass: "ghost",
                        group: "shared",
                        draggable: ".safi-template"
                    }}
                    list={templates}
                    setList={
                        ( sortedList, element, store ) => {
                            if ( store.dragging && store.dragging.props && JSON.stringify( store.dragging.props.list ) !== JSON.stringify( sortedList ) ) {
                                if ( element ) {
                                    handleReorderTemplates( sortedList );
                                }
                            }
                        }
                    }
                >
                    {templates.map( ( item ) => {
                        const thumbnail = getScreenshot( item.id );
                        return (
                            <div
                                className="safi-template"
                                data-tpl-id={item.id}
                                key={item.id}
                                onClick={editTemplate}
                                style={thumbnail !== false ? {
                                    backgroundImage: "url(" + thumbnail + ")",
                                } : ( item.id === "00000000" ? { display: "none" } : null )}
                            >
                                <div className="safi-template-overlay">
                                    <div className="safi-template-header">
                                        <div className="safi-template-name">
                                            <span>{item.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="safi-template-body">
                                </div>
                                <div className="safi-template-controls">
                                    <div className="safi-template-control"
                                        title={__( "Download template.", "wpjoli-safi" )}
                                        onClick={() => downloadTemplate( item.id )}>
                                        <span className="dashicons dashicons-download"></span>
                                    </div>
                                    <div className="safi-template-control"
                                        title={__( "Duplicate template.", "wpjoli-safi" )}
                                        onClick={() => handleDuplicateTemplate( item.id )}>
                                        <span className="dashicons dashicons-admin-page"></span>
                                    </div>
                                    <div className="safi-template-control"
                                        title={__( "Delete template.", "wpjoli-safi" )}
                                        onClick={() => deleteTemplate( item.id )}>
                                        <span className="dashicons dashicons-trash"></span>
                                    </div>
                                </div>
                            </div>
                        )
                    } )}
                    <div id="safi-new-template" className="safi-tpl-btn" onClick={newTemplate}>
                        <span>{__("NEW TEMPLATE", "wpjoli-safi")}</span>
                    </div>
                    <div id="safi-import-template" className="safi-tpl-btn">
                        <span className="tpl-btn-label">{__("IMPORT TEMPLATE", "wpjoli-safi")}</span>
                        <div className="tpl-btn-content">
                            <div className="input-file-container">
                                <input
                                    className="input-file"
                                    id="my-file"
                                    type="file"
                                    accept=".safi.json"
                                    onChange={handleImportTemplate}
                                />
                                <label tabindex="0" for="my-file" className="input-file-trigger">{__("Select a file...", "wpjoli-safi")}</label>
                            </div>
                        </div>
                    </div>
                </ReactSortable>
            </div>
            
            <SafiEditor
                context="editor"
                showEditor={editing}
                template={currentTemplate}
                templateId={activeID}
                onClose={closeEditor}
                onSaveTemplate={saveTemplate}
                isSaving={saving}
                options={props.options}
                onChangeDemoTemplate={handleDemoTemplateLoad}
            />
        </div >
    );
}

export default AppMain;
