importScripts('/sw/cache-polyfill.js')
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('ontrail').then(function(cache) {
            return cache.addAll([
                // index
                '/',
                '/index.html',

                // manifest ??
                '/manifest.manifest',
                '/#latest',

                // own hosted css
                "/froala/css/froala_editor.min.css",
                "/froala/css/froala_style.min.css",
                "/css/select2.css",
                "/css/pikaday.css",
                "/css/material-trail.css",

                // remote css -- TODO, replace with https
                'http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css',
                'http://fonts.googleapis.com/icon?family=Material+Icons',
                'http://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css',

                // remote fonts
                'http://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/fonts/roboto/Roboto-Regular.woff2',
                'http://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/fonts/roboto/Roboto-Medium.woff2',
                'http://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/fonts/roboto/Roboto-Bold.woff2',
                'http://fonts.gstatic.com/s/materialicons/v31/2fcrYFNaTjcS6g4U3t-Y5RV6cRhDpPC5P4GCEJpqGoc.woff',
                'http://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/fonts/roboto/Roboto-Light.woff2',

                // own hosted images
                '/img/logo.png',
                '/img/login_bg.png',
                '/img/share.jpg',
                '/img/loading.gif',

                // own hosted js
                'js/libs/modernizr-2.5.3.min.js',
                'js/select2.min.js?_=UID',
                'froala/js/froala_editor.min.js',
                'js/moment-locale-fi.js',
                'js/jquery.continuousCalendar-5.0.1-min.js',
                'js/xdate-0.8.js?_=UID"',
                'js/keen.js?_=UID',
                'js/rx.ontrail.js?_=UID',
                'js/rx.ontrail.jquery.js?_=UID',
                'js/rx.ontrail.backend.js?_=UID',
                'js/rx.ontrail.validation.js?_=UID',
                'js/rx.ontrail.pager.js?_=UID',
                'js/rx.ontrail.session.js?_=UID',
                'js/libs/Chart.min.js',
                'js/xdate-0.8.js?_=UID',
                'js/chart.js',
                'js/pikaday.js',
                'js/plugins.js?_=UID',
                'js/ontrail.js?_=UID',

                // remotely hosted js
                'http://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js?_=UID',
                'http://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
                'http://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.0/js.cookie.min.js',
                'http://cdnjs.cloudflare.com/ajax/libs/jquery.address/1.6/jquery.address.min.js?strict=false',
                'http://cdnjs.cloudflare.com/ajax/libs/ICanHaz.js/0.10.3/ICanHaz.min.js',
                'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.1.0/lodash.min.js',
                'http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.1/moment.min.js',
                'http://cdnjs.cloudflare.com/ajax/libs/rxjs/2.3.24/rx.all.js',
                'http://cdnjs.cloudflare.com/ajax/libs/rxjs-jquery/1.1.6/rx.jquery.min.js',
                'http://cdn.jsdelivr.net/fastclick/1.0.6/fastclick.min.js',

            ])
        })
    )
})


self.addEventListener('fetch', function(event) {
    var isRestCall = event.request.url.match(/rest\/v1/) !== null
    event.respondWith(
        caches.match(event.request, { ignoreSearch: isRestCall }).then(function(response) {
            if (response == null) console.log("cache miss", isRestCall, event.request.url)
            return response || fetch(event.request).then(function(resp2) {
                var r = resp2.clone()
                if (isRestCall) {
                    console.log("cache rest call", event.request.url)
                    caches.open("ontrail-api").then(function(cache) { cache.put(event.request, resp2.clone()) })
                }
                return r
            })
        }).catch(function(e) {
            console.log("error in service worker while intercepting fetch", e)
        })
    )
})