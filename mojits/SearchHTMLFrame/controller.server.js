/*
 * Copyright (c) 2011 Yahoo! Inc. All rights reserved.
 */
YUI.add('SearchHTMLFrame', function (Y, NAME) {

    Y.mojito.controllers[NAME] = {

        index: function(ac) {
            this.__call(ac);
        },

        /*
          This is a super hack to be able to productionize the assets right before generating the
          corresponding markup. We will analyze each entry, hashing them to avoid duplication, and
          replacing some of them when needed according to the mapping definition that any child
          can define. The use of the "*" wildcard will allow us to replace all of them by a single asset.
        */
        _normalizeAssets: function (ac, type, assets, mapping) {
            var ssl = ac.sx_env && ac.sx_env.getConfig('ssl'),
                hash = {},
                force, keys;
            // getting some performance boost
            mapping = mapping && mapping[type];
            force = mapping && mapping['*'];
            keys = Y.Object.keys(mapping || {});

            // analyzing each asset
            Y.each(assets, function (asset, index) {
                // if we should force it beacuse of the wildcard "*", then replace the asset url
                if (force) {
                    asset = force;
                } else if (Y.Array.indexOf(keys, asset) > -1) {
                    asset = mapping[keys[Y.Array.indexOf(keys, asset)]];
                }

// TODO: one more hack, this time removing any combo url included by mojito
// and we want to just use the seed plus the loader to rely on the browser
if (type === 'js' && (asset.indexOf("http://yui.yahooapis.com/combo") === 0)) {
    asset = "http://yui.yahooapis.com/combo?3.5.0/build/yui/yui-min.js";
}

                // If this request is coming over SSL, use YUI over SSL
                if (ssl) {
                    asset = asset.replace(/^http:\/\/yui.yahooapis.com\/combo/, 'https://s.yimg.com/lq/lib/yui/combo');
                }

// TODO: one more hack, this time fixing the issue with mojito and the '*' computation
if (type === 'blob') {
    asset = asset.replace("YUI().use('*', function(Y) {",
    // overriding the core definition by mojito
    "YUI_config.core=['get','features','intl-base','yui-log','yui-later','loader-base','loader-rollup','loader-yui3'];" +
    // all the regular yui configs
    "YUI_config.bootstrap=true;" +
    "YUI_config.combine=true;" +
    "var MOJITO_USE=new Date().getTime();" +
    // regular mojito-client instantiation
    "YUI().use('mojito-client', function(Y) {\n" +
    // this is THE HACK: it does bypass the mojito loader feature to avoid loading
    // the "NEEDS" collection per each mojitBinder in the page, and it will rely on
    // YUI().use statement instead.
    "Y.mojito.Loader=function(){this.load=function(needs,callback){callback();};};");
}

                hash[asset] = true;
            });
            // we use the hash to make sure that we don't include the same files twice.
            return Y.Object.keys(hash);
        },

        __call: function(ac) {

            // Grab the "child" from the config an add it as the
            // only item in the "children" map.
            var child = ac.config.get('child'),
                self = this,
                cfg;

            // Map the action to the child
            child.action = child.action || ac.action;

            // augmenting the child definition, usually augmenting the params from
            // the route definition to add more internal params like assetsMapping
            // this assetsMapping will be use to productionize the assets at the end
            // of the execution.
            child.params = ac.composite.command.params || {};
            child.params.assetsMapping = {
                js: {},
                css: {}
            };

            // Create a config object for the composite addon
            cfg = {
                children: {
                    child: child
                },
                assets: ac.config.get('assets')
            };
            Y.log('executing SearchHTMLFrame child', 'mojito', 'qeperf');

            // Now execute the child as a composite
            ac.composite.execute(cfg, function(data, meta) {

                // Make sure we have meta
                meta.http = meta.http || {};
                meta.http.headers = meta.http.headers || {};

                // Make sure our Content-type is HTML
                meta.http.headers['content-type'] = 'text/html; charset="utf-8"';

                // Set the default data
                data.title = (meta.common && meta.common.title) || ac.config.get('title') || 'Powered by Mojito '+Y.mojito.version;
                data.mojito_version = Y.mojito.version;
                data.dir = ac.context.dir || 'ltr';
                data.lang = ac.context.lang;

                // Add all the assets we have been given to our local store
                ac.assets.addAssets(meta.assets);

                // If we are deploying to the client get all the assets required
                if (ac.config.get('deploy') === true) {
                    ac.deploy.constructMojitoClientRuntime(ac.assets, meta.binders);
                }
                ac.shaker.run(meta);

                // Attach assets found in the "meta" to the page
                Y.Object.each(ac.assets.getAssets(), function(types, location) {
                    if (! data[location]) {
                        data[location] = '';
                    }
                    Y.Object.each(types, function(assets, type) {
                        // applying some extra normalization process for search
                        assets = self._normalizeAssets(ac, type, assets, child.params.assetsMapping);
                        // generating the html tag
                        data[location] += renderListAsHtmlAssets(assets, type);
                    });
                });

                meta.view = {name:'index'};

                Y.log('SearchHTMLFrame done()', 'mojito', 'qeperf');

                ac.done(data, meta);
            });
        }
    };

    var renderListAsHtmlAssets = function(list, type) {
        var i, data = '';

        if ('js' === type) {
            for (i=0; i<list.length; i++) {
                data += '<script type="text/javascript" src="' + list[i] + '"></script>\n';
            }
        }
        else if ('css' === type) {
            for (i=0; i<list.length; i++) {
                data += '<link rel="stylesheet" type="text/css" href="' + list[i] + '"/>\n';
            }
        }
        else if ('blob' === type) {
            for (i=0; i<list.length; i++) {
                data += list[i] + '\n';
            }
        }
        else {
            Y.log('Unknown asset type "' + type + '". Skipped.', 'warn', NAME);
        }

        return data;
    };

}, '0.1.0', {requires: ['mojito-assets-addon', 'mojito-deploy-addon', 'mojito-config-addon', 'sx-env-addon']});
