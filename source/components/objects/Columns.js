const {  useState, useEffect } = wp.element;
// import PropTypes from 'prop-types';
import Container from './Container';
import BaseObject from "./BaseObject";


const Columns = ( { width, height, layout, top, ...props } ) => {

    const hasChildren = ( typeof props.children ) !== "undefined";
    const [elements, setElements] = useState( hasChildren ? props.children : [] );

    useEffect( () => {
        //creates container if non existant
        if ( !elements.length ) {

            const baseElements = layout.map( value => {
                return <Container />
            } );

            setElements( baseElements );
        }
    }, [elements] );
    /**
     * 
     * @param {*} index column index
     */
    const calcColumnPosition = ( index ) => {
        //index = 0
        //width = 6
        const segmentSize = layout[index];
        const reducer = ( accumulator, currentValue ) => accumulator + currentValue;
        const prevSlice = layout.slice( 0, index );
        const segmentCountBefore = prevSlice.length > 0 ? layout.slice( 0, index ).reduce( reducer ) : 0;
        const singleSegmentWidth = ( width / 12 );

        const coords = {
            top: top,
            left: segmentCountBefore * singleSegmentWidth, //addition values up until index (exluded)
            width: segmentSize * singleSegmentWidth,
            height: height,
        }

        return coords;
    };

    // console.log(this.props.canvas);
    return (
        <BaseObject
            {...props}
            tag="div"
            styles={props.styles}
        >
            {props.children}
        </BaseObject>
    );

}

export default Columns;