const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;

const SafiModal = ( { title, message, modalType, onButtonPressed } ) => {
    const [isMounting, setIsMounting] = useState( false );

    //Upon mounting, this will add the --open class to the modal and provide a css animation
    useEffect( () => {
        setIsMounting( true );
    }, [] );


    return (
        <div className={"safi-overlay --showing"}>
            <div className={"safi-intent-modal" + ( isMounting ? " --open" : "" )}>
                <div className="safi-intent-modal-header">
                    <span>{title}</span>
                </div>
                <div className="safi-intent-modal-body">
                    <p>{message}</p>
                </div>
                <div className="safi-intent-modal-footer">
                    <button className="button button-primary" onClick={() => onButtonPressed( 1 )}>{__( "Yes", "wpjoli-safi" )}</button>
                    <button className="button" onClick={() => onButtonPressed( 0 )}>{__( "No", "wpjoli-safi" )}</button>
                    <button className="button" onClick={() => onButtonPressed( -1 )}>{__( "Cancel", "wpjoli-safi" )}</button>
                </div>
            </div >
        </div >
    );
}

export default SafiModal;