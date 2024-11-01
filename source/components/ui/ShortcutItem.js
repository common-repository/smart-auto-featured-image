const { __ } = wp.i18n;

const ShortcutItem = ( { title, shortcut, comment, ...props } ) => {

    return (
        <div className="safi-pane-item flex">
            <div className="safi-pane-item--shortcut flex items-center">
                {shortcut.map( item =>
                    <span className="safi-fancy-key">{item}</span>
                ).reduce((prev, curr) => [prev, <span>&nbsp;+&nbsp;</span>, curr])}
                {comment &&
                <span className="safi-fancy-comment">({comment})</span>
                }
            </div>
            <div className="safi-pane-item--content flex items-center justify-end">
                <span className="safi-pane-item--title">{title}</span>
            </div>
        </div>
    );
};

export default ShortcutItem;