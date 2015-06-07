define(function (require) {

    "use strict";

    var Backbone = require('backbone'),
        Model    = require('restaurant/models/model'),
        tpl      = require('text!restaurant/tpl/tpl.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        model: null,

        initialize: function(options) {
            if(options) {
                this.model = new Model(options);
                this.fetchDetails();
            }
            else {                
                this.render();
            }
        },

        events: {
            "click #submit" : "submitDetails",
            "click #reset" : "resetDetails",
            "keydown input" : "onkeydown"
        },

        onkeydown: function(e) {
            var code = e.keyCode || e.which;
            if(code === 13) 
                this.submitDetails();
        },

        submitDetails: function() {
            var self = this;

            $('#msg').html('');

            this.model = new Model();

            this.model.attributes.restaurant_name = $('#restaurant_name', this.$el).val();
            this.model.attributes.owner = $('#owner', this.$el).val();
            this.model.attributes.password = $('#password', this.$el).val();

            if(this.model.attributes.restaurant_name == "")
                $('#msg').html('Restaurant cannot be left blank');
            else if(this.model.attributes.owner == "")
                $('#msg').html('Manager cannot be left blank');
            else if(this.model.attributes.password == "")
                $('#msg').html('Password cannot be left blank');
            else {
                this.model.save(null,{
                    success: function (data) {                    
                        self.resetDetails();
                    },
                    error: function (data) {
                        $('#msg').html('Failed to save restaurant.');
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
            this.$el.html(template());
            return this;
        }
 
    });

});