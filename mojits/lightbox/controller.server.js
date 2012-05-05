/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('lightbox', function(Y, NAME) {

/**
 * The lightbox module.
 *
 * @module lightbox
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

        flush: function(ac, data) {
            ac.assets.addCss('./lightbox.css');
            // rendering the final view
            ac.done(data, {
                view: {
                    name: "index",
                    engine: "hb"
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
                photo, place;

            if (route.id && route.type === 'photo') {
                photo = new Y.PNM.Photo({id: route.id}),

                photo.load(function () {
                    place = photo.get('place');

                    // pushing data into the parent mojit if needed
                    self.pushData('place', {
                        id  : place.get('id'),
                        text: place.toString()
                    });

                    // pushing data to the client.
                    ac.instance.config.place = place.toJSON();

                    self.flush(ac, {
                        photo: Y.merge({title: 'Photo'}, photo.getAttrs([
                            'title', 'largeUrl', 'pageUrl', 'description'
                        ]))
                    });
                });
            }
            else {
                // displaying an empty lightbox
                self.flush(ac, {});
            }
        }

    };

}, '0.0.1', {requires: ['mojito', 'mojito-hb', 'pnm-photo']});
