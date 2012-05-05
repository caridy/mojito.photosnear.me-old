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

    var views = YUI.namespace('Env.PNM.VIEWS'),
        data  = YUI.namespace('Env.PNM.DATA');

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
            Y.log ('bind', 'info', NAME);

            // try { Typekit.load(); } catch (e) {}
            this.app = new Y.PNM.App({
                place : data.place || new Y.PNM.Place(),
                photo : data.photo,
                photos: data.photos,
                views : views,

                container    : '#wrap',
                viewContainer: '#main',
                transitions  : false,
                serverRouting: true
            });

            if (data.photos.isEmpty()) {
                this.app.loadPhotos();
            }

            // if there is at least one of the default views ready, we should show it
            Y.Array.some(['lightbox', 'grid'], function (viewName) {
                if (views[viewName]) {
                    this.app.showView(views[viewName].instance, null, {transition: false});
                    return true; // stopping looking
                }
            }, this);

            // @caridy: not so sure why I need to force to render here,
            // in the original implementation the render gets executed
            // automatically.
            this.app.render();
        }

    };

}, '0.0.1', {requires: ['mojito-client', 'pnm-app']});