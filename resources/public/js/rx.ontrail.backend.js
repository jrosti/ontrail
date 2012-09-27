(function(){
  var Rest = function() {}

  var success = function(ajaxStream) {
    return ajaxStream.where(isSuccess).select(ajaxResponseData)
  }

  var ajaxWithErrorHandler = function(options) {
    var errorHandler;
    var ajaxErrors = Rx.Observable.create(function(observer) {
      errorHandler = { error: function(error) { observer.onNext({ jqXHR: error }) } }
      return function() { errorHandler = null }
    }).publish()
    ajaxErrors.connect()
    return $.ajaxAsObservable($.extend(options, errorHandler)).mergeTo(ajaxErrors)
  }

  var getAsObservable = function() {
    var path = _.reduce(arguments, function(a, b) { return a + "/" + encodeURIComponent(b) })
    return ajaxWithErrorHandler({ url: "/rest/v1/" + path })
  }
  var getAsObservableResultData = function() {
    return success(getAsObservable.apply(this, arguments))
  }

  Rest.prototype.summary = function(user) { return getAsObservableResultData("summary", user) }
  // unused Jro
  Rest.prototype.avatarUrl = function(user) { return getAsObservableResultData("avatar", user) }
  Rest.prototype.latest = function(page) { return getAsObservableResultData("ex-list-all", page) }
  Rest.prototype.userExercises = function(user, page) { return getAsObservableResultData("ex-list-user", user, page) }
  Rest.prototype.tagExercises = function(tag, page) { return getAsObservableResultData("ex-list-tag", tag, page) }
  Rest.prototype.details = function(kind, id) { return getAsObservableResultData(kind, id) }
  Rest.prototype.searchResults = function(query) { return getAsObservableResultData("search?q=" + query ) }
  Rest.prototype.sports = function() { return getAsObservableResultData("sports") }
  Rest.prototype.tags = function(user) { return getAsObservableResultData("list-tags", user) }
  Rest.prototype.allTags = function() { return getAsObservableResultData("list-tags-all") }
  Rest.prototype.durationV = function(duration) { return getAsObservable("parse-time", duration) }

  // todo: move login and postExercise here also and make postAsObservable private
  Rest.prototype.postAsObservable = function(url, data) {
    return ajaxWithErrorHandler({ type: 'POST', url: "/rest/v1/" + url, data: data })

  }

  OnTrail.rest = new Rest();
})()

