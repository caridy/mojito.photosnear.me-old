/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('PNM', function(Y, NAME) {

/**
 * The PNM module.
 *
 * @module PNM
 */

    /**
     * Constructor for the Controller class.
     *
     * @class Controller
     * @constructor
     */
    Y.mojito.controllers[NAME] = {

        init: function(config) {
            this.config = config || {};
        },

        /**
         * Method corresponding to the 'index' action.
         *
         * @param ac {Object} The ActionContext that provides access
         *        to the Mojito API.
         */
        index: function(ac) {
            var metas  = ac.config.getDefinition('metas') || [],
                params = ac.params.params || {},
                route  = params.route || {},
                templateData = {};

            // adding basic meta-data on each page
            Y.each(metas, function (m) {
                ac.assets.addBlob('<meta name="'+m.name+'" content="'+m.content+'" />', 'top');
            });
            ac.assets.addCss('./style.css');
            ac.assets.addJs('./vendor/ios-orientationchange-fix.js');

            // piping the flickr configuration into the binder config
            ac.instance.config.flickr = ac.config.getDefinition('flickr');
            
            // setting up the global app id so it works the same way in the server
            // and in the client. This is to avoid changing Eric's code.
            YUI.namespace('Env.Flickr').API_KEY = ac.instance.config.flickr.api_key;



            // super HACK to create a communication pipeline between the parent mojit
            // and every children
            Y.each(Y.Object.keys(ac.instance.config.children), function (name) {
                var childConfig = ac.instance.config.children[name].config || {};
                // this trick will create a method that will be accessible at the child controller
                // to inject data into the parent mojit configuration and template
                childConfig.pushData = function (name, value) {
                    ac.instance.config[name] = value;
                    templateData[name] = value;
                };
                // piping this back
                ac.instance.config.children[name].config = childConfig;
            });


            // creating the composite view
            ac.composite.done({
                template: templateData
            }, {
                view: {
                    "name": 'index',
                    "engine": 'hb',
                    "content-path": __dirname+"/views/index.hb.html"
                }
            });
        }

    };

}, '0.0.1', {requires: ['mojito']});
