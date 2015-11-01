var app = {
	ref:null,
	deviceReady:false,
	
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onPlayGame: function() {
    	this.deviceReady = true;
    	if (this.deviceReady)
    	{
	    	showLoadingIndicator();
	    	this.ref = window.open('https://www.playinitium.com/main.jsp', '_self', 'location=no,hidden=yes');
	    	this.ref.getSettings().setDisplayZoomControls(false);
	    	this.ref.addEventListener('loadstop', hideLoadingIndicator);
	    	this.ref.addEventListener('loaderror', showErrorLoading);
    	}
    	else
    		alert("Game is still initializing, please wait...");
    },

    onDeviceReady: function() {
        this.deviceReady = true;
    },

    onSettings: function() {
        window.alert("This should go to Settings");
    },

    exitFromApp: function() {
        navigator.app.exitApp();
    }
};


function showLoadingIndicator(event)
{
	$("body").append("<div class='loading-indicator'><h1>Connecting to server...</h1></div>");
}

function hideLoadingIndicator(event)
{
	app.ref.show();
	$(".loading-indicator").remove();
}

function showErrorLoading(event)
{
	alert("Unable to connect to server: "+event.message);
}
