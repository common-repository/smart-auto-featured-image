const { useState, useEffect, useContext } = wp.element;
import Panel from './Panel';
import { AppContext } from '../../AppContext';


const PanelProperties = ( { element, onElementDataChange, ...props } ) => {

  const isPro = useContext( AppContext );
  const [currentElement, setCurrentElement] = useState( element );


  useEffect( () => {
    setCurrentElement( element );
  }, [element] );



  const opacityChanging = ( e ) => {

    const data = {
      opacity: e.target.value / 100
    }
    propDataChanged( data, false );
  }

  const opacityChanged = ( e ) => {

    const data = {
      opacity: e.target.value / 100
    }
    propDataChanged( data );
  }
  const angleChanging = ( e ) => {

    const data = {
      angle: e.target.value
    }
    propDataChanged( data, false );
  }

  const angleChanged = ( e ) => {

    const data = {
      angle: e.target.value
    }
    propDataChanged( data );
  }

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
    <Panel header={true} name="Properties">
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <label htmlFor="propX" title="Position from the left">
              <span>X</span>
              <input
                className="safi-plain --stealth"
                disabled={currentElement.locked}
                type="number"
                name="propX"
                id="propX"
                value={currentElement.x}
                onChange={e => propDataChanged( { x: parseFloat( e.target.value ) } )}
              />
            </label>
          </div>
        </div>
        <div className="safi-prop-col">
          <div className="safi-prop">
            <label htmlFor="propY">
              <span>Y</span>
              <input
                className="safi-plain --stealth"
                disabled={currentElement.locked}
                type="number"
                name="propY"
                id="propY"
                value={currentElement.y}
                onChange={e => propDataChanged( { y: parseFloat( e.target.value ) } )}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <label htmlFor="propW">
              <span>W</span>
              <input
                className="safi-plain --stealth"
                disabled={currentElement.locked}
                type="number"
                name="propW"
                id="propW"
                value={currentElement.width}
                onChange={e => propDataChanged( { width: parseFloat( e.target.value ) } )}
              />
            </label>
          </div>
        </div>
        <div className="safi-prop-col">
          <div className="safi-prop">
            <label htmlFor="propH">
              <span>H</span>
              <input
                className="safi-plain --stealth"
                disabled={currentElement.locked}
                type="number"
                name="propH"
                id="propH"
                value={currentElement.height}
                onChange={e => propDataChanged( { height: parseFloat( e.target.value ) } )}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <label htmlFor="propOpacity">
              <span>Opacity</span>
              <input
                className="safi-plain --stealth"
                style={{ width: 60 }}
                type="number"
                step={1}
                min="0"
                max="100"
                name="propOpacity"
                id="propOpacity"
                value={currentElement.opacity * 100}
                onChange={opacityChanging}
                onBlur={opacityChanged}
              />
            </label>
            {/* <div className="safi-label-container">
              <label>Opacity</label>
            </div> */}
            <input
              type="range"
              min="0"
              max="100"
              value={currentElement.opacity * 100}
              onChange={opacityChanging}
              // onInput={(e) => console.log(e)}
              onBlur={opacityChanged}
              title="Opacity"
            />
          </div>
        </div>
      </div>
      {isPro &&
        <div className="safi-prop-row">
          <div className="safi-prop-col">
            <div className="safi-prop">
              <label htmlFor="propAngle">
                <span>Rotation</span>
                <input
                  style={{ width: 60 }}
                  type="number"
                  min="0"
                  max="360"
                  name="propAngle"
                  id="propAngle"
                  value={currentElement.angle}
                  onChange={angleChanging}
                  onBlur={angleChanged}
                />
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step={1}
                value={currentElement.angle}
                onChange={angleChanging}
                // onInput={(e) => console.log(e)}
                onBlur={angleChanged}
                title="Angle"
              />
            </div>
          </div>
        </div>
      }
    </Panel>

  );
};

export default PanelProperties;