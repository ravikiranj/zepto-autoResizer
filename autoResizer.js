;(function($) {
  "use strict";
  var _defaultConfig = {
    onResize: function() {}, // resize callback
    animate: {}, // no animation by default
    minHeight: "default", // retain min height of the element that was passed before resizing
  }
  // css properties that we need to copy to the cloned element
  , _cssPropsToClone = [
    "lineHeight", "textDecoration", "letterSpacing",
    "fontSize", "fontFamily", "fontStyle", "fontWeight",
    "textTransform", "textAlign", "wordSpacing", "padding"
  ]
  // offscreen cloned element CSS
  , _cloneElemCSS = {
    position: "absolute",
    top: "-9999px",
    left: "-9999px",
    opacity: 0,
    overflowY: "hidden"
  }
  // auto resizer can only be applied to "textarea" elements
  , _textAreaSelector = "textarea"
  // clone element container id
  , CLONE_ELEMENT_CONTAINER_ID = "AUTO_RESIZER_CLONE_ELEMENT_CONTAINER"
  // function to check if element is defined and not null
  , _ifdefNN = function(a) {
    return typeof a !== "undefined" && a !== "null";
  }
  // AutoResizer
  , AutoResizer = function(zElem, config) {
    // Sanity check on the input args. Empty zepto selector is fine.
    if(!_ifdefNN(zElem) || !_ifdefNN(config)) {
      return;
    }
    // Private variables
    var el = zElem
    , origHeight = el.height()
    , clonedEl = null
    /**
     * setupConfig - setup config of the element to be resized
     */
    , setupConfig = function() {
      if (config.minHeight === "default") {
        config.minHeight = el.height();
      }
      if (config.minWidth === "default") {
        config.minWidth = el.width();
      }
    }
    /**
     * createClone - create a clone of the passed elem
     */
    , createClone = function() {
      // Setup config
      setupConfig();
      // Instantiate cloned element
      clonedEl = el.clone().height("auto");
      // copy the css properties from real element to clone
      $.each(_cssPropsToClone, function(index, value){
        clonedEl.css(value, el.css(value));
      });
      // set default clone css properties
      clonedEl.css(_cloneElemCSS);
      // Remove name and id of the cloned element
      clonedEl.removeAttr("name").removeAttr("id");
    }
    /**
     * createCloneElemContainer - create clone element container if it doesn't exist already
     */
    , createCloneElementContainer = function() {
      var cloneElemContainer = $("#"+CLONE_ELEMENT_CONTAINER_ID)
      ;
      if (cloneElemContainer.length < 1) {
        $("<div />", {id: CLONE_ELEMENT_CONTAINER_ID, css: {display: "none"}}).appendTo("body");
      }
    }
    /**
     * injectClone - insert the clone element in to DOM
     */
    , injectClone = function() {
      // Create clone elements container if it doesn't exist
      createCloneElementContainer();
      // Append cloned element to the container
      clonedEl.appendTo($("#"+CLONE_ELEMENT_CONTAINER_ID));
    }
    /**
     * bindEvents - bind events to element so that we can update it's size
     */
    , bindEvents = function() {
      var content
      , clonedElHeight
      ;
      el.on("keyup input change", function() {
        content = el.val();
        // fixes the IE innerHTML problem
        content = content.replace("/\n/g", "<br>");
        // Copy the content to cloned el
        clonedEl.html(content);
        clonedElHeight = clonedEl.height();
        // Copy the height of the clonedEl back to the original element
        el.css("height", clonedElHeight < origHeight ? origHeight : clonedElHeight);
      });
    }
    /**
     * init - initialize AutoResizer
     */
    , init = function() {
      createClone();
      injectClone();
      bindEvents();
    }
    ;
    // Call init
    init();
  }
  ;
  // Zepto plugin body
  $.extend($.fn, {
    autoResizer: function(config) { 
      // Merge config
      config = $.extend(_defaultConfig, config);
      // Filter and apply resizer only to "textarea" elements
      this.filter(_textAreaSelector).each(function(){
        new AutoResizer($(this), config);
      });
    }
  });
})(Zepto)
;
