(function() {

  Rx.Observable.prototype.selectArgs = function(selectAction) {
    return this.select(function(args) {
      return selectAction.apply(null, asArgs(args))
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

  Rx.Observable.prototype.mergeTo = function(observable) {
    return Rx.Observable.merge(null, this, observable)
  }
  Rx.Observable.prototype.combineWithLatestOf = function() {
    var first = this
    var latest = []
    for(var i in arguments) {
      arguments[i].subscribe(_.bind(function(index, value) { latest[index] = value }, null, i))
    }
    return Rx.Observable.create(function(subscriber) {
      var seq = first.subscribe(function(value) {
        subscriber.onNext([value].concat(latest))
      })
      return function() { seq.dispose() }
    })
  }
}());

// debugging and dummy subscribing
var debug = function() {console.log("debug: ", arguments)}
var nothing = function() {}

// general utilities
var splitWith = function(delim, string) { return string.split(delim) }

// functional js
var asArgs = function() { return arguments.length == 1 ? arguments[0] : arguments }

var always = function(x) { return function(y) { return x } }
var identity = function(x) { return x }
var not = function(x) { return !x }
var first = function() { return asArgs.apply(null, arguments)[0] }
var second = function() { return asArgs.apply(null, arguments)[1] }
var equals = function( a, b ) { return a === b }
var partialEquals = function(val) { return _.partial(equals, val) }

// ajax requests
var isSuccess = function(response) { return response.jqXHR.status >= 200 && response.jqXHR.status < 400 }
var ajaxResponseData = function(response) { return response.data }

// DOM
var target = function(event) { return event.target }
var value = function(input) { return input.value }
var isLink = function(el) { return $(el).prop('localName') === "a"}
var hasClass = function(name, el) { return $(el).hasClass(name) }
var attr = function(name, el) { return $(el).attr(name) }
var elementBottomIsAlmostVisible = function(el, margin) {
  // Toim.huom. $(window).height() näyttäis olevan rikki jquery 1.8.1:ssä...
  var viewportBottom = $(window).scrollTop() + window.innerHeight
  var loadingPoint = el.offset().top + el.outerHeight()
  return (viewportBottom  + margin) >= loadingPoint
}
