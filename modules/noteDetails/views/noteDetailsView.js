define(function (require) {

    "use strict";

    var Backbone = require('backbone'),
        Model    = require('noteDetails/models/noteDetailsModel'),
        tpl      = require('text!noteDetails/tpl/noteDetailsTpl.html'),

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
            "click #delete" : "deleteDetails"
        },

        submitDetails: function() {
            var self = this;

            $('#msg').html('');

            this.model.attributes.title = $('#title', this.$el).val();
            this.model.attributes.description = $('#description', this.$el).val();

            this.model.save(null,{
                success: function (data) {
                    document.router.navigate("", {trigger: true, replace: true});
                },
                error: function (data) {
                    $('#msg').html('Failed to save details.');
                }
            });

        },

        deleteDetails: function() {
            var self = this;

            $('#msg').html('');

            this.model.destroy({
                success: function (data) {
                    document.router.navigate("", {trigger: true, replace: true});
                },
                error: function (data) {
                    $('#msg').html('Failed to save details.');
                }
            });

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