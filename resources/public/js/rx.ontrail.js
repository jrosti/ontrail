(function() {

  Rx.Observable.prototype.log = function(category) {
    return this.doAction(function() {
      var dbg = _debug(category)
      dbg.apply(dbg, asArgs(arguments))
    })
  }

  Rx.Observable.prototype.selectArgs = function(selectAction) {
    return this.select(function(args) {
      return selectAction.apply(null, asArgs(args))
    })
  }

  Rx.Observable.prototype.whereArgs = function(whereAction) {
    return this.where(function(args) {
      return whereAction.apply(null, asArgs(args))
    })
  }

  Rx.Observable.prototype.subscribeArgs = function(subscribeAction) {
    return this.subscribe(function(args) {
      return subscribeAction.apply(null, asArgs(args))
    })
  }

  Rx.Observable.prototype.selectAjax = function(ajaxAction) {
    var stream = this.selectArgs(ajaxAction).switchLatest().publish()
    stream.connect()
    return stream
  }

  Rx.Observable.prototype.mergeErrors = function() {
    var merged = new Rx.Subject()
    this.doAction(merged.onNext, merged.onNext, merged.onCompleted)
      .retry().publish().connect()
    return merged
  }
  Rx.Observable.prototype.combineWithLatestOf = function() {
    var first = this
    var args = arguments
    return Rx.Observable.create(function(subscriber) {
      var latest = []
      for(var i in args) {
        args[i].subscribe(_.bind(function(index, value) { latest[index] = value }, null, i))
      }
      var seq = first.subscribe(function(value) {
        subscriber.onNext([value].concat(latest))
      })
      return function() { seq.dispose() }
    })
  }
}());
var rx = Rx.Observable;

var OnTrail = {}

// debugging and dummy subscribing
var debug = function() {console.log("debug: ", arguments)}
var _debug = function(category) { return _.partial(debug, category ) }
var nothing = function() {}

// general utilities
var splitWith = function(delim, string) { return (string !== undefined) ? string.split(delim) : string }
var splitM = _.partial(splitWith, "/")
var asArgs = function() { return _.argsToArray(arguments.length == 1 ? (($.isArray(arguments[0])) ? arguments[0] : [arguments[0]]) : arguments) }
var id = function(item) { return item.id }

// functional js
var always = function(x) { return function(y) { return x } }
var identity = function(x) { return x }
var exists = identity
var not = function(x) { return !x }
var first = function() { return asArgs.apply(null, arguments)[0] }
var tail = function() { return asArgs.apply(null, arguments).slice(1) }
var emptyAsUndefined = function() {
  var arr = asArgs.apply(null, arguments)
  return arr.length > 0 ? arr : undefined
}
var second = function() { return asArgs.apply(null, arguments)[1] }
var equals = function( a, b ) { return a === b }
var partialEquals = function(val) { return _.partial(equals, val) }
var partialEqualsAny = function(arr) {
  return function(item) { return _.find(arr, _.partial(equals, item)) !== undefined }
}
var firstDefined = function() { return _.find(_.argsToArray(arguments), exists) }

// ajax requests
var isSuccess = function(response) { return response.jqXHR.status >= 200 && response.jqXHR.status < 400 }
var ajaxResponseData = function(response) { return response.data }

// DOM
var parent = function(el) { return el.parentNode }
var findParent = function(el, match) {
  if (el == undefined || match(el)) return el;
  return findParent(parent(el), match);
}
var target = function(event) { return event.target }
var value = function(input) { return input.value }
var isLink = function(el) { return $(el).prop('nodeName') == "A"}
var hasClass = function(name, el) { return $(el).hasClass(name) }
var _hasClass = function(name) { return _.partial( hasClass, name) }
var attr = function(name, el) { return $(el).attr(name) }
var _attr = function(name) { return _.partial(attr, name) }

var asFilter = function(el) {
  function isFilterItem(a) { return a.name.indexOf("data-filter-") == 0 }
  function asFilterItem(a) { var item = {}; item[a.name.substring(12)] = a.value; return item }
  return _.extend.apply(_.extend, _($(el)[0].attributes).chain().filter(isFilterItem).map(asFilterItem).value())
}


var targetLink = function(event) {
    return findParent(target(event), isLink)
}


var elementBottomIsAlmostVisible = function(el, margin) {
  if (!$(el).is(':visible')) return false;
  // Toim.huom. $(window).height() näyttäis olevan rikki jquery 1.8.1:ssä...
  var viewportBottom = $(window).scrollTop() + window.innerHeight
  var loadingPoint = el.offset().top + el.outerHeight()
  return (viewportBottom  + margin) >= loadingPoint
}
