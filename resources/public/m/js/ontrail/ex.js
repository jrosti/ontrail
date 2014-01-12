define(["jquery", "bacon", "bacon.jquery"], function($, Bacon, bjq) {

    return {
        exercises: function(filter) {
            return bjq.ajax("/rest/v1/ex-list-filter?" + $.param(filter) + "page=1")
        }
    }

})