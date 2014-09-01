zepto-autoResizer
=================
A Zepto plugin that auto resizes the "textarea" based on the content it holds.

### Usage ###
 * See ```demo/autoResizer.html``` for demo.

```
Zepto(function($) {
  $("textAreaSelector").autoResize();
});
```

You can also pass options
```
Zepto(function($) {
  $("textAreaSelector").autoResize({
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
```
$(textAreaSelector).off(".autoResize")
```

### Tests ###

