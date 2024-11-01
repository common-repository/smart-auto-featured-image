const SafiPanel = ( props ) => {

    return (
        <div id="safi-panel--layer-data" className="safi-panel">
            {!props.noHeader &&
                <div className="safi-panel-header">
                    <div className="safi-panel-name">{props.name}</div>
                </div>
            }
            <div className="safi-panel-content">
                {props.children}
            </div>
        </div>
    );
};

export default SafiPanel;