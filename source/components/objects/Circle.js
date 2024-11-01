import BaseObject from "./BaseObject";

const Circle = ( { ...props } ) => {

    return (
        <BaseObject
            {...props}
            tag="div"
            styles={props.styles}
        >   
        </BaseObject>
    );
};

export default Circle;