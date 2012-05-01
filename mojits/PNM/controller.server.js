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
                params = (ac.params.params && ac.params.params.route) || {},
                page   = params.page || 'loading',
                id     = params.id,
                pushData = {};

            // adding basic meta-data on each page
            Y.each(metas, function (m) {
                ac.assets.addBlob('<meta name="'+m.name+'" content="'+m.content+'" />', 'top');
            });
            ac.assets.addCss('./style.css');
            ac.assets.addJs('./vendor/ios-orientationchange-fix.js');

            // defining the children structure
            // for composite execution
            ac.instance.config.children = {
                "body": {
                    "type": "PNM",
                    "action": page,
                    // we pass data into the child mojit just like
                    // we do with the regular routes, and it will
                    // not be sent to the client side as part of the
                    // payload, so, it is secure.
                    "params": {
                        "route": {
                            "id": id
                        },
                        "pushData": function (name, value) {
                            // pushData is accessible from children, so new
                            // data can be pushed into the parent mojit.
                            // In this case we just pass it to the client.
                            ac.instance.config[name] = value;
                        }
                    }
                }
            };
            ac.instance.config.foo = {};
            // piping the flickr configuration into the binder config
            ac.instance.config.flickr = ac.config.getDefinition('flickr');
            
            // setting up the global app id so it works the same way in the server
            // and in the client. This is to avoid changing Eric's code.
            YUI.namespace('Env.Flickr').API_KEY = ac.instance.config.flickr.api_key;

            // executing the child mojit->action, passing
            // the corresponding id
            ac.composite.done({
                template: {}
            });
        },

        /**
         * Method corresponding to the 'loading' action.
         *
         * @param ac {Object} The ActionContext that provides access
         *        to the Mojito API.
         */
        loading: function(ac) {
            var route    = (ac.params.params && ac.params.params.route) || {},
                pushData = (ac.params.params && ac.params.params.pushData);

            // pushing data into the parent mojit
            pushData('data', {
                located: false,
                place: null
            });
            ac.done({}, {
                view: {
                    "name": 'loading',
                    "engine": 'hb',
                    "content-path": __dirname+"/views/loading.hb.html"
                }
            });
        },

        /**
         * Method corresponding to the 'places' action.
         *
         * @param ac {Object} The ActionContext that provides access
         *        to the Mojito API.
         */
        place: function(ac) {
            var route    = (ac.params.params && ac.params.params.route) || {},
                pushData = (ac.params.params && ac.params.params.pushData),
                place    = new Y.PNM.Place({id: route.id}),
                photos   = new Y.PNM.Photos(),
                requests = new Y.Parallel();

            place.load(requests.add());
            photos.load({place: place}, requests.add());

            requests.done(function () {
                // pushing data structure into the parent mojit to be sent
                // to the client side via binder
                pushData('data', {
                    located: true,

                    place: {
                        id  : place.get('id'),
                        text: place.toString()
                    },

                    initialData: {
                        place : place,
                        photos: photos
                    }
                });

                // producing html content per photo
                ac.done({
                    photos: photos.map(function (photo) {
                        return photo.getAttrs(['id', 'clientId', 'thumbUrl']);
                    })
                }, {
                    view: {
                        "name": 'place',
                        "engine": 'hb',
                        "content-path": __dirname+"/views/place.hb.html"
                    }
                });
            });
        },

        /**
         * Method corresponding to the 'photos' action.
         *
         * @param ac {Object} The ActionContext that provides access
         *        to the Mojito API.
         */
        photo: function(ac) {
            var route    = (ac.params.params && ac.params.params.route) || {},
                pushData = (ac.params.params && ac.params.params.pushData),
                photo = new Y.PNM.Photo({id: route.id}),
                place;

            photo.load(function () {
                place = photo.get('place');

                // pushing data structure into the parent mojit to be sent
                // to the client side via binder
                pushData('data', {
                    located: true,

                    place: {
                        id  : place.get('id'),
                        text: place.toString()
                    },

                    initialData: {
                        place: place
                    }
                });
                ac.done({
                    photo: Y.merge({title: 'Photo'}, photo.getAttrs([
                        'title', 'largeUrl', 'pageUrl', 'description'
                    ]))
                }, {
                    view: {
                        "name": 'photo',
                        "engine": 'hb',
                        "content-path": __dirname+"/views/photo.hb.html"
                    }
                });
            });
        }

    };

}, '0.0.1', {requires: ['mojito', 'pnm-place', 'pnm-photo']});
