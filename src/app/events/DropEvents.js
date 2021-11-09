import $ from 'jQuery';
import BaseEvents from './BaseEvents.js';
import addLibraryItem from '../../templates/helpers/library__item.pug';

/**
  * Drop Events class.
  */

var app = {};
export default class DropEvents extends BaseEvents {
  constructor( appInstance ) {
    app = appInstance;
    super();

    window.addEventListener("drop", this.handleDrop);
  }

  handleDrop( event ) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();

    let completeDrop = (file) => {
      window.URL = window.URL || window.webkitURL || window.mozURL;
      var url = URL.createObjectURL(file);
      console.log(url);
      $(addLibraryItem({ url: url }))
        .insertBefore('#btnUploadImage');
    };

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          completeDrop(event.dataTransfer.items[i].getAsFile());
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.files.length; i++) {
        completeDrop(event.dataTransfer.files[i]);
      }
    }
  }
  
}
