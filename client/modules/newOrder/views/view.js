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
            this.model.attributes.chef_id = $('#chef_id', this.$el).val();

            if(this.model.attributes.order_no == "")
                $('#msg').html('Order cannot be left blank');
            else if(this.model.attributes.chef_id == "")
                $('#msg').html('Chef cannot be left blank');
            else {
                this.model.save(null,{
                    success: function (data) {
                        if(data.attributes.status == 1)
                            document.router.navigate("", {trigger: true, replace: true});
                        self.resetDetails();
                    },
                    error: function (data) {
                        $('#msg').html('Failed to save order.');
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