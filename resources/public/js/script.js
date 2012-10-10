
(function() {
  $(document).ready(function() {
    var entries = $("#entries")
    var userList = $("#user-results")

    var postHeartRateProfile = function(user) {
      return OnTrail.rest.postAsObservable("hr/" + user, $('#profile-form').serialize())
    }

    var doPostExercise = function(url) {
      var values = $('#add-exercise-form').serialize()
        + "&body=" + encodeURIComponent($('#ex-body').getCode())
        + "&tags=" +
        _.reduce(_.flatten(["", _.map($("#ex-tags")[0].selectedOptions, function(option) { return option.value })]),
          function(a, b) { return a + (a !== '' ? "," : "") + encodeURIComponent(b) })

      return OnTrail.rest.postAsObservable(url, values)
    }

    var postAddExercise = function(user) {
      return doPostExercise("ex/" + user)
    }

    var postEditExercise = function(exercise) {
      return doPostExercise("update/" + exercise)
    }

    var postComment = function(exercise) {
      var values = "body=" + encodeURIComponent($('#comment-body').getCode())
      return OnTrail.rest.postAsObservable("ex/" + exercise + "/comment", values)
    }
    var deleteExerciseOrComment = function() {
      return OnTrail.rest.deleteAsObservable.apply(OnTrail.rest, arguments);
    }

    var render = function(template, data) {
      return template(data)[0].outerHTML
    }

    var takeMax = function(renderer, left, str) {
      if (left.remaining == 0 || str === undefined) return left
      var max = left.remaining
      var isLast = str.length > max+3
      var data = left.data + renderer(isLast ? str.substring(0, max) + "..." : str)
      return { data: data, remaining: isLast ? 0 : (max-str.length) }
    }

    var renderLatest = function(el) {
      var helpers = {
        trunc: function () {
          return function(text, render) {
            var body = $('<div></div>').html(this.body);
            var wrapWithParagraph = function(item) { return "<p>" + item + "</p>" }
            var iText = function(item) { return item.innerText }
            return _.reduce(_.map(body.children("*"), iText), _.partial(takeMax, wrapWithParagraph), { data: "", remaining: 150 }).data
          }
        }
      }
      return _.partial(function(elem, data) {
        if (!data || !data.length || data.length == 0) return;
        var mappedData = _.map(data, function(item) { return _.extend(item, helpers)} )
        var content = _.map(mappedData, _.partial(render, ich.exerciseTemplate)).join("")
        $(content).appendTo(elem)
      }, $(el))
    }
    var renderSingleExercise = function(exercise, me) {
      var helpers = {
        deleteComment: function () {
          return function(text, render) {
            if (this.user !== me && exercise.user !== me) return ""
            this.deleteRel = (this.user === me ? "ex-" : "own-ex-") + exercise.id + (this.user === me ? "-own-comment-" : "-comment-") + this.id;
            return render(text)
          }
        }
      }
      $('#exercise').html(ich.singleExerciseTemplate(_.extend(exercise, helpers)))
      $('#comment-body').redactor(editorSettings)
    }
    var renderSports = function(data) {
      ich.sportsCreateTemplate({sports: _.filter(data, identity)}).appendTo($('#ex-sport'))
      $('#ex-sport').chosen()
    }
    var renderTags = function(data) {
      ich.tagsCreateTemplate({tags: data}).appendTo($('#ex-tags'))
      $('#ex-tags').chosen({ "create_option": true, "persistent_create_option": true })
    }
    var renderUserList = function(data) {
      ich.usersCreateTemplate({users: data}).appendTo(userList)
    }

    // filters: {year: yyyy, month: mm, week: ww }
    var renderSummary = function(summary) {
      var now = XDate.today();
      var utils = {
        hasNextYear: function() {
          return function(text, render) {
            console.log("foo " + text)
            return this.year != now.getFullYear() ? render(text) : ""
          }
        },
        nextYear: function() { return this.year + 1 },
        prevYear: function() { return this.year - 1 }
      }
      var sum = _.extend({year: now.getFullYear(), month: now.getMonth(), week: now.getWeek() }, summary, utils)
      console.log(sum)

      $("#content-entries").html(ich.hpkContentTemplate(sum))
      $("#content-header").html(ich.hpkHeaderTemplate(sum))
    }

    var renderDurationHint = function(duration) { $('#duration-hint').text(duration.time) }

    // logged in state handling
    var doLogin = function() { return OnTrail.rest.postAsObservable("login", $('#login-form').serialize()) }
    var logouts = $("#logout").clickAsObservable()
    var isEnter = function(event) { return event.keyCode == 13; }
    var loginEnters = $("#password").keyupAsObservable().where(isEnter)
    var loginRequests = $("#login").clickAsObservable().mergeTo(loginEnters).selectAjax(doLogin)
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
    var clickedArticleLinks = $("body").onAsObservable("click touchstart", "a").select(target)
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
    // show own delete buttons
    sessions.subscribe(function(user) {
      $('#logged-in-styles').replaceWith(ich.loggedInStylesTemplate({'user': user }))
    })

    // delete comments
    var deleteCommentClicks = clickedArticleLinks
      .whereArgs(function(elem) { return $(elem).hasClass('delete-comment')})
      .select(function(el) { return attr("rel", el).split("-") })
    deleteCommentClicks.selectAjax(deleteExerciseOrComment).where(isSuccess).select(ajaxResponseData)
      .combineWithLatestOf(sessions).subscribeArgs(renderSingleExercise)


    // toggle pages when pageLink is clicked
    var pageAndArgs = _.compose(splitM, _.partial(attr, 'rel'))
    var pageLinks = clickedArticleLinks.where(function(elem) { return $(elem).hasClass('pageLink')})
    var initialPage = function(user) {
      return splitM($.address.value()) || (user && "home") || "latest"
    }
    var currentPages = sessions.select(initialPage).mergeTo(pageLinks.selectArgs(pageAndArgs))

    // back button handling
    var backPresses = Rx.Observable.create(function( observer ) {
      var next = function() { observer.onNext($.address.value())}
      $.address.init(next).change(next)
      return nothing()
    }).select(splitM)

    var showPage = function() {
      var pages = _.argsToArray(arguments)
      $('body').attr('data-page', pages[0])
      $('#password').attr('value', '')
      $.address.value(pages.join("-"))
    }
    currentPages.mergeTo(backPresses).subscribeArgs(showPage)

    var userPages = currentPages.whereArgs(partialEqualsAny(["user", "tag"]))
    userPages.subscribeArgs(function(type, id) { $( "#content-header").html(ich[type + "HeaderTemplate"]({"data": id})) })
    userPages.scrollWith(OnTrail.rest.exercises, $("#content-entries")).subscribe(renderLatest($("#content-entries")))

    var exPages = currentPages.whereArgs(partialEquals("ex")).selectAjax(OnTrail.rest.details)
    exPages.combineWithLatestOf(sessions).subscribeArgs(renderSingleExercise)

    // initiate loading and search
    var latestScroll = $("#search").valueAsObservable().mergeTo(currentPages.whereArgs(partialEquals("latest")).select(always("")))
      .doAction(function() { entries.html("") })
      .selectArgs(function(query) {
        if (query === "")
          return OnTrail.pager.create(OnTrail.rest.latest, entries)
        else
          return OnTrail.rest.searchResults(query)
      })
      .switchLatest()
    latestScroll.subscribe(renderLatest(entries))

    // initiate summary loading after login
      var ownSummaries = currentPages.whereArgs(partialEquals("home")).selectArgs(_.compose(emptyAsUndefined, tail))
        .combineWithLatestOf(sessions).selectArgs(firstDefined).selectAjax(OnTrail.rest.summary).subscribe(renderSummary)

    // user search scroll
    var usersScroll = $("#search-users").valueAsObservable().mergeTo(currentPages.whereArgs(partialEquals("users")).select(always("")))
      .doAction(function() { userList.html("") })
      .selectArgs(function(query) {
        if (query === "")
          return OnTrail.pager.create(OnTrail.rest.users, userList)
        else
          return OnTrail.pager.create(_.partial(OnTrail.rest.searchUsers, query), userList)
      })
      .switchLatest()
    usersScroll.subscribe(renderUserList)


    // Kirjaudu sisään clicks toggle password & login fields visibility
    $('#login-link').clickAsObservable().subscribe(function() {
      $('body').toggleClass('login')
      $('#username').focus()
    })
    loggedIns.subscribe(function() { $('body').toggleClass('login', false) })

    var onPageLoad = rx.empty().startWith("")
    onPageLoad.selectAjax(OnTrail.rest.sports).subscribe(renderSports)
    loggedIns.selectAjax(OnTrail.rest.allTags).subscribe(renderTags)

    // Lisää lenkki
    var resetEditor = function() {
      $("#add-exercise-form .reset").attr('value', '')
      $("#ex-sports option").removeAttr('selected')
      $("#ex-tags option").removeAttr('selected')
      $("#ex_tags_chzn .search-choice").remove()
      $("#duration-hint").html("")
      $("#ex-body").setCode("")
    }
    var showExercise = function(ex) { resetEditor(); showPage("ex"); renderSingleExercise(ex) }
    var addExercises = $('#add-exercise').clickAsObservable().select(target).where(_.compose(not, _hasClass("disabled"))).combineWithLatestOf(sessions).selectArgs(second).where(exists).selectAjax(postAddExercise).where(isSuccess).select(ajaxResponseData)
    addExercises.subscribe(showExercise)

    // muokkaa lenkkiä:
    var renderEditExercise = function(ex) {
      $("[role='addex']").attr('data-mode', 'edit')
      _.map(["title", "duration", "distance", "avghr"], function(field) { $('#ex-' + field).val(ex[field]).keyup() })
      $("#ex-date").attr('value', ex.date)
      $("#ex-date").trigger("cal:changed")
      $("#ex-body").setCode(ex.body)
      $("#ex-sport").val(ex.sport)
      $("#ex-sport").trigger("liszt:updated")
      $("#ex-tags").val(ex.tags)
      $("#ex-tags").trigger("liszt:updated")
    }

    var renderAddExercise = function() { $("[role='addex']").attr('data-mode', 'add') }
    $('.pageLink[rel="addex"]').clickAsObservable().subscribe(renderAddExercise)

    var asExercise = function(__, exercise) { return ["ex", exercise] }
    var editExercise = currentPages.whereArgs(function(page, subPage) { return page === "addex" && subPage })
    editExercise.selectArgs(asExercise).selectAjax(OnTrail.rest.details).subscribe(renderEditExercise)

    // muokkauksen submit
    var updateExercises = $('#edit-exercise').clickAsObservable()
      .combineWithLatestOf(editExercise).selectArgs(_.compose(second, second)).selectAjax(postEditExercise).where(isSuccess).select(ajaxResponseData)
    updateExercises.subscribe(showExercise)


    // Lisää kommentti
    var addComments = $('#exercise').clickAsObservable().select(target).where(function(el) { return el.id === "add-comment"})
      .combineWithLatestOf(exPages).selectArgs(second).select(id).selectAjax(postComment).where(isSuccess).select(ajaxResponseData)
    addComments.combineWithLatestOf(sessions).subscribeArgs(renderSingleExercise)

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
    combine(validations).subscribe(toggleClassEffect($('#add-exercise'), "disabled"))

    var tomorrow = (new XDate()).addDays(1).clearTime()
    $('#ex-continuous-date').continuousCalendar({isPopup: true, selectToday: true, weeksBefore: 520, weeksAfter: 0, lastDate: tomorrow, startField: $('#ex-date'), locale: DateLocale.FI })

    var editorSettings = {
      buttons: ['html', '|', 'formatting', '|', 'bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'outdent', 'indent', '|',
        'image', 'table', 'link', '|', 'fontcolor', 'backcolor', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'horizontalrule'],
        minHeight: 200
    }
    $('#ex-body').redactor(editorSettings)
  })
})()
