const { useState, useEffect } = wp.element;
import Panel from './Panel';
import BoxControl from '../controls/BoxControl';
const { __ } = wp.i18n;


const PanelMarginPadding = ( { element, onElementDataChange, ...props } ) => {

  const [currentElement, setCurrentElement] = useState( element );


  useEffect( () => {
    setCurrentElement( element );
  }, [element] );


  const showPadding = ( e ) => {
    const data = {
      highlightPadding: true,
    }
    propDataChanged( data );
  };

  const hidePadding = ( e ) => {
    const data = {
      highlightPadding: undefined,
    }
    propDataChanged( data );
  };

  /**
   * Passes on the changed data to the React parent
   * Using the onElementDataChange prop
   * @param {Object} data 
   */
  const propDataChanged = ( data ) => {

    const elementId = currentElement.id;

    if ( !elementId ) {
      return;
    }

    onElementDataChange( elementId, data );
  }

  // console.log(this.props);
  return (
    <Panel header={true} name="Padding"
      isOpen={currentElement.padding != null || currentElement.margin != null}
    >
      {/* <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <BoxControl
              label={__( "Margin", "smart-auto-featured-image" )}
              value={currentElement.margin || null}
              dimensions={[
                { label: __( "top", "smart-auto-featured-image" ), value: "top" },
                { label: __( "right", "smart-auto-featured-image" ), value: "right" },
                { label: __( "bottom", "smart-auto-featured-image" ), value: "bottom" },
                { label: __( "left", "smart-auto-featured-image" ), value: "left" },

              ]}
              onChange={( val ) => propDataChanged( { margin: val } )}
            />
          </div>
        </div>
      </div> */}
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <BoxControl
              id="safi-box-control--padding"
              // label={__( "Padding", "smart-auto-featured-image" )}
              value={currentElement.padding || null}
              dimensions={[
                { label: __( "top", "smart-auto-featured-image" ), value: "top" },
                { label: __( "right", "smart-auto-featured-image" ), value: "right" },
                { label: __( "bottom", "smart-auto-featured-image" ), value: "bottom" },
                { label: __( "left", "smart-auto-featured-image" ), value: "left" },

              ]}
              noNegatives={true}
              onChange={( val ) => propDataChanged( { padding: val } )}
              onMouseEnter={showPadding}
              onMouseLeave={hidePadding}
            />
          </div>
        </div>
      </div>
    </Panel>

  );
};

export default PanelMarginPadding;