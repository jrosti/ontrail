(function(){
  var dataLoadEnd = new Rx.Subject()

  var scrolls = $(window).scrollAsObservable().throttle(100)
  var initialTimer = new Rx.Observable.interval(100).take(10)

  var timer = dataLoadEnd.merge(initialTimer.merge(scrolls)).merge($(document).onAsObservable("ready")).publish().refCount()

  // todo: remove depsu to elementBottomIsAlmostVisible
  var nextPage = function(elem) {
    var e = ($.isFunction(elem)) ? elem() : elem
    return timer.where(function() { return elementBottomIsAlmostVisible(e, 100) })
  }

  var pager = function(ajaxSearch, page, next) {
    return ajaxSearch(page).selectMany(function(data) {
      // I do not follow this code properly. FIXME this.
      if (data && data.searchSummary) {
        $('#searchSummary').html(data.searchSummary)
      }
      dataLoadEnd.onNext("tick")

      if (data.results.length === 0) {
        $("#content-spinner").html("Ei enempää suorituksia")
        return rx.empty()
      } else {
        return rx.returnValue(data.results).concat(next.take(1).selectMany(function() { return pager(ajaxSearch, page + 1, next) }))
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