define(function (require) {

    "use strict";

    var Backbone    = require('backbone'),
        Model       = require('review/models/model'),
        Collection  = require('review/collections/collection'),
        tpl         = require('text!review/tpl/tpl.html'),

        template    = _.template(tpl);

    return Backbone.View.extend({

        model: null,
        collection: null,

        initialize: function(options) {
            if(options) {
                this.model = new Model(options);
                this.fetchDetails();
            }
            else {                
                this.fetchDetails();
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

            this.model.attributes.order_no = $('#order_no', this.$el).val();
            this.model.attributes.restaurant_id = $('#restaurant_id', this.$el).val();
            this.model.attributes.feedback = $('#feedback', this.$el).val();

            if(this.model.attributes.order_no == "")
                $('#msg').html('Order cannot be left blank');
            else if(this.model.attributes.restaurant_id == "")
                $('#msg').html('Restaurant cannot be left blank');
            else if(this.model.attributes.feedback == "")
                $('#msg').html('Feedback cannot be left blank');
            else {
                this.model.save(null,{
                    success: function (data) {
                        self.resetDetails();
                    },
                    error: function (data) {
                        $('#msg').html('Failed to save review.');
                    }
                });
            }

        },

        resetDetails: function() {
            var self = this;

            $('#msg').html('');
            $('input').val('');
            $('textarea').val('');
        },

        fetchDetails: function() {
            var self = this;

            this.collection = new Collection();
            this.collection.fetch({
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
            this.$el.html(template(this.collection));
            return this;
        }
 
    });

});