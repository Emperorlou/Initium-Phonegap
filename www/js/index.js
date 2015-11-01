var app = {
	ref:null,
	deviceReady:false,
	
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
    	alert("binding event");
        document.addEventListener('deviceready', this.onDeviceReady, false);
    	alert("binding event complete");
    },

    onPlayGame: function() {
//    	this.deviceReady = true;
    	if (this.deviceReady)
    	{
	    	showLoadingIndicator();
	    	this.ref = window.open('https://www.playinitium.com/main.jsp', '_self', 'location=no,hidden=yes');
	    	this.ref.getSettings().setDisplayZoomControls(false);
	    	this.ref.addEventListener('loadstop', hideLoadingIndicator);
	    	this.ref.addEventListener('loaderror', showErrorLoading);
	    	alert("started game, listening tp compete ");
    	}
    	else
    		alert("Game is still initializing, please wait...");
    },

    onDeviceReady: function() {
    	alert("device ready fired");
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
