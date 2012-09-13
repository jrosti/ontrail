
(function() {
  $(document).ready(function() {
    var rx = Rx.Observable;

    var entries = $("#entries")
    var userEntries = $("#user-entries")

    var entryTemplate = Handlebars.compile($("#summary-entry-template").html());
    var exerciseTemplate = Handlebars.compile($("#exercise-template").html());
    var summaryTemplate = Handlebars.compile($("#summary-template").html());

    var query = $("#search").keyupAsObservable().throttle(500).select(_.compose(value, target)).distinctUntilChanged().startWith("")
    var nextPage = function(elem) { return Rx.Observable.interval(200).where(function() { return elementBottomIsAlmostVisible(elem, 100) }) }

    var pager = function(ajaxSearch, page, next) {
      return ajaxSearch(page).selectMany(function(res) {
        if (res.length === 0)
          return rx.never()
        else
          return rx.returnValue(res).concat(next.take(1).selectMany(function() { return pager(ajaxSearch, page+1, next) }))
      })
    }
    function scrollWith(ajaxQuery, elem) { return pager(ajaxQuery, 1, nextPage(elem)) }

    var errorHandler;
    var ajaxErrors = Rx.Observable.create(function(observer) {
      errorHandler = { error: function(error) { observer.onNext({ jqXHR: error }) } }
      return function() { errorHandler = null } // todo -- is there something to cleanup?
    });

    var getRest = function() {
      var path = _.reduce(arguments, function(a, b) { return a + "/" + b })
      return $.ajaxAsObservable($.extend({ url: "/rest/v1/" + path }, errorHandler)).mergeTo(ajaxErrors).where(isSuccess).select(ajaxResponseData)
    }
    var getSummary = function(user) { return getRest("summary", user) }
    // unused Jro
    var getAvatarUrl = function(user) { return getRest("avatar", user) }
    var getLatest = function(page) { return getRest("ex-list-all", page) }
    var getUserExercises = function(user, page) { return getRest("ex-list-user", user, page) }
    var getDetails = function(kind, id) { return getRest(kind, id) }
    var getSearchResults = function(query) { return getRest("search?q=" + query ) }

    var doLogin = function() {
      return $.ajaxAsObservable($.extend({ type: 'POST', url: "/rest/v1/login", data: $('#login-form').serialize() }, errorHandler)).mergeTo(ajaxErrors)
    }
    var postExercise = function(user) {
      return $.ajaxAsObservable($.extend({ type: 'POST', url: "/rest/v1/ex/" + user , data: $('#login-form').serialize() }, errorHandler)).mergeTo(ajaxErrors)
    }

    var renderLatest = function(elem, data) {
      if (!data || !data.length || data.length == 0) return;
      var content = _.map(data, entryTemplate).reduce(function(a, b) { return a+b })
      $(content).appendTo(elem)
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
    var logins = loginRequests.where(isSuccess).select(ajaxResponseData)
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
    loggedIns.subscribe(function(userId) { $('#my-page').attr('rel', 'user-' + userId)})

    // open single entries
    var parentArticle = function(el) { return $(el).closest('article') }
    var clickedArticleLinks = entries.clickAsObservable().select(target).where(isLink)
    var clickedArticles = clickedArticleLinks.where(function(elem) { return $(elem).hasClass('more')}).select(parentArticle)

    clickedArticleLinks.where(function(elem) { return $(elem).hasClass('pageLink')})

    var isArticleLoaded = function(el) { var $el = $(el); return $el.hasClass('full') || $el.hasClass('preview')}
    clickedArticles.where(_.compose(not, isArticleLoaded))
      .select(function(el) { return $(el).attr("id").split("-") })
      .selectAjax(getDetails).subscribe(renderExercise)

    clickedArticles.where(isArticleLoaded).subscribe(function(el) { $(el).toggleClass('full').toggleClass('preview') })

    // toggle pages when pageLink is clicked
    var pageAndArgs = function(elem) { return attr('rel', elem).split('-') }
    var pageLinks = $('.pageLink').clickAsObservable().select(target).mergeTo(clickedArticleLinks.where(function(elem) { return $(elem).hasClass('pageLink')}))
    var currentPages = loggedIns.select(always("home"))
      .mergeTo(pageLinks.selectArgs(pageAndArgs)).startWith("latest")

    currentPages.subscribeArgs(function(page) {
      $('body').attr('data-page', page)
      $('#password').attr('value', '')
    })
    var userPages = currentPages.whereArgs(partialEquals("user")).selectArgs(second)
    userPages.subscribe(function(user) {
      $("#button").click(function() {
        $('html, body').animate({
          scrollTop: $('[role="user"]').offset().top
        }, 300);
      });
      $(".current-username").text(user) })

    // initiate loading and search
    var latestScroll = query
      .doAction(function() { entries.html("") })
      .combineWithLatestOf(currentPages)
      .selectArgs(function(query, currentPage) {
        if (query === "")
          return scrollWith(getLatest, entries)
        else
          return getSearchResults(query)
      })
      .switchLatest()
    latestScroll.subscribe(_.partial(renderLatest, entries))

    var userScroll = userPages.distinctUntilChanged().doAction(function() { userEntries.html("") })
      .selectArgs(function(user) {
        return scrollWith(_.partial(getUserExercises, user), userEntries)
      }).switchLatest()
    userScroll.subscribe(_.partial(renderLatest, userEntries))

    // initiate summary loading after login
    var ownSummaries = currentPages.where(partialEquals("home")).combineWithLatestOf(sessions).selectArgs(second).selectAjax(getSummary)
    ownSummaries.subscribe(renderSummary)

    // Kirjaudu sisään clicks toggle password & login fields visibility
    $('#login-link').clickAsObservable().subscribe(function() {
      $('body').toggleClass('login')
      $('#username').focus()
    })
    loggedIns.subscribe(function() { $('body').toggleClass('login', false) })

    // Lisää lenkki
    var addExercises = $('#add-exercise').clickAsObservable().combineWithLatestOf(sessions).selectArgs(second).where(exists).selectAjax(postExercise)

    addExercises.subscribe(_.partial(debug, "log here"))

    _.forEach($(".pageLink"), function(elem) { $(elem).attr('href', "javascript:nothing()") })
  })
})()





