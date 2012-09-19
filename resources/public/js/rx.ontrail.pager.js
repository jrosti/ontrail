(function(){
  var nextPage = function(elem) { return Rx.Observable.interval(200).where(function() { return elementBottomIsAlmostVisible(elem, 100) }) }

  var pager = function(ajaxSearch, page, next) {
    return ajaxSearch(page).selectMany(function(res) {
      if (res.length === 0)
        return rx.empty()
      else
        return rx.returnValue(res).concat(next.take(1).selectMany(function() { return pager(ajaxSearch, page+1, next) }))
    })
  }

  var Pager = function() {}
  Pager.prototype.create = function(ajaxQuery, elem) { return pager(ajaxQuery, 1, nextPage(elem)) }
  OnTrail.pager = new Pager()
})()