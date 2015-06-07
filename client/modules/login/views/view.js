define(function (require) {

    "use strict";

    var Backbone = require('backbone'),
        Model    = require('login/models/model'),
        tpl      = require('text!login/tpl/tpl.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        model: null,

        initialize: function(options) {
            if(options) {
                this.model = new Model(options);
                this.fetchDetails();
            }
            else {
                this.model = new Model();
                this.render();
            }
        },

        events: {
            "click #submit" : "submitDetails",
            "click #reset" : "resetDetails"
        },

        submitDetails: function() {
            var self = this;

            $('#msg').html('');

            this.model.attributes.restaurant_name = $('#restaurant_name', this.$el).val();
            this.model.attributes.password = $('#password', this.$el).val();

            if(this.model.attributes.restaurant_name == "")
                $('#msg').html('Restaurant cannot be left blank');
            else if(this.model.attributes.password == "")
                $('#msg').html('Password cannot be left blank');
            else {
                this.model.save(null,{
                    success: function (data) {
                        if (data.attributes.status !== 1)
                            document.router.navigate("chefs", {trigger: true, replace: true});
                        else
                            $('#msg').html('Failed to login.');
                    },
                    error: function (data) {
                        $('#msg').html('Failed to login.');
                    }
                });
            }

        },

        resetDetails: function() {
            var self = this;

            $('#msg').html('');
            $('input').val('');
        },

        fetchDetails: function() {
            var self = this;

            this.model.fetch({
                success: function (data) {
                        self.render();
                },
                error: function (data) {
                    self.render();
                    $('#msg').html('Failed to load details.');
                }
            });

        },

        render: function () {
            this.$el.html(template(this.model.attributes));
            return this;
        }
 
    });

});