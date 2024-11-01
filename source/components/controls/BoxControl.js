const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;

const BoxControl = ( { id, label, value, property, unit, units, noNegatives, dimensions, onChange, onMouseEnter, onMouseLeave } ) => {

    //Get all numeric values regardless of dimension to test and a pply a lockj
    const numValues = value ? dimensions.map( dim => value[dim.value] ) : null;
    let numValCount = 1;
    if ( numValues !== null ) {
        //If numValCount == 1 then values are combined, otherwise they're independant
        numValCount = [...new Set( numValues )].length;
    }
    // const unitsList = [
    //     { label: 'px', value: 'px' },
    //     { label: 'em', value: 'em' },
    //     { label: '%', value: 'percent' },
    // ];
    // const [combinedValue, setCombinedValue] = useState( value );

    const valueObject = value || {};
    // const valueUnit = value && value !== -1 ? value.unit : 'px';
    const valueUnit = 'px';
    // console.log( valueObject );

    // const [numVal, setNumVal] = useState( valueObject );
    const [dimVal, setDimVal] = useState( valueObject );
    const [unitVal, setUnitVal] = useState( valueUnit );
    const [isLocked, setIslocked] = useState( numValCount > 1 ? false : true );

    useEffect( () => {

        // const finalValue = {
        //     dim: dimVal,
        //     unit: unitVal,
        // };
        // console.log( finalValue );

        // if ( typeof value !== 'undefined' && value !== null && value.indexOf( '|' ) !== -1 && value.indexOf( 'undefined' ) === -1 ) {
        //     const valuePair = value.split( '|' );

        //     if ( valuePair.length === 2 ) {
        //         const numericValue = ( valuePair[0] );
        //         const unitValue = valuePair[1];

        //         if ( !isNaN( numericValue ) ) {
        //             setNumVal( numericValue );
        //         }

        //         if ( unitsList.findIndex( element => element.value === unitValue ) !== -1 ) {
        //             setUnitVal( unitValue );
        //         }
        //     }
        // } else {
        //     setNumVal( [] );
        //     setUnitVal( 'px' );
        // }
    }, [dimVal, unitVal] );

    // setCombinedValue();

    // useEffect(() => {

    //     const finalValue = numVal + '|' + unitVal;
    //     console.log('final', finalValue);
    //     onChange(finalValue);


    // }, [numVal, unitVal]);

    const onChangeNumericValue = ( e, dimension ) => {
        // console.log( e, dimension );
        let currentVal = { ...dimVal };
        let val = e.target.value;

        if ( noNegatives === true && val < 0 ) {
            val = 0;
        }

        if ( val !== '' ) {
            if ( isLocked === true ) {
                currentVal = {};

                dimensions.map( dim => currentVal[dim.value] = parseFloat( val ) );
                // console.log( currentVal );
            } else {
                currentVal[dimension] = parseFloat( val );
            }
        }
        setDimVal( currentVal );
        // setCombinedValue(finalValue);
        onChange( currentVal );

        // const finalValue = currentVal + '|' + unitVal;
        // onChange( finalValue );
    };

    // const onChangeUnitValue = ( val ) => {
    //     setUnitVal( val );
    //     // setCombinedValue(finalValue);
    //     // onChange(finalValue);

    //     // const finalValue = {
    //     //     dim: dimVal,
    //     //     unit: val,
    //     // };

    //     // onChange( finalValue );
    // };

    // const onKeyPress = ( e ) => {
    //     const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Enter'];
    //     if ( allowedKeys.findIndex( element => element === e.key ) === -1 ) {
    //         e.preventDefault();
    //         return false;
    //     }
    // };

    const reset = () => {
        setDimVal( null );
        onChange( null );
    };
    const handleLockSwitch = ( e ) => {
        e.stopPropagation();
        setIslocked( !isLocked );
        // onChange( null );
    };

    const dimensionList = ( () => {
        return (
            <ul
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {
                    dimensions.map( dimension => {
                        // const isChecked = activeOptions.some( active => active == element.value );

                        const value = valueObject.hasOwnProperty( dimension.value ) ? valueObject[dimension.value] : 0;
                        // console.log( value );
                        const currentId = "safi-box-control_" + label + "_" + dimension.label;
                        return (
                            <li>
                                <input
                                    className="safi-box-control-input"
                                    id={currentId}
                                    type="number"
                                    value={value}
                                    data-dimension={dimension.label}
                                    onChange={( e ) => onChangeNumericValue( e, dimension.value )}

                                />
                                <label className="safi-box-control-label" for={currentId}>{dimension.label}</label>
                            </li>
                        );
                    } )
                }
            </ul>
        )


    } )();

    return (
        <div id={id}>
            <div className="safi-label-container">
                <label>{label}</label>
            </div>

            <div className="safi-box-control-container">
                {dimensionList}
                <span
                    title="Lock"
                    className={"safi-box-control-icon icon-lock dashicons" + ( isLocked ? " --is-locked" : "" )}
                    onMouseDown={handleLockSwitch}
                ></span>
                <span
                    title="Clear"
                    className={"safi-box-control-icon icon-clear dashicons"}
                    onMouseDown={reset}
                ></span>
            </div>
            {/* {
                dimVal !== [] &&
            } */}
        </div >
    );
}

export default BoxControl;