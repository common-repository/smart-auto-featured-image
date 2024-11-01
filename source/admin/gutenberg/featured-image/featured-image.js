// const { registerPlugin } = wp.plugins;

import SAFI_FI_Settings_Panel from './safi-featured-image-settings-panel';

const userTemplates = window.SafiData?.templates || [];

// const SAFISettings = () => {
//     return (
//         <SAFI_FI_Settings_Panel templates={userTemplates} />
//     );
// }

// registerPlugin( 'safi-featured-image-settings-panel', {
//     render: SAFISettings,
//     icon: 'format-image',
// } );

var el = wp.element.createElement;

/**
 * Inserts our SAFI module above the Featured Image element in the gutenberg sidebar
 * @param {*} OriginalComponent 
 * @returns 
 */
function wrapPostFeaturedImage( OriginalComponent ) {
	return function ( props ) {
		return el(
			wp.element.Fragment,
			{},
			// 'Prepend above',
			<SAFI_FI_Settings_Panel templates={userTemplates} />,
			el( OriginalComponent, props ),
		);
	};
}

wp.hooks.addFilter(
	'editor.PostFeaturedImage',
	'smart-auto-featured-image/wrap-post-featured-image',
	wrapPostFeaturedImage
);