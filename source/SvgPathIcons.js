const svgPathIcons = {

    tools: [ {
            id: 'select',
            label: 'Select (v)',
            pro: false,
            // type: null,
            iconSvgPath: 'M14.872 8.859L3.646 2.072l-.98-.592.231 1.121 2.683 13 .243 1.178.664-1.003 3.038-4.59 5.22-1.417 1.127-.306-1-.604zM4.108 3.52l9.247 5.59-4.274 1.16-.182.05-.104.156-2.479 3.746L4.108 3.52z',
        },
        {
            id: 'text',
            label: 'Text (t)',
            pro: false,
            // type: Text,
            iconSvgPath: 'M2 5h1V2h5v14H5v1h7v-1H9V2h5v3h1V1H2v4z',
        },
        {
            id: 'rect',
            label: 'Rect (r)',
            pro: false,
            // type: Rect,
            iconSvgPath: 'M16 2v14H2V2h14zm0 15h1V1H1v16h15z',
        },
        {
            id: 'circle',
            label: 'Circle (c)',
            pro: false,
            // type: Rect,
            iconSvgPath: 'm8.76,1c4.28,0,7.76,3.48,7.76,7.76s-3.48,7.76-7.76,7.76S1,13.03,1,8.76,4.48,1,8.76,1m0-1C3.92,0,0,3.92,0,8.76s3.92,8.76,8.76,8.76,8.76-3.92,8.76-8.76S13.59,0,8.76,0h0Z',
        },
        {
            id: 'image',
            label: 'Image (i)',
            pro: false,
            // type: 'Image',
            iconSvgPath: 'm11.5,9c1.38,0,2.5-1.12,2.5-2.5s-1.12-2.5-2.5-2.5-2.5,1.12-2.5,2.5,1.12,2.5,2.5,2.5Zm1.5-2.5c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5.67-1.5,1.5-1.5,1.5.67,1.5,1.5ZM16,0H0v16h16V0Zm-1,1v14h-1.29L5,6.29,1,10.29V1h14ZM1,15v-3.29l4-4,7.29,7.29H1Z',
        },
        {
            id: 'dynamicimage',
            label: 'Content-based image (d)',
            pro: true,
            // type: 'Image',
            iconSvgPath: 'm11.5,9c1.38,0,2.5-1.12,2.5-2.5s-1.12-2.5-2.5-2.5-2.5,1.12-2.5,2.5,1.12,2.5,2.5,2.5Zm1.5-2.5c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5.67-1.5,1.5-1.5,1.5.67,1.5,1.5Zm3-6.5H0v16h16V0Zm-1,1v14h-1.29L5,6.29,1,10.29V1h14ZM1,15v-3.29l4-4,7.29,7.29H1Zm.92-10.49L3.03.86h1.84l-1.1,3.08h1.47l-3.31,4.29,1.12-3.72h-1.12Z',
        },
        {
            id: 'icon',
            label: 'Font Awesome Icon (f)',
            pro: true,
            // type: 'Image',
            iconSvgPath: 'm18,.64v13.5c-2.53.92-3.29,1.29-4.78,1.29-2.53,0-3.5-1.29-6.03-1.29-.8,0-1.45.16-2.05.32v-2.57c.6-.16,1.25-.32,2.05-.32,2.53,0,3.5,1.29,6.03,1.29.8,0,1.41-.12,2.21-.36V4.14c-.8.24-1.41.36-2.21.36-2.53,0-3.5-1.29-6.03-1.29-2.05,0-3.01.84-4.62,1.17v12.33c0,.72-.56,1.29-1.29,1.29s-1.29-.56-1.29-1.29V1.29C0,.56.56,0,1.29,0s1.29.56,1.29,1.29v.52c1.61-.32,2.57-1.17,4.62-1.17,2.53,0,3.5,1.29,6.03,1.29,1.49,0,2.25-.36,4.78-1.29Z',
        },
        {
            id: 'svg',
            label: 'SVG (s)',
            pro: true,
            // type: 'Image',
            iconSvgPath: 'm1.1.99h9.02l4.02,4.21v5.2h1.05v-5.67L10.45,0H.06v10.4h1.04m-1.1,6.91l.18-1.09c.65.27,1.2.41,1.65.41.29,0,.51-.07.65-.22.12-.13.18-.28.18-.46,0-.16-.06-.29-.18-.38s-.41-.23-.87-.42c-.34-.14-.58-.25-.72-.32s-.27-.15-.39-.24c-.33-.25-.5-.61-.5-1.08,0-.4.11-.76.33-1.06.34-.47.89-.71,1.66-.71.56,0,1.16.1,1.81.31l-.26,1.04c-.39-.14-.68-.24-.87-.28-.19-.05-.4-.07-.61-.07-.24,0-.42.05-.55.16-.13.12-.2.26-.2.44,0,.15.06.27.17.36.11.09.38.22.8.39.42.17.7.3.84.36.14.07.26.15.39.24.33.25.49.64.49,1.15,0,.61-.21,1.07-.62,1.39-.35.26-.85.4-1.49.4s-1.3-.11-1.91-.32Zm6.5.22l-2.16-5.69h1.33l.95,2.55c.24.65.42,1.19.54,1.61.18-.59.36-1.11.53-1.55l.98-2.61h1.27l-2.16,5.69h-1.28Zm8.76-3.18v2.9c-.33.11-.56.18-.69.22-.41.11-.86.16-1.34.16-.94,0-1.65-.24-2.14-.71-.54-.52-.81-1.24-.81-2.17,0-1.07.34-1.87,1.01-2.42.49-.4,1.15-.59,1.98-.59.71,0,1.37.13,1.99.39l-.44,1c-.29-.14-.54-.25-.76-.3-.22-.06-.46-.09-.71-.09-.62,0-1.08.2-1.37.61-.25.34-.37.79-.37,1.35,0,.67.19,1.18.56,1.52.3.27.67.41,1.12.41.26,0,.51-.04.74-.13v-1.14h-.98v-1h2.22Z',
            // iconSvgPath: 'm10.48,0H.08v10.4h1.89V1.89h7.72l3.62,3.62v4.89h1.89v-5.67L10.48,0h0ZM0,17.68l.18-1.09c.65.27,1.2.41,1.65.41.29,0,.51-.07.65-.22.12-.13.18-.28.18-.46,0-.16-.06-.29-.18-.38s-.41-.23-.87-.42c-.34-.14-.58-.25-.72-.32s-.27-.15-.39-.24c-.33-.25-.5-.61-.5-1.08,0-.4.11-.76.33-1.06.34-.47.89-.71,1.66-.71.56,0,1.16.1,1.81.31l-.26,1.04c-.39-.14-.68-.24-.87-.28-.19-.05-.4-.07-.61-.07-.24,0-.42.05-.55.16-.13.12-.2.26-.2.44,0,.15.06.27.17.36.11.09.38.22.8.39.42.17.7.3.84.36.14.07.26.15.39.24.33.25.49.64.49,1.15,0,.61-.21,1.07-.62,1.39-.35.26-.85.4-1.49.4s-1.3-.11-1.91-.32Zm6.5.22l-2.16-5.69h1.33l.95,2.55c.24.65.42,1.19.54,1.61.18-.59.36-1.11.53-1.55l.98-2.61h1.27l-2.16,5.69h-1.28Zm8.76-3.18v2.9c-.33.11-.56.18-.69.22-.41.11-.86.16-1.34.16-.94,0-1.65-.24-2.14-.71-.54-.52-.81-1.24-.81-2.17,0-1.07.34-1.87,1.01-2.42.49-.4,1.15-.59,1.98-.59.71,0,1.37.13,1.99.39l-.44,1c-.29-.14-.54-.25-.76-.3-.22-.06-.46-.09-.71-.09-.62,0-1.08.2-1.37.61-.25.34-.37.79-.37,1.35,0,.67.19,1.18.56,1.52.3.27.67.41,1.12.41.26,0,.51-.04.74-.13v-1.14h-.98v-1h2.22Z',
        },
        // {
        //     id: 'columns',
        //     label: 'Columns (c)',
        //     pro: true,
        //     // type: 'Image',
        //     iconSvgPath: 'M 18 1 H 0 V 17 H 18 Z M 4 16 H 1 V 2 H 4 Z M 13 16 H 5 V 2 H 13 Z M 14 2 H 17 V 16 H 14 V 2 Z',
        //     // iconSvgPath: 'M 17 1 H 0 V 17 H 17 Z M 8 16 H 1 V 2 h 7 Z m 8 0 H 9 V 2 h 7 Z',
        // },
        {
            id: 'conditional',
            label: 'Conditional layers (x)',
            pro: true,
            // type: 'Image',
            iconSvgPath: 'M 4 1.5 C 4 0.6716 4.6715 0 5.5 0 H 11.5 C 12.3284 0 13 0.6716 13 1.5 V 2.5 C 13 3.3284 12.3284 4 11.5 4 H 9 V 6.2928 L 12.7071 10 H 16.5 C 16.7761 10 17 10.2239 17 10.5 V 13.5 C 17 13.7761 16.7761 14 16.5 14 C 16.2239 14 16 13.7761 16 13.5 V 11 H 13.1714 C 13.1508 11.0343 13.1257 11.0666 13.0962 11.0961 L 8.8535 15.3388 C 8.6583 15.534 8.3417 15.534 8.1464 15.3388 L 3.9038 11.0961 C 3.8742 11.0666 3.8491 11.0343 3.8285 11 H 1 C 0.7239 11 0.5 10.7761 0.5 10.5 C 0.5 10.2239 0.7239 10 1 10 H 4.2928 L 8 6.2928 V 4 H 5.5 C 4.6715 4 4 3.3284 4 2.5 V 1.5 Z M 5.5 1 C 5.2238 1 5 1.2239 5 1.5 V 2.5 C 5 2.7761 5.2238 3 5.5 3 H 11.5 C 11.7761 3 12 2.7761 12 2.5 V 1.5 C 12 1.2239 11.7761 1 11.5 1 H 5.5 Z M 8.5 7.2071 L 4.9644 10.7426 L 8.5 14.2781 L 12.0355 10.7426 L 8.5 7.2071 Z',
            // iconSvgPath: 'M 17 1 H 0 V 17 H 17 Z M 8 16 H 1 V 2 h 7 Z m 8 0 H 9 V 2 h 7 Z',
        },
        // {
        //     id: 'container',
        //     label: 'Container',
        //     pro: true,
        //     // type: 'Image',
        //     iconSvgPath: 'M0 0 0 2 1 2 1 1 2 1 2 0 0 0M4 0 4 1 6 1 6 0 4 0M8 0 8 1 10 1M10 1 10 0 8 0M12 0 12 1 14 1 14 0 12 0M16 1 16 0M16 0 18 0 18 2 17 2 17 2 17 1 16 1M17 4 18 4 18 6 17 6M17 8 18 8 18 10 17 10M17 12 18 12 18 14 17 14M17 16 18 16 18 18 16 18 16 17 17 17M14 17 14 18 12 18 12 17M10 17 10 18 8 18 8 17M6 17 6 18 4 18 4 17M2 17 2 18 0 18 0 16 1 16 1 17M0 14 0 12 1 12 1 14M1 10 0 10 0 8 1 8M1 6 0 6 0 4 1 4',
        // },
    ],

    gridIcon: [ {
        id: 'grid',
        label: 'Show/hide grid (#)',
        // type: 'Image',
        iconSvgPath: 'm16.88,9.38c.35,0,.63-.28.63-.63s-.28-.63-.63-.63h-1.47V3.63h1.47c.35,0,.63-.28.63-.63s-.28-.63-.63-.63h-1.47V.63c0-.35-.28-.63-.63-.63s-.63.28-.63.63v1.75h-4.5V.63c0-.35-.28-.63-.63-.63s-.63.28-.63.63v1.75H3.91V.63c0-.35-.28-.63-.63-.63s-.63.28-.63.63v1.75H.63c-.35,0-.63.28-.63.63s.28.63.63.63h2.02v4.5H.63c-.35,0-.63.28-.63.63s.28.63.63.63h2.02v4.5H.63c-.35,0-.63.28-.63.63s.28.63.63.63h2.02v1.75c0,.35.28.63.63.63s.63-.28.63-.63v-1.75h4.5v1.75c0,.35.28.63.63.63s.63-.28.63-.63v-1.75h4.5v1.75c0,.35.28.63.63.63s.63-.28.63-.63v-1.75h1.47c.35,0,.63-.28.63-.63s-.28-.63-.63-.63h-1.47v-4.5h1.47Zm-2.72-5.75v4.5h-4.5V3.63h4.5Zm-10.25,0h4.5v4.5H3.91V3.63Zm0,10.25v-4.5h4.5v4.5H3.91Zm10.25,0h-4.5v-4.5h4.5v4.5Z',
    }, ]
};

export default svgPathIcons;