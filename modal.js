(function(window, document) {
  window.Modal = Modal;

  function Modal () {
    var defaults = {
      content: "",
      animation: "fade",
      size: null,
      customClass: null
    };

    this.modal = null;
    this.backdrop = null;
    this.options = extend(defaults, arguments[0] || {});
  }

  Modal.prototype = {
    open: open,
    close: close
  };

  function open () {
    document.body.classList.add("modal-open");
    createModal.call(this);
    this.modal.style.display = "block";

    /*
     * After adding elements to the DOM, use getComputedStyle
     * to force the browser to recalc and recognize the added elements.
     * Get the CSS animation starting point
     */

    window.getComputedStyle(this.modal).height;

    // Add class to start open animation
    this.backdrop.classList.add("in");
    this.modal.classList.add("in");
  }

  function close () {
    var self = this;

    // Listen for transitionend to remove the DOMNodes afterwards
    this.modal.addEventListener("transitionend", function (e) {
      if (e.target === self.modal)
        self.modal.parentNode.removeChild(self.modal);
    });

    this.backdrop.addEventListener("transitionend", function () {
      self.backdrop.parentNode.removeChild(self.backdrop);
      document.body.classList.remove("modal-open");
    });

    // Remove class to start close animation
    this.modal.classList.remove("in");
    this.backdrop.classList.remove("in");

    // Trigger the event manually if transitions are not supported
    if (! hasTransitions()) {
      triggerEvent(this.modal, "transitionend");
      triggerEvent(this.backdrop, "transitionend");
    }
  }

  function createModal () {
    var dialog, content, fragment;
    var self = this;
    var animation = this.options.animation || "";

    // Create a document fragment for DOM building
    fragment = document.createDocumentFragment();

    /* <backdrop> */

    this.backdrop = document.createElement("div");
    this.backdrop.className = "modal-backdrop " + animation;

    fragment.appendChild(this.backdrop);

    /* </backdrop> */

    /* <modal> */

    this.modal = document.createElement("div");
    this.modal.className = "modal " + animation;

    this.modal.addEventListener("click", function (e) {
      // Close only if target is the modal, not it's children
      if (e.target === self.modal)
        self.close.call(self);
    });

    /* <dialog> */

    dialog = document.createElement("div");
    dialog.className = "modal-dialog";

    if (typeof this.options.size === "string")
      dialog.classList.add("modal-" + this.options.size);
    else if (typeof this.options.size === "number")
      dialog.style.width = this.options.size + "px";

    /* <content> */

    content = document.createElement("div");
    content.className = "modal-content";

    /*
     * If content is an HTML string, append the HTML string.
     * If content is a DOMNode, append its content.
     */

    if (typeof this.options.content === "string") {
      content.innerHTML = this.options.content;
    } else {
      content.appendChild(this.options.content);
    }

    dialog.appendChild(content);

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
    var event = document.createEvent("HTMLEvents");
    event.initEvent(eventName, true, false);
    element.dispatchEvent(eventName);
    return element;
  }

  function hasTransitions () {
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