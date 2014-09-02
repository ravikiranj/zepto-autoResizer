zepto-autoResizer
=================
A Zepto plugin that auto resizes the "textarea" based on the content it holds.

### Usage ###
See `demo/autoResizer.html` for demo.

```javascript
Zepto(function($) {
  $("textarea.className").autoResize();
  // $("textarea#id").autoResize();
});
```

You can also pass options
```javascript
Zepto(function($) {
  $("textarea.className").autoResize({
    minHeight: 100,
    maxHeight: 500
  });
});
```

Available options include:
   * minHeight: *(default: "original")* - A number indicating the minimum height to be retained
   * maxHeight: *(default: 500)* - A number indicating the maximum height that the resizable element can be
   * onResize: *(default: function(){})* - Callback function whenever the "textarea" is resized (passes the element as input to the callback)
   * animate : *(default: {duration: 200, complete: function(){})* - Zepto's animate function properties. See http://zeptojs.com/#animate for details.

You can unbind listeners bound by this plugin as below:-
```javascript
$("textarea.className").off(".autoResize")
```

### Caveats ###
* You will need to include the non-default ["fx" module](https://github.com/madrobby/zepto/blob/master/src/fx.js) to support animations.
* Currently, you can turn on *autoResize* functionality and *unbind* events later. There is no way to reinstate autoResizing after unbinding. In order to support destroy-reinstante, I had to include ["data" module](https://github.com/madrobby/zepto/blob/master/src/data.js), but I have deferred this feature as of now.


