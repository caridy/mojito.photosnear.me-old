/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('grid', function(Y, NAME) {

/**
 * The grid module.
 *
 * @module grid
 */

    /**
     * Constructor for the Controller class.
     *
     * @class Controller
     * @constructor
     */
    Y.mojito.controllers[NAME] = {

        init: function(config) {
            this.config = config;
        },

        flush: function(ac, photos) {
            ac.assets.addCss('./grid.css');
            // rendering the final view
            ac.done({
                photos: photos
            }, {
                view: {
                    "name": 'index',
                    "engine": 'hb',
                    "content-path": __dirname+"/views/grid.hb.html"
                }
            });
        },

        pushData: function (name, value) {
            // this is part of the hack to pipe data into the parent mojit
            if (this.config.pushData) {
                this.config.pushData(name, value);
            }
        },

        /**
         * Method corresponding to the 'index' action.
         *
         * @param ac {Object} The ActionContext that provides access
         *        to the Mojito API.
         */
        index: function(ac) {
            var self     = this,
                params   = (ac.params.params || {}), // yeah, nasty
                route    = params.route || {},
                requests = new Y.Parallel(),
                place, photos;

            if (route.id && route.type === 'place') {
                place  = new Y.PNM.Place({id: route.id}),
                photos = new Y.PNM.Photos(),

                place.load(requests.add());
                photos.load({place: place}, requests.add());

                requests.done(function () {

                    // pushing data into the parent mojit if needed
                    self.pushData('place', {
                        id  : place.get('id'),
                        text: place.toString()
                    });

                    // pushing data to the client.
                    //ac.instance.config.place = place;
                    //ac.instance.config.photos = photos;

                    self.flush(ac, photos.map(function (photo) {
                        return photo.getAttrs(['id', 'clientId', 'thumbUrl']);
                    }));
                });
            }
            else {
                // displaying an empty grid
                self.flush(ac, []);
            }
        }

    };

}, '0.0.1', {requires: ['mojito', 'mojito-hb', 'pnm-photos']});
