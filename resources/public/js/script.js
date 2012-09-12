
(function() {
  $(document).ready(function() {
    var rx = Rx.Observable;

    var entries = $("#entries")

    var entryTemplate = Handlebars.compile($("#summary-entry-template").html());
    var exerciseTemplate = Handlebars.compile($("#exercise-template").html());
    var summaryTemplate = Handlebars.compile($("#summary-template").html());

    var query = $("#search").keyupAsObservable().throttle(500).select(_.compose(value, target)).distinctUntilChanged().startWith("")
    var nextpage = Rx.Observable.interval(200).where(function() { return elementBottomIsAlmostVisible(entries, 100) })

    function pager(ajaxSearch, page) {
      return ajaxSearch(page).selectMany(function(res) {
        if (res.length === 0)
          return rx.never()
        else
          return rx.returnValue(res).concat(nextpage.take(1).selectMany(function() { return pager(ajaxSearch, page+1) }))
      })
    }
    function scrollWith(ajaxQuery) { return pager(ajaxQuery, 1) }

    var getRest = function() {
      var path = _.reduce(arguments, function(a, b) { return a + "/" + b })
      return $.ajaxAsObservable({ url: "/rest/v1/" + path }).where(isSuccess).select(ajaxResponseData)
    }
    var getSummary = function(user) { return getRest("summary", user) }
    // unused Jro
    var getAvatarUrl = function(user) { return getRest("avatar", user) }
    var getLatest = function(page) { return getRest("ex-list-all", page) }
    var getDetails = function(kind, id) { return getRest(kind, id) }
    var getSearchResults = function(query) { return getRest("search?q=" + query ) }

    var doLogin = function() {
      return $.ajaxAsObservable({ type: 'POST', url: "/rest/v1/login", data: $('#login-form').serialize() })
    }

    var renderLatest = function(elem, data) {
      if (!data || !data.length || data.length == 0) return;
      var content = _.map(data, entryTemplate).reduce(function(a, b) { return a+b })
      $(content).appendTo(entries)
    }
    var renderExercise = function(exercise) {
      $('#ex-' + exercise.id).replaceWith($(exerciseTemplate(exercise)))
    }
    var renderSummary = function(summary) {
      if (!summary || !summary.length || summary.length == 0) return;
      var content = _.map(summary, summaryTemplate).reduce(function(a, b) { return a+b })
      $(content).appendTo($('#homies tbody'))
    }

    var logouts = $("#logout").clickAsObservable()
    var loginRequests = $("#login").clickAsObservable().selectAjax(doLogin)
    var logins = loginRequests.doAction(function() { debug("authToken", $.cookie("authToken")) }).where(isSuccess).select(ajaxResponseData)
    var loginFails = loginRequests.where(_.compose(not, isSuccess)).select(ajaxResponseData)

    var sessions = rx.create(function(observer) {
      logins.subscribe(function(login) { $.cookie("authToken", login.authToken ); observer.onNext(login.username) } )
      logouts.mergeTo(loginFails).subscribe(function() { $.cookie("authToken", null); observer.onNext(null)})
      return function() {} // todo -- should we dispose something.
    })
    var loggedIns = sessions.where(identity)
    var loggedOuts = sessions.where(_.compose(not, identity))

    // toggle logged-in and logged-out
    sessions.subscribe(function(userId) { $('body').toggleClass('logged-in', userId).toggleClass('logged-out', !userId) })

    // toggle pages when pageLink is clicked
    var currentPages = loggedIns.select(always("home"))
      .mergeTo($('.pageLink').clickAsObservable().select(target).select(_.partial(attr, 'rel'))).startWith("latest")

    currentPages.subscribe(function(page) {
      $('body').attr('data-page', page)
      $('#password').attr('value', '')
    })

    // open single entries
    var parentArticle = function(el) { return $(el).closest('article') }
    var clickedArticles = entries.clickAsObservable().select(target).where(isLink).select(parentArticle)

    var isArticleLoaded = function(el) { var $el = $(el); return $el.hasClass('full') || $el.hasClass('preview')}
    clickedArticles.where(_.compose(not, isArticleLoaded)).select(_.compose(_.partial(splitWith, "-"), _.partial(attr, "id")))
      .selectAjax(getDetails).subscribe(renderExercise)

    clickedArticles.where(isArticleLoaded).subscribe(function(el) { $(el).toggleClass('full').toggleClass('preview') })

    // initiate loading and search
    var oegyscroll = query
      .doAction(function() { entries.html("") })
      .combineWithLatestOf(currentPages)
      .selectArgs(function(query, currentPage) {
        if (query === "")
          return scrollWith(getLatest)
        else
          return getSearchResults(query)
      })
      .switchLatest()
    oegyscroll.subscribe(_.partial(renderLatest, entries))

    // initiate summary loading after login
    var ownSummaries = currentPages.where(partialEquals("home")).combineWithLatestOf(sessions).selectArgs(second).selectAjax(getSummary)
    ownSummaries.subscribe(renderSummary)

    // Kirjaudu sisään clicks toggle password & login fields visibility
    $('#login-link').clickAsObservable().subscribe(function() {
      $('body').toggleClass('login')
      $('#username').focus()
    })
    loggedIns.subscribe(function() { $('body').toggleClass('login', false) })

    _.forEach($(".pageLink"), function(elem) { $(elem).attr('href', "javascript:nothing()") })
  })
})()





