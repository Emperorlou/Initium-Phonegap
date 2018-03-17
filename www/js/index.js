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
                  $.post("https://www.playinitium.com/ServletUserControl?type=ajaxOAuth", {type:"ajaxOAuth", token:obj.idToken})
                  .done(function(data){
                	  alert(JSON.stringify(data));
                  })
                  .fail(function(data){
                	  alert("Error: "+JSON.stringify(data));
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
    	this._login();
    },

    onMainMenu: function()
    {
    	$(".menu-panel").hide();
    	$("#buttons-panel").show();
    },
    
    checkIfLoggedIn: function()
    {
        $.post("https://www.playinitium.com/ServletUserControl?type=ajaxLoginCheck", {type:"ajaxLoginCheck"})
        .done(function(data)
        {
      	  //TODO
        	this.internetOnline = true;
        	this.serverOnline = true;
        	this.loggedIn = data.loggedIn;
        	
        	if (this.loggedIn)
    		{
        		this.showLaunchPage();
    		}
        	else
    		{
        		this.showLoginPage();
    		}
        })
        .fail(function(data)
        {
        	if (data.status>0)
        	{
        		this.internetOnline = true;
        		this.serverOnline = false;
        		this.loggedIn = null;
        		
        		setConnectionError("Unable to connect to game server. The server may be down.");
        	}
        	else
        	{
        		this.internetOnline = false;
        		this.serverOnline = null;
        		this.loggedIn = null;
        		
        		setConnectionError("Unable to connect to game server. Your internet may be unstable or something may be blocking the connection to our servers. Try disabling wifi?");
        	}
        	
        	// TODO: Temp
        	app.showLoginPage();
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
    
    _login: function(){
    	$(".menu-panel").hide();
    	$("#login-panel").show();
    },
    
    enterGame: function(){
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
	$("#initialize-status").text(msg);
	$("#initialize-control").html("<a onclick='app.initializeConnection();'>Retry connection</a>");
}
