(function(){
  // todo: remove depsu to elementBottomIsAlmostVisible
  var nextPage = function(elem) {
    var e = ($.isFunction(elem)) ? elem() : elem
    return Rx.Observable.interval(200).where(function() { return elementBottomIsAlmostVisible(e, 100) })
  }

  var pager = function(ajaxSearch, page, next) {
    return ajaxSearch(page).selectMany(function(res) {
      if (res.length === 0) {
        _.map(["#content-spinner-content", "#content-spinner-latest", "#content-spinner-new-comments"], function(elem) { $(elem).html("Ei enempää suorituksia") })
        return rx.empty()
      } else {
        return rx.returnValue(res).concat(next.take(1).selectMany(function() { return pager(ajaxSearch, page+1, next) }))
      }
    })
  }

  var Pager = function() {}
  Pager.prototype.create = function(ajaxQuery, elem) { return pager(ajaxQuery, 1, nextPage(elem)) }
  OnTrail.pager = new Pager()

  Rx.Observable.prototype.scrollWith = function(action, element, visibleElem) {
    return this.distinctUntilChanged().doAction(function() { element.html("") })
      .selectArgs(function() {
        var partialAppliedArgs = [action].concat(_.argsToArray(arguments))
        return OnTrail.pager.create(_.partial.apply(_.partial, partialAppliedArgs), visibleElem || element)
      }).switchLatest()
  }
})()