
(function() {
  $(document).ready(function() {
    var rx = Rx.Observable;

    var entries = $("#entries")
    var entryTemplate = Handlebars.compile($("#summary-entry-template").html());
    var exerciseTemplate = Handlebars.compile($("#exercise-template").html());

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
    var getSummary = function(user) { getRest("summary") }
    // unused Jro
    var getAvatarUrl = function(user) { getRest("avatar", user) }
    var getLatest = function(page) { return getRest("ex-list-all", page) }
    var getDetails = function(kind, id) { return getRest(kind, id) }
    var getSearchResults = function(query) { return getRest("search?q=" + query ) }

    var doLogin = function() {
      return $.ajaxAsObservable({ type: 'POST', url: "/rest/v1/login", data: $('#login-form').serialize() })
    }

    var renderSummary = function(elem, data) {
      var content = _.map(data, entryTemplate).reduce(function(a, b) { return a+b })
      $(content).appendTo(entries)
    }
    var renderExercise = function(exercise) {
      $('#ex-' + exercise.id).replaceWith($(exerciseTemplate(exercise)))
    }
    var renderSingleSummary = function(exercise) {
      $('#ex-' + exercise.id).replaceWith($(entryTemplate(exercise)))
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
    summaryRequests.subscribe(renderSummary);

    // toggle pages when pageLink is clicked
    var currentPages = $('.pageLink').clickAsObservable().select(target).select(function(elem) { return $(elem).attr('rel') }).startWith("latest");

    currentPages.subscribe(function(page) {
      $('body').attr('data-page', page)
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

    oegyscroll.subscribe(_.partial(renderSummary, entries))

    _.forEach($(".pageLink"), function(elem) { $(elem).attr('href', "javascript:nothing()") })
  })
})()





