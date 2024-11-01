const { useState, useEffect } = wp.element;
import SafiColorPicker from '../controls/SafiColorPicker';
import Panel from './Panel';
const { __ } = wp.i18n;


const PanelColors = ( { element, onStyleUpdate, isMouseDown, onTriggerSnapshot, ...props } ) => {

  const [currentElement, setCurrentElement] = useState( element );

  useEffect( () => {
    setCurrentElement( element );
  }, [element] );


  const colorChanged = ( hexColor ) => {

    onStyleUpdate( currentElement.id, "backgroundColor", hexColor );
  }

  const colorChangeComplete = ( hexColor ) => {
    const addHistory = true;
    onStyleUpdate( currentElement.id, "backgroundColor", hexColor, addHistory );
  }

  /**
   * Passes on the changed data to the React parent
   * Using the onElementDataChange prop
   * @param {Object} data 
   */
  const propDataChanged = ( data, addHistory = true ) => {

    const elementId = currentElement.id;

    if ( !elementId ) {
      return;
    }

    props.onElementDataChange( elementId, data, addHistory );
  }

  return (
    <Panel header={true} name={props.name || "Background color"}>
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <SafiColorPicker
              color={currentElement.styles?.backgroundColor || null}
              onColorChange={colorChanged}
              onColorChangeComplete={colorChangeComplete}
              onTriggerSnapshot={() => onTriggerSnapshot()}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default PanelColors;