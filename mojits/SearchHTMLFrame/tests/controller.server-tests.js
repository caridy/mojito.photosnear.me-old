/*
 * Copyright (c) 2011 Yahoo! Inc. All rights reserved.
 */
YUI.add('SearchHTMLFrame-tests', function (Y) {

    var suite = new YUITest.TestSuite('SearchHTMLFrame-tests'),
        Value = YUITest.Mock.Value,
        A     = YUITest.Assert,
        OA    = YUITest.ObjectAssert,

        controller,
        baseConfig;

    baseConfig = {

        // setUp for every testcase
        setUp: function () {
            Global = {};

            controller = Y.clone(Y.mojito.controllers.SearchHTMLFrame);
//            ac = new Y.mojito.MockActionContext({
//                addons: ['config', 'composite', 'assets', 'deploy', 'sx_env']
//            });

            this._setUp();
        },

        // tearDown for every testcase
        tearDown: function () {
            this._tearDown();

            Global = null;
            controller = null;
        },

        // These methods are meant to be overriden
        _setUp:     function () {},
        _tearDown:  function () {}

    };

    createTestCase = function (config) {
        var mergedConfig = Y.merge(baseConfig, config);
        return new YUITest.TestCase(mergedConfig);
    };

    suite.add(
        createTestCase({
            name: 'YUI over SSL',
            'test that all YUI assets added to SearchHTMLFrame are modified if ssl': function () {
                var acMock = {
                        sx_env: {
                            getConfig: function(config) {
                                return (config === 'ssl');
                            }
                        }
                    },
                    originalAssets = [
                        'http://yui.yahooapis.com/combo?3.3.0/build/cssreset/reset-min.css&3.3.0/build/cssfonts/fonts-min.css',
                        'http://yui.yahooapis.com/combo?3.4.0/build/widget-base/assets/skins/sam/widget-base.css&3.4.0/build/widget-stack/assets/skins/sam/widget-stack.css&3.4.0/build/overlay/assets/skins/sam/overlay.css',
                        'http://yui.yahooapis.com/combo?3.4.0/build/yui/yui-min.js&3.4.0/build/yui-base/yui-base-min.js&3.4.0/build/oop/oop-min.js&3.4.0/build/event-custom-base/event-custom-base-min.js&3.4.0/build/querystring-stringify-simple/querystring-stringify-simple-min.js&3.4.0/build/features/features-min.js&3.4.0/build/dom-core/dom-core-min.js&3.4.0/build/dom-base/dom-base-min.js&3.4.0/build/io-base/io-base-min.js&3.4.0/build/selector-native/selector-native-min.js',
                        'http://search.yahoo.com'
                    ],
                    assets;
                // js first
                assets = controller._normalizeAssets(acMock, 'type-here', originalAssets);

                A.isTrue (/^https:\/\/s.yimg.com\/lq\/lib\/yui\/combo/.test(assets[0]), 'The YUI combo URL for CSS should not be modified when type is js on SSL');
                A.isTrue (/^https:\/\/s.yimg.com\/lq\/lib\/yui\/combo/.test(assets[1]), 'The YUI combo URL should be modified when ssl');
                A.isTrue (/^https:\/\/s.yimg.com\/lq\/lib\/yui\/combo/.test(assets[2]), 'The YUI combo URL should be modified when type is js on SSL');
                A.isFalse(/^https:\/\/s.yimg.com\/lq\/lib\/yui\/combo/.test(assets[3]), 'The URL should not be modified when not ssl');
            },
            'test hash routine to avoid duplication': function () {
                var acMock = {},
                    originalAssets = [
                        'foo',
                        'bar',
                        'foo',
                        'http://search.yahoo.com'
                    ],
                    assets;
                // js first
                assets = controller._normalizeAssets(acMock, 'js', originalAssets);
                A.areEqual(3, assets.length, 'Duplicated entries should be removed.');
            },
            'test mapping routine to productionize the assets': function () {
                var acMock = {},
                    originalAssets = assets = [
                        'foo',
                        'bar',
                        'foo',
                        'http://search.yahoo.com'
                    ],
                    assets;

                assets = controller._normalizeAssets(acMock, 'js', originalAssets, {
                    js: {
                        'foo': 'bar'
                    }
                });
                A.areEqual(2, assets.length, 'Mapping and hashing should work together.');

                assets = controller._normalizeAssets(acMock, 'js', originalAssets, {
                    js: {
                        '*': 'bar'
                    }
                });
                A.areEqual(1, assets.length, 'Mapping using a wildcard should produce a single file.');
            }
        })
    );

    YUITest.TestRunner.add(suite);

}, '0.0.1', {requires: ['mojito-test', 'SearchHTMLFrame', 'oop']});
