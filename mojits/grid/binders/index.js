/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('gridBinderIndex', function(Y, NAME) {

/**
 * The gridBinderIndex module.
 *
 * @module gridBinderIndex
 */

    var views = YUI.namespace('Env.PNM.VIEWS'),
        data  = YUI.namespace('Env.PNM.DATA');

    /**
     * Constructor for the gridBinderIndex class.
     *
     * @class gridBinderIndex
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
            // storing models
            if (this.config.place) {
                data.place = new Y.PNM.Place(this.config.place);
            }
            data.photos = new Y.PNM.Photos().reset(this.config.photos || []);
        },

        /**
         * The binder method, invoked to allow the mojit to attach DOM event
         * handlers.
         *
         * @param node {Node} The DOM node to which this mojit is attached.
         */
        bind: function(node) {
            Y.log ('bind', 'info', NAME);

            // removing the node from the DOM in preparation for view rendering
            node.remove();

            // adding the view into the global PNM register
            views.grid = this.getViewInstance(node);
        },

        getViewInstance: function (node) {
            var view;
            if (this.config.place) {
                view = new Y.PNM.GridView({
                    container: node,
                    place    : data.place,
                    photos   : data.photos
                });
            }
            return ( view ? { instance: view } : view );
        }

    };

}, '0.0.1', {requires: ['mojito-client', 'pnm-grid-view', 'pnm-photos', 'pnm-place']});
