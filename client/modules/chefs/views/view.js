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
                    if(data.models.length!=0 && data.models[0].attributes.status == 1)
                        document.router.navigate("", {trigger: true, replace: true});
                    else
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