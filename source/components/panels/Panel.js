const { useContext, useState, useEffect } = wp.element;
import { AppContext } from "../../AppContext";

const Panel = ( { isOpen, ...props } ) => {

    const isPro = useContext( AppContext );
    const initialOpened = isPro === false ? true : ( isOpen !== undefined ? isOpen : true );
    const [isOpened, setIsOpened] = useState( initialOpened );

    const cannot = ( props.disabled === true && isPro === false );

    useEffect( () => {
        const initialOpened = isPro === false ? true : ( isOpen !== undefined ? isOpen : true );
        setIsOpened( initialOpened );
    }, [isOpen] );

    const handleHeaderClick = ( e ) => {
        if ( props.isCollapsible === false ) {
            return false;
        }
        setIsOpened( !isOpened );
    }
    return (
        <div id={props.id} className={"safi-panel" + ( cannot ? " --pro" : "" ) + ( props.isCollapsible === false ? "" : " --is-collapsible" ) + ( isOpened ? " --opened" : "" )} disabled={props.disabled}>
            {!props.noHeader &&
                <div className="safi-panel-header" onClick={handleHeaderClick}>
                    <div className="safi-panel-name">{props.name}</div>
                </div>
            }
            {( isOpened ) &&
                <div className="safi-panel-content">
                    {props.children}
                </div>
            }
        </div>

    );
};

export default Panel;