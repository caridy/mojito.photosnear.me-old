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

            var data   = this.config.data || {},
                place  = new Y.PNM.Place(data.place),
                photos = new Y.PNM.Photos().reset(data.photos || []);

            new Y.PNM.App({
                container    : '#wrap',
                viewContainer: '#main',
                transitions  : false,
                serverRouting: true,
                place        : place,
                photos       : photos,
                mojitProxy   : this.mojitProxy
            });

        }

    };

}, '0.0.1', {requires: ['mojito-client', 'pnm-app']});
