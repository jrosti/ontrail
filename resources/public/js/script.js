
(function() {
  $(document).ready(function() {
    var entries = $("#entries")
    var userEntries = $("#user-entries")
    var allEntries = $("#entries,#user-entries")

    var entryTemplate = Handlebars.compile($("#summary-entry-template").html());
    var exerciseTemplate = Handlebars.compile($("#exercise-template").html());
    var summaryTemplate = Handlebars.compile($("#summary-template").html());

    var query = $("#search").keyupAsObservable().throttle(500).select(_.compose(value, target)).distinctUntilChanged().startWith("")

    var postExercise = function(user) { return OnTrail.rest.postAsObservable("ex/" + user, $('#add-exercise-form').serialize()) }

    var renderLatest = function(elem, data) {
      if (!data || !data.length || data.length == 0) return;
      var content = _.map(data, entryTemplate).reduce(function(a, b) { return a+b })
      $(content).appendTo(elem)
    }
    var renderExercise = function(exercise) {
      $('[data-id=' + exercise.id + ']').replaceWith($(exerciseTemplate(exercise)))
    }
    var renderSummary = function(summary) {
      if (!summary || !summary.length || summary.length == 0) return;
      var content = _.map(summary, summaryTemplate).reduce(function(a, b) { return a+b })
      $(content).appendTo($('#homies tbody'))
    }

    var doLogin = function() { return OnTrail.rest.postAsObservable("login", $('#login-form').serialize()) }
    var logouts = $("#logout").clickAsObservable()
    var loginRequests = $("#login").clickAsObservable().selectAjax(doLogin)
    var logins = loginRequests.where(isSuccess).select(ajaxResponseData)
    var loginFails = loginRequests.where(_.compose(not, isSuccess)).select(ajaxResponseData)
    var sessions = OnTrail.session.create(logins, loginFails, logouts);

    var loggedIns = sessions.where(identity)
    var loggedOuts = sessions.where(_.compose(not, identity))

    // toggle logged-in and logged-out
    sessions.subscribe(function(userId) { $('body').toggleClass('logged-in', !!userId).toggleClass('logged-out', !userId) })
    loggedIns.subscribe(function(userId) { $('#my-page').attr('rel', 'user-' + userId)})

    // open single entries
    var parentArticle = function(el) { return $(el).closest('article') }
    var clickedArticleLinks = allEntries.clickAsObservable().select(target).where(isLink)
    var clickedArticles = clickedArticleLinks.where(function(elem) { return $(elem).hasClass('more')}).select(parentArticle)

//    clickedArticleLinks.where(function(elem) { return $(elem).hasClass('pageLink')})

    var isArticleLoaded = function(el) { var $el = $(el); return $el.hasClass('full') || $el.hasClass('preview')}
    clickedArticles.where(_.compose(not, isArticleLoaded))
      .select(function(el) { return ['ex', $(el).attr("data-id")] })
      .selectAjax(OnTrail.rest.details).subscribe(renderExercise)

    clickedArticles.where(isArticleLoaded).subscribe(function(el) { $(el).toggleClass('full').toggleClass('preview') })

    // toggle pages when pageLink is clicked
    var pageAndArgs = function(elem) { return attr('rel', elem).split('-') }
    var pageLinks = $('.pageLink').clickAsObservable().select(target).mergeTo(clickedArticleLinks.where(function(elem) { return $(elem).hasClass('pageLink')}))
    var currentPages = loggedIns.select(always("home"))
      .mergeTo(pageLinks.selectArgs(pageAndArgs)).startWith("latest")

    var showPage = function(page) {
      $('body').attr('data-page', page)
      $('#password').attr('value', '')
    }
    currentPages.subscribeArgs(showPage)
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
          return OnTrail.pager.create(OnTrail.rest.latest, entries)
        else
          return OnTrail.rest.searchResults(query)
      })
      .switchLatest()
    latestScroll.subscribe(_.partial(renderLatest, entries))

    var userScroll = userPages.distinctUntilChanged().doAction(function() { userEntries.html("") })
      .selectArgs(function(user) {
        return OnTrail.pager.create(_.partial(OnTrail.rest.userExercises, user), userEntries)
      }).switchLatest()
    userScroll.subscribe(_.partial(renderLatest, userEntries))

    // initiate summary loading after login
    var ownSummaries = currentPages.where(partialEquals("home")).combineWithLatestOf(sessions).selectArgs(second).selectAjax(OnTrail.rest.summary)
    ownSummaries.subscribe(renderSummary)

    // Kirjaudu sisään clicks toggle password & login fields visibility
    $('#login-link').clickAsObservable().subscribe(function() {
      $('body').toggleClass('login')
      $('#username').focus()
    })
    loggedIns.subscribe(function() { $('body').toggleClass('login', false) })

    // Lisää lenkki
    var addExercises = $('#add-exercise').clickAsObservable().combineWithLatestOf(sessions).selectArgs(second).where(exists).selectAjax(postExercise)

    addExercises.subscribe(_.partial(showPage, "home"))

    _.forEach($(".pageLink"), function(elem) { $(elem).attr('href', "javascript:nothing()") })
    // pimp selection boxes
    $(".chzn-select").chosen()
  })
})()
