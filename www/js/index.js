window.loginConfig = 
{
	'webClientId':'236957303251-83rr9gcnddjfcgkm35a2o70rf2rvfq2d.apps.googleusercontent.com',
	'offline':false
};

var app = {
	ref:null,
	deviceReady:false,
	internetConnected:null,
	internetOnline:null,
	serverOnline:null,
	loggedIn:null,
	verifyCode:null,
	
	isPhoneGap: function() {
		if (window.cordova)
			return true;
		else
			return false;
	},
	
    initialize: function() {
        this.bindEvents();
    },

    initializeConnection: function()
    {
    	$("#initialize-status").text("Connecting to server...");
    	$("#initialize-control").html("<img src='images/wait.gif'/>");
    	
    	this.internetOnline = null;
    	this.loggedIn = null;
    	
    	this.internetConnected = window.navigator.onLine;
    	
    	if (this.internetConnected == false)
    	{
    		setConnectionError("You are not connected to the internet.");
    		return;
    	}
    	
        this.checkIfLoggedIn();
    },
    
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('menubutton', shutdownGame, false);
    },

    onAjaxOAuthLogin: function()
    {
        window.plugins.googleplus.login(
				window.loginConfig,
				function (obj) {
				  alert("Hi, " + obj.displayName + ", " + obj.email);
				  alert(obj.idToken);
				  $.post("https://test-dot-playinitium.appspot.com/ServletUserControl?suctype=ajaxOAuth", {suctype:"ajaxOAuth", token:obj.idToken})
				  .done(function(data){
			      	  	if (data.error)
			  	  		{
			      	  		$("#login-error-message").text(data.error);
			      	  		return;
			  	  		}
			  	  		$("#login-error-message").text("");
						app.internetOnline = true;
						app.serverOnline = true;
						app.loggedIn = data.loggedIn;
						app.verifyCode = data.verifyCode;
						
						if (app.loggedIn)
						{
							app.showLaunchPage();
						}
						else
						{
							app.showLoginPage();
						}
                  })
                  .fail(function(data){
                	  processFailedAjaxCall(data);
                  });
                },
                function (msg) {
	      	  		$("#login-error-message").text(msg);
	      	  		return;
                }
            );
    },
    
    
    onOAuthLogin: function()
    {
    	if (app.isPhoneGap()==false)
		{
    		window.location.href = "https://test-dot-playinitium.appspot.com/ServletUserControl?suctype=oauth&authType=google";
		}
    	else if (app.deviceReady)
    	{
	    	showLoadingIndicator();
	    	app.ref = window.open('https://test-dot-playinitium.appspot.com/ServletUserControl?suctype=oauth&authType=google', "_self", 'location=no,hidden=yes');
	    	app.ref.addEventListener('loadstop', hideLoadingIndicator);
	    	app.ref.addEventListener('loaderror', showErrorLoading);
    	}
    	else
    		alert("Game is still initializing, please wait...\nIf you keep getting this message, check your internet connection.");
    },
    
    
    onMainMenu: function()
    {
    	$(".menu-panel").hide();
    	$("#buttons-panel").show();
    },
    
    checkIfLoggedIn: function()
    {
        $.post("https://test-dot-playinitium.appspot.com/ServletUserControl?suctype=ajaxLoginCheck", {suctype:"ajaxLoginCheck"})
        .done(function(data)
        {
        	app.internetOnline = true;
        	app.serverOnline = true;
        	app.loggedIn = data.loggedIn;
        	app.verifyCode = data.verifyCode;
        	
        	if (app.loggedIn)
    		{
        		app.showLaunchPage();
    		}
        	else
    		{
        		app.showLoginPage();
    		}
        })
        .fail(function(data)
        {
        	processFailedAjaxCall(data);
        });
    	
    },
    
    doClassicLogin: function()
    {
    	var email = $("#login-email").val();
    	var password = $("#login-password").val();
        $.post("https://test-dot-playinitium.appspot.com/ServletUserControl?suctype=login", {suctype:"login", email:email, password:password, ajax:true})
        .done(function(data)
        {
      	  	if (data.error)
  	  		{
      	  		$("#login-error-message").text(data.error);
      	  		return;
  	  		}
  	  		$("#login-error-message").text("");
        	app.internetOnline = true;
        	app.serverOnline = true;
        	app.loggedIn = data.loggedIn;
        	app.verifyCode = data.verifyCode;
        	
        	if (app.loggedIn)
    		{
        		app.showLaunchPage();
    		}
        	else
    		{
        		app.showLoginPage();
    		}
        })
        .fail(function(data)
        {
        	if (data.status==500)
        	{
        		app.internetOnline = true;
        		app.serverOnline = false;
        		app.loggedIn = null;
        		
        		setConnectionError("Unable to login to game server. The server had an internal error. Sorry about this!");
        	}
        	else if (data.status>0)
        	{
        		app.internetOnline = true;
        		app.serverOnline = false;
        		app.loggedIn = null;
        		
        		setConnectionError("Unable to connect to game server. The server had an error and may be down.");
        	}
        	else
        	{
        		app.internetOnline = false;
        		app.serverOnline = null;
        		app.loggedIn = null;
        		
        		setConnectionError("Unable to connect to game server. Your internet may be unstable or something may be blocking the connection to our servers. Try disabling wifi?");
        	}
        	
        });
    	
    },
    
    showLoginPage: function()
    {
    	$(".menu-panel").hide();
    	$("#login-panel").show();
    },
    
    showSignupPage: function()
    {
    	$(".menu-panel").hide();
    	$("#signup-panel").show();
    },
    
    showLaunchPage: function()
    {
    	$(".menu-panel").hide();
    	$("#launch-panel").show();
    },
    
    showSoundtrackPage: function()
    {
    	location.href = "soundtrack.html";
    },
    
    
    enterGame: function(){
    	if (app.isPhoneGap()==false)
		{
    		window.location.href = "https://test-dot-playinitium.appspot.com/main.jsp";
		}
    	else if (app.deviceReady)
    	{
	    	showLoadingIndicator();
	    	app.ref = window.open('https://test-dot-playinitium.appspot.com/main.jsp', "_self", 'location=no,hidden=yes');
	    	app.ref.addEventListener('loadstop', hideLoadingIndicator);
	    	app.ref.addEventListener('loaderror', showErrorLoading);
    	}
    	else
    		alert("Game is still initializing, please wait...\nIf you keep getting this message, check your internet connection.");
    },
    
    logout: function()
    {
        $.post("https://test-dot-playinitium.appspot.com/ServletUserControl?suctype=ajaxLogout", {suctype:"ajaxLogout", v:this.verifyCode})
        .done(function(data)
        {
        	app.internetOnline = true;
        	app.serverOnline = true;
        	app.loggedIn = false;
        	app.verifyCode = null
        	
    		app.showLoginPage();
        })
        .fail(function(data)
        {
        	if (data.status==500)
        	{
        		alert("There was a server error when attempting to logout. A server log of the error has been generated.");
    		}
        	else if (data.status>0)
        	{
        		app.internetOnline = true;
        		app.serverOnline = false;
        		app.loggedIn = null;
        		
        		setConnectionError("Unable to connect to game server. The server may be down.");
        	}
        	else
        	{
        		app.internetOnline = false;
        		app.serverOnline = null;
        		app.loggedIn = null;
        		
        		setConnectionError("Unable to connect to game server. Your internet may be unstable or something may be blocking the connection to our servers. Try disabling wifi?");
        	}
        });
    },
    
    onDeviceReady: function() {
        app.deviceReady = true;

        app.initializeConnection();
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


function setConnectionError(msg)
{
	$(".menu-panel").hide();
	$("#initialize-panel").show();
	$("#initialize-status").text(msg);
	$("#initialize-control").html("<a onclick='app.initializeConnection();'>Retry connection</a>");
}


function processFailedAjaxCall(data)
{
	if (data.status==500)
	{
		app.internetOnline = true;
		app.serverOnline = false;
		app.loggedIn = null;
		
		setConnectionError("The game server failed to process your command. The server had an internal error. Sorry about this!");
	}
	else if (data.status>0)
	{
		app.internetOnline = true;
		app.serverOnline = false;
		app.loggedIn = null;
		
		setConnectionError("Unable to connect to game server. The server had an error and may be down.");
	}
	else
	{
		app.internetOnline = false;
		app.serverOnline = null;
		app.loggedIn = null;
		
		setConnectionError("Unable to connect to game server. Your internet may be unstable or something may be blocking the connection to our servers. Try disabling wifi?");
	}
}