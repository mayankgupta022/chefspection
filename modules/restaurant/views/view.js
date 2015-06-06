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
            this.model.attributes.owner = $('#owner', this.$el).val();

            this.model.save(null,{
                success: function (data) {
                    document.router.navigate("", {trigger: true, replace: true});
                },
                error: function (data) {
                    $('#msg').html('Failed to save restaurant.');
                }
            });

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