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

        _flush: function(ac, data) {
            //ac.assets.addCss('./lightbox.css');
            // rendering the final view
            ac.done(data, {
                view: {
                    name: "index",
                    engine: "hb"
                }
            });
        },

        _pushData: function (name, value) {
            // this is part of the hack to pipe data into the parent mojit
            if (this.config.pushData) {
                this.config.pushData(name, value);
            }
        },

        _byId: function (ac, id) {
            var self     = this,
                photo = new Y.PNM.Photo({id: id}),
                place;

            photo.load(function () {
                place = photo.get('location');

                // pushing data into the parent mojit if needed
                self._pushData('place', {
                    id  : place.get('id'),
                    text: place.toString()
                });

                // pushing data to the client.
                ac.instance.config.place = place.toJSON();
                // photos.toJSON() fails because it is also trying to convert
                // the photo.location attribute which is a complex structure
                // ac.instance.config.photo = photo.toJSON();
                // So, I will do my own thing here
                ac.instance.config.photo = photo.getAttrs();
                delete ac.instance.config.photo.location;
                delete ac.instance.config.photo.clientId;
                delete ac.instance.config.photo.destroyed;
                delete ac.instance.config.photo.initialized;
                if (photo.idAttribute !== 'id') {
                    delete ac.instance.config.photo.id;
                }

                // flushign the html fragment
                self._flush(ac, {
                    photo: Y.merge({title: 'Photo'}, photo.getAttrs([
                        'title', 'largeUrl', 'pageUrl'
                    ]))
                });
            });
        },

        /**
         * Method corresponding to the 'index' action.
         *
         * @param ac {Object} The ActionContext that provides access
         *        to the Mojito API.
         */
        index: function(ac) {
            var params   = (ac.params.params || {}), // yeah, nasty
                route    = params.route || {};

            if (route.id && route.type === 'photo') {
                // displaying photo by id
                this._byId(ac, route.id);
            }
            else {
                // displaying an empty lightbox
                this._flush(ac, {});
            }
        }

    };

}, '0.0.1', {requires: ['mojito', 'mojito-hb', 'pnm-photo']});
