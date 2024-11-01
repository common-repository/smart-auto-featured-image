const { __ } = wp.i18n;

const HelpItem = ( { title, description, buttonLabel, onButtonClick, ...props } ) => {

    return (
        <div className="safi-pane-item flex">
            <div className="safi-pane-item--content flex flex-col justify-center">
                <div className="safi-pane-item--title">{title}</div>
                <div className="safi-pane-item--description">{description}</div>
            </div>
            <div className="safi-pane-item--cta flex-center">
                <button
                    className="safi-tb-btn"
                    // id="safi-start-tour"
                    onClick={onButtonClick}
                >{buttonLabel || __("Start", "wpjoli-safi")}</button>
            </div>
        </div>
    );
};

export default HelpItem;