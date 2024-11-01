import isSvg from 'is-svg';

export default class Utils {

    static counter = {};

    static generateIDLabel = ( type, elements, delta = 0, suffix = "" ) => {
        //1. Count the number of element of the same type
        const typeElements = elements.filter( item => {
            return item.type === type;
        } );

        let typeCount;

        if ( typeElements.length === 0 ) {
            typeCount = 0;
        } else {

            // const typeCount = typeElements[typeElements.length - 1]
            const lastElement = typeElements[0]; //0 because order is reversed
            const lastElementIdCursorPos = lastElement.id.lastIndexOf( '-' ) + 1;
            typeCount = parseInt( lastElement.id.substr( lastElementIdCursorPos ) );
        }

        const nextNumber = typeCount + 1 + delta;

        const id = type + '-' + nextNumber.toString();
        const label = type.charAt( 0 ).toUpperCase() + type.slice( 1 ) + ' ' + nextNumber.toString();

        return {
            id: id,
            label: label + suffix,
        };
    }

    /**
     * Get the parent node ID in the elements tree from a node ID
     * @param {*} tree 
     * @param {*} id 
     * @param {*} parentId 
     */
    // static getParentId = ( tree, id, parentId ) => {
    //     return tree.some( item => {
    //             const currentId = item.id
    //             return currentId === id ||
    //                 item.children && ( parentId = Utils.getParentId( item.children, id, currentId ) ) !== null

    //         } ) ?
    //         parentId :
    //         null;
    // }


    static getParentId = ( array, id, parentId = null ) => {
        // For every entry in the array
        for ( const entry of array ) {
            // If the ID matches, return the current parent ID
            if ( entry.id === id ) {
                return parentId;
            }

            let deeperParentId;
            // Otherwise, call the same function on its children, passing itself as the parent.
            // If there was a match, return it.
            if ( entry.children && ( deeperParentId = Utils.getParentId( entry.children, id, entry.id ) ) ) {
                return deeperParentId;
            }
        }
        // No match was found
        return null;
    }

    static getParent = ( element, elements, tree ) => {
        const parentId = Utils.getParentId( tree, element.id );
        let parent = 'root'; //default to root

        if ( parentId ) {
            //Get parent object from ID
            parent = elements.find( element => element.id === parentId )
            // console.warn(parent);
        }

        return parent;
    }



    static deleteElementRecursive = ( source, id ) => {

        const sourceNew = source.filter( item => {
            if ( item.id === id ) {
                return false;
            }

            if ( item.children && item.children.length ) {
                item.children = Utils.deleteElementRecursive( item.children, id );

                if ( !item.children.length ) {
                    delete item.children;
                }
            }

            return true;

        } )
        return sourceNew;
    }

    static validateSVG = ( value ) => {
        return isSvg( value );

    }

    static validateCSS = ( value ) => {
        //splits the text block into an array of lines
        const lines = value.split( "\n" );
        // console.log( lines );

        var errors = [];
        var valid = [];

        for ( const cssprop of lines ) {
            if ( cssprop.length === 0 ) {
                continue;
            }
            //check for : and missing semicolon
            if ( cssprop.indexOf( ':' ) >= 0 && cssprop.slice( -1 ) !== ';' ) {
                errors.push( 'Missing semi-column: ' + cssprop );
                continue;
            }
            //removes semi-column for CSS.supports and emppty spaces
            const code = cssprop.replace( /;\s*$/, "" );

            const isValidProp = CSS.supports( code );

            if ( isValidProp === false ) {
                errors.push( 'Invalid property "' + cssprop + '"' );
            } else {
                valid.push( cssprop );
            }
        }


        const hasErrors = ( errors.length > 0 );

        if ( hasErrors ) {
            return {
                valid: false,
                value: valid.join( "\n" ),
                errors: errors
            };
        } else {
            return {
                valid: true,
                value: valid.join( "\n" )
            };
        }
    }


    static isProTemplate = ( template ) => {

        if (!template){
            return false;
        }
        //counts the layes
        const treeCount = template.content.tree.length;

        //If it has more than 2 layers
        if ( treeCount > 2 ) {
            return true;
        }

        const elements = template.content.elements

        const proLayerTypes = ["dynamicimage", "icon", "svg", "conditional", "condition", "columns", "container"];

        //checks if the layer type is one from the proLayerTypes array
        const hasProFeatures = elements.find( element => proLayerTypes.find( type => type === element.type ) !== undefined );

        if ( hasProFeatures !== undefined ) {
            return true;
        }

        return false;
    }

    static slugify = ( str ) => {
        return String( str )
            .normalize( 'NFKD' ) // split accented characters into their base characters and diacritical marks
            .replace( /[\u0300-\u036f]/g, '' ) // remove all the accents, which happen to be all in the \u03xx UNICODE block.
            .trim() // trim leading or trailing whitespace
            .toLowerCase() // convert to lowercase
            .replace( /[^a-z0-9 -]/g, '' ) // remove non-alphanumeric characters
            .replace( /\s+/g, '-' ) // replace spaces with hyphens
            .replace( /-+/g, '-' ); // remove consecutive hyphens
    }
    /**
     * Removes keys from an object recursively
     * @param {*} obj 
     * @param {*} keys 
     * @returns 
     */
    static removeKeys = ( obj, keys ) => obj !== Object( obj )
        ? obj
        : Array.isArray( obj )
            ? obj.map( ( item ) => Utils.removeKeys( item, keys ) )
            : Object.keys( obj )
                .filter( ( k ) => !keys.includes( k ) )
                .reduce(
                    ( acc, x ) => Object.assign( acc, { [x]: Utils.removeKeys( obj[x], keys ) } ),
                    {}
                );
}