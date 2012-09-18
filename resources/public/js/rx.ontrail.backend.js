(function(){
  var Rest = function() {}

  var errorHandler;
  var ajaxErrors = Rx.Observable.create(function(observer) {
    errorHandler = { error: function(error) { observer.onNext({ jqXHR: error }) } }
    return function() { errorHandler = null } // todo -- is there something to cleanup?
  });

  Rest.prototype.doGet = function() {
    var path = _.reduce(arguments, function(a, b) { return a + "/" + b })
    return $.ajaxAsObservable($.extend({ url: "/rest/v1/" + path }, errorHandler)).mergeTo(ajaxErrors).where(isSuccess).select(ajaxResponseData)
  }
  Rest.prototype.summary = function(user) { return Rest.prototype.doGet("summary", user) }
  // unused Jro
  Rest.prototype.avatarUrl = function(user) { return Rest.prototype.doGet("avatar", user) }
  Rest.prototype.latest = function(page) { return Rest.prototype.doGet("ex-list-all", page) }
  Rest.prototype.userExercises = function(user, page) { return Rest.prototype.doGet("ex-list-user", user, page) }
  Rest.prototype.details = function(kind, id) { return Rest.prototype.doGet(kind, id) }
  Rest.prototype.searchResults = function(query) { return Rest.prototype.doGet("search?q=" + query ) }


  Rest.prototype.postAsObservable = function(url, data) {
    return $.ajaxAsObservable($.extend({ type: 'POST', url: url, data: data }, errorHandler)).mergeTo(ajaxErrors)
  }

  OnTrail.rest = new Rest();
})()

