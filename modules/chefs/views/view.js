define(function (require) {

    "use strict";

    var Backbone    = require('backbone'),
        Collection  = require('chefs/collections/collection'),
        tpl         = require('text!chefs/tpl/tpl.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        collection: null,

        initialize: function() {
            this.render();
        },

        render: function () {
            var self = this;

            this.collection = new Collection();
            this.collection.fetch({
                success: function (data) {
                        self.$el.html(template(self.collection));
                },
                error: function (data, response, options) {
                    console.log('Failed to load details.');
                }
            });

            return this;
        }
 
    });

});