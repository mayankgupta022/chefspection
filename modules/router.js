define(function (require) {

    "use strict";

    var model       = require('common/models/model'),
        ShellView   = require('shell/views/shell'),
        $body       = $('body'),
        shellView,
        currentView,
        $content;

    return Backbone.Router.extend({

        routes: {
            "": "chefs",
            "chefs": "chefs",
            "login": "login",
            "restaurant": "restaurant",
            "review": "review",
            "chef/new": "newChef",
            "order/new": "newOrder",
            "chef/:id": "viewChef"
        },

        initialize: function () {
            shellView = new ShellView();
            $body.html(shellView.render().el);
            $content = $("#content");
        },

        updateCurrentView: function(newView) {
            //COMPLETELY UNBIND THE VIEW
            if(this.currentView) {
                if(typeof this.currentView.close === "function")
                    this.currentView.close();
                this.currentView.undelegateEvents();
                $(this.currentView.el).removeData().unbind(); 
                //Remove currentView from DOM
                this.currentView.remove();  
                Backbone.View.prototype.remove.call(this.currentView);
            }
            this.currentView= newView;
            this.currentView.delegateEvents(); // delegate events when the view is recycled
        },

        review: function () {
            var self = this;
            require(["review/views/view"], function (Review) {
                var review = new Review();
                self.updateCurrentView(review);
                $(review.el).appendTo($content);
                $(".my-menu").hide();
            });
        },

        login: function () {
            var self = this;
            require(["login/views/view"], function (Login) {
                var login = new Login();
                self.updateCurrentView(login);
                $(login.el).appendTo($content);
                $(".my-menu").hide();
            });
        },

        restaurant: function () {
            var self = this;
            require(["restaurant/views/view"], function (Restaurant) {
                var restaurant = new Restaurant();
                self.updateCurrentView(restaurant);
                $(restaurant.el).appendTo($content);
                $(".my-menu").hide();
            });
        },

        chefs: function () {
            var self = this;
            require(["chefs/views/view"], function (Chefs) {
                var chefs = new Chefs();
                self.updateCurrentView(chefs);
                $(chefs.el).appendTo($content);
                $(".my-menu").show();
            });
        },

        newChef: function () {
            var self = this;
            require(["newChef/views/view"], function (Chef) {
                var chef = new Chef();
                self.updateCurrentView(chef);
                $(chef.el).appendTo($content);
                $(".my-menu").show();
            });
        },

        newOrder: function () {
            var self = this;
            require(["newOrder/views/view"], function (Order) {
                var order = new Order();
                self.updateCurrentView(order);
                $(order.el).appendTo($content);
                $(".my-menu").show();
            });
        },

        viewChef: function (id) {
            var self = this;
            require(["viewChef/views/view"], function (Chef) {
                var chef = new Chef({id:id});
                self.updateCurrentView(chef);
                $(chef.el).appendTo($content);
                $(".my-menu").show();
            });
        },

    });

});