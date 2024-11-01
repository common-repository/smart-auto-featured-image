const { __ } = wp.i18n;
const { useState, useEffect, useContext } = wp.element;
import { AppContext } from '../../AppContext';
import BoxControl from '../controls/BoxControl';
import SafiColorPicker from '../controls/SafiColorPicker';
import Panel from './Panel';



const PanelBorder = ( { element, onStyleUpdate, onTriggerSnapshot, ...props } ) => {

  const isPro = useContext( AppContext );
  const [currentElement, setCurrentElement] = useState( element );

  useEffect( () => {
    setCurrentElement( element );
    // console.log('USEFEFFCT', element);
  }, [element] );


  const colorChanged = ( hexColor ) => {
    //newvalue
    onStyleUpdate( currentElement.id, "borderColor", hexColor );
  };


  const colorChangeComplete = ( hexColor ) => {

    // add history
    onStyleUpdate( currentElement.id, "borderColor", hexColor, true );
  };

  /**
   * Passes on the changed data to the React parent
   * Using the onElementDataChange prop
   * @param {Object} data 
   */
  const propDataChanged = ( data, addHistory = true ) => {
    const elementId = currentElement.id;

    // console.log( data );
    if ( !elementId ) {
      return;
    }

    props.onElementDataChange( elementId, data, addHistory );
  }

  return (
    <Panel header={true}
      name={props.name || "Border"}
      disabled={isPro === false}
      isOpen={currentElement.border != null || currentElement.borderRadius != null || currentElement.borderColor != null}
    >
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <SafiColorPicker
              color={currentElement.styles.borderColor}
              onColorChange={colorChanged}
              onColorChangeComplete={colorChangeComplete}
              onTriggerSnapshot={() => onTriggerSnapshot()}
            />
          </div>
        </div>
      </div>
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <BoxControl
              id="safi-box-control--border"
              label={__( "Border width", "smart-auto-featured-image" )}
              value={currentElement.border || null}
              dimensions={[
                { label: __( "top", "smart-auto-featured-image" ), value: "top" },
                { label: __( "right", "smart-auto-featured-image" ), value: "right" },
                { label: __( "bottom", "smart-auto-featured-image" ), value: "bottom" },
                { label: __( "left", "smart-auto-featured-image" ), value: "left" },

              ]}
              noNegatives={true}
              onChange={( val ) => propDataChanged( { border: val } )}
            />
          </div>
        </div>
      </div>
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <BoxControl
              id="safi-box-control--border-radius"
              label={__( "Border radius", "smart-auto-featured-image" )}
              value={currentElement.borderRadius || null}
              dimensions={[
                { label: __( "top-left", "smart-auto-featured-image" ), value: "topLeft" },
                { label: __( "top-right", "smart-auto-featured-image" ), value: "topRight" },
                { label: __( "bot-right", "smart-auto-featured-image" ), value: "bottomRight" },
                { label: __( "bot-left", "smart-auto-featured-image" ), value: "bottomLeft" },

              ]}
              noNegatives={true}
              onChange={( val ) => propDataChanged( { borderRadius: val } )}
            />
          </div>
        </div>
      </div>
    </Panel>

  );
};

export default PanelBorder;