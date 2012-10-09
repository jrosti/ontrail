// jquery extensions
(function () {
  $.fn.valueAsObservable = function () {
    return this.keyupAsObservable().throttle(500).select(_.compose(value, target)).distinctUntilChanged().startWith("")
  }

  _.mixin({
    argsToArray: function argsToArray(args) {
      return Array.prototype.slice.call(args);
    }
  })
})()