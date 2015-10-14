define(function() {
	return [
        {
            "_pluginName": "graphic",
            "_isEnabled": true,
            "_classes": "base navigation-graphic",
            "_layout": "center",
            "_sizes": "medium large",
            "text": "Adapt Learning",
            "ariaLabel": "Adapt Learning",
        },
        {
            "_pluginName": "text",
            "_isEnabled": true,
            "_classes": "base navigation-text",
            "_layout": "center",
            "_sizes": "medium large",
            "text": "Adapt Learning",
            "ariaLabel": "Adapt Learning",
        },
        {
            "_pluginName": "back",
            "_isEnabled": true,
            "_classes": "base navigation-back-button",
            "_iconClasses": "icon icon-controls-small-left",
            "_dataEvent": "backButton",
            "_showTooltip": true,
            "_layout": "left",
            "_sizes": "small medium large",
            "tooltip": "Back",
            "ariaLabel": "Back"
        },
        {
            "_pluginName": "home",
            "_isEnabled": true,
            "_classes": "base navigation-menu-button",
            "_iconClasses": "icon icon-home",
            "_layout": "left",
            "_sizes": "small medium large",
            "_showTooltip": true,
            "_dataEvent": "homeButton",
            "tooltip": "Home",
            "ariaLabel": "Home"
        },
        {
            "_pluginName": "drawer",
            "_isEnabled": true,
            "_classes": "base navigation-drawer-toggle-button",
            "_iconClasses": "icon icon-list",
            "_dataEvent": "toggleDrawer",
            "_showTooltip": true,
            "_layout": "right",
            "_sizes": "small medium large",
            "tooltip": "Drawer",
            "ariaLabel": "Open course resources."
        },
        {
            "_pluginName": "pageLevelProgress",
            "_isEnabled": true,
            "_layout": "right",
            "_sizes": "small medium large"
        }
    ];
});