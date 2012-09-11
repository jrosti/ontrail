
(function() {
  $(document).ready(function() {
    var rx = Rx.Observable;

    var entryTemplate = Handlebars.compile($("#summary-entry-template").html());
    var exerciseTemplate = Handlebars.compile($("#exercise-template").html());

    var query = $("#search").keyupAsObservable().throttle(500).select(eventTarget).distinctUntilChanged().startWith("")
    var nextpage = Rx.Observable.interval(200).where(function() { return elementBottomIsAlmostVisible($('#entries'), 100) })

    function pager(ajaxSearch, page) {
      return ajaxSearch(page).where(isSuccess).select(ajaxResponseData).selectMany(function(res) {
        if (res.length === 0)
          return rx.never()
        else
          return rx.returnValue(res).concat(nextpage.take(1).selectMany(function() { return pager(ajaxSearch, page+1) }))
      })
    }
    function scrollWith(ajaxQuery) {
      pager(ajaxQuery, 1).subscribe(_.partial(renderSummary, "#entries"))
    }

    var getSummary = function(user) {
      return $.ajaxAsObservable({ url: "/rest/v1/summary/" + user })
    }

    // unused Jro
    var getAvatarUrl = function(user) {
      return $.ajaxAsObservable({ url: "/rest/v1/avatar/" + user })
    }

    var getLatest = function(page) {
      return $.ajaxAsObservable({ url: "/rest/v1/ex-list-all/" + page })
    }

    var getDetails = function(kind, id) {
      debug("getDetailz", arguments)
      return $.ajaxAsObservable({ url: "/rest/v1/" + kind + "/" + id })
    }

    var doLogin = function() {
      return $.ajaxAsObservable({ type: 'POST', url: "/rest/v1/login", data: $('#login-form').serialize() })
    }

    var renderSummary = function(elem, data) {
      var content = _.map(data, entryTemplate).reduce(function(a, b) { return a+b })
      $(content).appendTo("#entries")
    }

    var renderExercise = function(exercise) {
      console.log(exercise)
      var content =
      $('#ex-' + exercise.id).replaceWith($(exerciseTemplate(exercise)))
    }

    var logouts = $("#logout").clickAsObservable()
    var loginRequests = $("#login").clickAsObservable().selectAjax(doLogin)
    var logins = loginRequests.where(isSuccess).select(ajaxResponseData)
    var loginFails = loginRequests.where(_.compose(not, isSuccess)).select(ajaxResponseData)

    var sessions = rx.create(function(observer) {
      logins.subscribe(function(login) { $.cookie("authToken", login.authToken ); observer.onNext(login.username) } )
      logouts.mergeTo(loginFails).subscribe(function() { $.cookie("authToken", null); observer.onNext(null)})
      return function() {} // todo -- should we dispose something.
    })
    var loggedIns = sessions.where(identity)

    var summaryRequests = sessions.selectAjax(getSummary)
    summaryRequests.where(isSuccess).select(ajaxResponseData).subscribe(renderSummary);

    // toggle pages when pageLink is clicked
    var currentPages = $('.pageLink').clickAsObservable().select(eventTarget).select(function(elem) { return $(elem).attr('rel') }).startWith("latest");
//    currentPages.where(partialEquals("latest")).takeWhile(partialEquals("latest")).subscribe(_.partial(scrollWith, getLatest))

    currentPages.subscribe(function(page) {
      $('body').attr('data-page', page)
    })

    // open single entries
    var entryClicks = $('#entries').clickAsObservable().select(_.compose(_.partial(splitWith, "-"), _.partial(attr, "rel"), eventTarget))
    entryClicks.doAction(_.partial(debug, "foo")).selectAjax(getDetails).where(isSuccess).select(ajaxResponseData).subscribe(renderExercise)

    // initiate loading and search
    var oegyscroll = query
      .doAction(function() { $("#entries").html("") } )
      .select(function(q) { return scrollWith(getLatest) })
      .switchLatest()

    oegyscroll.subscribe(nothing)

    _.forEach($(".pageLink"), function(elem) { $(elem).attr('href', "javascript:nothing()") })
  })
})()





