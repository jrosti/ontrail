
(function() {
  $(document).ready(function() {
    var source = $("#summary-entry-template").html();
    var entryTemplate = Handlebars.compile(source);

    var getSummary = function(user) {
      return $.ajaxAsObservable({ url: "http://localhost:8080/rest/v1/summary/" + user })
    }

    var getLatest = function() {
      return $.ajaxAsObservable({ url: "http://localhost:8080/rest/v1/ex-list-all/1" })
    }

    var doLogin = function() {
      console.log($('#login-form').serialize())
      return $.ajaxAsObservable({ type: 'POST', url: "http://localhost:8080/rest/v1/login", data: $('#login-form').serialize() })
    }

    var drawSummary = function(elem, data) {
      var content = _.map(data, entryTemplate).reduce(function(a, b) { return a+b })
      $(elem).html(content)
    }

    var logouts = $("#logout").clickAsObservable()
    var loginRequests = $("#login").clickAsObservable().selectAjax(doLogin)
    var logins = loginRequests.where(isSuccess).select(ajaxResponseData)
    var loginFails = loginRequests.where(_.compose(not, isSuccess)).select(ajaxResponseData)

    var sessions = Rx.Observable.create(function(observer) {
      logins.subscribe(function(login) { $.cookie("authToken", login.authToken ); observer.onNext(login.username) } )
      logouts.mergeTo(loginFails).subscribe(function() { $.cookie("authToken", null); observer.onNext(null)})
      return function() {} // todo -- should we dispose something.
    })
    var loggedIns = sessions.where(identity)

    var summaryRequests = sessions.selectAjax(getSummary)
    summaryRequests.where(isSuccess).select(ajaxResponseData).subscribe(drawSummary);

    // toggle pages when pageLink is clicked
    var currentPages = Rx.Observable.returnValue("latest").mergeTo($('.pageLink').clickAsObservable().select(eventTarget).select(function(elem) { return $(elem).attr('rel') }));

    currentPages.where(partialEquals("latest")).selectAjax(getLatest).where(isSuccess).select(ajaxResponseData).subscribe(_.partial(drawSummary, "#summary-entries"))

    currentPages.subscribe(function(page) {
      $('body').attr('data-page', page)
    })

    _.forEach($(".pageLink"), function(elem) { $(elem).attr('href', "javascript:nothing()") })
  })

})()





