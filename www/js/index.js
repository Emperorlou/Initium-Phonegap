var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onPlayGame: function() {
    	doOpen();
        //var ref = window.location = "http://www.playinitium.com/login.jsp"
       var ref = window.open('http://www.playinitium.com/main.jsp', '_self', 'location=no');
    },

    onDeviceReady: function() {
        //var ref = window.open('http://www.playinitium.com/login.jsp', '_blank', 'location=no');
    },

    onSettings: function() {
        window.alert("This should go to Settings");
    },

    exitFromApp: function() {
        navigator.app.exitApp();
    }
};


function doOpen() {

	var options = {
		toolbarColor : '#FFFFFF', // Background color of the toolbar in #RRGGBB
		toolbarHeight : '40',
		closeButtonText : '< Close',
		closeButtonSize : '25',
		closeButtonColor : '#000000',
		openHidden : false
	};

	if (window.cordova && cordova.platformId === "android") {
		var browser = window.inAppBrowserXwalk
				.open("https://www.playinitium.com/main.jsp", options);

		browser.addEventListener("loadstart", function(url) {
			console.log(url);
		});

		browser.addEventListener("loadstop", function(url) {
			console.log(url);
		});

		browser.addEventListener("exit", function() {
			console.log("browser closed");
		});
	} else {
		window.open("https://www.playinitium.com/main.jsp", "_self");
	}
}