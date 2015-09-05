var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onPlayGame: function() {
        //var ref = window.location = "http://www.playinitium.com/login.jsp"
        var ref = window.open('http://www.playinitium.com/login.jsp', '_blank', 'location=no,')
        ref.resizeTo(window.innerHeight, window.innerWidth)
    },

    onDeviceReady: function() {
        //var ref = window.open('http://www.playinitium.com/login.jsp', '_blank', 'location=no')
    },

    changeScreenSize: function(w,h){
        window.resizeTo (w,h)
    },

    onSettings: function() {
        window.alert("This should go to Settings")
    },

    exitFromApp: function() {
        navigator.app.exitApp()
    }
};
