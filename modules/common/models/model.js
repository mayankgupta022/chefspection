define(function (require) {

    "use strict";

    var Backbone  = require('backbone'),
        server_ip = '172.16.5.37:5000';

    document.serverURL = 'http://' + server_ip + '/';
    var originalSync = Backbone.sync;
    console.log("common");

    Backbone.sync = function (method, model, options) {
        if (method === "read" || method === "create"|| method === "update" || method === "delete") {
            options.dataType = "json";
            if (!options.crossDomain) {
                options.crossDomain = true;
            }

            if (!options.xhrFields) {
                options.xhrFields = {withCredentials:false};
            }

            return originalSync(method, model, options);
        }
    };

});