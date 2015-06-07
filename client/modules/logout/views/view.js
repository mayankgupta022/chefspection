define(function (require) {

    "use strict";

    var Backbone = require('backbone'),
        model    = require('logout/models/model');

    return Backbone.View.extend({

        initialize: function() {
            this.render();
        },

        logout: function() {
            var logout = new model();
            logout.save();
            console.log("logout");
            document.router.navigate("", {trigger: true});
        },

        render: function () {
            this.logout();
            return this;
        }

    });

});