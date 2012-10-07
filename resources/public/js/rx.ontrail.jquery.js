// jquery extensions
(function() {
  $.fn.valueAsObservable = function() {
    return this.keyupAsObservable().throttle(500).select(_.compose(value, target)).distinctUntilChanged().startWith("")
  }
})()