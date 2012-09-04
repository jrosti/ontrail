(function() {

  Rx.Observable.prototype.selectAjax = function(ajaxAction) {
    var stream = this.select(ajaxAction).switchLatest().publish()
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
  Rx.Observable.prototype.combineWithLatestOf = function(second, combinator) {
    var first = this
    var latest
    second.subscribe(function(value) { latest = value })

    return Rx.Observable.create(function(subscriber) {
      var seq = first.subscribe(function(value) {
        subscriber.onNext(combinator(value, latest))
      })
      return function() { seq.dispose() }
    })
  }
}());

// debugging and dummy subscribing
var debug = function() {console.log("debug: ", arguments)}
var nothing = function() {}

// functional js
var always = function(x) { return function(y) { return x } }
var identity = function(x) { return x }
var not = function(x) { return !x }
var first = function() { return arguments[0] }
var second = function() { return arguments[1] }
var equals = function( a, b ) { return a === b }
var partialEquals = function(val) { return _.partial(equals, val) }

// ajax requests
var isSuccess = function(response) { return response.jqXHR.status >= 200 && response.jqXHR.status < 400 }
var ajaxResponseData = function(response) { return response.data }

// events
var eventTarget = function(event) { return event.target }