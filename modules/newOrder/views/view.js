define(function (require) {

    "use strict";

    var Backbone = require('backbone'),
        Model    = require('newOrder/models/model'),
        Collection  = require('newOrder/collections/collection'),
        tpl      = require('text!newOrder/tpl/tpl.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        model: null,
        collection: null,

        initialize: function(options) {
            if(options) {
                this.model = new Model(options);
                this.fetchDetails();
            }
            else {
                this.model = new Model();
                this.fetchDetails();
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
            this.model.attributes.chef_id = $('#chef_id', this.$el).val();

            this.model.save(null,{
                success: function (data) {
                    document.router.navigate("", {trigger: true, replace: true});
                },
                error: function (data) {
                    $('#msg').html('Failed to save order.');
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