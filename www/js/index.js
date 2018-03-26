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
	loggedInEmail:null,
	characterName:null,
	verifyCode:null,
	
	isPhonegap: function() {
		if (window.cordova)
			return true;
		else
			return false;
	},
	
    initialize: function() {
        this.bindEvents();
        
        updateGUIState();
    },

    initializeConnection: function()
    {
    	$("#initialize-status").text("Connecting to server...");
    	$("#initialize-control").html("<img src='images/wait.gif'/>");
    	
    	this.internetOnline = null;
    	this.loggedIn = null;
    	this.loggedInEmail = null;
    	
    	this.internetConnected = window.navigator.onLine;
    	
    	if (this.internetConnected == false)
    	{
    		setConnectionError("You are not connected to the internet.");
    		return;
    	}
    	
        this.checkIfLoggedIn();
        updateGUIState();
    },
    
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('menubutton', shutdownGame, false);
    },

    onAjaxOAuthLogin: function()
    {
        window.plugins.googleplus.logout();
        window.plugins.googleplus.login(
				window.loginConfig,
				function (obj) {
				  $.post("https://www.playinitium.com/ServletUserControl?suctype=ajaxOAuth", {suctype:"ajaxOAuth", token:obj.idToken})
				  .done(function(data){
			      	  	if (data.error)
			  	  		{
			      	  		$("#login-error-message").text(data.error);
			      	  		return;
			  	  		}
			  	  		clearErrorMessages();
						app.internetOnline = true;
						app.serverOnline = true;
						app.loggedIn = data.loggedIn;
						app.verifyCode = data.verifyCode;
						app.characterName = data.characterName;
						
				        updateGUIState();
						
				        if (app.loggedIn && app.characterName==null)
				        {
				        	app.showNewCharacterPage();
				        }
				        else if (app.loggedIn)
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
    	if (app.isPhonegap()==false)
		{
    		window.location.href = "https://www.playinitium.com/ServletUserControl?suctype=oauth&authType=google";
		}
    	else if (app.deviceReady)
    	{
	    	showLoadingIndicator();
	    	app.ref = window.open('https://www.playinitium.com/ServletUserControl?suctype=oauth&authType=google', "_self", 'location=no,hidden=yes');
	    	app.ref.addEventListener('loadstop', hideLoadingIndicator);
	    	app.ref.addEventListener('loaderror', showErrorLoading);
    	}
    	else
    		alert("Game is still initializing, please wait...\nIf you keep getting this message, check your internet connection.");
        updateGUIState();
    },
    
    
    onMainMenu: function()
    {
    	$(".menu-panel").hide();
    	$("#buttons-panel").show();
    },
    
    checkIfLoggedIn: function()
    {
        $.post("https://www.playinitium.com/ServletUserControl?suctype=ajaxLoginCheck", {suctype:"ajaxLoginCheck"})
        .done(function(data)
        {
        	app.internetOnline = true;
        	app.serverOnline = true;
        	app.loggedIn = data.loggedIn;
        	app.loggedInEmail = data.loggedInEmail;
    		app.characterName = data.characterName;
        	app.verifyCode = data.verifyCode;
            updateGUIState();

        	
            if (app.loggedIn && characterName==null)
        	{
            	app.showNewCharacterPage();
        	}
            else if (app.loggedIn)
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
    	clearErrorMessages();
  		
    	var email = $("#login-email").val();
    	var password = $("#login-password").val();
        $.post("https://www.playinitium.com/ServletUserControl?suctype=login", {suctype:"login", email:email, password:password, ajax:true})
        .done(function(data)
        {
      	  	if (data.error)
  	  		{
      	  		$("#login-error-message").text(data.error);
      	  		return;
  	  		}
      	  	clearErrorMessages();
        	app.internetOnline = true;
        	app.serverOnline = true;
        	app.loggedIn = data.loggedIn;
        	app.loggedInEmail = data.loggedInEmail;
    		app.characterName = data.characterName;
        	app.verifyCode = data.verifyCode;
            updateGUIState();
        	
            if (app.loggedIn && characterName==null)
        	{
            	app.showNewCharacterPage();
        	}
            else if (app.loggedIn)
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
    
    doClassicSignup: function()
    {
    	clearErrorMessages();
    	var characterName = $("#signup-characterName").val();
    	var email = $("#signup-email").val();
    	var password = $("#signup-password").val();
        $.post("https://www.playinitium.com/ServletUserControl?suctype=signup", {suctype:"signup", characterName:characterName, email:email, password:password, ajax:true})
        .done(function(data)
        {
      	  	if (data.error)
  	  		{
      	  		$("#signup-error-message").text(data.error);
      	  		return;
  	  		}
      	  	clearErrorMessages();
        	app.internetOnline = true;
        	app.serverOnline = true;
        	app.loggedIn = data.loggedIn;
        	app.loggedInEmail = data.loggedInEmail;
    		app.characterName = data.characterName;
        	app.verifyCode = data.verifyCode;
        	
            updateGUIState();
        	
            if (app.loggedIn && characterName==null)
        	{
            	app.showNewCharacterPage();
        	}
            else if (app.loggedIn)
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
    
    doResetPassword: function()
    {
    	clearErrorMessages();
    	var email = $("#reset-password-email").val();
        $.post("https://www.playinitium.com/ServletUserControl?suctype=resetPassword", {suctype:"resetPassword", email:email, ajax:true})
        .done(function(data)
        {
      	  	if (data.error)
  	  		{
      	  		$("#resetpassword-error-message").text(data.error);
      	  		return;
  	  		}
      	  	clearErrorMessages();
      	  	
      	  	$("#reset-password-message").text("An email has been sent to "+email+". Please check that email's inbox for password reset instructions. If you haven't received anything yet, be sure to check your spam folder.");
      	  	
            updateGUIState();
        	
        })
        .fail(function(data)
        {
        	processFailedAjaxCall(data);        	
        });
    	
    },
    
    doNewCharacter: function()
    {
    	if (app.verifyCode==null) $("#new-character-error-message").text("You have to be logged in first.");
    	clearErrorMessages();
    	var name = $("#new-character-name").val();
        $.post("https://www.playinitium.com/ServletUserControl?suctype=newcharacter", {suctype:"newcharacter", name:name, v:app.verifyCode, ajax:true})
        .done(function(data)
        {
      	  	if (data.error)
  	  		{
      	  		$("#new-character-error-message").text(data.error);
      	  		return;
  	  		}
      	  	clearErrorMessages();

        	app.internetOnline = true;
        	app.serverOnline = true;
        	app.loggedIn = data.loggedIn;
        	app.loggedInEmail = data.loggedInEmail;
    		app.characterName = data.characterName;
        	app.verifyCode = data.verifyCode;
      	  	
            updateGUIState();
            
            if (app.loggedIn==false)
            	app.showLoginPage();
            else if (app.characterName!=null)
            	app.showLaunchPage();
        	
        })
        .fail(function(data)
        {
        	processFailedAjaxCall(data);        	
        });
    	
    },
    
    showNewCharacterPage: function()
    {
    	$(".menu-panel").hide();
    	$("#new-character-panel").show();
    },
    
    showResetPasswordPage: function()
    {
    	$(".menu-panel").hide();
    	$("#reset-password-panel").show();
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
    	if (app.isPhonegap()==false)
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
    
    logout: function()
    {
        $.post("https://www.playinitium.com/ServletUserControl?suctype=ajaxLogout", {suctype:"ajaxLogout", v:this.verifyCode})
        .done(function(data)
        {
        	app.internetOnline = true;
        	app.serverOnline = true;
        	app.loggedIn = false;
        	app.loggedInEmail = null;
    		app.characterName = null;
        	app.verifyCode = null
            updateGUIState();
        	
    		app.showLoginPage();
        })
        .fail(function(data)
        {
        	processFailedAjaxCall(data);
        });
        window.plugins.googleplus.logout();
    },
    
    onDeviceReady: function() {
        app.deviceReady = true;

        window.navigationbar.setUp(true);
        
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
		app.loggedInEmail = null;
		app.characterName = null;
		
		setConnectionError("The game server failed to process your command. The server had an internal error. Sorry about this!");
	}
	else if (data.status>0)
	{
		app.internetOnline = true;
		app.serverOnline = false;
		app.loggedIn = null;
		app.loggedInEmail = null;
		app.characterName = null;
		
		setConnectionError("Unable to connect to game server. The server had an error and may be down.");
	}
	else
	{
		app.internetOnline = false;
		app.serverOnline = null;
		app.loggedIn = null;
		app.loggedInEmail = null;
		app.characterName = null;
		
		setConnectionError("Unable to connect to game server. Your internet may be unstable or something may be blocking the connection to our servers. Try disabling wifi?");
	}

	updateGUIState();
}

function clearErrorMessages()
{
	$("#login-error-message").text("");
	$("#signup-error-message").text("");
	$("#reset-password-error-message").text("");
}

function updateGUIState()
{
	var body = $("body");
	body.removeClass();
	
	if (app.isPhonegap()==true)
		body.addClass("state-phonegap");
	if (app.internetOnline==true)
		body.addClass("state-internetOnline");
	if (app.serverOnline==true)
		body.addClass("state-serverOnline");
	if (app.loggedIn==true)
		body.addClass("state-loggedIn");
	if (app.characterName!=null)
		body.addClass("state-characterLive");
	
	
	if (app.loggedInEmail!=null)
		$("#logged-in-email").text("Logged in as "+app.loggedInEmail);
	if (app.loggedInEmail==null)
		$("#logged-in-email").text("");
	
	clearErrorMessages();

}



// THIS IS A HACK TO FIX DISAPPEARING FOOTER WHEN KEYBOARD POPS UP
$(document).on('blur', 'input, textarea', function() 
{
	
	if (app.isPhonegap())
	{
		
//		setTimeout(function(){
//			window.navigationbar.show();
//			window.navigationbar.hide();
//			if (AndroidFullScreen)
//				AndroidFullScreen.setSystemUiVisibility(AndroidFullScreen.SYSTEM_UI_FLAG_FULLSCREEN | AndroidFullScreen.SYSTEM_UI_FLAG_LOW_PROFILE);
//		}, 800);
	}
});
