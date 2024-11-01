// const { Component, render, useState, useEffect } = wp.element;
import BaseObject from "./BaseObject";


const DrawingObject = ( props ) => {
    // const [selectedTool, setSelectedTool] = useState( activeTool || 'select' );

    const borderStyle = props.isHidden === true ? "none" : "1px dashed";

    return (
        <BaseObject
            tag="div"
            styles={{
                zIndex: 999999999,
                backgroundColor: "#0000000a",
                border: borderStyle,
                boxSizing: "border-box"
            }}
            // onPaste={e => console.log(e)}
            {...props}
        >
            {props.children}
        </BaseObject>
    );
};

export default DrawingObject;