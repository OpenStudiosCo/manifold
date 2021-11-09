import $ from 'jQuery';
import BaseControls from './BaseControls.js';
import addLibraryItem from '../../../templates/helpers/library__item.pug';

/**
  * Library controls
  */

var app = {};
export default class LibraryControls extends BaseControls {
  constructor( appInstance ) {
    app = appInstance;
    super();
    var el = document.getElementById( 'library' );
    if ( !el ) {
      return;
    }
    $( '#btnUploadImage' )
      .on( 'click', function ( e ) {
        e.stopImmediatePropagation();
        e.preventDefault();
        $( '#image_input' ).click();
      } );
    $( '#image_input' )
      .on( 'change', function ( e ) {
        window.URL = window.URL || window.webkitURL || window.mozURL;
        var url = URL.createObjectURL( e.currentTarget.files[ 0 ] );
        $( addLibraryItem( { url: url } ) )
          .insertBefore( '#btnUploadImage' );
      } );
    $( '#library' ).on( 'click', 'a.ui.image.button img', function ( e ) {
      var src = $( e.target ).attr( 'src' );

      fabric.Image.fromURL( src, function ( img ) {
        app.fabric.model.helpers.addToCenter( img );
      } );

    } );

  }

}
