define(function (require) {

    "use strict";

    var Backbone = require('backbone');
        
    return Backbone.Model.extend({

    	urlRoot: document.serverURL,       

        initialize: function(options) {
        	if(options)
	    		this.createUrl(options.id);
	    	else
	    		this.createUrl();
        },

        createUrl: function(id) {
        	if(id) {
	        	this.url = this.urlRoot + 'login/' + id;
	        	this.idAttribute = id;
	        }
	        else
	        	this.url = this.urlRoot + 'login';
        }

    });

});