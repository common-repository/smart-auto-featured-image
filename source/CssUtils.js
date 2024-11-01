const { applyFilters } = wp.hooks;

export function cssToJS( css ) {
    try {
        const code = applyFilters( "safi-parse-css", css );
        return code;
    } catch ( err ) {
        console.error( 'Couldn\'t convert CSS to JS.', err );
    }
}