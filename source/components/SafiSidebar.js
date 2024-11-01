
const { useState } = wp.element;

const SafiSidebar = ( { id, collapsible, activeElement, canvas, onCanvasChange, ...props } ) => {

    const [collapsed, setCollapsed] = useState( false );

    return (
        <div id={'safi-sidebar-' + id} className={'safi-sidebar' + ( collapsed ? ' --collapsed' : '' )}>
            <div className="safi-sidebar-content --safi-scroll-thin">
                {/* {renderPanels} */}
                {props.children}
            </div>
            {
                collapsible === true &&
                <div className="safi-sidebar-footer">
                    <div
                        id="safi-sidebar-toggle"
                        onClick={() => setCollapsed( !collapsed )}
                    ><span className="material-icons">{collapsed ? 'chevron_right' : 'chevron_left'}</span></div>
                </div>
            }
        </div>
    );
};

export default SafiSidebar;