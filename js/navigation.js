define([
    'coreJS/adapt',
    'coreViews/navigationView',
    './navigationButton',
    './defaultSettings'
],function(Adapt, NavigationView, NavigationButtonView, defaultSettings) {

    _.extend(NavigationView.prototype, {

        layouts: [],
        $elements: null,
        coreChildren: [],
        defaultSettings: defaultSettings,

        events: {
            'click [data-event]':'triggerEvent'
        },

        initialize: function() {
            if (Adapt.navigation) return false;
            Adapt.navigation = this;

            this.listenToOnce(Adapt, "app:dataReady", this.onDataReady);
        },

        onDataReady: function() {
            this.setupConfig()
            this.preRender();
            this.createCoreChildren();
            this.setupEventListeners();
            Adapt.trigger("navigation:ready");
        },
        
        setupConfig: function() {
            var layout = Adapt.course.get("_navigationLayout") || defaultSettings;
            layout = this.addDefaultsToLayout(layout);
            this.layouts.push( layout );
        },

        createCoreChildren: function() {
            var current = this.getCurrentLayout();
            items = _.where(current, { _type: "_core"} );

            var $childContainer = $('.navigation > .navigation-inner');

            for (var i = 0, l = items.length; i < l; i++) {
                var item = items[i];
                this.coreChildren.push(new NavigationButtonView({ 
                    model: new Backbone.Model(items[i]),
                    $parent: $childContainer,
                    template: "navigationButton-"+item._name
                }));
            }
        },

        getCurrentLayout: function() {
            return this.layouts[this.layouts.length -1 ];
        },

        addDefaultsToLayout: function(layout) {
            var globals = Adapt.course.get("_globals");
            for (var i = 0, l = layout.length; i < l; i++) {
                var item = layout[i];
                var extensionDefaults = {};
                switch (item._name) {
                case "text": case "back": case "drawer": case "home": case "graphic": case "parent":
                    extensionDefaults = _.findWhere(defaultSettings, {_name: item._name}) || {};
                    item._type = "_core";
                    break;
                default:
                    var k = "_extensions";
                    var e = "_"+item._name;
                    if (globals[k] && globals[k][e]) {
                        var defaultGlobals = _.findWhere(defaultSettings, {_name: item._name}) || {};
                        extensionDefaults = $.extend(true, defaultGlobals, globals[k][e]);
                    }
                    item._type = k;
                    item._plugin = e;
                }
                var combined = _.extend({}, extensionDefaults, item);
                _.extend(item, combined);
                if (item._index === undefined) item._index = i;
            }
            return layout;
        },

        setupEventListeners: function() {
            this.listenTo(Adapt, 'router:location', this.onSectionLoading);
            this.listenTo(Adapt, 'menuView:ready pageView:ready pluginView:ready', this.onSectionLoaded);

            this.listenTo(Adapt, 'navigation:addLayout', this.addLayout);
            this.listenTo(Adapt, 'navigation:addButtonDefaults', this.addButtonDefaults);
            this.listenTo(Adapt, 'navigation:cloneLayout', this.cloneLayout);
            this.listenTo(Adapt, 'navigation:updateLayout', this.updateCurrentLayout);
            this.listenTo(Adapt, 'navigation:changeLayout', this.changeCurrentLayout);
            this.listenTo(Adapt, 'navigation:removeLayout', this.removeCurrentLayout);
        },

        onSectionLoading: function() {
            this.$(".navigation-inner").hide();
        },

        onSectionLoaded: function() {
            this.drawLayout();
            this.$(".navigation-inner").fadeIn('fast');
        },

        drawLayout: function() {

            this.undelegateEvents();
            this.reRenderCoreChildren();
            Adapt.trigger("navigation:render");

            this.$elements = this.getCurrentElements();

            this.overrideItemDataEvents();

            this.hideButtons();

            var sortedElements = this.sortCurrentElements();

            this.injectTooltips();

            this.makeCurrentLayoutStylesheet();

            //sort elements here
            this.$(".navigation-inner").append(sortedElements.$lefts);
            this.$(".navigation-center").append(sortedElements.$centers);
            this.$(".navigation-inner").append(sortedElements.$rights);

            this.delegateEvents();

        },

        getCurrentElements: function() {
           return this.$(".navigation-inner, .navigation-center").children(":not(.aria-label, .navigation-center)");
        },

        overrideItemDataEvents: function() {
            this.$elements = this.getCurrentElements();
            var layouts = this.getCurrentLayout();

            for (var i = 0, l = layouts.length; i < l; i++) {
                var item = layouts[i];
                var selector = this.getClassesSelector(item);
                var $item = this.$elements.filter(selector);
                if ($item.length === 0) return;

                $item.attr("data-event", item._dataEvent).data("event", item._dataEvent);
            }


        },

        hideButtons: function() {
            var current = this.getCurrentLayout();
            var location = Adapt.location;
            var locationArr;
            switch (location._currentLocation) {
            case "course":
                locationArr =  [ location._currentLocation, location._currentId ];
                break;
            default:
                locationArr =  [ location._currentLocation, location._contentType, location._currentId ];
            }

            for (var i = 0, l = current.length; i < l; i++) {
                var item = current[i];
                if (!item._showOn && !item._hideOn) continue;

                var isDisplayed = false;

                if (item._showOn) {
                    var allowedLocations = item._showOn.split(" ");
                    isDisplayed = _.intersection(locationArr, allowedLocations).length > 0;
                }

                if (item._hideOn) {
                    var disallowLocations = item._hideOn.split(" ");
                    isDisplayed = isDisplayed && _.intersection(locationArr, disallowLocations).length === 0;
                }

                var $selected = this.$elements.filter(this.getClassesSelector(item));
                if ($selected.length === 0) continue;

                if (!isDisplayed) {
                    $selected.addClass('display-none');
                } else {
                    $selected.removeClass('display-none');
                }

            }

        },

        sortCurrentElements: function() {

            var currentLayout = this.getCurrentLayout();
            var layoutItems = this.addDefaultsToLayout(currentLayout);

            var lefts = _.where(layoutItems, { _layout: "left"});
            var centers = _.where(layoutItems, { _layout: "center"});
            var rights = _.where(layoutItems, { _layout: "right"});

            lefts.sort(function(a,b) {
                return a._index - b._index;
            });
            centers.sort(function(a,b) {
                return a._index - b._index;
            });
            rights.sort(function(a,b) {
                return b._index - a._index;
            });


            var $lefts = $([]);
            var $centers = $([]);
            var $rights = $([]);

            for (var i = 0, l = lefts.length; i < l; i++) {
                var item = lefts[i];
                var selector = this.getClassesSelector(item);
                var $selected = this.$elements.filter(selector);
                if ($selected.length === 0) continue;
                $lefts.push($selected[0]);
            }
            for (var i = 0, l = centers.length; i < l; i++) {
                var item = centers[i];
                var selector = this.getClassesSelector(item);
                var $selected = this.$elements.filter(selector);
                if ($selected.length === 0) continue;
                $centers.push($selected[0]);
            }
            for (var i = 0, l = rights.length; i < l; i++) {
                var item = rights[i];
                var selector = this.getClassesSelector(item);
                var $selected = this.$elements.filter(selector);
                if ($selected.length === 0) continue;
                $rights.push($selected[0]);
            }

            return { 
                $lefts: $lefts, 
                $centers: $centers, 
                $rights: $rights
            };

        },

        getClassesSelector: function(item) {
            return "." + item._classes.split(" ").join(".")
        },

        injectTooltips: function() {
            var items = this.getCurrentLayout();

            for (var i = 0, l = items.length; i < l; i++) {
                var item = items[i];
                if (!item._showTooltip) continue;
                var selector = this.getClassesSelector(item);
                var $selected = this.$elements.filter(selector);
                if ($selected.length === 0) continue;
                switch (item._type) {
                case "_extensions":
                    var $tooltip = $selected.find(".tooltip");
                    if ($tooltip.length !== 0) {
                        $tooltip.html(item.tooltip);
                        break;
                    }
                    $selected.append($("<div class='tooltip'>"+item.tooltip+"</div>"));
                    break;
                }
                $selected.addClass("tooltip-show");
            }

        },

        reRenderCoreChildren: function() {

            var items = this.getCurrentLayout();

            for (var i = 0, l = this.coreChildren.length; i < l; i++) {
                var child = this.coreChildren[i];
                var childModelClasses = child.model.get("_classes");
                var isDisplayNone = _.contains(child.$el.attr("class").split(" "), "display-none");

                var item = _.find(items, function(item) {
                    if (childModelClasses == item._classes) return true;
                });

                if (!item) continue;
                child.model.set(item);
                child.preRender();

                if (isDisplayNone) child.$el.addClass("display-none");
            }

        },

        makeCurrentLayoutStylesheet: function() {
            var items = this.addDefaultsToLayout(this.getCurrentLayout());

            var cssStyling = "";

            for (var i = 0, l = items.length; i < l; i++) {
                var item = items[i];
                var selector = this.getClassesSelector(item);
                if (!item._isEnabled) {
                    cssStyling += ".navigation > .navigation-inner " + selector + "{ display: none; } \n";
                } else if (item._sizes) {
                    var showSizes = item._sizes.split(" ");
                    var hideSizes = _.difference(['small', 'medium', 'large'], showSizes);
                    if (hideSizes.length === 0) continue;
                    for (var s = 0, sl = hideSizes.length; s < sl; s++) {
                        cssStyling += ".size-" + hideSizes[s] + " .navigation > .navigation-inner " + selector + " { display: none; } \n"; 
                    }
                    
                }
                if (item._type == "_extensions") {
                    var floatValue = items[i]._layout == "right" ? "right" : item._layout == "center" ? "none": "left";
                    cssStyling += ".navigation > .navigation-inner " + selector + "{ float: "+floatValue+"; } \n";
                }
            }

            if ($("html").is(".ie8")) {
                this.$("> style")[0].styleSheet.cssText = cssStyling;
            } else {
                this.$("> style").html(cssStyling);
            }
        },

        addButtonDefaults: function(buttonDefaults) {
            var index = -1;
            _.find(defaultSettings, function(item, itemIndex) {
                if (item._name == buttonDefaults._name) {
                    index = itemIndex;
                    return true;
                }
            });
            if (index == -1) defaultSettings.push(buttonDefaults);
            else _.extend(defaultSettings[index], buttonDefaults); 
        },

        addLayout: function(layout) {
            //copy layout, enable only selected settings and overlay new settings on copy

            layout = this.normaliseLayout(layout, false);

            this.layouts.push(layout);

            this.drawLayout();
        },

        cloneLayout: function(layout) {
            //copy layout, enable only selected settings and overlay new settings on copy

            layout = this.normaliseLayout(layout, true);

            this.layouts.push(layout);

            this.drawLayout();
        },

        changeCurrentLayout: function(layout) {
            //enabled only selected settings, overlaying new settings on existing
            layout = this.normaliseLayout(layout, false);

            this.layouts.pop();
            this.layouts.push(layout);

            this.drawLayout();
        },

        updateCurrentLayout: function(layout) {
            //overlay new settings on existing settings
            layout = this.normaliseLayout(layout, true);

            this.layouts.pop();
            this.layouts.push(layout);

            this.drawLayout();
        },

        normaliseLayout: function(layout, updateOnly) {
            //1. convert layout style ['pluginName', 'pluginName'] to [ { object }, { object }]
            //2. overlay new layout ontop of old layout, to preserve layout context as layouts are add
            //3. enabled only selected plugins or keep existing

            layout = layout || [];

            var allItems = this.getAllLayoutsCollapsed();
        
            //add new items if not existing
            _.each(layout, function(item) {
                var itemName;
                if (typeof item == "string") {
                    itemName = item;
                } else {
                    itemName = item._name;
                }
                if (!_.findWhere(allItems, {_name: itemName})) {
                    allItems.push(item);
                }
            });

            if (allItems.length === 0) return layout;

            var normalisedLayout = [];

            for (var i = 0, l = allItems.length; i < l; i++) {
                var notFound = false;
                var oldItem = allItems[i];
                var newItem;
                var foundItem;

                if (_.contains(layout, oldItem._name)) { //item referenced by string
                    newItem = oldItem;
                } else {
                    newItem = foundItem = _.findWhere(layout, { _name: oldItem._name }); //whole new item object
                    if (newItem) {
                        newItem = $.extend(true, oldItem, newItem); //overlay updates
                    } else {
                        notFound = true;
                        newItem = oldItem;
                    }
                }

                if (!updateOnly) {
                    if (notFound) {
                        newItem._isEnabled = false;
                    } else {
                        if (foundItem._isEnabled === undefined) newItem._isEnabled = true;
                    }
                }

                normalisedLayout.push(newItem);
            }

            return normalisedLayout;
        },

        getAllLayoutsCollapsed: function() {
            //collapse all layouts, taking newest most layouts as prescidence 

            var merged = {};
            for (var i = this.layouts.length-1, l = -1; i > l; i--) {
                var layout = this.layouts[i];
                for (var la = 0, lal = layout.length; la < lal; la++) {
                    var item = layout[la];
                    merged[item._name] = merged[item._name] || {};
                    merged[item._name] = $.extend(true, {}, item, merged[item._name]);
                }
            }
            return _.values(merged);
        },

        removeCurrentLayout: function() {
            //remove last layout from stack and restore previous layout

            if (this.layouts.length <= 1) return;

            this.layouts.pop();

            this.drawLayout();
        },

        template: "navigation-alternative"

    });

    new NavigationView();

});
