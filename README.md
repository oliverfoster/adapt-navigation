# adapt-navigation
    

###Description
This is a layout engine for the navigation bar.   
The engine is built using a layout stack.  
The initial layout in the ``course.json`` is the first item on the stack.  
A new layout can be added to or be cloned from the layout stack.  
The current layout can be changed, updated or removed.  

###Usage

####For a single layout course  

Copy [example.json](https://github.com/cgkineo/adapt-navigation/blob/develop/example.json) into ``course.json`` and rearrange / amend.

####Layout items
Each item in a layout represents a button on the navigation bar.

```
{
    "_name": "back",
    "_isEnabled": true,
    "_classes": "navigation-back-button",
    "_iconClasses": "icon icon-controls-small-left",
    "_dataEvent": "backButton",
    "_showTooltip": true,
    "_layout": "left",
    "_sizes": "small medium large",
    "_locations": "menu page",
    "tooltip": "Back",
    "ariaLabel": "Back"
}
```
  
| Property Name | Description |
| --- | --- |
| ``_name`` | ``back``,``home``,``drawer``,``text``,``graphic``,``extensionName`` is used to identify the button type |
| ``_isEnabled`` | ``true``,``false`` used to show / hide the button |
| ``_classes`` | Used to uniquely identfy the button in the DOM |
| ``_iconClasses`` | Used to add styling classes for the button |
| ``_dataEvent`` | Adapt event to trigger. Prefixed with ``navigation:`` |
| ``_showTooltip`` | ``true``,``false`` as described |
| ``_layout`` | ``left``,``right``,``center`` as described |
| ``_sizes`` | ``small``,``medium``,``large`` include all screen sizes displaying the button |
| ``_locations`` | ``course``,``menu``,``page``, ``contentObjectId`` include on all relevant content objects |
| ``tooltip`` | Tooltip text |
| ``ariaLabel`` | Button aria label text |
| ``text`` | ``text`` button text |
| ``_graphic`` | ``graphic`` ``_src`` and ``alt`` object |
  
  

####Programmic usage


| Event Name | Description |
| --- | --- |
| ``Adapt.trigger("navigation:addLayout", layoutArray);`` | Add a layout to the stack, hiding all items not listed |
| ``Adapt.trigger("navigation:cloneLayout", layoutArray);`` | Add a layout to the stack, updating all items listed |
| ~~``Adapt.trigger("navigation:changeLayout", layoutArray);``~~ | ~~Change the current layout, hiding all items not listed~~ *the use-cases for this are very few |
| ``Adapt.trigger("navigation:updateLayout", layoutArray);`` | Change the current layout, updating all items listed |
| ``Adapt.trigger("navigation:removeLayout");`` | Remove the current layout from the stack |
| ``Adapt.trigger("navigation:addButtonDefaults", defaultsObject);`` | Add/update a button default for tooltips, layout and screen size options |

Layout arrays for ``addLayout`` and ``changeLayout`` can use an ``array[string]`` instead of an ``array[object]`` format. So ``Adapt.trigger("navigation:changeLayout", ['back', 'drawer']);`` would hide all buttons but ``back`` and ``drawer``. The two styles can be mixed, so ``Adapt.trigger("navigation:changeLayout", ['back', { _name: 'text', text: "New Title"}, 'drawer']);`` would show only the ``back``, ``text`` and ``drawer`` but would also update the navigation bar text to ``"New Title"``. 

###Examples

* wait for navigation to be ready
```
    this.listenToOnce(Adapt, "navigation:ready", this.callbackFunction);
```

* update current layout text to "New Title",
```
Adapt.trigger("navigation:updateLayout", [{ _name: 'text', text: "New Title"}]);
```

* change current layout text to "New Title", showing only text, back and drawer
```
Adapt.trigger("navigation:changeLayout", ['back', { _name: 'text', text: "New Title"}, 'drawer']);
```

* clone current layout and change text to "New Title"
```
Adapt.trigger("navigation:cloneLayout", [ { _name: 'text', text: "New Title"} ]);
```

* add new layout and change text to "New Title", shoing only text, back and drawer
```
Adapt.trigger("navigation:addLayout", ['back', { _name: 'text', text: "New Title"}, 'drawer']);
```

* revert current layout to previous layout
```
Adapt.trigger("navigation:removeLayout");
```
