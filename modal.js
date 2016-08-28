(function(window, document) {
  window.Modal = Modal;

  function Modal () {
    var defaults = {
      content: ""
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
    document.body.classList.add("js-modal-open");
    createModal.call(this);

    /*
     * After adding elements to the DOM, use getComputedStyle
     * to force the browser to recalc and recognize the added elements.
     * Get the CSS animation starting point
     */

    window.getComputedStyle(this.modal).height;

    // Add class to start animation
    this.backdrop.classList.add("in");
    this.modal.classList.add("in");
  }

  function close () {
    var _ = this;

    this.modal.addEventListener("transitionend", function () {
      _.modal.parentNode.removeChild(_.modal);
    });

    this.backdrop.addEventListener("transitionend", function () {
      _.backdrop.parentNode.removeChild(_.backdrop);
      document.body.classList.remove("js-modal-open");
    });

    if (! hasTransitions()) {
      triggerEvent(this.modal, "transitionend");
      triggerEvent(this.backdrop, "transitionend");
    }

    this.modal.classList.remove("in");
    this.backdrop.classList.remove("in");
  }

  function createModal () {
    var dialog, content, fragment;

    // Create a document fragment for DOM building
    fragment = document.createDocumentFragment();

    /* <backdrop> */

    this.backdrop = document.createElement("div");
    this.backdrop.className = "js-modal-backdrop";

    fragment.appendChild(this.backdrop);

    /* </backdrop> */

    /* <modal> */

    this.modal = document.createElement("div");
    this.modal.className = "js-modal fade";

    this.modal.addEventListener("click", this.close.bind(this));

    /* <dialog> */

    dialog = document.createElement("div");
    dialog.className = "js-modal-dialog";

    /* <content> */

    content = document.createElement("div");
    content.className = "js-modal-content";

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