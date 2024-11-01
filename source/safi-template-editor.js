const { render } = wp.element;
import AppMain from './AppMain';
import { AppContext } from './AppContext';

const app = document.getElementById( 'safiapp' );

if ( app !== null ) {
    render(

        <AppContext.Provider value={window.SAFI.options.can}>
            <AppMain options={window.SAFI.options} />
        </AppContext.Provider>,
        
        document.getElementById( 'safiapp' )
    );
}