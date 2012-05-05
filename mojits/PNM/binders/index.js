/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('PNMBinderIndex', function(Y, NAME) {

/**
 * The PNMBinderIndex module.
 *
 * @module PNMBinderIndex
 */

    /**
     * Constructor for the PNMBinderIndex class.
     *
     * @class PNMBinderIndex
     * @constructor
     */
    Y.namespace('mojito.binders')[NAME] = {

        /**
         * Binder initialization method, invoked after all binders on the page
         * have been constructed.
         */
        init: function(mojitProxy) {
            Y.log ('init', 'info', NAME);
            this.mojitProxy = mojitProxy;
            this.config = mojitProxy.config;
            // normalization process to match the format of the original PNM
            YUI.namespace('Env.Flickr').API_KEY = this.config.flickr && this.config.flickr.api_key;
        },

        /**
         * The binder method, invoked to allow the mojit to attach DOM event
         * handlers.
         *
         * @param node {Node} The DOM node to which this mojit is attached.
         */
        bind: function(node) {
            // try { Typekit.load(); } catch (e) {}
            var PNMEnv   = YUI.namespace('Env.PNM'),
                data     = YUI.namespace('Env.PNM.DATA'),
                place    = new Y.PNM.Place(data.place),
                photos   = new Y.PNM.Photos().reset(data.photos || []),
                photo    = new Y.PNM.Photo(data.photo),
                viewName = PNMEnv.VIEW,
                views    = {},
                view, app;

            Y.log ('bind', 'info', NAME);

            if (viewName) {
                view = new Y.PNM.App.prototype.views[viewName].type({
                    container: Y.one('#main .' + viewName),
                    place    : place,
                    photos   : photos,
                    photo    : photo
                });

                views[viewName] = {instance: view};
            }

            app = new Y.PNM.App({
                place : place,
                photos: photos,
                views : views,

                container    : '#wrap',
                viewContainer: '#main',
                transitions  : false,
                serverRouting: true
            });

            photos.isEmpty() && app.loadPhotos();
            // @caridy: not so sure why I need to force to render here,
            // in the original implementation the render gets executed
            // automatically.
            app.render();
            view && app.showView(view, null, {transition: false});

        }

    };

}, '0.0.1', {requires: ['mojito-client', 'pnm-app']});