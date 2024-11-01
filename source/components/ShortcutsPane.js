const { __ } = wp.i18n;
const { useContext } = wp.element;
import { AppContext } from '../AppContext';
import ShortcutItem from './ui/ShortcutItem';


const ShortcutsPane = ( { onClose, ...props } ) => {

  const isPro = useContext( AppContext );


  return (
    <div id="safi-shortcuts-menu" className="safi-floating-pane">
      <div className="close-btn flex items-center" onClick={onClose}>
        <div className="close-symbol"></div>
      </div>
      <div className="text-center">
        <h2>{__( "SHORTCUTS", "wpjoli-safi" )}</h2>
      </div>
      <div className="safi-floating-pane-inner --safi-scroll-thin">
        <div className="text-center">
          <h4>{__( "Editor", "wpjoli-safi" )}</h4>
        </div>
        <ShortcutItem
          title={__( "Close", "wpjoli-safi" )}
          shortcut={['ESC']}
        />
        <ShortcutItem
          title={__( "Zoom", "wpjoli-safi" )}
          shortcut={['ALT', 'Wheel']}
        />
        <div className="text-center">
          <h4>{__( "Tools", "wpjoli-safi" )}</h4>
        </div>
        <ShortcutItem
          title={__( "Select", "wpjoli-safi" )}
          shortcut={['V']}
        />
        <ShortcutItem
          title={__( "Text", "wpjoli-safi" )}
          shortcut={['T']}
        />
        <ShortcutItem
          title={__( "Rect", "wpjoli-safi" )}
          shortcut={['R']}
        />
        <ShortcutItem
          title={__( "Circle", "wpjoli-safi" )}
          shortcut={['C']}
        />
        <ShortcutItem
          title={__( "Image", "wpjoli-safi" )}
          shortcut={['I']}
        />
        <ShortcutItem
          title={__( "Content-based image", "wpjoli-safi" )}
          shortcut={['D']}
        />
        <ShortcutItem
          title={__( "FontAwesome icon", "wpjoli-safi" )}
          shortcut={['F']}
        />
        <ShortcutItem
          title={__( "SVG", "wpjoli-safi" )}
          shortcut={['S']}
        />
        <ShortcutItem
          title={__( "Conditional layers", "wpjoli-safi" )}
          shortcut={['X']}
        />
        <div className="text-center">
          <h4>{__( "Editing", "wpjoli-safi" )}</h4>
        </div>
        <ShortcutItem
          title={__( "Undo", "wpjoli-safi" )}
          shortcut={['CTRL', 'Z']}
        />
        <ShortcutItem
          title={__( "Redo", "wpjoli-safi" )}
          shortcut={['CTRL', 'Y']}
        />
        <ShortcutItem
          title={__( "Toggle grid", "wpjoli-safi" )}
          shortcut={['#']}
        />
        <div className="text-center">
          <h4>{__( "Selected layer", "wpjoli-safi" )}</h4>
        </div>
        <ShortcutItem
          title={__( "Delete", "wpjoli-safi" )}
          shortcut={['DEL']}
        />
        <ShortcutItem
          title={__( "Duplicate", "wpjoli-safi" )}
          shortcut={['ALT', 'D']}
        />
        <div className="text-center">
          <h4>{__( "Layer creation", "wpjoli-safi" )}</h4>
        </div>
        <ShortcutItem
          shortcut={['SHIFT']}
          comment="Hold"
          title={__( "Creates a layer with a 1:1 square ratio", "wpjoli-safi" )}
        />
        <ShortcutItem
          shortcut={['CTRL']}
          comment="Hold before click"
          title={__( "Set the starting point along the grid", "wpjoli-safi" )}
        />
        <ShortcutItem
          shortcut={['CTRL']}
          comment="Hold while drawing"
          title={__( "Snap layer along the grid", "wpjoli-safi" )}
        />
        <div className="text-center">
          <h4>{__( "Layer moving", "wpjoli-safi" )}</h4>
        </div>
        <ShortcutItem
          shortcut={['SHIFT']}
          comment="Hold"
          title={__( "Moves the layer along a fixed axis", "wpjoli-safi" )}
        />
        <ShortcutItem
          shortcut={['CTRL']}
          comment="Hold"
          title={__( "Moves & snaps the layer on the grid", "wpjoli-safi" )}
        />
        <ShortcutItem
          shortcut={['←↑↓→']}
          title={__( "Move by 1 pixel", "wpjoli-safi" )}
        />
        <ShortcutItem
          shortcut={['SHIFT', '←↑↓→']}
          title={__( "Move by 10 pixels", "wpjoli-safi" )}
        />
        <ShortcutItem
          shortcut={['CTRL', '←↑↓→']}
          title={__( "Move by 100 pixels", "wpjoli-safi" )}
        />
        <div className="text-center">
          <h4>{__( "Layer resizing", "wpjoli-safi" )}</h4>
        </div>
        <ShortcutItem
          shortcut={['SHIFT']}
          comment="Hold"
          title={__( "Preserve ascpect ratio", "wpjoli-safi" )}
        />
        <ShortcutItem
          shortcut={['ALT']}
          comment="Hold"
          title={__( "Resize the layer from its center", "wpjoli-safi" )}
        />
        <ShortcutItem
          shortcut={['CTRL']}
          comment="Hold"
          title={__( "Resizes & snaps the layer on the grid", "wpjoli-safi" )}
        />
      </div>
    </div>
  );
};

export default ShortcutsPane;