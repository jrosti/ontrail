
(function() {
  $(document).ready(function() {
    var entries = $("#entries")
    var userEntries = $("#user-entries")
    var tagEntries = $("#tag-entries")
    var allEntries = $("#entries,#user-entries,#tag-entries,#exercise")

    var postExercise = function(user) {
      var values = $('#add-exercise-form').serialize() + "&tags=" +
        _.reduce(_.flatten(["", _.map($("#ex-tags")[0].selectedOptions, function(option) { return option.value })]),
          function(a, b) { return a + (a !== '' ? "," : "") + encodeURIComponent(b) })

      return OnTrail.rest.postAsObservable("ex/" + user, values)
    }
    var postComment = function(exercise) { return OnTrail.rest.postAsObservable("ex/" + exercise + "/comment", $('#add-comment-form').serialize()) }
    var deleteExerciseOrComment = function(type, id) {
      return OnTrail.rest.deleteAsObservable(type, id);
    }

    var render = function(template, data) {
      return template(data)[0].outerHTML
    }

    var renderLatest = function(el) {
      var helpers = {
        trunc: function () {
          return function(text, render) {
            var result = render(text)
            return (result.length < 153) ? result : result.substr(0, 150) + '... '
          }
        }
      }
      return _.partial(function(elem, data) {
        if (!data || !data.length || data.length == 0) return;
        var mappedData = _.map(data, function(item) { return _.extend(item, helpers)} )
        var content = _.map(mappedData, _.partial(render, ich.exerciseTemplate)).reduce(function(a, b) { return a + b })
        $(content).appendTo(elem)
      }, $(el))
    }
    var renderSingleExercise = function(exercise) {
      $('#exercise').html(ich.singleExerciseTemplate(exercise))

      var commentBodyValidation = mkValidation($('#comment-body').changes(), requiredV())
      commentBodyValidation.subscribe(toggleEffect($(".comment-body-required")))
      var commentTitleValidation = mkValidation($('#comment-title').changes(), requiredV())
      commentTitleValidation.subscribe(toggleEffect($(".comment-title-required")))
      combine([commentBodyValidation, commentTitleValidation]).subscribe(disableEffect($('#add-comment')))
    }
    var renderSports = function(data) {
      ich.sportsCreateTemplate({sports: data}).appendTo($('#ex-sport'))
      $('#ex-sport').chosen()
    }
    var renderTags = function(data) {
      ich.tagsCreateTemplate({tags: data}).appendTo($('#ex-tags'))
      $('#ex-tags').chosen({ "create_option": true, "persistent_create_option": true })
    }
    var renderSummary = function(summary) {
      if (!summary || !summary.length || summary.length == 0) return;
      var content = _.map(summary, _.partial(render, ich.summaryTemplate) ).reduce(function(a, b) { return a+b })
      $(content).appendTo($('#homies tbody'))
    }
    var renderDurationHint = function(duration) { $('#duration-hint').text(duration.time) }

    // logged in state handling
    var doLogin = function() { return OnTrail.rest.postAsObservable("login", $('#login-form').serialize()) }
    var logouts = $("#logout").clickAsObservable()
    var loginRequests = $("#login").clickAsObservable().selectAjax(doLogin)
    var logins = loginRequests.where(isSuccess).select(ajaxResponseData)
    var loginFails = loginRequests.where(_.compose(not, isSuccess)).select(ajaxResponseData)

    // create session
    var sessions = OnTrail.session.create(logins, logouts.mergeTo(loginFails));

    // loggedIn and loggedOut state resolved from session
    var loggedIns = sessions.where(identity)
    var loggedOuts = sessions.where(_.compose(not, identity))

    // toggle logged-in and logged-out
    sessions.subscribe(function(userId) { $('body').toggleClass('logged-in', !!userId).toggleClass('logged-out', !userId) })
    loggedIns.subscribe(function(userId) { $('#my-page').attr('rel', 'user-' + userId)})

    // open single entries
    var parentArticle = function(el) { return $(el).closest('article') }
    var clickedArticleLinks = allEntries.clickAsObservable().select(target).where(isLink)
    var clickedArticles = clickedArticleLinks.where(function(elem) { return $(elem).hasClass('more')}).select(parentArticle)

    var isArticleLoaded = function(el) { var $el = $(el); return $el.hasClass('full') || $el.hasClass('preview')}
    clickedArticles.where(isArticleLoaded).subscribe(function(el) { $(el).toggleClass('full').toggleClass('preview') })

    // delete
    var deleteClicks = clickedArticleLinks.combineWithLatestOf(sessions)
      .whereArgs(function(elem, user) { return $(elem).hasClass('delete') && user && $(elem).attr("data-user") == user})
      .select(function(el) { return attr("rel", el).split("-") })
    deleteClicks.selectAjax(deleteExerciseOrComment).where(isSuccess).select(ajaxResponseData).subscribe(function(data) {
      $("*[data-id='" + data.id + "']").remove()
    })

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

    // TODO: Handlebars maybe?
    var userPages = currentPages.whereArgs(partialEquals("user")).selectArgs(second)
    userPages.subscribe(function(user) { $(".current-username").text(user) })

    // TODO: Handlebars maybe?
    var tagPages = currentPages.whereArgs(partialEquals("tag")).selectArgs(second)
    tagPages.subscribe(function(tag) { $(".current-tag").text(tag) })

    var exPages = currentPages.whereArgs(partialEquals("ex")).selectAjax(OnTrail.rest.details)
    exPages.subscribe(renderSingleExercise)

    // initiate loading and search
    var query = $("#search").keyupAsObservable().throttle(500).select(_.compose(value, target)).distinctUntilChanged().startWith("")

    var latestScroll = query.mergeTo(currentPages.whereArgs(partialEquals("latest")).select(always("")))
      .doAction(function() { entries.html("") })
      .selectArgs(function(query) {
        if (query === "")
          return OnTrail.pager.create(OnTrail.rest.latest, entries)
        else
          return OnTrail.rest.searchResults(query)
      })
      .switchLatest()
    latestScroll.subscribe(renderLatest(entries))

    // scrolling on user page
    userPages.scrollWith(OnTrail.rest.userExercises, userEntries).subscribe(renderLatest(userEntries))

    // scrolling on tag page
    tagPages.scrollWith(OnTrail.rest.tagExercises, tagEntries).subscribe(renderLatest(tagEntries))

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
    var addExercises = $('#add-exercise').clickAsObservable().combineWithLatestOf(sessions).selectArgs(second).where(exists).selectAjax(postExercise).where(isSuccess).select(ajaxResponseData)
    addExercises.doAction(function() {
      $("#add-exercise-form .reset").attr('value', '')
    }).subscribe(function(ex) { showPage("ex"); renderSingleExercise(ex) })
    // Lisää kommentti
    var addComments = $('#exercise').clickAsObservable().select(target).where(function(el) { return el.id === "add-comment"})
      .combineWithLatestOf(exPages).selectArgs(second).select(id).selectAjax(postComment).where(isSuccess).select(ajaxResponseData)
    addComments.subscribe(renderSingleExercise)

    _.forEach($(".pageLink"), function(elem) { $(elem).attr('href', "javascript:nothing()") })

    // luo lenkki -validaatio
    var require = function(field) {
      var validation = mkValidation($('#ex-' + field).changes(), requiredV())
      validation.subscribe(toggleEffect($("." + field + "-required")))
      validation.subscribe(toggleClassEffect($('#ex-' + field), "has-error"))
      return validation
    }

    var serverTimeValidator = function() {
      var convertToError = function(n) {
        function toNext(x) { return new Rx.Notification.createOnNext(x) }

        switch (n.kind) {
          case 'E':
            try {
              return toNext([$.parseJSON(n.value.jqXHR.responseText)['message']])
            } catch (e) { return n }
          case 'N': {
            if (n.value.jqXHR.status == 200 && n.value.data.success !== false) return toNext([])
            else return toNext($.parseJSON(n.value.jqXHR.responseText)['message']) // check if this could be return as array instead
          }
          default : return n
        }
      }

      return function(value) {
        if ($.trim(value) == "") return Rx.Observable.returnValue([])
        var request = OnTrail.rest.durationV(value)
        request.where(isSuccess).select(ajaxResponseData).subscribe(renderDurationHint)
        return request.materialize()
          .select(convertToError)
          .dematerialize()
      }}

    var timeValidation = mkServerValidation($('#ex-duration').changes(), '/rest/v1/parse-time/', serverTimeValidator).validation
    timeValidation.subscribe(toggleEffect($(".invalid-duration")))
    timeValidation.subscribe(toggleClassEffect($('#ex-duration'), "has-error"))
    var validations = _.flatten([_.map(['title', 'duration'], require), timeValidation])
    combine(validations).subscribe(disableEffect($('#add-exercise')))

    var onPageLoad = rx.empty().startWith("")
    onPageLoad.selectAjax(OnTrail.rest.sports).subscribe(renderSports)
    loggedIns.selectAjax(OnTrail.rest.allTags).subscribe(renderTags)

    var tomorrow = (new XDate()).addDays(1).clearTime()
    $('#ex-continuous-date').continuousCalendar({isPopup: true, selectToday: true, weeksBefore: 52, weeksAfter: 0, lastDate: tomorrow, startField: $('#ex-date'), locale: DateLocale.FI })
  })
})()
