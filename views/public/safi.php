<?php

defined( 'ABSPATH' ) or die( 'Wrong path bro!' );
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Smart Auto Featured Image</title>
  <?php 
?>
  <?php 
?>
  <?php 
echo safi_sanitize_var( $scripts, true );
?>
  <style>
    body {margin: 0;padding: 0;overflow: hidden;color: #000;}
    canvas {position: absolute;top: 0;left: 0;z-index: -1;}
    .canvas {position: relative;}
    .root-container {width: <?php 
echo filter_var( $canvas->width, FILTER_SANITIZE_NUMBER_INT );
?>px !important;height: <?php 
echo filter_var( $canvas->height, FILTER_SANITIZE_NUMBER_INT );
?>px !important;background-color: <?php 
echo esc_html( $canvas->backgroundColor );
?>;overflow: hidden;position: relative;user-select: none;}
    .root-container p {margin: 0;}
    <?php 
?>
    <?php 
?>
    <?php 
echo safi_escape_css( $css );
?>
    </style><!--SAFIEOS-->
</head>
<body>
  <?php 
?>
    <div id="safi-canvas" class="root-container"><?php 
echo wp_kses( $html, $allowed_html );
?></div>
  <?php 
?>
</body> 
</html>