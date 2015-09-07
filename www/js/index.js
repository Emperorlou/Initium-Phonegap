var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onPlayGame: function() {
        //var ref = window.location = "http://www.playinitium.com/login.jsp"
        var ref = window.open('http://www.playinitium.com/main.jsp', '_blank', 'location=no,');
        ref.resizeTo(window.innerHeight, window.innerWidth);
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
