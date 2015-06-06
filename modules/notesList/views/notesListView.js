define(function (require) {

    "use strict";

    var Backbone    = require('backbone'),
        Collection  = require('notesList/collections/notesListCollection'),
        tpl         = require('text!notesList/tpl/notesListTpl.html'),

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