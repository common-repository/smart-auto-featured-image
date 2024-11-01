import BaseObject from "./BaseObject";

const Rect = ( { ...props } ) => {

    return (
        <BaseObject
            {...props}
            tag="div"
            styles={props.styles}
        >
        </BaseObject>
    );
};

export default Rect;