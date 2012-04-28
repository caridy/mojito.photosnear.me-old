YUI.add('pnm-photo', function (Y) {

var Lang  = Y.Lang,
    Place = Y.PNM.Place,
    Photo;

Photo = Y.Base.create('photo', Y.Model, [Y.ModelSync.YQL], {

    cache  : new Y.CacheOffline(),
    query  : 'SELECT * FROM flickr.photos.info WHERE api_key={api_key} AND photo_id={id}',
    imgUrl : 'http://farm{farm}.static.flickr.com/{server}/{id}_{secret}_{size}.jpg',
    pageUrl: 'http://www.flickr.com/photos/{user}/{id}/',

    buildQuery: function () {
        return Lang.sub(this.query, {
            api_key: YUI.namespace('Env.Flickr').API_KEY || '',
            id     : this.get('id')
        });
    },

    parse: function (results) {
        if ( ! results) { return; }

        var photo    = results.photo,
            place    = photo.location,
            country  = place.country,
            region   = place.region,
            locality = place.locality;

        photo.place = {
            woeid    : place.woeid,
            latitude : place.latitude,
            longitude: place.longitude,
            country  : country && country.content,
            region   : region && region.content,
            locality : locality && locality.content
        };

        return photo;
    },

    getImgUrl: function (size) {
        var attrs = this.getAttrs(['id', 'farm', 'server', 'secret']),
            url   = Lang.sub(this.imgUrl, Y.merge(attrs, {size: size}));

        // Append dynamic flag "zz=1" if we are generating the URL.
        if (size === 'z') {
            url += '?zz=1';
        }

        return url;
    },

    // Insired by: Lucas Smith
    // (http://lucassmith.name/2008/11/is-my-image-loaded.html)
    loadImg: function (callback) {
        var img  = new Image(),
            prop = img.naturalWidth ? 'naturalWidth' : 'width';

        Lang.isFunction(callback) || (callback = function () {});

        img.src = this.get('largeUrl');

        if (img.complete) {
            callback.call(this, img[prop] ? img : null);
        } else {
            img.onload  = Y.bind(callback, this, img);
            img.onerror = Y.bind(callback, this, null);
        }
    }

}, {

    ATTRS: {
        farm     : {},
        server   : {},
        secret   : {},
        owner    : {},
        pathalias: {},
        title    : {},
        url_sq   : {},
        url_z    : {},

        place: {
            value : {},
            setter: function (place) {
                (place instanceof Place) || (place = new Place(place));
                return place;
            }
        },

        thumbUrl: {
            readOnly: true,
            getter  : function () {
                return this.get('url_sq') || this.getImgUrl('s');
            }
        },

        largeUrl: {
            readOnly: true,
            getter  : function () {
                return this.get('url_z') || this.getImgUrl('z');
            }
        },

        pageUrl: {
            readOnly: true,
            getter  : function () {
                var user = this.get('pathalias') || this.get('owner');
                
console.log (user);

                return Lang.sub(this.pageUrl, {
                    id  : this.get('id'),
                    user: Lang.isString(user) ? user : user.nsid
                });
            }
        }
    }

});

Y.namespace('PNM').Photo = Photo;

}, '0.5.0', {
    requires: [
        'gallery-model-sync-yql',
        'cache-offline',
        'model',
        'pnm-place',
        'yql'
    ]
});
