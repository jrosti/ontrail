(function(){
  var Rest = function() {}

  var errorHandler;
  var ajaxErrors = Rx.Observable.create(function(observer) {
    errorHandler = { error: function(error) { observer.onNext({ jqXHR: error }) } }
    return function() { errorHandler = null } // todo -- is there something to cleanup?
  });

  var getAsObservable = function() {
    var path = _.reduce(arguments, function(a, b) { return a + "/" + b })
    return $.ajaxAsObservable($.extend({ url: "/rest/v1/" + path }, errorHandler)).mergeTo(ajaxErrors).where(isSuccess).select(ajaxResponseData)
  }
  Rest.prototype.summary = function(user) { return getAsObservable("summary", user) }
  // unused Jro
  Rest.prototype.avatarUrl = function(user) { return getAsObservable("avatar", user) }
  Rest.prototype.latest = function(page) { return getAsObservable("ex-list-all", page) }
  Rest.prototype.userExercises = function(user, page) { return getAsObservable("ex-list-user", user, page) }
  Rest.prototype.details = function(kind, id) { return getAsObservable(kind, id) }
  Rest.prototype.searchResults = function(query) { return getAsObservable("search?q=" + query ) }

  // todo: move login and postExercise here also and make postAsObservable private
  Rest.prototype.postAsObservable = function(url, data) {
    return $.ajaxAsObservable($.extend({ type: 'POST', url: "/rest/v1/" + url, data: data }, errorHandler)).mergeTo(ajaxErrors)
  }

  OnTrail.rest = new Rest();
})()

