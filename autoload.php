<?php

defined( 'WPINC' ) || die;

require_once( ABSPATH.WPINC.'/class-phpass.php' );

spl_autoload_register( function( $className ) {
	$namespaces = [
		'WPJoli\\SAFI\\' => __DIR__.'/core/',
		'WPJoliVendor\\SAFI\\' => __DIR__.'/vendor/',
	];
	foreach( $namespaces as $prefix => $baseDir ) {
		$len = strlen( $prefix );
		if( strncmp( $prefix, $className, $len ) !== 0 )continue;
		$file = $baseDir.str_replace( '\\', '/', substr( $className, $len )).'.php';
		if( !file_exists( $file ))continue;
		require $file;
		break;
	}
});
