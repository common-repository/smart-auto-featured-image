export default class ElementDefaults {

    static base = {
        type: null,
        id: null,
        label: null,
        x: 0,
        y: 0,
        angle: 0,
        opacity: 1,
        // zIndex: 0,
        align: null,
        classes: null,
        customCss: null,

        hidden: false,
        locked: false,
        hAlign: null,
        vAlign: null,
        // children: [],
    }

    static defaults = {
        text: Object.assign( {}, ElementDefaults.base, {
            type: "text",
            text: "New text",
            fontSize: "40", //not in styles because we process the value later and add px and a lineHeight prop
            lineHeight: 1, //line height
            fontType: null, //not in styles because we process the value later and add px and a lineHeight prop
            fontFamily: "Arial",
            styles: {
                display: "flex",
                backgroundColor: "",
                color: "#000000",
                fontWeight: "400",
                textAlign: null,
                // lineHeight: "40",
            }
        } ),
        icon: Object.assign( {}, ElementDefaults.base, {
            type: "icon",
            // fontSize: "40", //not in styles because we process the value later and add px and a lineHeight prop
            iconPrefix: "fa",
            icon: "face-grin",
            styles: {
                display: "flex",
                // fontFamily: "'Font Awesome 6 Free'",
                // fontWeight: "900",
                color: "#8c53ff",
                justifyContent: "center",
                alignItems: "center",
                // lineHeight: "40",
            }
        } ),
        conditional: Object.assign( {}, ElementDefaults.base, {
            type: "conditional",
            activeChild: null, // will be used to show only a set of condition layers at a time
            collapsed: false, // callapse item in the layers panel
        } ),
        condition: Object.assign( {}, ElementDefaults.base, {
            type: "condition",
            compareWith: null,// "category, title, author, meta",
            compareOperator: "equals",
            compareValue: "",
            // conditionType: "if",
        } ),
        columns: Object.assign( {}, ElementDefaults.base, {
            type: "columns",
            styles: {
                // backgroundColor: "#ffeea0",
                // borderWidth: "1px",
                // borderStyle: "dashed",
                // borderColor: "#8787fe",
                // lineHeight: "40",
            }
        } ),
        container: Object.assign( {}, ElementDefaults.base, {
            type: "container",
            styles: {
                backgroundColor: "transparent",
                // borderWidth: "1px",
                // borderStyle: "dashed",
                // borderColor: "#80808033",
                // lineHeight: "40",
            }
        } ),
        rect: Object.assign( {}, ElementDefaults.base, {
            type: "rect",
            styles: {
                backgroundColor: "#ffeea0",
                // lineHeight: "40",
            }
        } ),
        circle: Object.assign( {}, ElementDefaults.base, {
            type: "circle",
            styles: {
                backgroundColor: "#ffeea0",
                borderRadius: "100%"
                // lineHeight: "40",
            }
        } ),
        image: Object.assign( {}, ElementDefaults.base, {
            type: "image",
            sourceType: null,
            // srcUrl: SAFI.options.pluginUrl + "assets/admin/img/image-placeholder.png",
            fit: "cover", //cover, contain...
            styles: {
                // backgroundColor: "#fdfdfd",
            },
            imageStyles: {
                width: "100%",
                height: "100%",
                borderRadius: "inherit",
                userSelect: "none",
                pointerEvents: "none",
                objectPosition: "inherit",
                // backgroundOrigin: "border-box",
            }
        } ),
        dynamicimage: Object.assign( {}, ElementDefaults.base, {
            type: "dynamicimage",
            dynImageSource: "first-image",
            sourceType: null,
            // srcUrl: SAFI.options.pluginUrl + "assets/admin/img/image-placeholder.png",
            fit: "cover", //cover, contain...
            styles: {
                // backgroundColor: "#fdfdfd",
            },
            imageStyles: {
                width: "100%",
                height: "100%",
                borderRadius: "inherit",
                userSelect: "none",
                pointerEvents: "none",
                objectPosition: "inherit",
                // backgroundOrigin: "border-box",
            }
        } ),
        svg: Object.assign( {}, ElementDefaults.base, {
            type: "svg",
            // fontSize: "40", //not in styles because we process the value later and add px and a lineHeight prop
            styles: {
                // lineHeight: "40",
            }
        } ),
    };


    // static text = Object.assign( {}, ElementDefaults.base, {
    //     type: "text",
    //     text: "New text",
    //     fontSize: "40", //not in styles because we process the value later and add px and a lineHeight prop
    //     fontType: null, //not in styles because we process the value later and add px and a lineHeight prop
    //     styles: {
    //         color: "#000000",
    //         fontFamily: "Arial",
    //         fontWeight: "400",
    //         textAlign: null,
    //         // lineHeight: "40",
    //     }
    // } );

    // static rect = Object.assign( {}, ElementDefaults.base, {
    //     type: "rect",
    //     styles: {
    //         backgroundColor: "#000000",
    //         // lineHeight: "40",
    //     }
    // } );

    // static circle = Object.assign( {}, ElementDefaults.base, {
    //     type: "circle",
    //     width: 100,
    //     height: 100,
    //     fill: "#0020fe",
    //     strokeWidth: 0,
    //     radius: 50,
    // } );

    // static image = Object.assign( {}, ElementDefaults.base, {
    //     type: "image",
    //     style: "fit", //"cover"
    // } );

    // static icon = Object.assign( {}, ElementDefaults.base, {
    //     type: "icon",
    //     width: 100,
    //     height: 100,
    //     fill: "#000000",
    //     fontFamily: "Font Awesome 6 Free",
    //     fontWeight: "900",
    //     text: "\uf258",
    // } );

}