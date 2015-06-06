define(function (require) {

    "use strict";

    var Backbone = require('backbone'),
        Model    = require('review/models/model'),
        tpl      = require('text!review/tpl/tpl.html'),

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

            this.model.attributes.order_no = $('#order_no', this.$el).val();
            this.model.attributes.restaurant_id = $('#restaurant_id', this.$el).val();
            this.model.attributes.feedback = $('#feedback', this.$el).val();

            this.model.save(null,{
                success: function (data) {
                    document.router.navigate("", {trigger: true, replace: true});
                },
                error: function (data) {
                    $('#msg').html('Failed to save review.');
                }
            });

        },

        resetDetails: function() {
            var self = this;

            $('#msg').html('');
            $('input').val('');
            $('textarea').val('');
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