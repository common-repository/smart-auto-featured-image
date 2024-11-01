const { Component } = wp.element;

const icons = [
    {
        id: 'select',
        label: 'Select',
        // type: null,
        iconSvgPath: 'M14.872 8.859L3.646 2.072l-.98-.592.231 1.121 2.683 13 .243 1.178.664-1.003 3.038-4.59 5.22-1.417 1.127-.306-1-.604zM4.108 3.52l9.247 5.59-4.274 1.16-.182.05-.104.156-2.479 3.746L4.108 3.52z',
    },
    {
        id: 'conditional',
        label: 'Conditional layers (x)',
        // type: 'Image',
        iconSvgPath: 'M 4 1.5 C 4 0.6716 4.6715 0 5.5 0 H 11.5 C 12.3284 0 13 0.6716 13 1.5 V 2.5 C 13 3.3284 12.3284 4 11.5 4 H 9 V 6.2928 L 12.7071 10 H 16.5 C 16.7761 10 17 10.2239 17 10.5 V 13.5 C 17 13.7761 16.7761 14 16.5 14 C 16.2239 14 16 13.7761 16 13.5 V 11 H 13.1714 C 13.1508 11.0343 13.1257 11.0666 13.0962 11.0961 L 8.8535 15.3388 C 8.6583 15.534 8.3417 15.534 8.1464 15.3388 L 3.9038 11.0961 C 3.8742 11.0666 3.8491 11.0343 3.8285 11 H 1 C 0.7239 11 0.5 10.7761 0.5 10.5 C 0.5 10.2239 0.7239 10 1 10 H 4.2928 L 8 6.2928 V 4 H 5.5 C 4.6715 4 4 3.3284 4 2.5 V 1.5 Z M 5.5 1 C 5.2238 1 5 1.2239 5 1.5 V 2.5 C 5 2.7761 5.2238 3 5.5 3 H 11.5 C 11.7761 3 12 2.7761 12 2.5 V 1.5 C 12 1.2239 11.7761 1 11.5 1 H 5.5 Z M 8.5 7.2071 L 4.9644 10.7426 L 8.5 14.2781 L 12.0355 10.7426 L 8.5 7.2071 Z',
        // iconSvgPath: 'M 17 1 H 0 V 17 H 17 Z M 8 16 H 1 V 2 h 7 Z m 8 0 H 9 V 2 h 7 Z',
    },
    {
        id: 'rect',
        label: 'Rect',
        // type: Rect,
        iconSvgPath: 'M16 2v14H2V2h14zm0 15h1V1H1v16h15z',
    },
    {
        id: 'circle',
        label: 'Circle (d)',
        // type: Rect,
        iconSvgPath: 'm8.76,1c4.28,0,7.76,3.48,7.76,7.76s-3.48,7.76-7.76,7.76S1,13.03,1,8.76,4.48,1,8.76,1m0-1C3.92,0,0,3.92,0,8.76s3.92,8.76,8.76,8.76,8.76-3.92,8.76-8.76S13.59,0,8.76,0h0Z',
    },
    {
        id: 'text',
        label: 'Text',
        // type: Text,
        iconSvgPath: 'M2 5h1V2h5v14H5v1h7v-1H9V2h5v3h1V1H2v4z',
    },
    // {
    //     id: 'image',
    //     label: 'Image',
    //     // type: 'Image',
    //     iconSvgPath: 'M12.5 10c1.38 0 2.5-1.12 2.5-2.5C15 6.12 13.88 5 12.5 5 11.12 5 10 6.12 10 7.5c0 1.38 1.12 2.5 2.5 2.5zM14 7.5c0 .828-.672 1.5-1.5 1.5-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5zM17 1H1v16h16V1zm-1 1v14h-1.293L6 7.293l-4 4V2h14zM2 16v-3.293l4-4L13.293 16H2z',
    // },
    {
        id: 'image',
        label: 'Image (i)',
        // type: 'Image',
        iconSvgPath: 'm11.5,9c1.38,0,2.5-1.12,2.5-2.5s-1.12-2.5-2.5-2.5-2.5,1.12-2.5,2.5,1.12,2.5,2.5,2.5Zm1.5-2.5c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5.67-1.5,1.5-1.5,1.5.67,1.5,1.5ZM16,0H0v16h16V0Zm-1,1v14h-1.29L5,6.29,1,10.29V1h14ZM1,15v-3.29l4-4,7.29,7.29H1Z',
    },
    {
        id: 'dynamicimage',
        label: 'Content-based image (i)',
        // type: 'Image',
        iconSvgPath: 'm11.5,9c1.38,0,2.5-1.12,2.5-2.5s-1.12-2.5-2.5-2.5-2.5,1.12-2.5,2.5,1.12,2.5,2.5,2.5Zm1.5-2.5c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5.67-1.5,1.5-1.5,1.5.67,1.5,1.5Zm3-6.5H0v16h16V0Zm-1,1v14h-1.29L5,6.29,1,10.29V1h14ZM1,15v-3.29l4-4,7.29,7.29H1Zm.92-10.49L3.03.86h1.84l-1.1,3.08h1.47l-3.31,4.29,1.12-3.72h-1.12Z',
    },
    {
        id: 'icon',
        label: 'Font Awesome Icon (j)',
        // type: 'Image',
        iconSvgPath: 'm18,.64v13.5c-2.53.92-3.29,1.29-4.78,1.29-2.53,0-3.5-1.29-6.03-1.29-.8,0-1.45.16-2.05.32v-2.57c.6-.16,1.25-.32,2.05-.32,2.53,0,3.5,1.29,6.03,1.29.8,0,1.41-.12,2.21-.36V4.14c-.8.24-1.41.36-2.21.36-2.53,0-3.5-1.29-6.03-1.29-2.05,0-3.01.84-4.62,1.17v12.33c0,.72-.56,1.29-1.29,1.29s-1.29-.56-1.29-1.29V1.29C0,.56.56,0,1.29,0s1.29.56,1.29,1.29v.52c1.61-.32,2.57-1.17,4.62-1.17,2.53,0,3.5,1.29,6.03,1.29,1.49,0,2.25-.36,4.78-1.29Z',
    },
    {
        id: 'svg',
        label: 'SVG (s)',
        // type: 'Image',
        iconSvgPath: 'm1.1.99h9.02l4.02,4.21v5.2h1.05v-5.67L10.45,0H.06v10.4h1.04m-1.1,6.91l.18-1.09c.65.27,1.2.41,1.65.41.29,0,.51-.07.65-.22.12-.13.18-.28.18-.46,0-.16-.06-.29-.18-.38s-.41-.23-.87-.42c-.34-.14-.58-.25-.72-.32s-.27-.15-.39-.24c-.33-.25-.5-.61-.5-1.08,0-.4.11-.76.33-1.06.34-.47.89-.71,1.66-.71.56,0,1.16.1,1.81.31l-.26,1.04c-.39-.14-.68-.24-.87-.28-.19-.05-.4-.07-.61-.07-.24,0-.42.05-.55.16-.13.12-.2.26-.2.44,0,.15.06.27.17.36.11.09.38.22.8.39.42.17.7.3.84.36.14.07.26.15.39.24.33.25.49.64.49,1.15,0,.61-.21,1.07-.62,1.39-.35.26-.85.4-1.49.4s-1.3-.11-1.91-.32Zm6.5.22l-2.16-5.69h1.33l.95,2.55c.24.65.42,1.19.54,1.61.18-.59.36-1.11.53-1.55l.98-2.61h1.27l-2.16,5.69h-1.28Zm8.76-3.18v2.9c-.33.11-.56.18-.69.22-.41.11-.86.16-1.34.16-.94,0-1.65-.24-2.14-.71-.54-.52-.81-1.24-.81-2.17,0-1.07.34-1.87,1.01-2.42.49-.4,1.15-.59,1.98-.59.71,0,1.37.13,1.99.39l-.44,1c-.29-.14-.54-.25-.76-.3-.22-.06-.46-.09-.71-.09-.62,0-1.08.2-1.37.61-.25.34-.37.79-.37,1.35,0,.67.19,1.18.56,1.52.3.27.67.41,1.12.41.26,0,.51-.04.74-.13v-1.14h-.98v-1h2.22Z',
        // iconSvgPath: 'm10.48,0H.08v10.4h1.89V1.89h7.72l3.62,3.62v4.89h1.89v-5.67L10.48,0h0ZM0,17.68l.18-1.09c.65.27,1.2.41,1.65.41.29,0,.51-.07.65-.22.12-.13.18-.28.18-.46,0-.16-.06-.29-.18-.38s-.41-.23-.87-.42c-.34-.14-.58-.25-.72-.32s-.27-.15-.39-.24c-.33-.25-.5-.61-.5-1.08,0-.4.11-.76.33-1.06.34-.47.89-.71,1.66-.71.56,0,1.16.1,1.81.31l-.26,1.04c-.39-.14-.68-.24-.87-.28-.19-.05-.4-.07-.61-.07-.24,0-.42.05-.55.16-.13.12-.2.26-.2.44,0,.15.06.27.17.36.11.09.38.22.8.39.42.17.7.3.84.36.14.07.26.15.39.24.33.25.49.64.49,1.15,0,.61-.21,1.07-.62,1.39-.35.26-.85.4-1.49.4s-1.3-.11-1.91-.32Zm6.5.22l-2.16-5.69h1.33l.95,2.55c.24.65.42,1.19.54,1.61.18-.59.36-1.11.53-1.55l.98-2.61h1.27l-2.16,5.69h-1.28Zm8.76-3.18v2.9c-.33.11-.56.18-.69.22-.41.11-.86.16-1.34.16-.94,0-1.65-.24-2.14-.71-.54-.52-.81-1.24-.81-2.17,0-1.07.34-1.87,1.01-2.42.49-.4,1.15-.59,1.98-.59.71,0,1.37.13,1.99.39l-.44,1c-.29-.14-.54-.25-.76-.3-.22-.06-.46-.09-.71-.09-.62,0-1.08.2-1.37.61-.25.34-.37.79-.37,1.35,0,.67.19,1.18.56,1.52.3.27.67.41,1.12.41.26,0,.51-.04.74-.13v-1.14h-.98v-1h2.22Z',
    },
    {
        id: 'columns',
        label: 'Columns',
        // type: 'Image',
        // iconSvgPath: 'M 17 1 H 0 V 17 H 17 Z M 8 16 H 1 V 2 h 7 Z m 8 0 H 9 V 2 h 7 Z', // 2 cols
        iconSvgPath: 'M 18 1 H 0 V 17 H 18 Z M 4 16 H 1 V 2 H 4 Z M 13 16 H 5 V 2 H 13 Z M 14 2 H 17 V 16 H 14 V 2 Z',
    },
    {
        id: 'container',
        label: 'Container',
        // type: 'Image',
        iconSvgPath: 'M0 0 0 2 1 2 1 1 2 1 2 0 0 0M4 0 4 1 6 1 6 0 4 0M8 0 8 1 10 1M10 1 10 0 8 0M12 0 12 1 14 1 14 0 12 0M16 1 16 0M16 0 18 0 18 2 17 2 17 2 17 1 16 1M17 4 18 4 18 6 17 6M17 8 18 8 18 10 17 10M17 12 18 12 18 14 17 14M17 16 18 16 18 18 16 18 16 17 17 17M14 17 14 18 12 18 12 17M10 17 10 18 8 18 8 17M6 17 6 18 4 18 4 17M2 17 2 18 0 18 0 16 1 16 1 17M0 14 0 12 1 12 1 14M1 10 0 10 0 8 1 8M1 6 0 6 0 4 1 4',
    },
    {
        id: 'undo',
        label: 'Undo',
        iconSvgPath: 'M 3 9 C 7 5 13 5 17 9 L 16 10 C 12 6 8 6 4 10 H 3 V 9 M 2 6 H 3 V 10 H 7 V 11 H 2 V 6',
    },
    {
        id: 'redo',
        label: 'Redo',
        iconSvgPath: 'M 2 9 C 6 5 12 5 16 9 L 16 10 L 15 10 C 11 6 7 6 3 10 V 10 L 2 9 M 13 10 H 16 V 6 H 17 V 11 H 12 V 10',
    },
    {
        id: 'lock',
        label: 'Lock',
        iconSvgPath: 'M5 2.5V4H2V2.5C2 1.672 2.672 1 3.5 1 4.328 1 5 1.672 5 2.5zM1 4V2.5C1 1.12 2.12 0 3.5 0 4.88 0 6 1.12 6 2.5V4h.5c.276 0 .5.224.5.5v5c0 .276-.224.5-.5.5h-6c-.276 0-.5-.224-.5-.5v-5c0-.276.224-.5.5-.5H1z',
        fillRule: 'evenodd',
        width: 8,
        height: 10,
    },
    {
        id: 'lock_open',
        label: 'Lock open',
        iconSvgPath: 'M10 6v1h.5c.276 0 .5.224.5.5v5c0 .276-.224.5-.5.5h-6c-.276 0-.5-.224-.5-.5v-5c0-.276.224-.5.5-.5H9V4.5C9 3.12 10.12 2 11.5 2 12.88 2 14 3.12 14 4.5V6h-1V4.5c0-.828-.672-1.5-1.5-1.5-.828 0-1.5.672-1.5 1.5V6z',
        fillRule: 'evenodd',
        width: 16,
        height: 16,
    },
    {
        id: 'bolt',
        label: 'Bolt',
        iconSvgPath: 'M106.739 41.135L47.711 119.699L61.321 64.439L29.656 64.973L42.59 0L80.997 0L65.58 41.17z',
        fillRule: 'evenodd',
        vBoxWidth: 120,
        vBoxHeight: 120,
        width: 16,
        height: 16,
    },
    {
        id: 'align_left',
        label: 'Align left',
        iconSvgPath: 'M1 13H0V0h1v13zm12-8H3V3h10v2zM3 10h6V8H3v2z',
        fillRule: 'evenodd',
        width: 14,
        height: 14,
    },
    {
        id: 'align_center',
        label: 'Align center',
        iconSvgPath: 'M6 0H5v3H0v2h5v3H2v2h3v3h1v-3h3V8H6V5h5V3H6V0z',
        fillRule: 'evenodd',
        width: 12,
        height: 14,
    },
    {
        id: 'align_right',
        label: 'Align right',
        iconSvgPath: 'M13 13h1V0h-1v13zM1 5h10V3H1v2zm10 5H5V8h6v2z',
        fillRule: 'evenodd',
        width: 14,
        height: 14,
    },
    {
        id: 'align_top',
        label: 'Align top',
        iconSvgPath: 'M5 13V3H3v10h2zm8-12V0H0v1h13zm-3 2v6H8V3h2z',
        fillRule: 'evenodd',
        width: 14,
        height: 14,
    },
    {
        id: 'align_middle',
        label: 'Align middle',
        iconSvgPath: 'M3 5V0h2v5h3V2h2v3h3v1h-3v3H8V6H5v5H3V6H0V5h3z',
        fillRule: 'evenodd',
        width: 14,
        height: 12,
    },
    {
        id: 'align_bottom',
        label: 'Align bottom',
        iconSvgPath: 'M5 0v10H3V0h2zm8 12v1H0v-1h13zm-3-2V4H8v6h2z',
        fillRule: 'evenodd',
        width: 14,
        height: 13,
    },
    {
        id: 'expand',
        label: 'Expand',
        iconSvgPath: 'M 0 0 L 0 4 L 1 4 L 1 1 L 4 1 L 4 0 L 0 0 M 7 0 L 7 1 L 10 1 L 10 0 L 7 0 M 13 0 L 13 1 L 16 1 L 16 0 L 13 0 M 19 1 L 22 1 L 22 4 L 23 4 L 23 0 L 19 0 L 19 1',
        // fillRule: 'evenodd',
        // width: 14,
        // height: 13,
    },
    {
        id: 'plus',
        label: 'Plus',
        iconSvgPath: 'M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 11 L 7 11 L 7 13 L 11 13 L 11 17 L 13 17 L 13 13 L 17 13 L 17 11 L 13 11 L 13 7 L 11 7 z',
        vBoxWidth: 24,
        vBoxHeight: 24,
    },
    {
        id: 'eye',
        label: 'Eye',
        iconSvgPath: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
        vBoxWidth: 24,
        vBoxHeight: 24,
        width: 12,
        height: 12,
    },
    {
        id: 'eye_off',
        label: 'Eye off',
        iconSvgPath: 'M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z',
        vBoxWidth: 24,
        vBoxHeight: 24,
        width: 12,
        height: 12,
    },
    {
        id: 'duplicate',
        label: 'Duplicate',
        iconSvgPath: 'M112 80h288V56a24 24 0 0 0-24-24H66a34 34 0 0 0-34 34v310a24 24 0 0 0 24 24h24V112a32 32 0 0 1 32-32Z M456 112H136a24 24 0 0 0-24 24v320a24 24 0 0 0 24 24h320a24 24 0 0 0 24-24V136a24 24 0 0 0-24-24Zm-64 200h-80v80h-32v-80h-80v-32h80v-80h32v80h80Z',
        vBoxWidth: 512,
        vBoxHeight: 512,
        width: 16,
        height: 16,
    },
    {
        id: 'trash',
        label: 'Trash',
        iconSvgPath: 'M296 64h-80a7.91 7.91 0 0 0-8 8v24h96V72a7.91 7.91 0 0 0-8-8Z M292 64h-72a4 4 0 0 0-4 4v28h80V68a4 4 0 0 0-4-4Z M447.55 96H336V48a16 16 0 0 0-16-16H192a16 16 0 0 0-16 16v48H64.45L64 136h33l20.09 314A32 32 0 0 0 149 480h214a32 32 0 0 0 31.93-29.95L415 136h33ZM176 416l-9-256h33l9 256Zm96 0h-32V160h32Zm24-320h-80V68a4 4 0 0 1 4-4h72a4 4 0 0 1 4 4Zm40 320h-33l9-256h33Z',
        vBoxWidth: 512,
        vBoxHeight: 512,
        width: 16,
        height: 16,
    },
];



class SvgIcon extends Component {

    getIconFromId = (id) => {
        return icons.find(obj => obj.id === id);
    }
    
    render() {
        // console.log(this.props);
        const {icon, className, svgPath} = this.props;

        const iconObj = icon ? this.getIconFromId(icon) : null;
        const path = iconObj ? iconObj.iconSvgPath : svgPath;

        const width = iconObj && iconObj.width ? iconObj.width : '18';
        const height = iconObj && iconObj.height ? iconObj.height : '18';

        const vBoxWidth = iconObj && iconObj.vBoxWidth ? iconObj.vBoxWidth : null;
        const vBoxHeight = iconObj && iconObj.vBoxWidth ? iconObj.vBoxWidth : null;

        return (
            <div className={'safi-icon-container ' + className + (this.props.disabled ? " --disabled" : "") } onClick={this.props.onClick} title={this.props.title} disabled={this.props.disabled}>
                <svg className="svg" 
                width={width} 
                height={height} 
                viewBox={`0 0 ${vBoxWidth || width} ${vBoxHeight ||height}`}
                xmlns="http://www.w3.org/2000/svg">
                    <path
                        d={path}
                        fillRule={iconObj ? iconObj.fillRule : 'nonzero'}
                        fillOpacity="1"
                        fill="#000"
                        stroke="none" />
                </svg>
            </div>
        );
    }
};

export default SvgIcon;