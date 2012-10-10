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

  Rest.prototype.summary = function() { return getAsObservableResultData.apply(this, ["summary"].concat(_.argsToArray(arguments))) }
  // unused Jro
  Rest.prototype.avatarUrl = function(user) { return getAsObservableResultData("avatar", user) }
  Rest.prototype.latest = function(page) { return getAsObservableResultData("ex-list-all", page) }
  Rest.prototype.exercises = function(type, id, page) { return getAsObservableResultData("ex-list-" + type, id, page) }
  Rest.prototype.details = function(kind, id) { return getAsObservableResultData(kind, id) }
  Rest.prototype.searchResults = function(query) { return getAsObservableResultData("search?q=" + query ) }
  Rest.prototype.sports = function() { return getAsObservableResultData("sports") }
  Rest.prototype.tags = function(user) { return getAsObservableResultData("list-tags", user) }
  Rest.prototype.profile = function(user) { return getAsObservableResultData("profile", user) }
  Rest.prototype.allTags = function() { return getAsObservableResultData("list-tags-all") }
  Rest.prototype.durationV = function(duration) { return getAsObservable("parse-time", duration) }

  // user search
  Rest.prototype.users = function(page) { return getAsObservableResultData("list-users", page ) }
  Rest.prototype.searchUsers = function(query, page) { return getAsObservableResultData("find-users", query, page ) }

  // todo: move login and postExercise here also and make postAsObservable private
  Rest.prototype.postAsObservable = function(url, data) {
    return ajaxWithErrorHandler({ type: 'POST', url: "/rest/v1/" + url, data: data })
  }

  Rest.prototype.deleteAsObservable = function() {
    var path = _.reduce(arguments, function(a, b) { return a + "/" + encodeURIComponent(b) })
    return ajaxWithErrorHandler({ type: 'DELETE', url: "/rest/v1/" + path })
  }

  OnTrail.rest = new Rest();
})()

