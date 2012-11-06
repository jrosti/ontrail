// jquery extensions
(function () {
  $.fn.valueAsObservable = function () {
    return this.keyupAsObservable().throttle(500).select(_.compose(value, target)).distinctUntilChanged().startWith("")
  }

  $.fn.dialogAsObservable = function(options, buttons) {
    var self = this
    return rx.create(function(observer) {
      var opts = _.extend({ buttons: {}}, options)
      var createButton = function(button) {
        opts.buttons[button.name] = function() {
          observer.onNext(button.id)
        }
      }
      _.map(buttons, createButton)
      self.dialog(opts)
      return function() {
        $(self).dialog("close")
      }
    })
  }

  _.mixin({
    argsToArray: function argsToArray(args) {
      return Array.prototype.slice.call(args);
    }
  })
})()