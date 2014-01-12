define(["jquery", "lodash", "bacon", "bacon.jquery"], function($, _, Bacon, bjq) {
    var elementBottomIsAlmostVisible = function(el, margin) {
        if (!$(el).is(':visible')) return false;

        // Toim.huom. $(window).height() näyttäis olevan rikki jquery 1.8.1:ssä...
        var viewportBottom = $(window).scrollTop() + window.innerHeight
        var loadingPoint = el.offset().top + el.outerHeight()

        return (viewportBottom  + margin) >= loadingPoint
    }

    var windowScrolls = $(window).scrollE().throttle(500)

    return {
        create: function(view, controller, renderer) {
            var elem = $(view)
            var ajaxReady = elem.asEventStream("ontrail-update").throttle(100)
            var shouldUpdate = ajaxReady.merge(windowScrolls).filter(_.partial(elementBottomIsAlmostVisible, elem, 100))
            var events = controller(shouldUpdate.startWith("").zip(ajaxReady.startWith("")))
            events.map(renderer).onValue(function(result) {
                elem.append(result).trigger("ontrail-update") // render and trigger refresh
            })
            return events
        }
    }
})