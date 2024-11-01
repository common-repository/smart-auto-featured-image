const { useState, useEffect, useContext } = wp.element;
import Panel from './Panel';
import Utils from '../../Utils';
import { AppContext } from '../../AppContext';


const PanelCSS = ( { element, ...props } ) => {

  const isPro = useContext( AppContext );
  const [currentElement, setCurrentElement] = useState( element );
  const [cssErrors, setCssErrors] = useState( false );
  const [valClasses, setValClasses] = useState( element.classes == null ? "" : element.classes );
  const [valCss, setValCss] = useState( element.customCss == null ? "" : element.customCss );


  let hasCSSChanged;

  useEffect( () => {
    setCurrentElement( element );
    setValClasses( element.classes == null ? "" : element.classes );
    setValCss( element.customCss == null ? "" : element.customCss );

  }, [element] );

  const updateCSS = ( e ) => {
    const value = e.target.value;

    const cssValidation = Utils.validateCSS( value );

    setCssErrors( cssValidation.valid === true ? false : cssValidation.errors );

    //let the component know we made some changes
    hasCSSChanged = true;
    setValCss( value );

    if ( cssValidation.valid === true ) {
      propDataChanged( { customCss: value } )
    }
  };


  const updateClasses = ( e ) => {
    const value = e.target.value;
    setValClasses( value );

    propDataChanged( { classes: e.target.value } );
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
    <Panel header={true} name="Custom CSS" disabled={isPro === false}>
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <label htmlFor="prop-classes">
              <span>Custom classes</span>
            </label>
            <input
              type="text"
              className="safi-plain"
              name="prop-classes"
              id="safi-custom-classes"
              placeholder="class1 class2..."
              value={valClasses}
              onChange={updateClasses}
            // onBlur={() => this.propDataChanged({ classes: element.classes })}
            />
          </div>
        </div>
      </div>
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <label htmlFor="prop-css">
              <span>Custom CSS</span>
            </label>
            <textarea
              name="prop-css"
              className="safi-plain"
              id="safi-custom-css"
              placeholder="margin: 10px;&#13;&#10;backdrop-filter: blur(10px);&#13;&#10;..."
              value={valCss}
              onChange={updateCSS}
              // onBlur={updateCSSTriggerHistory}
              onBlur={( e ) => propDataChanged( { customCss: e.target.value } )}
            />
            {cssErrors !== false &&
              <ol className="css-errors">
                {cssErrors.map( ( error ) => {
                  return ( <li>{error}</li> );
                } )}
              </ol>
            }
          </div>
        </div>
      </div>
    </Panel>

  );
};

export default PanelCSS;