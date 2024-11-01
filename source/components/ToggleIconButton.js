const { useState, useEffect } = wp.element;

const ToggleIconButton = ( { tools, isActive, onSwitch } ) => {

    const [isSwitched, setIsSwitched] = useState( isActive || false );

    const callback = () => {
        setIsSwitched( !isSwitched )
        onSwitch( !isSwitched )
    }

    useEffect( () => {
        setIsSwitched( isActive );
    }, [isActive] ); //run this code when the value of template changes

    const handleToolChange = e => {
        const clickedTool = e.target.closest( '.safi-tool' );

        if ( clickedTool ) {
            const toolId = clickedTool.dataset.tool;
            toolChanged( toolId );
        }
    }

    // console.log(tools);
    return (
        <div id="safi-grid" className="safi-toolbar">
            {tools.map( ( item ) => {
                return (
                    <div
                        className={'safi-tool safi-icon-container' + ( isSwitched ? ' --active' : '' )}
                        data-tool={item.id}
                        data-tooltip={item.label}
                        title={item.label}
                        onClick={callback}
                    >
                        <svg className="svg" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                            <path d={item.iconSvgPath} fillRule="nonzero" fillOpacity="1" fill="#000" stroke="none"></path>
                        </svg>
                    </div>
                );

            } )}

        </div>
    );
};

export default ToggleIconButton;