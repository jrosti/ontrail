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
    return $.ajaxAsObservable($.extend(options, errorHandler)).merge(ajaxErrors)
  }

  var getAsObservableFromBlogDomain = function() {
    var path = _.reduce(arguments, function(a, b) { return a + "/" + encodeURIComponent(b) })
    return ajaxWithErrorHandler({ url: "http://blog.ontrail.net/" + path })
  }
  var getAsObservable = function() {
    var path = _.reduce(arguments, function(a, b) { return a + "/" + encodeURIComponent(b) })
    return ajaxWithErrorHandler({ url: "/rest/v1/" + path })
  }
  var getAsObservableResultData = function() {
    return success(getAsObservable.apply(this, arguments))
  }

  // todo: move login and postExercise here also and make postAsObservable private
  var postAsObservable = function(url, data) {
    return ajaxWithErrorHandler({ type: 'POST', url: "/rest/v1/" + url, data: data })
  }

  var deleteAsObservable = function() {
    var path = _.reduce(arguments, function(a, b) { return a + "/" + encodeURIComponent(b) })
    return ajaxWithErrorHandler({ type: 'DELETE', url: "/rest/v1/" + path })
  }


  Rest.prototype.summary = function() { return getAsObservableResultData.apply(this, ["summary"].concat(_.argsToArray(arguments))) }
  Rest.prototype.tagsummary = function() { return getAsObservableResultData.apply(this, ["summary-tags"].concat(_.argsToArray(arguments))) }
  Rest.prototype.weeksummary = function(user, year, month, n) {
    var nthMonth = function(n) {
      monthsTotal = year * 12 + month - n
      return [Math.floor(monthsTotal / 12), monthsTotal % 12 + 1]
    }

    return getAsObservableResultData.apply(this, ["weekly-list", user].concat(nthMonth(n - 1)))
  }

  Rest.prototype.markAllRead = function() { return getAsObservableResultData("mark-all-read") }

  Rest.prototype.loggedIns = function() { return getAsObservableResultData("logged-ins") }

  Rest.prototype.latest = function(page) { return getAsObservableResultData("ex-list-all", page) }

  Rest.prototype.newComments = function() { return getAsObservableResultData("ex-unread-comments") }
  Rest.prototype.newOwnComments = function() { return getAsObservableResultData("ex-unread-own-comments") }
  Rest.prototype.mostRead = function() { return getAsObservableResultData("keen/most-read") }
  Rest.prototype.mostRead14 = function() { return getAsObservableResultData("keen/most-read-14") }
  Rest.prototype.mostCared14 = function() { return getAsObservableResultData("cares/most-cared-14") }

  Rest.prototype.topHours = function() { return getAsObservableResultData("tops/totals/2018") }
  Rest.prototype.topSports = function(sport) { return getAsObservableResultData("tops/totals/" + sport + "/2018") }


  Rest.prototype.newCommentCountOwn = function() { return getAsObservableResultData("ex-unread-count", "own")}
  Rest.prototype.newCommentCountAll = function() { return getAsObservableResultData("ex-unread-count", "all")}

  Rest.prototype.mostComments = function() { return getAsObservableResultData("ex-most-comments") }

  Rest.prototype.exercises = function(filter, page) { return getAsObservableResultData("ex-list-filter?" + [$.param(filter), "page=" + page].join("&")) }
  Rest.prototype.details = function(kind, id) { return getAsObservableResultData(kind, id) }
  Rest.prototype.searchResults = function(query, page) { return getAsObservableResultData("search?q=" + query + "&page=" + page) }

  Rest.prototype.system = function() { return getAsObservableResultData("system") }

  Rest.prototype.serverParseV = function(kind, item) { return getAsObservable("validate", kind, item) }

  Rest.prototype.usernameV = function(username) { return getAsObservable("validate", "username", username) }
  Rest.prototype.passwordV = function(password, username) { return postAsObservable("validate/login", { username: username, password: password }) }

  Rest.prototype.pageDetail = function(filter) { return getAsObservable("page-detail?" + $.param(filter))}
  Rest.prototype.profile = function(username) { return getAsObservable("profile/" + username) }

  Rest.prototype.s3list = function(filter) { return getAsObservableFromBlogDomain("s3list?" + $.param(filter)) }

  // user search
  Rest.prototype.users = function(page) { return getAsObservableResultData("list-users", page ) }
  Rest.prototype.searchUsers = function(query, page) { return getAsObservableResultData("find-users", query, page ) }
  Rest.prototype.activeUsers = function() { return getAsObservableResultData("active-users") }

  Rest.prototype.groups = function(page) { return getAsObservableResultData("groups", page) }
  Rest.prototype.ownGroups = function() { return getAsObservableResultData("own-groups") }

  // todo: move login and postExercise here also and make postAsObservable private
  Rest.prototype.postAsObservable = postAsObservable
  Rest.prototype.deleteAsObservable = deleteAsObservable

  OnTrail.rest = new Rest();
})()

