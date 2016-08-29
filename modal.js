(function(window, document, undefined) {
  var TRANSITIONS_SUPPORTED = transitionsSupported();

  window.Modal = Modal;

  function Modal () {
    var defaults = {
      content: "",
      container: null, // TODO: Define alternative container for modal
      backdrop: true,
      animation: "fade",
      size: null,
      customClass: "",
      onOpen: null,
      onClose: null
    };

    this.isOpen = false;
    this.modal = null;
    this.backdrop = null;
    this.dialog = null;
    this.options = extend(defaults, arguments[0] || {});
  }

  Modal.prototype = {
    open: open,
    close: close
  };

  function open () {
    if (this.isOpen === false) {
      this.isOpen = true;
      createModal.call(this);

      /*
       * After adding elements to the DOM, use getComputedStyle
       * to force the browser to recalc and recognize the added elements.
       * Get the CSS animation starting point
       */

      window.getComputedStyle(this.modal).height;

      // Add class to start open animation
      document.body.classList.add("modal-open");

      if (this.options.backdrop === true)
        this.backdrop.classList.add("in");

      this.modal.classList.add("in");

      // focus the modal to be completely blocking
      this.modal.focus();

      if (typeof this.options.onOpen === "function")
        this.options.onOpen.apply(this, arguments);

      return this;
    }

    return false;
  }

  function close () {
    if (this.isOpen === true) {

      this.isOpen = false;
      var self = this;

      if (this.options.animation) {
        /* modal */

        // Listen for transitionend to remove the DOMNodes afterwards
        this.modal.addEventListener("transitionend", function (e) {
          if (e.target === self.modal) {
            self.modal.parentNode.removeChild(self.modal);
          }
        });

        // Trigger the event manually if transitions are not supported
        if (! TRANSITIONS_SUPPORTED)
          triggerEvent(this.modal, "transitionend");

        // Remove class to start close animation
        this.modal.classList.remove("in");

        /* !modal */

        /* backdrop */

        if (this.options.backdrop === true) {
          this.backdrop.addEventListener("transitionend", function () {
            self.backdrop.parentNode.removeChild(self.backdrop);
            document.body.classList.remove("modal-open");
          });

          // Trigger the event manually if transitions are not supported
          if (! TRANSITIONS_SUPPORTED)
            triggerEvent(this.backdrop, "transitionend");

          // Remove class to start close animation
          this.backdrop.classList.remove("in");
        }

        /* !backdrop */
      } else {
        this.modal.parentNode.removeChild(this.modal);
        if (this.options.backdrop === true)
          this.backdrop.parentNode.removeChild(this.backdrop);
      }

      if (typeof this.options.onClose === "function")
        this.options.onClose.apply(this, arguments);

      return this;
    }

    return false;
  }

  function createModal () {
    var self = this;

    // Define the animation class
    var animation = this.options.animation || "";

    // Create a document fragment for DOM building
    var fragment = document.createDocumentFragment();

    /* <backdrop> */

    if (this.options.backdrop === true) {
      this.backdrop = document.createElement("div");
      this.backdrop.className = "modal-backdrop " + animation;

      fragment.appendChild(this.backdrop);
    }

    /* </backdrop> */

    /* <modal> */

    this.modal = document.createElement("div");
    this.modal.setAttribute("tabindex", -1);
    this.modal.className = "modal " + animation;

    this.modal.addEventListener("click", function (e) {
      // Close only if target is the modal, not it's children
      if (e.target === self.modal)
        self.close.call(self, false);
    });

    /* <dialog> */

    this.dialog = document.createElement("div");
    this.dialog.className = "modal-dialog " + this.options.customClass;

    if (typeof this.options.size === "string")
      this.dialog.classList.add("modal-" + this.options.size);
    else if (typeof this.options.size === "number")
      this.dialog.style.width = this.options.size + "px";

    /* <content> */

    /*
     * If content is an HTML string, append the HTML string.
     * If content is a DOMNode, append its content.
     */

    if (typeof this.options.content === "string") {
      this.dialog.innerHTML = this.options.content;
    } else {
      this.dialog.appendChild(this.options.content.cloneNode(true));
    }

    /* </content> */

    this.modal.appendChild(this.dialog);

    /* </dialog> */

    fragment.appendChild(this.modal);

    /* </modal> */

    // Append DocumentFragment to body
    document.body.appendChild(fragment);
  }

  /* Utility / Helper methods */

  function triggerEvent (element, eventName) {
    var event = document.createEvent("HTMLEvents");
    event.initEvent(eventName, true, false);
    element.dispatchEvent(eventName);
    return element;
  }

  function transitionsSupported () {
    var fake = document.createElement("div");
    return fake.style.transition !== undefined;
  }

  function extend (properties) {
    properties = properties || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          properties[key] = arguments[i][key];
      }
    }

    return properties;
  }
})(window, document);
