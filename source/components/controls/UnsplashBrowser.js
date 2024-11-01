const { useState, useEffect, useContext } = wp.element;
// import { createApi } from 'unsplash-js';
import PhotoAlbum from "react-photo-album";

// import apiFetch from '@wordpress/api-fetch';

// import { usimages } from "./images";
// import Icon from '../Icon';
import { AppContext } from "../../AppContext";
import Icon from "../Icon";

// const demo = [
//     {
//         "id": "Mv9hjnEUHR4",
//         "slug": "Mv9hjnEUHR4",
//         "created_at": "2018-02-05T16:58:13Z",
//         "updated_at": "2023-06-04T20:02:38Z",
//         "promoted_at": "2018-02-06T12:32:01Z",
//         "width": 3024,
//         "height": 4032,
//         "color": "#f3c00c",
//         "blur_hash": "LlMiSjxB^ct5}%NfItWC%KskIsj[",
//         "description": "Toshi wearing a knit sweater.",
//         "alt_description": "black pug with gray knit scarf",
//         "urls": {
//             "raw": "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixid=M3w0NTc0Mzd8MHwxfHNlYXJjaHwxfHxkb2d8ZW58MHx8fHwxNjg1OTU5MzQyfDA&ixlib=rb-4.0.3",
//             "full": "https://images.unsplash.com/photo-1517849845537-4d257902454a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0NTc0Mzd8MHwxfHNlYXJjaHwxfHxkb2d8ZW58MHx8fHwxNjg1OTU5MzQyfDA&ixlib=rb-4.0.3&q=85",
//             "regular": "https://images.unsplash.com/photo-1517849845537-4d257902454a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTc0Mzd8MHwxfHNlYXJjaHwxfHxkb2d8ZW58MHx8fHwxNjg1OTU5MzQyfDA&ixlib=rb-4.0.3&q=80&w=1080",
//             "small": "https://images.unsplash.com/photo-1517849845537-4d257902454a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTc0Mzd8MHwxfHNlYXJjaHwxfHxkb2d8ZW58MHx8fHwxNjg1OTU5MzQyfDA&ixlib=rb-4.0.3&q=80&w=400",
//             "thumb": "https://images.unsplash.com/photo-1517849845537-4d257902454a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTc0Mzd8MHwxfHNlYXJjaHwxfHxkb2d8ZW58MHx8fHwxNjg1OTU5MzQyfDA&ixlib=rb-4.0.3&q=80&w=200",
//             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1517849845537-4d257902454a"
//         },
//         "links": {
//             "self": "https://api.unsplash.com/photos/Mv9hjnEUHR4",
//             "html": "https://unsplash.com/photos/Mv9hjnEUHR4",
//             "download": "https://unsplash.com/photos/Mv9hjnEUHR4/download?ixid=M3w0NTc0Mzd8MHwxfHNlYXJjaHwxfHxkb2d8ZW58MHx8fHwxNjg1OTU5MzQyfDA",
//             "download_location": "https://api.unsplash.com/photos/Mv9hjnEUHR4/download?ixid=M3w0NTc0Mzd8MHwxfHNlYXJjaHwxfHxkb2d8ZW58MHx8fHwxNjg1OTU5MzQyfDA"
//         },
//         "likes": 3035,
//         "liked_by_user": false,
//         "current_user_collections": [],
//         "sponsorship": null,
//         "topic_submissions": {
//             "animals": {
//                 "status": "approved",
//                 "approved_on": "2020-04-06T14:20:16Z"
//             }
//         },
//         "user": {
//             "id": "mA08QQzQf8Y",
//             "updated_at": "2023-06-02T23:04:00Z",
//             "username": "charlesdeluvio",
//             "name": "charlesdeluvio",
//             "first_name": "charlesdeluvio",
//             "last_name": null,
//             "twitter_username": null,
//             "portfolio_url": null,
//             "bio": "Graphic designer",
//             "location": "Montreal",
//             "links": {
//                 "self": "https://api.unsplash.com/users/charlesdeluvio",
//                 "html": "https://unsplash.com/es/@charlesdeluvio",
//                 "photos": "https://api.unsplash.com/users/charlesdeluvio/photos",
//                 "likes": "https://api.unsplash.com/users/charlesdeluvio/likes",
//                 "portfolio": "https://api.unsplash.com/users/charlesdeluvio/portfolio",
//                 "following": "https://api.unsplash.com/users/charlesdeluvio/following",
//                 "followers": "https://api.unsplash.com/users/charlesdeluvio/followers"
//             },
//             "profile_image": {
//                 "small": "https://images.unsplash.com/profile-1515694660956-9133b2f53e3b?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
//                 "medium": "https://images.unsplash.com/profile-1515694660956-9133b2f53e3b?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
//                 "large": "https://images.unsplash.com/profile-1515694660956-9133b2f53e3b?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
//             },
//             "instagram_username": null,
//             "total_collections": 132,
//             "total_likes": 5229,
//             "total_photos": 674,
//             "accepted_tos": true,
//             "for_hire": false,
//             "social": {
//                 "instagram_username": null,
//                 "portfolio_url": null,
//                 "twitter_username": null,
//                 "paypal_email": null
//             }
//         },
//         "tags": [
//             {
//                 "type": "landing_page",
//                 "title": "dog",
//                 "source": {
//                     "ancestry": {
//                         "type": {
//                             "slug": "images",
//                             "pretty_slug": "Images"
//                         },
//                         "category": {
//                             "slug": "animals",
//                             "pretty_slug": "Animals"
//                         },
//                         "subcategory": {
//                             "slug": "dog",
//                             "pretty_slug": "Dog"
//                         }
//                     },
//                     "title": "Dog images & pictures",
//                     "subtitle": "Download free dog images",
//                     "description": "Man's best friend is something to behold in all forms: gorgeous Golden Retrievers, tiny yapping chihuahuas, fearsome pitbulls. Unsplash's community of incredible photographers has helped us curate an amazing selection of dog images that you can access and use free of charge.",
//                     "meta_title": "Dog Pictures | Download Free Images on Unsplash",
//                     "meta_description": "Choose from hundreds of free dog pictures. Download HD dog photos for free on Unsplash.",
//                     "cover_photo": {
//                         "id": "tGBRQw52Thw",
//                         "slug": "tGBRQw52Thw",
//                         "created_at": "2018-01-19T14:20:08Z",
//                         "updated_at": "2023-05-28T23:51:56Z",
//                         "promoted_at": "2018-01-20T10:59:48Z",
//                         "width": 3264,
//                         "height": 4896,
//                         "color": "#262626",
//                         "blur_hash": "LQDcH.smX9NH_NNG%LfQx^Rk-pj@",
//                         "description": "Dog day out",
//                         "alt_description": "short-coated brown dog",
//                         "urls": {
//                             "raw": "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?ixlib=rb-4.0.3",
//                             "full": "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
//                             "regular": "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
//                             "small": "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max",
//                             "thumb": "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max",
//                             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1516371535707-512a1e83bb9a"
//                         },
//                         "links": {
//                             "self": "https://api.unsplash.com/photos/tGBRQw52Thw",
//                             "html": "https://unsplash.com/photos/tGBRQw52Thw",
//                             "download": "https://unsplash.com/photos/tGBRQw52Thw/download",
//                             "download_location": "https://api.unsplash.com/photos/tGBRQw52Thw/download"
//                         },
//                         "likes": 761,
//                         "liked_by_user": false,
//                         "current_user_collections": [],
//                         "sponsorship": null,
//                         "topic_submissions": {},
//                         "premium": false,
//                         "plus": false,
//                         "user": {
//                             "id": "toGyhBVt2M4",
//                             "updated_at": "2023-05-29T04:39:15Z",
//                             "username": "fredrikohlander",
//                             "name": "Fredrik Öhlander",
//                             "first_name": "Fredrik",
//                             "last_name": "Öhlander",
//                             "twitter_username": null,
//                             "portfolio_url": null,
//                             "bio": "fredrikohlander@gmail.com\r\n\r\n",
//                             "location": "El Stockholmo, Sweden",
//                             "links": {
//                                 "self": "https://api.unsplash.com/users/fredrikohlander",
//                                 "html": "https://unsplash.com/@fredrikohlander",
//                                 "photos": "https://api.unsplash.com/users/fredrikohlander/photos",
//                                 "likes": "https://api.unsplash.com/users/fredrikohlander/likes",
//                                 "portfolio": "https://api.unsplash.com/users/fredrikohlander/portfolio",
//                                 "following": "https://api.unsplash.com/users/fredrikohlander/following",
//                                 "followers": "https://api.unsplash.com/users/fredrikohlander/followers"
//                             },
//                             "profile_image": {
//                                 "small": "https://images.unsplash.com/profile-1530864939049-bcc82b6c41c2?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
//                                 "medium": "https://images.unsplash.com/profile-1530864939049-bcc82b6c41c2?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
//                                 "large": "https://images.unsplash.com/profile-1530864939049-bcc82b6c41c2?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
//                             },
//                             "instagram_username": "new_final_final.jpg",
//                             "total_collections": 10,
//                             "total_likes": 94,
//                             "total_photos": 236,
//                             "accepted_tos": true,
//                             "for_hire": true,
//                             "social": {
//                                 "instagram_username": "new_final_final.jpg",
//                                 "portfolio_url": null,
//                                 "twitter_username": null,
//                                 "paypal_email": null
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 "type": "landing_page",
//                 "title": "yellow",
//                 "source": {
//                     "ancestry": {
//                         "type": {
//                             "slug": "wallpapers",
//                             "pretty_slug": "HD Wallpapers"
//                         },
//                         "category": {
//                             "slug": "colors",
//                             "pretty_slug": "Color"
//                         },
//                         "subcategory": {
//                             "slug": "yellow",
//                             "pretty_slug": "Yellow"
//                         }
//                     },
//                     "title": "Hd yellow wallpapers",
//                     "subtitle": "Download free yellow wallpapers",
//                     "description": "Choose from a curated selection of yellow wallpapers for your mobile and desktop screens. Always free on Unsplash.",
//                     "meta_title": "Yellow Wallpapers: Free HD Download [500+ HQ] | Unsplash",
//                     "meta_description": "Choose from hundreds of free yellow wallpapers. Download HD wallpapers for free on Unsplash.",
//                     "cover_photo": {
//                         "id": "vC8wj_Kphak",
//                         "slug": "vC8wj_Kphak",
//                         "created_at": "2017-02-15T08:32:55Z",
//                         "updated_at": "2023-05-29T20:01:04Z",
//                         "promoted_at": "2017-02-15T08:32:55Z",
//                         "width": 3456,
//                         "height": 5184,
//                         "color": "#d9c0a6",
//                         "blur_hash": "LQP=+Pxta$og%%j]WWj@Dhayofae",
//                         "description": "Find more inspiring photos: https://monaeendra.com/",
//                         "alt_description": "flowers beside yellow wall",
//                         "urls": {
//                             "raw": "https://images.unsplash.com/photo-1487147264018-f937fba0c817?ixlib=rb-4.0.3",
//                             "full": "https://images.unsplash.com/photo-1487147264018-f937fba0c817?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
//                             "regular": "https://images.unsplash.com/photo-1487147264018-f937fba0c817?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
//                             "small": "https://images.unsplash.com/photo-1487147264018-f937fba0c817?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max",
//                             "thumb": "https://images.unsplash.com/photo-1487147264018-f937fba0c817?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max",
//                             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1487147264018-f937fba0c817"
//                         },
//                         "links": {
//                             "self": "https://api.unsplash.com/photos/vC8wj_Kphak",
//                             "html": "https://unsplash.com/photos/vC8wj_Kphak",
//                             "download": "https://unsplash.com/photos/vC8wj_Kphak/download",
//                             "download_location": "https://api.unsplash.com/photos/vC8wj_Kphak/download"
//                         },
//                         "likes": 12928,
//                         "liked_by_user": false,
//                         "current_user_collections": [],
//                         "sponsorship": null,
//                         "topic_submissions": {
//                             "textures-patterns": {
//                                 "status": "approved",
//                                 "approved_on": "2020-04-06T14:20:11Z"
//                             }
//                         },
//                         "premium": false,
//                         "plus": false,
//                         "user": {
//                             "id": "-tVYuvmMiPA",
//                             "updated_at": "2023-05-29T03:25:25Z",
//                             "username": "monaeendra",
//                             "name": "Mona Eendra",
//                             "first_name": "Mona",
//                             "last_name": "Eendra",
//                             "twitter_username": null,
//                             "portfolio_url": "https://monaeendra.com/",
//                             "bio": "Passionate photographer capturing beauty and soul in people and places. I am available for collaborations!",
//                             "location": "Copenhagen ",
//                             "links": {
//                                 "self": "https://api.unsplash.com/users/monaeendra",
//                                 "html": "https://unsplash.com/@monaeendra",
//                                 "photos": "https://api.unsplash.com/users/monaeendra/photos",
//                                 "likes": "https://api.unsplash.com/users/monaeendra/likes",
//                                 "portfolio": "https://api.unsplash.com/users/monaeendra/portfolio",
//                                 "following": "https://api.unsplash.com/users/monaeendra/following",
//                                 "followers": "https://api.unsplash.com/users/monaeendra/followers"
//                             },
//                             "profile_image": {
//                                 "small": "https://images.unsplash.com/profile-1470086144548-9b86aec8f374?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
//                                 "medium": "https://images.unsplash.com/profile-1470086144548-9b86aec8f374?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
//                                 "large": "https://images.unsplash.com/profile-1470086144548-9b86aec8f374?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
//                             },
//                             "instagram_username": "monaeendra",
//                             "total_collections": 0,
//                             "total_likes": 289,
//                             "total_photos": 39,
//                             "accepted_tos": false,
//                             "for_hire": true,
//                             "social": {
//                                 "instagram_username": "monaeendra",
//                                 "portfolio_url": "https://monaeendra.com/",
//                                 "twitter_username": null,
//                                 "paypal_email": null
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 "type": "landing_page",
//                 "title": "puppy",
//                 "source": {
//                     "ancestry": {
//                         "type": {
//                             "slug": "images",
//                             "pretty_slug": "Images"
//                         },
//                         "category": {
//                             "slug": "animals",
//                             "pretty_slug": "Animals"
//                         },
//                         "subcategory": {
//                             "slug": "puppies",
//                             "pretty_slug": "Puppies"
//                         }
//                     },
//                     "title": "Puppies images & pictures",
//                     "subtitle": "Download free images of puppies",
//                     "description": "Is there anything more emotive and endearing than images of puppies? No? Well, how about flawless, HD images of puppies taken by passionate professional photographers? Unsplash has over 900 puppy images to choose from. Beware of cuteness overload.",
//                     "meta_title": "Puppies Pictures | Download Free Images on Unsplash",
//                     "meta_description": "Choose from hundreds of free puppies pictures. Download HD puppies photos for free on Unsplash.",
//                     "cover_photo": {
//                         "id": "-AYS6hFdp7U",
//                         "slug": "-AYS6hFdp7U",
//                         "created_at": "2018-12-07T15:50:16Z",
//                         "updated_at": "2023-05-29T08:04:53Z",
//                         "promoted_at": null,
//                         "width": 6000,
//                         "height": 4002,
//                         "color": "#f3f3f3",
//                         "blur_hash": "LeP%CX9FyE_4%g%Ln#V?kWt8IUIU",
//                         "description": "She’s been with us for only a few weeks, but is now very much part of the family",
//                         "alt_description": "medium-coated tan puppy on white textile",
//                         "urls": {
//                             "raw": "https://images.unsplash.com/photo-1544197807-bb503430e22d?ixlib=rb-4.0.3",
//                             "full": "https://images.unsplash.com/photo-1544197807-bb503430e22d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
//                             "regular": "https://images.unsplash.com/photo-1544197807-bb503430e22d?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
//                             "small": "https://images.unsplash.com/photo-1544197807-bb503430e22d?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max",
//                             "thumb": "https://images.unsplash.com/photo-1544197807-bb503430e22d?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max",
//                             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1544197807-bb503430e22d"
//                         },
//                         "links": {
//                             "self": "https://api.unsplash.com/photos/-AYS6hFdp7U",
//                             "html": "https://unsplash.com/photos/-AYS6hFdp7U",
//                             "download": "https://unsplash.com/photos/-AYS6hFdp7U/download",
//                             "download_location": "https://api.unsplash.com/photos/-AYS6hFdp7U/download"
//                         },
//                         "likes": 223,
//                         "liked_by_user": false,
//                         "current_user_collections": [],
//                         "sponsorship": null,
//                         "topic_submissions": {},
//                         "premium": false,
//                         "plus": false,
//                         "user": {
//                             "id": "t7XcCH2m2p0",
//                             "updated_at": "2023-05-29T09:55:12Z",
//                             "username": "jawis",
//                             "name": "Wai Siew",
//                             "first_name": "Wai",
//                             "last_name": "Siew",
//                             "twitter_username": null,
//                             "portfolio_url": null,
//                             "bio": null,
//                             "location": null,
//                             "links": {
//                                 "self": "https://api.unsplash.com/users/jawis",
//                                 "html": "https://unsplash.com/@jawis",
//                                 "photos": "https://api.unsplash.com/users/jawis/photos",
//                                 "likes": "https://api.unsplash.com/users/jawis/likes",
//                                 "portfolio": "https://api.unsplash.com/users/jawis/portfolio",
//                                 "following": "https://api.unsplash.com/users/jawis/following",
//                                 "followers": "https://api.unsplash.com/users/jawis/followers"
//                             },
//                             "profile_image": {
//                                 "small": "https://images.unsplash.com/profile-1660659680353-318354bc7fd6image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
//                                 "medium": "https://images.unsplash.com/profile-1660659680353-318354bc7fd6image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
//                                 "large": "https://images.unsplash.com/profile-1660659680353-318354bc7fd6image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
//                             },
//                             "instagram_username": "Jawis",
//                             "total_collections": 6,
//                             "total_likes": 530,
//                             "total_photos": 109,
//                             "accepted_tos": true,
//                             "for_hire": false,
//                             "social": {
//                                 "instagram_username": "Jawis",
//                                 "portfolio_url": null,
//                                 "twitter_username": null,
//                                 "paypal_email": null
//                             }
//                         }
//                     }
//                 }
//             }
//         ]
//     }
// ];

const UnsplashBrowser = ( { isVisible, onSelect, onClose, canvas, ...props } ) => {
    const isPro = useContext( AppContext );
    const [isFetching, setIsFetching] = useState( false );
    const [search, setSearch] = useState( "" );
    const [searchPage, setSearchPage] = useState( 1 );
    const [searchTotalPage, setSearchTotalPage] = useState( null );
    const [searchResults, setSearchResults] = useState( [] );


    const [counter, setCounter] = useState( "Search" );

    useEffect( () => {
        counter > 0 && setTimeout( () => setCounter( counter - 1 ), 1000 );
        counter === 0 && setCounter( "Search" );
    }, [counter] ); //run this code when the value of template changes

    const rootURL = 'https://api.wpjoli.com/wp-json';

    const getStyles = ( () => {
        return {
            display: isVisible ? "flex" : "none",
        };
    } )();

    const handleImageClick = ( index ) => {
        // console.log( index );

        if ( !( index >= 0 ) ) {
            return false;
        }

        // console.log( searchResults[index] );
        const selectedImage = searchResults[index];

        if ( selectedImage ) {

            const maxWidth = canvas.width;

            onSelect( {
                src: selectedImage.urls.raw,
                // src: selectedImage.urls.raw + "&q=90&w=" + ( maxWidth * 2 ).toString(),
                width: maxWidth,
                // width: selectedImage.width,
                height: Math.round( selectedImage.height * maxWidth / selectedImage.width ),
                originalHeight: selectedImage.height,
                originalWidth: selectedImage.width,
            } );

            triggerUnsplashDownload( selectedImage.id );
        }

    };

    const handleSearchChange = ( e ) => {
        setSearchPage( 1 );
        setSearchTotalPage( null );
        setSearch( e.target.value );
    }

    const handleKeyDown = ( e ) => {
        if ( e.keyCode === 13 ) { //enter
            handleSearch();
        }
    }

    const handleSearch = () => {
        setIsFetching( true );

        let reqHeaders = {
            'Accept': 'application/json',
            'X-Safi-User-Id': window.SAFI?.license?.user_id || 0,
            'Content-Type': 'application/json',
        };

        


        const fetchOptions = {
            method: 'POST',
            // mode: "no-cors",

            headers: reqHeaders,


            //     data: {
            //         html: previewContent,
            //         options: options,
            //     },
            body: JSON.stringify( {
                search: search,
                page: searchPage,
            } )
        }

        fetch( rootURL + '/safi-api/v1/unsplash/search', fetchOptions )
            .then( response => response.json() )
            .then( data => {
                setIsFetching( false );

                if ( searchPage > 1 ) {
                    setSearchResults( [...searchResults, ...data.unsplash.results] );
                }
                else {
                    setSearchResults( data.unsplash.results );
                }
                const totalPages = data.unsplash.total_pages;

                setSearchTotalPage( totalPages );
                if ( totalPages > searchPage ) {
                    setSearchPage( searchPage + 1 );
                }

                if ( isPro !== true ) {
                    setCounter( 10 );
                }
            } )

            // } )
            .catch( ( e ) => {
                console.error( 'An error occured', e );
                alert( 'An error occured, try again.' );
                setIsFetching( false );
            } );
    };

    const triggerUnsplashDownload = ( photoID ) => {
        const fetchOptions = {
            method: 'POST',
            // mode: "no-cors",

            headers: {
                'Accept': 'application/json',
                'X-Safi-License-Id': window.SAFI?.license?.id || 0,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( {
                photo_id: photoID,
            } )
        }

        fetch( rootURL + '/safi-api/v1/unsplash/download', fetchOptions )
            .then( response => response.json() )
            .then( data => {

            } )

            // } )
            .catch( ( e ) => {
                alert( 'An error occured, try again.' );
            } );

    };

    const images = ( () => {
        const formattedImages = searchResults.map( result => {
            return {
                src: result.urls.small,
                width: result.width,
                height: result.height,
                title: result.description,
                author: result.user.name,
                author_profile: result.user.url,
            };
        } );

        console.log( searchResults.map( result => {
            return result.urls.regular;
        } ) );
        return formattedImages;
    } )();

    const isSearchDisabled = ( () => {
        return counter >= 0;
    } )();


    return (
        <div id="safi-unsplash-browser" className="safi-image-browser-wrap"
            style={getStyles}
        >
            <div className="safi-image-browser">
                <div className="safi-ib-header">
                    <h3>Photos by <a href="https://unsplash.com/?utm_source=smart-auto-featured-image&utm_medium=referral&utm_campaign=api-credit" target="_blank">Unsplash</a></h3>
                    <div className="safi-unsplash-search-area">
                        <input
                            type="text"
                            name=""
                            id="safi-unsplash-search"
                            className="safi-plain"
                            placeholder="Mountains"
                            value={search}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            autoComplete="off"
                            disabled={isFetching || isSearchDisabled}
                        />
                        <button className="button" value="Search" onClick={handleSearch} disabled={isFetching || isSearchDisabled || !search.length} >{counter > 0 ? counter : "Search"}</button>
                    </div>
                    <div className="safi-close " onClick={onClose}>
                        <Icon icon="close" />
                    </div>
                </div>
                <div className="safi-ib-body --safi-scroll-thin">
                    {/* <Gallery images={images} /> */}


                    <div className={"safi-overlay overlay-unsplash" + ( isFetching ? " --showing" : "" )}>
                        <span className="safi-loader"></span>
                    </div>
                    <PhotoAlbum
                        photos={images}
                        layout="rows"
                        spacing={3}
                        targetRowHeight={150}
                        onClick={( { index } ) => {
                            handleImageClick( index );
                        }}
                        renderPhoto={( { photo, wrapperStyle, renderDefaultPhoto } ) => (
                            <div className="safi-ib-thumb" style={{ position: "relative", ...wrapperStyle }}>
                                {renderDefaultPhoto( { wrapped: true } )}
                                {photo.author && (
                                    <div className="safi-ib-thumb-author" >
                                        <a href={photo.author_profile + "?utm_source=smart-auto-featured-image&utm_medium=referral"} target="_blank">{photo.author}</a>
                                    </div>
                                )}
                            </div>
                        )}
                    />
                    {isPro !== true &&
                        <div className="safi-ib-pro-notice">
                            <ul>
                                <li>Unlimited results</li>
                                <li>Unrestricted searches*</li>
                                <li>HD + HQ image quality</li>
                            </ul>
                            <a className="button" target="_blank" href="https://wpjoli.com/smart-auto-featured-image/">Get Pro Now</a>
                            <p style={{
                                fontSize: "10px",
                                fontStyle: "italic",
                                color: "#ffffff80"
                            }}>*Free users are restricted to one search per 10 seconds to keep a smooth experience for both free and pro users.</p>
                        </div>
                    }
                    {/* Search results */}
                    {
                        isPro && searchPage < searchTotalPage &&
                        <button onClick={handleSearch}>More</button>
                    }
                </div>
            </div>
        </div>
    );
};

export default UnsplashBrowser;