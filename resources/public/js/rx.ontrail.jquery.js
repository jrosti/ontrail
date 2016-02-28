// jquery extensions
(function () {
  $.fn.valueAsObservable = function () {
    return this.keyupAsObservable().throttle(500).select(_.compose(value, target)).distinctUntilChanged().startWith("")
  }

  $.fn.modalAsObservable = function(options) {
    var self = this

    return rx.create(function(observer) {
      function okClicked () {
        observer.onNext("delete")
      }

      function cancelClicked () {
        observer.onNext("cancel")
      }

      $(self).on('click', "a.confirm", okClicked);
      $(self).on('click', "a.cancel", cancelClicked);

      $(self).openModal({
        dismissible: false,
        complete: function() {
          $(self).off('click', "a.confirm", okClicked)
          $(self).off('click', "a.cancel", cancelClicked)
        }
      })

      return function() {
        $(self).closeModal()
        $(self).off('click', "a.confirm", okClicked)
        $(self).off('click', "a.cancel", cancelClicked)
      }
    })
  }

  _.mixin({
    argsToArray: function argsToArray(args) {
      return Array.prototype.slice.call(args);
    }
  })
})()