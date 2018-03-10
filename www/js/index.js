window.loginConfig = 
{
	'webClientId':'236957303251-83rr9gcnddjfcgkm35a2o70rf2rvfq2d.apps.googleusercontent.com',
	'offline':false
};

var app = {
	ref:null,
	deviceReady:false,
	
	isPhoneGap: function() {
		if (window.cordova)
			return true;
		else
			return false;
	},
	
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('menubutton', shutdownGame, false);
    },

    onAjaxOAuthLogin: function()
    {
        window.plugins.googleplus.login(
                loginConfig,
                function (obj) {
                  alert("Hi, " + obj.displayName + ", " + obj.email);
                  
                  $.post("https://www.playinitium.com/ServletUserControl?type=ajaxOAuth", {token:obj.idToken})
                  .done(function(data){
                	  alert(data.next);
                  })
                  .fail(function(data){
                	  alert("Error: "+data);
                  });
                },
                function (msg) {
                  alert("error: " + msg);
                }
            );
    },
    
    
    onOAuthLogin: function()
    {
    	if (app.isPhoneGap()==false)
		{
    		window.location.href = "https://www.playinitium.com/ServletUserControl?type=oauth&authType=google";
		}
    	else if (app.deviceReady)
    	{
	    	showLoadingIndicator();
	    	app.ref = window.open('https://www.playinitium.com/ServletUserControl?type=oauth&authType=google', "_self", 'location=no,hidden=yes');
	    	app.ref.addEventListener('loadstop', hideLoadingIndicator);
	    	app.ref.addEventListener('loaderror', showErrorLoading);
    	}
    	else
    		alert("Game is still initializing, please wait...\nIf you keep getting this message, check your internet connection.");
    },
    
    onPlayGame: function() {
    	if (app.isPhoneGap()==false)
		{
    		window.location.href = "https://www.playinitium.com/main.jsp";
		}
    	else if (app.deviceReady)
    	{
	    	showLoadingIndicator();
	    	app.ref = window.open('https://www.playinitium.com/main.jsp', "_self", 'location=no,hidden=yes');
	    	app.ref.addEventListener('loadstop', hideLoadingIndicator);
	    	app.ref.addEventListener('loaderror', showErrorLoading);
    	}
    	else
    		alert("Game is still initializing, please wait...\nIf you keep getting this message, check your internet connection.");
    },

    onDeviceReady: function() {
        app.deviceReady = true;
    },

    onSettings: function() {
        window.alert("This should go to Settings");
    },

    exitFromApp: function() {
        navigator.app.exitApp();
    }
};


function shutdownGame(event)
{
	if (app.ref!=null)
	{
		app.ref.hide();
		app.ref.close();
	}
	
	$(".loading-indicator").remove();
}

function showLoadingIndicator(event)
{
	$("body").append("<div class='loading-indicator'><h1>Connecting to server...</h1></div>");
	$(".loading-indicator").hide().fadeIn();
}

function hideLoadingIndicator(event)
{
	app.ref.show();
	$(".loading-indicator").fadeOut();
}

function showErrorLoading(event)
{
	shutdownGame(event);
	
	alert("Unable to connect to server: "+event.message);
}
