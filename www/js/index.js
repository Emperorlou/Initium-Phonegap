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
    	if (app.deviceReady)
    	{
	    	showLoadingIndicator();
	    	app.ref = window.open('https://www.playinitium.com/main.jsp', '_self', 'location=no,hidden=yes');
	    	alert("started game");
	    	app.ref.addEventListener('loadstop', hideLoadingIndicator);
	    	app.ref.addEventListener('loaderror', showErrorLoading);
	    	alert("listening to events  compete ");
    	}
    	else
    		alert("Game is still initializing, please wait...");
    },

    onDeviceReady: function() {
    	alert("device ready fired");
        app.deviceReady = true;
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
	alert ("load start fired ");
	$("body").append("<div class='loading-indicator'><h1>Connecting to server...</h1></div>");
}

function hideLoadingIndicator(event)
{
	alert(app.ref);
	app.ref.show();
	$(".loading-indicator").remove();
}

function showErrorLoading(event)
{
	alert("Unable to connect to server: "+event.message);
}
