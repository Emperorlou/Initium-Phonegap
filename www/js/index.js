var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        var ref = window.open('http://www.playinitium.com/login.jsp', '_blank', 'location=no')
    }
};
