var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onPlayGame: function() {
    	showLoadingIndicator();
    	var ref = window.open('https://www.playinitium.com/main.jsp', '_self', 'location=no');
    	ref.addEventListener('loadstart', showLoadingIndicator);
    	ref.addEventListener('loadstop', hideLoadingIndicator);
    	ref.addEventListener('loaderror', showErrorLoading);
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


function showLoadingIndicator(event)
{
	$("body").append("<div class='loading-indicator'><h1>Connecting to server...</h1></div>");
}

function hideLoadingIndicator(event)
{
	$(".loading-indicator").remove();
}

function showErrorLoading(event)
{
	alert("Unable to connect to server: "+event.message);
}