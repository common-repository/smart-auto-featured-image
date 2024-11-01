const { useState, useEffect, useContext } = wp.element;
import SafiColorPicker from './controls/SafiColorPicker';
import Panel from './panels/Panel';
import PanelGlobalCSS from './panels/PanelGlobalCSS';
import { AppContext } from '../AppContext';


const SafiTemplateSettings = ( { canvas, onCanvasDataChange, onTriggerSnapshot } ) => {

  const isPro = useContext( AppContext );
  const [canvasData, setCanvasData] = useState( canvas );

  useEffect( () => {
    setCanvasData( canvas );
  }, [canvas] );

  const colorChanged = ( hexColor ) => {
    let canvasNew = { ...canvasData };
    canvasNew.backgroundColor = hexColor;
    setCanvasData( canvasNew );
    onCanvasDataChange( canvasNew, false );
  };

  const colorChangeComplete = ( hexColor ) => {
    let canvasNew = { ...canvasData };
    let color = hexColor ? hexColor : "#ffffff";
    canvasNew.backgroundColor = color;
    setCanvasData( canvasNew );
    onCanvasDataChange( canvasNew, true );
  };

  const updateW = ( e ) => {
    let canvasNew = { ...canvasData };
    canvasNew.width = parseInt( e.target.value );

    if ( !isPro && canvasNew.width > 1200 ) {
      alert( "Max width is 1200. Upgrade to Pro for max width up to 5000" );
      canvasNew.width = 1200;
    }
    setCanvasData( canvasNew );
    // onCanvasDataChange( canvasNew );
  };

  const updateH = ( e ) => {
    let canvasNew = { ...canvasData };
    canvasNew.height = parseInt( e.target.value );

    if ( !isPro && canvasNew.height > 800 ) {
      alert( "Max width is 800. Upgrade to Pro for max width up to 5000" );
      canvasNew.height = 800;
    }

    setCanvasData( canvasNew );
    // onCanvasDataChange( canvasNew );
  };

  const updateName = ( e ) => {
    const name = e.target.value;

    let canvasNew = { ...canvasData };
    canvasNew.templateName = e.target.value;
    setCanvasData( canvasNew );
    // onCanvasDataChange( canvasNew );
  };

  const updateGridSize = ( e ) => {
    let canvasNew = { ...canvasData };
    canvasNew.gridSize = parseInt( e.target.value );
    setCanvasData( canvasNew );
    onCanvasDataChange( canvasNew, false );
  };

  const handleKeyUp = ( e ) => {
    if ( e.keyCode === 13 ) { //enter
      handleNameChange();
    }
  };

  const handleNameChange = () => {
    const name = canvasData.templateName;

    if ( !name ) {
      alert( "A name is required" );
      return;
    }

    if ( name.length > 50 ) {
      alert( "A name cannot be longer than 50 characters" );
      return;
    }

    onCanvasDataChange( canvasData )
  };


  return (
    <div>
      <Panel header={true} name="Template name">
        <div className="safi-prop-row">
          <div className="safi-prop-col">
            <div className="safi-prop">
              <input
                type="text"
                id="safi-tpl-name"
                className="safi-plain --stealth"
                autoComplete="false"
                name="safi-tpl-name"
                value={canvasData?.templateName}
                onChange={updateName}
                onKeyUp={handleKeyUp}
                onBlur={handleNameChange}
              />
            </div>
          </div>
        </div>
      </Panel>

      <Panel header={true} name="Background">
        <div className="safi-prop-row">
          <div className="safi-prop-col">
            <div className="safi-prop">
              <SafiColorPicker
                color={canvasData?.backgroundColor || null}
                onColorChange={colorChanged}
                onColorChangeComplete={colorChangeComplete}
                onTriggerSnapshot={() => onTriggerSnapshot()}
              />
            </div>
          </div>
        </div>
      </Panel>

      <Panel header={true} name="Template size">
        <div className="safi-prop-row">
          <div className="safi-prop-col">
            <div className="safi-prop">
              <label htmlFor="propW">
                <span>W</span>
                <input
                  className="safi-plain --stealth"
                  type="number"
                  name="propW"
                  id="propW"
                  value={canvasData?.width}
                  onChange={updateW}
                  onBlur={() => onCanvasDataChange( canvasData )}
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
                  type="number"
                  name="propH"
                  id="propH"
                  value={canvasData?.height}
                  onChange={updateH}
                  onBlur={() => onCanvasDataChange( canvasData )}
                />
              </label>
            </div>
          </div>
        </div>
      </Panel>

      <Panel header={true} name="Grid size">
        <div className="safi-prop-row">
          <div className="safi-prop-col">
            <div className="safi-prop">
              <input
                className="safi-plain --stealth"
                type="number" name="" id=""
                value={canvasData?.gridSize}
                onChange={updateGridSize}
                onBlur={() => onCanvasDataChange( canvasData )}
              />
            </div>
          </div>
        </div>
      </Panel>

      <PanelGlobalCSS
        canvas={canvasData}
        onCanvasDataChange={( data ) => onCanvasDataChange( data )}
      />
    </div>

  );
}

export default SafiTemplateSettings;