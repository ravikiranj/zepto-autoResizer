/*
 * Zepto.fn.autoResize 1.0
 *
 * @author ravikiranj (https://github.com/ravikiranj/)
 * @since Sep 2014
 *
 * License: BSD 3-Caluse License. See https://github.com/ravikiranj/zepto-autoResizer/blob/master/LICENSE
 *          for details.
 *
 * Note: This is the simplified and ported version of jQuery.fn.autoResize by James Padolsey.
 *       See https://github.com/jamespadolsey/jQuery.fn.autoResize for details.
 *       Original License: http://sam.zoy.org/wtfpl/COPYING
 */

(function($){
  "use strict";
  // Default AutoResizer properties
  var defaults = {
    onResize: function(){},
    animate: {
      duration: 200,
      complete: function(){}
    },
    minHeight: "original",
    maxheight: 500
  }
  // ifdefinedNotNull func
  , ifdefNN = function(a) {
    return typeof a !== "undefined" && a !== null;
  }
  // Container for AutoResizer clones
  , CLONE_CONTAINER_ID = "ZEPTO_AUTORESIZER_CLONE_CONTAINER"
  ;

  // Following CSS properties need to be copied from the original to the cloen
  autoResize.cloneCSSProperties = [
    "lineHeight", "textDecoration", "letterSpacing",
    "fontSize", "fontFamily", "fontStyle", "fontWeight",
    "textTransform", "textAlign", "direction",
    "wordSpacing", "fontSizeAdjust", "padding"
  ];

  // Cloned element's CSS properties
  autoResize.cloneCSSValues = {
    position: "absolute",
    top: -9999,
    left: -9999,
    opacity: 0,
    overflowY: "hidden",
    resize: "none"
  };

  // AutoResize valid selector
  autoResize.resizableFilterSelector = "textarea";
  // Set default autoresizer properties
  autoResize.defaults = defaults;
  // Assign autoResize as a Zepto module
  autoResize.AutoResizer = AutoResizer;
  $.fn.autoResize = autoResize;

  /**
   * autoResize - instantiates and associates a "AutoResizer" instance to each valid selector passed
   */
  function autoResize(config) {
    /* jshint validthis: true */
    this.filter(autoResize.resizableFilterSelector).each(function(){
      new AutoResizer($(this), config);
    });
  }

  /**
   * AutoResizer - the standalone component responsible for auto resizing the DOMElement
   */
  function AutoResizer(el, config) {
    // Sanity check for input args. We don't need to be concerned about empty Zepto selector
    if (!ifdefNN(el) || !ifdefNN(config)) {
      return;
    }
    
    // Configure minHeight
    if (config.minHeight === "original") {
      config.minHeight = el.height();
    } 

    // Save properties to the instance by using "this", since AutoResizer can have multiple instances
    // Merge default and passed configs
    config = this.config = $.extend(autoResize.defaults, config);
    this.el = el;
    this.originalHeight = el.height();
    this.previousScrollTop = null;
    this.value = el.val();

    // Create a clone and inject it to the DOM i.e., add it to Clone Container
    this.createClone();
    this.injectClone();
    // Bind events to the DOM Element
    this.bind();
  }

  /**
   * AutoResizer - standalone component that performs auto resizing on the DOM Element
   */
  AutoResizer.prototype = {
    /**
     * bind - bind events to the DOM Element so that we can update it's height
     */
    bind: function() {
      // Proxy the check function so that it always has the correct "this" context
      var check = $.proxy(function(){
        this.check();
        return true;
      }, this)
      ;

      // Unbind any previous events
      this.unbind();

      // Bind to DOM element's update events
      this.el.on("keyup.autoResize input.autoResize paste.autoResize focus.autoResize", check);
      
      // Check if element's height needs to be update
      this.check(null, true);
    },

    /**
     * unbind - unbind from the DOM element's update events
     */
    unbind: function() {
      this.el.off(".autoResize");
    },

    /**
     * createClone - create a clone of the passed DOM element and copy relevant CSS proeprties
     */
    createClone: function() {
      var el = this.el
      , clone
      ;

      // Set height to "auto" so that it takes appropriate size when filled with content
      clone = el.clone().height("auto");

      // Reference clone to "this"
      this.clone = clone;

      // Copy properties from original element to clone
      $.each(autoResize.cloneCSSProperties, function(i, p){
        clone.css(p, el.css(p));
      });

      // Set/Remove attributes and set CSS properties of the clone
      clone
        .removeAttr("name")
        .removeAttr("id")
        .removeAttr("class")
        .attr("tabIndex", -1)
        .css(autoResize.cloneCSSValues);
    },

    /**
     * check - checks if the DOM element height needs to be updated
     */
    check: function(e, immediate) {
      var config = this.config
      , clone = this.clone
      , el = this.el
      , value = el.val();

      // Set height to 0 and copy the content from the original DOM element to the clone
      clone.height(0).val(value).scrollTop(10000);

      // Get the new scrollTop value
      var scrollTop = clone.scrollTop();
        
      // Don't do anything if scrollTop hasen't changed:
      if (this.previousScrollTop === scrollTop) {
        return;
      }

      // Update previousScrollTop
      this.previousScrollTop = scrollTop;
      
      // Show the scroll bars again if we reached maxHeight
      if (scrollTop >= config.maxHeight) {
        el.css("overflowY", "");
        return;
      }

      // Hide the scroll bars as we haven't reached maxHeight
      el.css("overflowY", "hidden");

      // Retain minimum height
      if (scrollTop < config.minHeight) {
        scrollTop = config.minHeight;
      }

      // Call onResize callback (if any)
      config.onResize.call(el);
      
      // Either animate or directly apply the new height
      if (config.animate && !immediate && el.animate) {
        el.animate({
          height: scrollTop
        }, config.animate);
      } else {
        el.height(scrollTop);
      }
    },

    /**
     * injectClone - injects the clone into the DOM, additionally, it creates the clone container if not already present
     */
    injectClone: function() {
      if (!autoResize.cloneContainer) {
        autoResize.cloneContainer = $("<div />", {id: CLONE_CONTAINER_ID}).appendTo("body");
      }
      autoResize.cloneContainer.append(this.clone);
    }
  };
})(Zepto);
