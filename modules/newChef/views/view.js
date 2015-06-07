define(function (require) {

    "use strict";

    var Backbone = require('backbone'),
        Model    = require('newChef/models/model'),
        tpl      = require('text!newChef/tpl/tpl.html'),

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

            this.model.attributes.chef_name = $('#chef_name', this.$el).val();

            if(this.model.attributes.chef_name == "")
                $('#msg').html('Chef cannot be left blank');
            else {
                this.model.save(null,{
                    success: function (data) {
                        if(data.attributes.status == 1)
                            document.router.navigate("", {trigger: true, replace: true});
                        else
                            document.router.navigate("chefs", {trigger: true, replace: true});
                    },
                    error: function (data) {
                        $('#msg').html('Failed to save chef.');
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
            this.$el.html(template(this.model.attributes));
            return this;
        }
 
    });

});