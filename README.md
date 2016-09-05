## Javascript Modal
**- Javascript Modal | lightweight, customizable, no dependencies | inspired by Bootstrap -**

[Examples](https://nehrdani.github.io/Modal/)

### Getting Started

The Modal is very easy to use.
- Initialize the Modal with parameters.
- Call the open() method.
- Call the close() method when done.

The Modal appends itself to the document, and cleans itself up after closing.

#### Javascript

```js
// best wait for DOM ready
document.addEventListener("DOMContentLoaded", function () {

  // constructor
  var modal = new Modal({
    content: "<h1>I'm a modal.</h1>", // content, String or DOMNode
  });

  modal.open(); // opens the modal
}
```

### Properties

* modal [DOMNode] - The Modal element.
* backdrop [DOMNode] - The Backdrop element.

### Methods

* open (arguments) - Opens the Modal.
* close (arguments) - Closes the Modal and passes the arguments to the onClose handler. Or use escape key.

### Options

* content - The content of the Modal Dialog. Could be a string or a DOM Node.
* backdrop *(Default: true)* - Whether or not to render a modal backdrop element *(true, false, "static")*. Use static for a backdrop which doesn't close the Modal on click.
* animation - *(Default: "fade")* - Sets the animation class of the modal, or *false* for no animation at all.
* key *(Default: true)* - Closes the Modal when escape key is pressed.
* onOpen (arguments) - Handler called when the Modal opens. Passing the argments of the calling function.
* onClose (arguments) - Handler called when the Modal closes. Passing the argments of the calling function.
* size *(Default: null)* - Optional parameter for changing the modal size *("sm", "lg", Number)*. Smaller or larger modal like bootstrap, or a number representing the width in pixels.
* customClass - Optional property to set a custom class on the modal dialog element, for custom styling.

### NPM
* npm install - installs all needed dependencies
* npm run uglify - minifies the source file for production use.

### About
*Another Modal. I know what you think...  
But there are not that many Modal plugins out there in vanilla javascript.  
To be honest, I think you need no plugin at all for modal dialogs, but it helps ;-)*

**Feel free to try, fork and share. I appreciate every feedback.**
