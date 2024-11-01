const { __ } = wp.i18n;
const { useEffect, useContext } = wp.element;

import { AppContext } from '../AppContext';
import HelpItem from './ui/HelpItem';


const HelpMenu = ( { currentTuto, autoStartUITour, tree, onClose, ...props } ) => {

  const isPro = useContext( AppContext );
  const driver = window.driver.js.driver || null;

  useEffect( () => {
    if ( autoStartUITour === true && ( localStorage.getItem( "SAFI_INTRO" ) === null ) ) {
      startUITour();

      //Marks tour as seen for the first time
      localStorage.setItem( "SAFI_INTRO", true );
    }
  }, [] )

  const checkLayerCount = () => {
    if ( !isPro && tree.length >= 2 ) {
      alert( __( "Your current plan has a limit of 2 layers. Delete one layer or more to begin the tutorial.", "wpjoli-safi" ) );
      return false;
    }
    return true;
  }

  const startUITour = () => {

    const driverObj = driver( {
      popoverClass: 'safi-driver',
      showProgress: true,
      tutorial: "tuto-ui-tour",
      hideHelpOnComplete: true,
      steps: [
        { popover: { title: 'Welcome to the Smart Auto Featured Image editor!', description: 'If this is your first time here, take a minute to get familiar with the editor. Click next to start the tour or use the right arrow on your keyboard' } },
        { element: '#safi-design-tools', popover: { title: 'Design Tools', description: 'These are all the design tools available. Select a tool and draw on the canvas to create a new layer!' } },
        { element: '#safi-grid', popover: { title: 'Grid', description: 'Toggle the grid to make designing easier. Change the grid size from the template settings.' } },
        { element: '#safi-settings', popover: { title: 'Template Settings', description: 'Edit Template name here and adjust the Canvas size / Background color / Global CSS rules' } },
        { element: '#safi-canvas', popover: { title: 'Canvas', description: 'Use the tools to draw on it and build your design. Change canvas size and color in the template settings' } },
        { element: '#safi-panel-layers', popover: { title: 'Layers', description: 'The layers are shown on the left as your create them. Rearrange the order with drag & drop. Double click on a layer to rename it' } },
        { element: '#safi-sidebar-right', popover: { title: 'Contextual settings', description: `The right sidebar shows the selected layer's settings. This is where you can adjust colors, fonts etc` } },
        { element: '#safi-zoom', popover: { title: 'Zoom', description: 'Adjust the zoom level to your convenience here.' } },
        { element: '#safi-info-helper', popover: { title: 'Contextual helper', description: 'This is the contextual helper area. It will show useful tips depending on the action that you perform.' } },
        { element: '#safi-help', isLastStep: true, popover: { title: 'Help center', description: 'Check the help center here to replay this tour or access interactive tutorials and documentation ! Happy designing !' } },
        //   { element: '.sidebar', popover: { title: 'Title', description: 'Description' } },
        //   { element: '.footer', popover: { title: 'Title', description: 'Description' } },
      ]
    } );

    driverObj.drive();
    currentTuto( driverObj );
  }

  const startDynLayersTour = () => {

    if ( !checkLayerCount() === true ) return false;

    const driverObj = driver( {
      popoverClass: 'safi-driver',
      showProgress: true,
      tutorial: "tuto-dynamic-layers",
      hideHelpOnComplete: true,
      // allowClose: false,
      steps: [
        {
          popover: {
            title: 'What are Dynamic layers ?',
            description: 'When marking layers as "Dynamic", you will be able to replace their content while preserving their styles & position. This feature allows you to change the main image of your template, to shorten a title, adjusting line breaks, or bolden a specific word for example.',
          }
        },
        {
          element: '#safi-tool-text',
          autoNextClickElement: true,
          popover: {
            title: 'Text tool',
            description: 'Select the Text tool to begin.',
          }
        },
        {
          element: '#safi-canvas',
          popover: {
            title: 'Draw a Text element',
            description: 'Draw a text element on the canvas'
          }
        },
        {
          element: '#safi-layers',
          // autoNextClickElement: true,
          // isLastStep: true,
          popover: {
            title: 'Click the bolt icon',
            description: 'Hover the selected layer and click the bolt icon to Mark layer as dynamic.'
          }
        },
        {
          // isLastStep: true,
          popover: {
            title: 'That\'s it !',
            description: 'Next, from the gutenberg editor, dynamic layers will show up on the left sidebar of the Preview window. '
          }
        },
        {
          isLastStep: true,
          popover: {
            title: 'Recommanded usage:',
            description: 'Content-based text layers such as {{title}} should be marked as dynamic. The main image of your template as well. Basically any layer that needs to change on a per-post basis.'
          }
        },

      ]
    } );

    driverObj.drive();
    currentTuto( driverObj );
  }

  const startDynTextTour = () => {
    // console.log(checkLayerCount());
    if ( !checkLayerCount() === true ) return false;

    const driverObj = driver( {
      popoverClass: 'safi-driver',
      showProgress: true,
      tutorial: "tuto-dynamic-text",
      hideHelpOnComplete: true,
      // allowClose: false,
      steps: [
        {
          element: '#safi-tool-text',
          autoNextClickElement: true,
          popover: {
            title: 'Text tool',
            description: 'Select the Text tool to begin.',
          }
        },
        {
          element: '#safi-canvas',
          popover: {
            title: 'Draw a Text element',
            description: 'Draw a text element on the canvas'
          }
        },
        {
          element: '#dynamic-text-dropdown',
          autoNextClickElement: true,
          popover: {
            title: 'Select a content-based text',
            description: 'Click the down arrow button to show content-based text list'
          }
        },
        {
          element: '.safi-popover-container',
          autoNextClickElement: true,
          isLastStep: true,
          popover: {
            title: 'Select any content-based text',
            description: 'Select any content-based text from the list'
          }
        },

      ]
    } );

    driverObj.drive();
    currentTuto( driverObj );
  }

  const startStyleTextTour = () => {
    // console.log(checkLayerCount());
    if ( !checkLayerCount() === true ) return false;

    const driverObj = driver( {
      popoverClass: 'safi-driver',
      showProgress: true,
      tutorial: "tuto-style-text",
      hideHelpOnComplete: true,
      // allowClose: false,
      steps: [
        {
          element: '#safi-tool-text',
          autoNextClickElement: true,
          popover: {
            title: 'Text tool',
            description: 'Select the Text tool to begin.',
          }
        },
        {
          element: '#safi-canvas',
          popover: {
            title: 'Draw a big Text element',
            description: 'Draw a rather big text element on the canvas'
          }
        },
        {
          element: '#dynamic-text-dropdown',
          autoNextClickElement: true,
          popover: {
            title: 'Show the content-based text dropdown',
            description: 'Click the down arrow button to show content-based text list'
          }
        },
        {
          element: '.safi-popover-container',
          // autoNextClickElement: true,
          popover: {
            title: 'Select "Post title" {{title}} from the content-based text list',
            description: 'Click the down arrow button to show content-based text list'
          }
        },
        {
          element: '.--selected .safi-text-placeholder',
          autoNextClickElement: true,
          // isLastStep: true,
          popover: {
            title: 'Activate the "Lorem ipsum" placeholder',
            description: 'This fake text will give a you a preview of what a longer text will look like within the text layer.'
          }
        },
        {
          element: '#propLineHeight',
          // autoNextClickElement: true,
          // isLastStep: true,
          popover: {
            title: 'Adjust the line height to 1.3',
            description: '.'
          }
        },
        {
          element: '#safi-box-control--padding',
          // autoNextClickElement: true,
          // isLastStep: true,
          popover: {
            title: 'Adjust the padding to 20',
            description: 'Increase padding to make sure the text won\'t be sticking to the edges. Scroll over the value to easily change it'
          }
        },
        {
          element: '#segmented-button-text-align-middle',
          // autoNextClickElement: true,
          // isLastStep: true,
          popover: {
            title: 'Align center vertically',
            description: 'This will keep the text vertically centered, regardless of its length'
          }
        },
        {
          element: '.--selected .safi-text-placeholder',
          autoNextClickElement: true,
          // isLastStep: true,
          popover: {
            title: 'Deactivate the "Lorem ipsum" placeholder',
            description: 'Deactivate the placeholder once you are done styling.'
          }
        },
        {
          // element: '#safi-box-control--padding',
          // autoNextClickElement: true,
          // isLastStep: true,
          popover: {
            title: 'Congratulations !',
            description: 'Keep in mind that text will be contained within the boundaries of its own layer size. Make sure to adjust the proper width/height/padding for your designs and play with the other available options.'
          }
        },

      ]
    } );

    driverObj.drive();
    currentTuto( driverObj );
  }

  const startImageTour = () => {

    if ( !checkLayerCount() === true ) return false;

    const driverObj = driver( {
      popoverClass: 'safi-driver',
      showProgress: true,
      // allowClose: false,

      showButtons: [
        // 'next',
        'previous',
        'close'
      ],

      tutorial: "tuto-image-background",
      hideHelpOnComplete: true,
      steps: [
        {
          element: '#safi-tool-image',
          autoNextClickElement: true,
          popover: {
            title: 'Image tool',
            description: 'Select the Image tool to begin.',
          }
        },
        {
          element: '#safi-canvas',
          popover: {
            title: 'Draw an image element',
            description: 'Draw an image element of any size on the canvas.'
          }
        },
        {
          element: '#safi-media-library-open',
          autoNextClickElement: true,
          popover: {
            title: 'Select an image from the media library',
            description: 'We are choosing from the media library for this tutorial but you can pick an image from any source'
          }
        },
        {
          element: '.media-modal',
          // autoNextClickElement: true,
          popover: {
            title: 'Pick an image',
            description: 'Select any image from the media library and click on "Use this image" on the bottom right.'
          }
        },
        {
          element: '#segmented-button-fit',
          autoNextClickElement: true,
          popover: {
            title: 'Click the "Fit to container" button',
            description: 'This button automatically resizes/repositions the selected layer to fit its container.'
          }
        },
        {
          element: '#safi-image-fit-select',
          autoNextClickElement: true,
          isLastStep: true,
          popover: {
            title: 'Change the image fit to "Cover"',
            description: 'The "Cover" fit will ensure the image fills up the space entirely'
          }
        },
        // {
        //   element: '.react-select__menu',
        //   autoNextClickElement: true,
        //   popover: {
        //     title: 'Change the image fit to "Cover"',
        //     description: 'The "Cover" fit will ensure the image fills up the space entirely'
        //   }
        // },

      ]
    } );

    driverObj.drive();
    currentTuto( driverObj );
  }

  const startSquareTour = () => {
    if ( !checkLayerCount() === true ) return false;

    const driverObj = driver( {
      popoverClass: 'safi-driver',
      showProgress: true,
      // allowClose: false,

      showButtons: [
        // 'next',
        'previous',
        'close'
      ],

      tutorial: "tuto-perfect-square",
      hideHelpOnComplete: true,

      steps: [
        {
          element: '#safi-tool-rect',
          autoNextClickElement: true,
          popover: {
            title: 'Rect tool',
            description: 'Select the Rect tool to begin.',
          }
        },
        {
          element: '#safi-canvas',
          keyRequired: true,
          // key: 'shiftKey',
          keyCallback: ( e ) => e.shiftKey === true,
          popover: {
            title: 'Hold the Shift key',
            description: 'Hold the Shift key before or while drawing.'
          }
        },
        {
          element: '#safi-canvas',
          // keyRequired: true,
          // key: 'shiftKey',
          isLastStep: true,
          popover: {
            title: 'Start drawing',
            description: 'Keep holding the Shift key and draw to create a perfect square. Release the mouse button before the Shift key.'
          }
        },


      ]
    } );

    driverObj.drive();
    currentTuto( driverObj );
  }

  const startMoveFixedAxisTour = () => {
    if ( !checkLayerCount() === true ) return false;

    const driverObj = driver( {
      popoverClass: 'safi-driver',
      showProgress: true,
      // allowClose: false,

      showButtons: [
        // 'next',
        'previous',
        'close'
      ],
      tutorial: "tuto-move-fixed-axis",
      hideHelpOnComplete: true,

      steps: [
        {
          element: '#safi-tool-rect',
          autoNextClickElement: true,
          popover: {
            title: 'Rect tool',
            description: 'Select the Rect tool to begin.',
          }
        },
        {
          element: '#safi-canvas',
          // autoNextClickElement: true,
          popover: {
            title: 'Draw a rect shape',
            description: 'Create a rect layer of any size on the canvas',
          }
        },
        {
          element: '#safi-canvas',
          keyRequired: true,
          // key: 'shiftKey',
          keyCallback: ( e ) => e.shiftKey === true,
          popover: {
            title: 'Hold the Shift key',
            description: 'Hold the Shift key before or while drawing.'
          }
        },
        {
          element: '#safi-canvas',
          // keyRequired: true,
          // key: 'shiftKey',
          isLastStep: true,
          popover: {
            title: 'Move the layer to the right or the left',
            description: 'Keep holding the Shift key and move the layer along a fixed axis. The position of the mouse will determine if the X ou Y axis is used.'
          }
        },


      ]
    } );

    driverObj.drive();
    currentTuto( driverObj );
  }

  const startResizeFromCenterTour = () => {
    if ( !checkLayerCount() === true ) return false;

    const driverObj = driver( {
      popoverClass: 'safi-driver',
      showProgress: true,
      // allowClose: false,

      showButtons: [
        // 'next',
        'previous',
        'close'
      ],
      tutorial: "tuto-resize-from-center",
      hideHelpOnComplete: true,

      steps: [
        {
          element: '#safi-tool-rect',
          autoNextClickElement: true,
          popover: {
            title: 'Rect tool',
            description: 'Select the Rect tool to begin.',
          }
        },
        {
          element: '#safi-canvas',
          // autoNextClickElement: true,
          popover: {
            title: 'Draw a rect shape',
            description: 'Create a rect layer of any size on the canvas',
          }
        },
        {
          element: '#segmented-button-align-h-center',
          autoNextClickElement: true,
          popover: {
            title: 'Align center horizontally',
            description: 'This button centers horizontally the selected layer.'
          }
        },
        {
          element: '#segmented-button-align-v-center',
          autoNextClickElement: true,
          popover: {
            title: 'Align center vertically',
            description: 'This button centers vertically the selected layer.'
          }
        },
        {
          // element: '.safi-object.--selected',
          keyRequired: true,
          // key: 'shiftKey',
          keyCallback: ( e ) => e.altKey === true,
          popover: {
            title: 'Hold the Alt key',
            description: 'Holding the Alt key will resize a layer from its center.'
          }
        },

        {
          element: '.safi-object.--selected +.safi-handles .--handle-bottom-right',
          // autoNextClickElement: true,
          // keyRequired: true,
          // key: 'shiftKey',
          // isLastStep: true,
          popover: {
            title: 'Drag the bottom right corner',
            description: 'Hold the Alt key and drag this corner to resize the layer from its center. Use Ctrl/Cmd key in combination to snap to grid'
          }
        },


      ]
    } );

    driverObj.drive();
    currentTuto( driverObj );
  }

  const startGridTour = () => {
    if ( !checkLayerCount() === true ) return false;

    const driverObj = driver( {
      popoverClass: 'safi-driver',
      showProgress: true,
      // allowClose: false,

      showButtons: [
        // 'next',
        'previous',
        'close'
      ],

      tutorial: "tuto-grid",
      hideHelpOnComplete: true,

      steps: [
        {
          element: '#safi-grid',
          autoNextClickElement: true,
          popover: {
            title: 'Activate the grid',
            description: 'Click the grid icon to activate/deactivate it or use the "#" shortcut key',
          }
        },
        {
          element: '#safi-tool-rect',
          autoNextClickElement: true,
          popover: {
            title: 'Rect tool',
            description: 'Select the Rect tool.',
          }
        },
        {
          // element: '#safi-canvas',
          keyRequired: true,
          keyCallback: ( e ) => e.ctrlKey === true || e.metaKey === true,
          popover: {
            title: 'Hold the Ctrl/Cmd key',
            description: 'Holding the Ctrl/Cmd key will snap the pointer to the grid.'
          }
        },
        {
          element: '#safi-canvas',
          // keyRequired: true,
          // key: 'shiftKey',
          // isLastStep: true,
          popover: {
            title: 'Draw a rect layer of any size',
            description: 'Keep holding the Ctrl/Cmd key while drawing to draw along the grid.'
          }
        },
        {
          element: '#safi-canvas',
          // keyRequired: true,
          // key: 'shiftKey',
          isLastStep: true,
          popover: {
            title: 'Move the layer',
            description: 'Keep holding the Ctrl/Cmd key to move the layer along the grid.'
          }
        },


      ]
    } );

    driverObj.drive();
    currentTuto( driverObj );
  }
  

  return (
    <div id="safi-help-menu" className="safi-floating-pane">
      <div className="close-btn flex items-center" onClick={onClose}>
        <div className="close-symbol"></div>
      </div>
      <div className="text-center">
        <h2>{__( "HELP CENTER", "wpjoli-safi" )}</h2>
      </div>
      <div className="safi-floating-pane-inner --safi-scroll-thin">
        <div className="text-center">
          <h4>{__( "Tours", "wpjoli-safi" )}</h4>
        </div>
        <HelpItem
          title={__( "Interface tour", "wpjoli-safi" )}
          description={__( "Get an overview of the UI", "wpjoli-safi" )}
          onButtonClick={startUITour}
        />
        <div className="text-center">
          <h4>{__( "Interactive Tutorials", "wpjoli-safi" )}</h4>
        </div>
        <HelpItem
          title={__( "Dynamic layers", "wpjoli-safi" )}
          description={__( "Make per-post changes before generating the image", "wpjoli-safi" )}
          onButtonClick={startDynLayersTour}
        />
        <HelpItem
          title={__( "Content-based text", "wpjoli-safi" )}
          description={__( "Create content-based text such as post title", "wpjoli-safi" )}
          onButtonClick={startDynTextTour}
        />
        <HelpItem
          title={__( "Style text proactively", "wpjoli-safi" )}
          description={__( "Properly style text, especially when using content-based text", "wpjoli-safi" )}
          onButtonClick={startStyleTextTour}
        />
        <HelpItem
          title={__( "Image as background", "wpjoli-safi" )}
          description={__( "Insert an image that will fit the canvas", "wpjoli-safi" )}
          onButtonClick={startImageTour}
        />
        <HelpItem
          title={__( "Perfect square", "wpjoli-safi" )}
          description={__( "How to create a perfectly square layer", "wpjoli-safi" )}
          onButtonClick={startSquareTour}
        />
        <HelpItem
          title={__( "Move along a fixed axis", "wpjoli-safi" )}
          description={__( "Move a layer along a fixed axis", "wpjoli-safi" )}
          onButtonClick={startMoveFixedAxisTour}
        />
        <HelpItem
          title={__( "Draw and move along the grid", "wpjoli-safi" )}
          description={__( "Use the grid to help you achieve clean designs", "wpjoli-safi" )}
          onButtonClick={startGridTour}
        />
        <HelpItem
          title={__( "Center & Resize from center", "wpjoli-safi" )}
          description={__( "Center & Resize a layer from its center", "wpjoli-safi" )}
          onButtonClick={startResizeFromCenterTour}
        />
        {}
        <div className="text-center">
          <h4>{__( "Need more help ?", "wpjoli-safi" )}</h4>
          <p><a className="safi-tb-btn" href="https://wpjoli.com/docs/smart-auto-featured-image" target="_blank">{__( "Documentation", "wpjoli-safi" )}</a></p>
        </div>
      </div>
    </div>
  );
};

export default HelpMenu;