define(function (require) {

    "use strict";

    var Backbone = require('backbone'),
        Model    = require('viewChef/models/model'),
        tpl      = require('text!viewChef/tpl/tpl.html'),

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