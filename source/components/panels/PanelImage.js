const { __ } = wp.i18n;
const { useState, useEffect, useRef, useContext } = wp.element;
import Panel from './Panel';
import { AppContext } from '../../AppContext';
import ImagePicker from '../controls/ImagePicker';

const objectFit = [
  { value: null, label: 'None' },
  { value: 'contain', label: 'Contain' },
  { value: 'cover', label: 'Cover' },
  { value: 'fill', label: 'Fill' },
  { value: 'scale-down', label: 'Scale down' },
];

const PanelImage = ( { element, canvas, ...props } ) => {
  const isPro = useContext( AppContext )

  const [currentElement, setCurrentElement] = useState( element );


  useEffect( () => {
    setCurrentElement( element );
    // console.log('USEFEFFCT', element);
  }, [element] );

  const objectFitChanged = ( e ) => {

    const dataChanged = {
      fit: e.target.value
    }
    
    propDataChanged( dataChanged );
  }

  /**
   * Passes on the changed data to the React parent
   * Using the onElementDataChange prop
   * @param {Object} data 
   */
  const propDataChanged = ( data ) => {

    const elementId = currentElement.id;

    // console.log( elementId );
    if ( !elementId ) {
      return;
    }

    props.onElementDataChange( elementId, data );
  };

  return (
    <Panel header={true} name="Image">
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <ImagePicker
              element={currentElement}
              canvas={canvas}
              propDataChanged={propDataChanged}
            />
          </div>
        </div>
      </div>
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-input">
            <div className="safi-prop">
              <label htmlFor="safi-image-fit-select">{__( "Image fit", "wpjoli-safi" )}</label>

              <select
                id="safi-image-fit-select"
                className="safi-plain --stealth"
                onChange={objectFitChanged}
              >
                {objectFit.map( ( item ) => {
                  return <option
                    value={item.value}
                    selected={item.value === currentElement.fit}
                  >{item.label}</option>
                } )
                }
              </select>
            </div>
          </div>
        </div>
      </div>
    </Panel >
  );
};

export default PanelImage;