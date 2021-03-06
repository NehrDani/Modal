/*!
 * Modal
 *
 * Copyright (c) 2016 Daniel Nehring | MIT license | https://github.com/NehrDani/Modal
 */

(function(window, document, undefined) {
  var TRANSITIONS_SUPPORTED = transitionsSupported();

  window.Modal = Modal;

  function Modal () {
    var defaults = {
      content: "",
      backdrop: true,
      key: true,
      animation: "fade",
      size: null,
      customClass: "",
      onOpen: null,
      onClose: null
    };

    this.isOpen = false;
    this.modal = null;
    this.backdrop = null;
    this.options = extend(defaults, arguments[0] || {});
  }

  Modal.prototype = {
    open: open,
    close: close
  };

  function open () {
    if (this.isOpen === false) {
      var self = this;
      assambleModal.call(this);

      /*
       * After adding elements to the DOM, use getComputedStyle
       * to force the browser to recalc and recognize the added elements.
       * Get the CSS animation starting point
       */

      window.getComputedStyle(this.modal).height;

      if (this.options.backdrop !== "static") {
        this.modal.addEventListener("click", function (e) {
          // Close only if target is the modal, not it's children
          if (e.target === self.modal) {
            self.close.call(self, false);
            this.removeEventListener("click", arguments.callee);
          }
        });
      }

      if (this.options.key === true) {
        // Make closable on escape key
        window.addEventListener("keydown", function (e) {
          if (e.keyCode === 27) {
            self.close.call(self, false);
            this.removeEventListener("keydown", arguments.callee);
          }
        });
      }

      // Add class to start open animation
      document.body.classList.add("modal-open");

      if (this.options.backdrop)
        this.backdrop.classList.add("in");

      this.modal.classList.add("in");

      // focus the modal to be completely blocking
      this.modal.focus();

      // set open flag
      this.isOpen = true;

      if (typeof this.options.onOpen === "function")
        this.options.onOpen.apply(this, arguments);

      return this;
    }

    return false;
  }

  function close () {
    if (this.isOpen === true) {
      var self = this;
      /* modal */

      // Listen for transitionend to remove the DOMNodes afterwards
      this.modal.addEventListener("transitionend", function (e) {
        if (e.target === self.modal) {
          this.removeEventListener("transitionend", arguments.callee);
          document.body.classList.remove("modal-open");
          self.modal.parentNode.removeChild(self.modal);
          self.modal = null;
        }
      });

      // Remove class to start close animation
      this.modal.classList.remove("in");

      // Trigger the event manually if transitions are not supported
      if (! TRANSITIONS_SUPPORTED || ! this.options.animation)
        triggerEvent(this.modal, "transitionend");

      /* !modal */

      /* backdrop */

      if (this.options.backdrop) {
        this.backdrop.addEventListener("transitionend", function () {
          this.removeEventListener("transitionend", arguments.callee);
          self.backdrop.parentNode.removeChild(self.backdrop);
          self.backdrop = null;
        });

        // Remove class to start close animation
        this.backdrop.classList.remove("in");

        // Trigger the event manually if transitions are not supported
        if (! TRANSITIONS_SUPPORTED || ! this.options.animation)
          triggerEvent(this.backdrop, "transitionend");
      }

      /* !backdrop */

      this.isOpen = false;

      if (typeof this.options.onClose === "function")
        this.options.onClose.apply(this, arguments);

      return this;
    }

    return false;
  }

  function assambleModal () {
    // Define the animation class
    var animation = this.options.animation || "";

    // Create a document fragment for DOM building
    var fragment = document.createDocumentFragment();

    /* <backdrop> */

    if (this.options.backdrop !== false) {
      this.backdrop = document.createElement("div");
      this.backdrop.className = "modal-backdrop " + animation;

      fragment.appendChild(this.backdrop);
    }

    /* </backdrop> */

    /* <modal> */

    this.modal = document.createElement("div");
    this.modal.setAttribute("tabindex", -1);
    this.modal.className = "modal " + animation;

    /* <dialog> */

    var dialog = document.createElement("div");
    dialog.className = "modal-dialog " + this.options.customClass;

    if (typeof this.options.size === "string")
      dialog.classList.add("modal-" + this.options.size);
    else if (typeof this.options.size === "number")
      dialog.style.maxWidth = this.options.size + "px";

    /* <content> */

    /*
     * If content is an HTML string, append the HTML string.
     * If content is a DOMNode, append its content.
     */

    if (typeof this.options.content === "string") {
      dialog.innerHTML = this.options.content;
    } else {
      dialog.innerHTML = this.options.content.innerHTML;
    }

    /* </content> */

    this.modal.appendChild(dialog);

    /* </dialog> */

    fragment.appendChild(this.modal);

    /* </modal> */

    // Append DocumentFragment to body
    document.body.appendChild(fragment);
  }

  /* Utility / Helper methods */

  function triggerEvent (element, eventName) {
    var event = document.createEvent("Event");
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
