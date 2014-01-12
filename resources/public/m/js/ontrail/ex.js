define(["jquery", "lodash", "bacon", "bacon.jquery"], function($, _,    Bacon, bjq) {

    var pager = function(fromUrl) {
        return fromUrl.scan({page: 0}, function(val, url) { var pg = val.page + 1; return {page: pg, url: url + "&page=" + pg} }).skip(1).map(".url")
    }

    return {
        exercises: function(pagerStream) {
            var filter = {}
            var urlPager = pager(pagerStream.map("/rest/v1/ex-list-filter?" + $.param(filter)))
            return urlPager.ajax()
        }
    }
})