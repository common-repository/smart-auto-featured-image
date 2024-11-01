const { useState, useEffect, useContext } = wp.element;
import Panel from './Panel';
import { AppContext } from '../../AppContext';


const PanelGlobalCSS = ( { canvas, onCanvasDataChange } ) => {

  const isPro = useContext( AppContext );
  const [canvasData, setCanvasData] = useState( canvas );
  const [cssErrors, setCssErrors] = useState( false );
  const [valCss, setValCss] = useState( canvas?.globalCss == null ? "" : canvas.globalCss );

  let hasCSSChanged;


  useEffect( () => {
    setCanvasData( canvas );
  }, [canvas] );


  const cssChanged = ( value ) => {
    let canvasNew = { ...canvasData };
    canvasNew.globalCss = value;
    onCanvasDataChange( canvasNew )
  };


  const updateCSS = ( e ) => {
    const value = e.target.value;

    //let the component know we made some changes
    hasCSSChanged = true;
    // valCss = value;
    setValCss( value );

  };


  return (
    <Panel header={true} name="Global CSS" disabled={isPro === false}>
      <div className="safi-prop-row">
        <div className="safi-prop-col">
          <div className="safi-prop">
            <label htmlFor="prop-css">
              <span>Write your custom styles here and use them throughout the template.</span>
            </label>
            <textarea
              name="prop-css"
              className="safi-plain"
              id="safi-global-css"
              placeholder=".my-class{&#13;&#10;    margin: 10px;&#13;&#10;    backdrop-filter: blur(10px);&#13;&#10;...&#13;&#10;}"
              value={valCss}
              onChange={updateCSS}
              // onBlur={updateCSSTriggerHistory}
              // onBlur={( e ) => propDataChanged( { customCss: e.target.value } )}
              rows={20}
              onBlur={( e ) => cssChanged( e.target.value )}
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

export default PanelGlobalCSS;