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

                // own hosted images
                'http://localhost:8080/img/logo.png',
                'http://localhost:8080/img/login_bg.png',
                'http://localhost:8080/img/share.jpg',
                'http://localhost:8080/img/loading.gif',

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
                'js/ontrail.js?_=UID'
            ])
        })
    )
})


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response == null) console.log("cache miss", event.request.url)
            return response || fetch(event.request)
        }).catch(function(e) {
            console.log("error in service worker while intercepting fetch", e)
        })
    )
})