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

        _flush: function(ac, photos) {
           // ac.assets.addCss('./grid.css');
            // rendering the final view
            ac.done({
                photos: photos
            }, {
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
                requests = new Y.Parallel(),
                place  = new Y.PNM.Place({id: id}),
                photos = new Y.PNM.Photos();

            place.load(requests.add());
            photos.load({place: place}, requests.add());

            requests.done(function () {

                // pushing data into the parent mojit if needed
                self._pushData('place', {
                    id  : place.get('id'),
                    text: place.toString()
                });

                // pushing data to the client.
                ac.instance.config.place = place.toJSON();
                // photos.toJSON() fails because it is also trying to convert
                // the photo.location attribute which is a complex structure
                // ac.instance.config.photos = photos.toJSON();
                // So, I will do my own thing here
                ac.instance.config.photos = photos.map(function (model) {
                    var attrs = model.getAttrs();
                    delete attrs.location;
                    delete attrs.clientId;
                    delete attrs.destroyed;
                    delete attrs.initialized;
                    if (model.idAttribute !== 'id') {
                        delete attrs.id;
                    }
                    return attrs;
                });

                // flushign the html fragment
                self._flush(ac, photos.map(function (photo) {
                    return photo.getAttrs(['id', 'title', 'thumbUrl']);
                }));
            });
        },

        _byText: function (ac, text) {
            var self = this,
                place;

            place = new Y.PNM.Place();
            place.load({text: text}, function () {
                if (place.isNew()) {
                    // TODO: apparently, composite doesn't support 404 error
                    //ac.error({
                    //    code: 404
                    //});
                    // for now lets just flush it
                    self._flush(ac, []);
                } else {
                    // TODO: apparently, composite doesn't support redirect
                    //ac.http.redirect('/places/' + place.get('id') + '/', 302);
                    // for now lets just call _byId
                    self._byId(ac, place.get('id'));
                }
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

            if (route.place && route.type === 'place') {
                // displaying photos by location name
                this._byText(ac, route.place);
            }
            else if (route.id && route.type === 'place') {
                // displaying photos by location id
                this._byId(ac, route.id);
            }
            else {
                // displaying an empty grid
                this._flush(ac, []);
            }
        }

    };

}, '0.0.1', {requires: ['mojito', 'mojito-hb', 'pnm-photos']});
