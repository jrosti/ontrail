(function(){
  var Rest = function() {}

  var errorHandler;
  var ajaxErrors = Rx.Observable.create(function(observer) {
    errorHandler = { error: function(error) { observer.onNext({ jqXHR: error }) } }
    return function() { errorHandler = null }
  });
  var success = function(ajaxStream) {
    return ajaxStream.where(isSuccess).select(ajaxResponseData)
  }

  var getAsObservable = function() {
    var path = _.reduce(arguments, function(a, b) { return a + "/" + b })
    return $.ajaxAsObservable($.extend({ url: "/rest/v1/" + path }, errorHandler)).mergeTo(ajaxErrors)
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

  // todo: move login and postExercise here also and make postAsObservable private
  Rest.prototype.postAsObservable = function(url, data) {
    return $.ajaxAsObservable($.extend({ type: 'POST', url: "/rest/v1/" + url, data: data }, errorHandler)).mergeTo(ajaxErrors)
  }

  OnTrail.rest = new Rest();
})()

