var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onPlayGame: function() {
        var ref = window.location="http://www.playinitium.com/login.jsp"
        //var ref = window.open('http://www.playinitium.com/login.jsp', '_blank', 'location=no')
    },

    onDeviceReady: function() {
        //var ref = window.open('http://www.playinitium.com/login.jsp', '_blank', 'location=no')
    }
};
