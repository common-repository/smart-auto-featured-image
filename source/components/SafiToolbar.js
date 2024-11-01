import { AppContext } from "../AppContext";
const { useContext } = wp.element;


const SafiToolbar = ( { tools, activeTool, toolChanged } ) => {
    // const [selectedTool, setSelectedTool] = useState( activeTool || 'select' );

    const isPro = useContext( AppContext )

    const handleToolChange = e => {
        const clickedTool = e.target.closest( '.safi-tool' );

        if ( clickedTool ) {
            const toolId = clickedTool.dataset.tool;
            toolChanged( toolId );
        }
    }

    return (
        <div id="safi-design-tools" className="safi-toolbar">
            {tools.map( ( item ) => {
                const cannot = ( isPro === false && item.pro !== isPro );
                return (
                    <div
                        id={"safi-tool-" + item.id}
                        className={'safi-tool safi-icon-container' + ( activeTool === item.id ? " --active" : "" ) + ( cannot ? " --pro" : "" )}
                        data-tool={item.id}
                        data-tooltip={item.label}
                        title={item.label}
                        onClick={handleToolChange}
                        disabled={cannot}
                    >
                        <svg className="svg" width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                            <path d={item.iconSvgPath} fillRule="nonzero" fillOpacity="1" fill="#000" stroke="none"></path>
                        </svg>
                    </div>
                );

            } )}

        </div>
    );
};

export default SafiToolbar;