define(function() {
	return [
        {
            "_name": "graphic",
            "_isEnabled": true,
            "_classes": "navigation-graphic",
            "_layout": "center",
            "_sizes": "medium large",
            "_showOn": "course menu page",
            "text": "Adapt Learning",
            "ariaLabel": "Adapt Learning",
        },
        {
            "_name": "text",
            "_isEnabled": true,
            "_classes": "navigation-text",
            "_layout": "center",
            "_sizes": "medium large",
            "_showOn": "course menu page",
            "text": "Adapt Learning",
            "ariaLabel": "Adapt Learning",
        },
        {
            "_name": "back",
            "_isEnabled": true,
            "_classes": "navigation-back-button",
            "_iconClasses": "icon icon-controls-small-left",
            "_dataEvent": "backButton",
            "_showTooltip": true,
            "_layout": "left",
            "_sizes": "small medium large",
            "_showOn": "menu page",
            "tooltip": "Back",
            "ariaLabel": "Back"
        },
        {
            "_name": "home",
            "_isEnabled": true,
            "_classes": "navigation-menu-button",
            "_iconClasses": "icon icon-home",
            "_layout": "left",
            "_sizes": "small medium large",
            "_showOn": "menu page",
            "_showTooltip": true,
            "_dataEvent": "homeButton",
            "tooltip": "Home",
            "ariaLabel": "Home"
        },
        {
            "_name": "parent",
            "_isEnabled": true,
            "_classes": "navigation-parent-button",
            "_iconClasses": "icon icon-controls-small-up",
            "_layout": "left",
            "_sizes": "small medium large",
            "_showOn": "menu page",
            "_showTooltip": true,
            "_dataEvent": "parentButton",
            "tooltip": "Parent",
            "ariaLabel": "Parent"
        },
        {
            "_name": "drawer",
            "_isEnabled": true,
            "_classes": "navigation-drawer-toggle-button",
            "_index": 3000,
            "_iconClasses": "icon icon-list",
            "_dataEvent": "toggleDrawer",
            "_showTooltip": true,
            "_layout": "right",
            "_sizes": "small medium large",
            "_showOn": "course menu page",
            "tooltip": "Drawer",
            "ariaLabel": "Open course resources."
        },
        {
            "_name": "pageLevelProgress",
            "_classes": "page-level-progress-navigation",
            "_index": 2000,
            "_isEnabled": true,
            "_layout": "right",
            "_sizes": "small medium large",
            "_showOn": "page",
            "_showTooltip": true,
            "tooltip": "Progress"
        }
    ];
});