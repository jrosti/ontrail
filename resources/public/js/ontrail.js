(function() {
  $(document).ready(function() {
    $.ajaxSetup({ cache: false })

    var entries = $("#entries")
    var userList = $("#user-results")

    function selectionFormat(state) {
      if (!state.id) return state.toString();
      return state.text.toString();
    }

    var doPostExercise = function(url) {
      var renderSelection = _.compose(encodeURIComponent, selectionFormat)
      var values = $('#add-exercise-form').serialize()
        + "&sport=" + renderSelection($('#ex-sport').select2("data"))
        + "&body=" + encodeURIComponent($('#ex-body').getCode())
        + "&tags=" + _.filter(_.flatten(["", _.map($("#ex-tags").select2("data"), renderSelection)])).join(",")

      return OnTrail.rest.postAsObservable(url, values)
    }

    var postAddExercise = function(user) {
      return doPostExercise("ex/" + user)
    }

    var postEditExercise = function(exercise) {
      return doPostExercise("update/" + exercise)
    }

    var postProfile = function() {
      return OnTrail.rest.postAsObservable("profile", $('#profile-form').serialize())
    }

    var postComment = function(exercise) {
      var values = "body=" + encodeURIComponent($('#comment-body').getCode())
      return OnTrail.rest.postAsObservable("ex/" + exercise + "/comment", values)
    }

    var postRegisterUser = function() {
      return OnTrail.rest.postAsObservable("register", $('#register-form').serialize())
    }

    var confirmDelete = function(dialog, type, id) {
      return $(dialog).dialogAsObservable({
        resizable: false,
        modal: true
      }, [{id: "cancel", name: "Peruuta"}, {id: "delete", name: "Poista!"}]).take(1).where(partialEquals("delete")).select(always([type, id]))

    }

    var confirmDeleteEx = _.partial(confirmDelete, "#dialog-delete-ex-confirm")
    var confirmDeleteComment = _.partial(confirmDelete, "#dialog-delete-comment-confirm")

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
            var iText = function(item) { return $(item).text() }
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
      $('#ex-sport').select2({formatSelection: selectionFormat})
    }
    var renderTags = function(data) {
      $('#ex-tags').select2({
        tags: data,
        tokenSeparators: [",", ";"],
        formatSelection: selectionFormat
      })
    }
    var renderUserList = function(data) {
      ich.usersCreateTemplate({users: data}).appendTo(userList)
    }
    var renderActiveUsersList = function(data) {
      $("#active-users").text(data)
    }

    var monthNames = {
      monthName: function() {
        return DateLocale.FI.monthNames[ this.month ]
      }
    }

    // filters: {year: yyyy, month: mm, week: ww }
    var renderSummary = function(elem, summary) {
      var now = XDate.today();
      var maxYear = $.isArray(summary) ? now.getFullYear() : now.getFullYear()
      var utils = {
        hasNextYear: function() {
          return function(text, render) {
            return this.year != maxYear ? render(text) : "<span style='visibility: none;'>&rarr; </span>"
          }
        },
        nextYear: function() { return this.year + 1 },
        prevYear: function() { return this.year - 1 },
        kind: elem
      }

      if ($.isArray(summary)) {
        var hasSports = function(item) { return item.sports.length > 1 }
        var extendWithMonthName = function(item) { return _.extend(item, monthNames ) }
        var sums = _.map(_.filter(summary, hasSports), extendWithMonthName)
        var sum = _.extend( { year: (summary[0].year) }, { months: sums, "user": summary[0].user }, utils)
        $("#" + elem + "-entries").html(ich.hpkMonthContentTemplate(sum))
      } else {
        var sum = _.extend( { year: now.getFullYear() }, summary, utils)
        $("#" + elem + "-entries").html(ich.hpkContentTemplate(sum))
      }
      $("#" + elem + "-header").html(ich.hpkHeaderTemplate(sum))
    }

    // filters: {year: yyyy, month: mm, week: ww }
    var renderWeeklySummary = function(summary) {
      function toWeeklySummary(month, summaryItem) {
        var monday = new XDate(summaryItem.from)
        var exs = _.groupBy(summaryItem.exs, _attr("dayIndex"))
        for (var i in _.range(0, 7))
          if (exs[i] === undefined) exs[i] = [];
        exs = _.map(exs, function(item, index) {
          return {dayIndex: index, exs: item, class: monday.clone().addDays(index).getMonth() == month ? "current" : "other-month"}
        })
        var monday = new XDate(summary.fromIsoDate)

        var sum = (summaryItem.exs.length > 0 ? summaryItem.summary : [])
        var result = {week: summaryItem.week, exs: exs, summaries: sum }
        return result
      }

      var date = new XDate(summary[0].from)
      var month = date.getMonth()
      var summaries =_.extend( {summary: _.map(summary, _.partial(toWeeklySummary, month)), month: month, year: (1900 + date.getYear()), weeks: (summary.length*2) + 1}, monthNames)
      $(ich.hpkWeeklyContentTemplate(summaries)).appendTo($("#weeksummary"))
    }

    var renderDurationHint = function(duration) { $('#duration-hint').text(duration.time) }
    var renderDistanceHint = function(distance) { $('#distance-hint').text(distance.distance) }

    // logged in state handling
    var doLogin = function() { return OnTrail.rest.postAsObservable("login", $('#login-form').serialize()) }
    var logouts = $("#logout").clickAsObservable()
    var isEnter = function(event) { return event.keyCode == 13; }
    var loginEnters = $("#password").keyupAsObservable().where(isEnter)
    var loginRequests = $("#login").clickAsObservable().merge(loginEnters).selectAjax(doLogin)
    var logins = loginRequests.where(isSuccess).select(ajaxResponseData)
    var loginFails = loginRequests.where(_.compose(not, isSuccess)).select(ajaxResponseData)

    var registerUsers = $('#register-user').onAsObservable('click touchstart').selectAjax(postRegisterUser)
      .doAction(function() { $('#register-form')[0].reset() })
      .where(isSuccess).select(ajaxResponseData);

    // create session
    var sessions = OnTrail.session.create(logins.merge(registerUsers), logouts.merge(loginFails));

    // loggedIn and loggedOut state resolved from session
    var loggedIns = sessions.where(identity)
    var loggedOuts = sessions.where(_.compose(not, identity))

    // toggle logged-in and logged-out
    sessions.subscribe(function(userId) { $('body').toggleClass('logged-in', !!userId).toggleClass('logged-out', !userId) })
    loggedIns.subscribe(function(userId) {
      $('#my-page').attr('rel', 'user-' + userId)
      $('.username').html(userId)
    })

    loggedIns.selectAjax(OnTrail.rest.profile).subscribe(function(profile) {
      _.map(["resthr", "maxhr", "aerk", "anaerk"], function(field) { $('#' + field).val(profile[field]) })
    })

    loggedIns.selectAjax(OnTrail.rest.email).subscribe(function(result) {
      $('#profile-email').text(result.email)
    })

    loggedIns.selectAjax(OnTrail.rest.avatarUrl).subscribe(function(avatar) {
      $('#profile-avatar').attr("src", avatar.url)
    })

    loggedIns.selectAjax(OnTrail.rest.system).subscribe(function(systemstats) {
      _.map(["sysheap", "sysmaxHeap", "sysuptime", "sysexs", "sysusers"], function(field) { $('#' + field).text(systemstats[field]) })
    })

    // open single entries
    var parentArticle = function(el) { return $(el).closest('article') }
    var clickedLinks = $("body").onAsObservable("click touchstart", "a").select(targetLink)
    var clickedArticles = clickedLinks.where(function(elem) { return $(elem).hasClass('more')}).select(parentArticle)

    var isArticleLoaded = function(el) { var $el = $(el); return $el.hasClass('full') || $el.hasClass('preview')}
    clickedArticles.where(isArticleLoaded).subscribe(function(el) { $(el).toggleClass('full').toggleClass('preview') })

    // delete
    var deleteClicks = clickedLinks.combineWithLatestOf(sessions)
      .whereArgs(function(elem, user) { return $(elem).hasClass('delete') && user && $(elem).attr("data-user") == user})
      .select(function(el) { return attr("rel", el).split("-") })
    deleteClicks.selectMany(confirmDeleteEx).selectArgs(first)
      .selectAjax(deleteExerciseOrComment).where(isSuccess).select(ajaxResponseData).subscribe(function(data) {
        $("*[data-id='" + data.id + "']").remove()
      })
    // show own delete buttons
    sessions.subscribe(function(user) {
      $('#logged-in-styles').replaceWith(ich.loggedInStylesTemplate({'user': user }))
    })

    // delete comments
    var deleteCommentClicks = clickedLinks
      .whereArgs(function(elem) { return $(elem).hasClass('delete-comment')})
      .select(function(el) { return attr("rel", el).split("-") })
    deleteCommentClicks.selectMany(confirmDeleteComment).selectArgs(first).selectAjax(deleteExerciseOrComment).where(isSuccess).select(ajaxResponseData)
      .combineWithLatestOf(sessions).subscribeArgs(renderSingleExercise)

    // toggle pages when pageLink is clicked
    var pageAndArgs = _.compose(splitM, _.partial(attr, 'rel'))
    var pageLinks = clickedLinks.where(function(elem) { return $(elem).hasClass('pageLink')})
    var initialPage = function(user) {
      if ($.address.value()) return splitM($.address.value())
      return (user && "summary") || "latest"
    }

    var currentPages = sessions.select(initialPage).merge(pageLinks.selectArgs(pageAndArgs)).doAction(_.partial(debug, "foos")).merge(registerUsers.select(always("profile"))).publish()

    // filtering
    var setFilter = function( filter ) { $("body").attr("data-filter", filter) }
    var filters = currentPages.whereArgs(partialEqualsAny(["summary", "tagsummary"])).subscribeArgs(function() {
      if (arguments.length == 3) setFilter("by-year")
      else if (arguments.length == 4) setFilter("by-month")
      else setFilter("")
    })

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
    currentPages.merge(backPresses).subscribeArgs(showPage)

    var userTagPages = currentPages.whereArgs(partialEqualsAny(["user", "tag"])).distinctUntilChanged()
    userTagPages.subscribeArgs(function(type, id) { $( "#content-header").html(ich[type + "HeaderTemplate"]({"data": id})) })
    userTagPages.scrollWith(OnTrail.rest.exercises, $("#content-entries")).subscribe(renderLatest($("#content-entries")))
    var exPages = currentPages.whereArgs(partialEquals("ex")).selectAjax(OnTrail.rest.details)
    exPages.combineWithLatestOf(sessions).subscribeArgs(renderSingleExercise)

    // initiate loading and search
    var latestScroll = $("#search").valueAsObservable().merge(currentPages.whereArgs(partialEquals("latest")).select(always("")))
      .doAction(function() { entries.html("") })
      .selectArgs(function(query) {
        if (query === "")
          return OnTrail.pager.create(OnTrail.rest.latest, entries)
        else
          return OnTrail.rest.searchResults(query)
      })
      .switchLatest()
    latestScroll.subscribe(renderLatest(entries))

    var weeklyScroll = currentPages.whereArgs(partialEquals("weeksummary"))
      .doAction(function() { $("#weeksummary").html("") })
      .combineWithLatestOf(sessions)
      .selectArgs(function(pg, user) {
        return OnTrail.pager.create(_.partial(OnTrail.rest.weeksummary, user), $("#weeksummary"))
      }).switchLatest()
//    weeklyScroll.subscribe(renderWeeklySummary)

    $("#weeksummary").onAsObservable("hover", ".sport").subscribe(function(el) {
      var e = $(el.target);
      if (el.type === "mouseenter") {
        e.tooltip({content: function() {
          var distance = e.attr("data-distance")
          var duration = e.attr("data-duration")
          return e.attr("data-sport") + ", " + (distance !== "" ? distance : duration)
        }, "items": "[data-sport]", show: false, hide: false})
        e.tooltip("open")
      } else if (el.type === "mouseleave") {
        e.tooltip("close")
      }
      return true;
    })

    // initiate summary loading after login
    var summaries = currentPages.whereArgs(partialEquals("summary")).selectArgs(_.compose(emptyAsUndefined, tail))
      .combineWithLatestOf(sessions).selectArgs(firstDefined).selectAjax(OnTrail.rest.summary)
    summaries.subscribe(_.partial(renderSummary, "summary"))

    var tagSummaries = currentPages.whereArgs(partialEquals("tagsummary")).selectArgs(_.compose(emptyAsUndefined, tail))
      .combineWithLatestOf(sessions).selectArgs(firstDefined).selectAjax(OnTrail.rest.tagsummary)
    tagSummaries.subscribe(_.partial(renderSummary, "tagsummary"))

    // user search scroll
    var usersScroll = $("#search-users").valueAsObservable().merge(currentPages.whereArgs(partialEquals("users")).select(always("")))
      .doAction(function() { console.log(arguments, "usereScroll"); userList.html("") })
      .selectArgs(function(query) {
          if (query === "")
          return OnTrail.pager.create(OnTrail.rest.users, userList)
        else
          return OnTrail.pager.create(_.partial(OnTrail.rest.searchUsers, query), userList)
      })
      .switchLatest()
//    usersScroll.subscribe(renderUserList)

    var onPageLoad = rx.empty().startWith("")
    onPageLoad.selectAjax(OnTrail.rest.sports).subscribe(renderSports)
    loggedIns.selectAjax(OnTrail.rest.allTags).subscribe(renderTags)

    // Lisää lenkki
    var resetEditor = function() {
      $("#add-exercise-form .reset").attr('value', '')
      $("#ex-sport").select2("data", {id: "Juoksu", text: "Juoksu"})
      $("#ex-tags").select2("data", [])
      $("#duration-hint").html("")
      $("#distance-hint").html("")
      $("#ex-body").setCode("<p>\n<br>\n</p>")
    }

    var showExercise = function(ex) { showPage("ex", ex.id); renderSingleExercise(ex) }
    var addExercises = $('#add-exercise').clickAsObservable().select(target).where(_.compose(not, _hasClass("disabled"))).combineWithLatestOf(sessions).selectArgs(second).where(exists).selectAjax(postAddExercise).where(isSuccess).select(ajaxResponseData)
    addExercises.subscribe(showExercise)
    currentPages.whereArgs(partialEquals("addex")).subscribeArgs(function(page, exid) {
      if (exid === undefined) resetEditor()
    })

    currentPages.whereArgs(partialEquals("import")).subscribeArgs(function(page, args) {
      var res = ["reset", ""]
      if (args !== undefined) {
        res = args.split('=')
      }
      if (res[0] === 'ok') {
        $("#import-result").html("<p>Tuonti onnistui: " + res[1] + " harjoitusta lisättiin harjoituspäiväkirjaan.</p>")
      } if (res[0] === 'error') {
        var errors = {"invalidFormat": "virheellinen tiedostomuoto", "alreadyExists": "harjoituspäiväkirja on jo tuotu"}
        $("#import-result").html("<p class=\"error\">Virhe tuonnissa, syy: " + errors[res[1]] + " </p>")
      } if (res[0] === "reset") {
        $("#import-result").html("")
      }
    })

    // muokkaa lenkkiä:
    var renderEditExercise = function(ex) {
      $("[role='addex']").attr('data-mode', 'edit')
      _.map(["title", "duration", "distance", "avghr"], function(field) { $('#ex-' + field).val(ex[field]).keyup() })
      $("#ex-date").attr('value', ex.date)
      $("#ex-date").trigger("cal:changed")
      $("#ex-body").setCode(ex.body)
      $("#ex-sport").select2("data", [ex.sport])
      if (ex.tags && ex.tags.length > 0)
        $("#ex-tags").select2("data", ex.tags)
    }

    var renderProfileUpdate = function(args) {
      var result = _.reduce(_.map([["leposyke", args.resthr], ["maksimisyke", args.maxhr],
        ["anaerobinen kynnys", args.aerk], ["anaerobinen kynnys", args.anaerk]],
        function(val) {
          if (val[1]) {
            return " " + val[0] + ": " + val[1] + " "
          } else {
            return ""
          }}),
        function(fst,snd) { return fst + snd })
      $("#profile-result").html("Sykeprofiili päivitetty tiedoilla: " + result)
    }

    var renderAddExercise = function() {
      resetEditor()
      $("[role='addex']").attr('data-mode', 'add')
    }
    $('.pageLink[rel="addex"]').clickAsObservable().subscribe(renderAddExercise)

    var asExercise = function(__, exercise) { return ["ex", exercise] }
    var editExercise = currentPages.whereArgs(function(page, subPage) { return page === "addex" && subPage })
    editExercise.selectArgs(asExercise).selectAjax(OnTrail.rest.details).subscribe(renderEditExercise)

    // muokkauksen submit
    var updateExercises = $('#edit-exercise').clickAsObservable()
      .combineWithLatestOf(editExercise).selectArgs(_.compose(second, second)).selectAjax(postEditExercise).where(isSuccess).select(ajaxResponseData)
    updateExercises.subscribe(showExercise)

    // update user profile
    var updateProfiles = $('#update-profile').onAsObservable('click touchstart')
      .selectAjax(postProfile).where(isSuccess).select(ajaxResponseData)
    updateProfiles.subscribeArgs(renderProfileUpdate)

    // Lisää kommentti
    var addComments = $('#exercise').clickAsObservable().select(target).where(function(el) { return el.id === "add-comment"})
      .combineWithLatestOf(exPages).selectArgs(second).select(id).selectAjax(postComment).where(isSuccess).select(ajaxResponseData)
    addComments.combineWithLatestOf(sessions).subscribeArgs(renderSingleExercise)

    _.forEach($(".pageLink"), function(elem) { $(elem).attr('href', "javascript:nothing()") })

    var attachValidation = function(validator, error, field) {
      var validation = mkValidation($('#ex-' + field).changes(), validator)
      validation.subscribe(toggleEffect($("." + field + "-" + error)))
      validation.subscribe(toggleClassEffect($('#ex-' + field), "has-error"))
      return validation

    }

    // luo lenkki -validaatio
    var require = _.partial(attachValidation, requiredV(), "required");

    var serverTimeValidator = function() {
      return function(value) {
        if ($.trim(value) == "") return Rx.Observable.returnValue([])
        var request = OnTrail.rest.durationV(value)
        request.where(isSuccess).select(ajaxResponseData).subscribe(renderDurationHint)
        return request.materialize()
          .select(convertToError)
          .dematerialize()
      }}

    var serverDistanceValidator = function() {
      return function(value) {
        if ($.trim(value) == "") return Rx.Observable.returnValue([])
        var request = OnTrail.rest.distanceV(value)
        request.where(isSuccess).select(ajaxResponseData).subscribe(renderDistanceHint)
        return request.materialize()
          .select(convertToError)
          .dematerialize()
      }}

    var timeValidation = mkServerValidation($('#ex-duration').changes(), '/rest/v1/parse-time/', serverTimeValidator).validation
    timeValidation.subscribe(toggleEffect($(".invalid-duration")))
    timeValidation.subscribe(toggleClassEffect($('#ex-duration'), "has-error"))

    var distanceValidation = mkServerValidation($('#ex-distance').changes(), '/rest/v1/parse-distance/', serverDistanceValidator).validation

    var validations = _.flatten([_.map(['title', 'duration'], require), timeValidation, distanceValidation])
    combine(validations).subscribe(toggleClassEffect($('#add-exercise'), "disabled"))

    $('#ex-continuous-date').continuousCalendar({isPopup: true, selectToday: true, weeksBefore: 520, weeksAfter: 0, lastDate: "today", startField: $('#ex-date'), locale: DateLocale.FI })

    var editorSettings = {
      buttons: ['html', '|', 'formatting', '|', 'bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'outdent', 'indent', '|',
        'image', 'table', 'link', '|', 'fontcolor', 'backcolor', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'horizontalrule'],
      minHeight: 200
    }
    $('#ex-body').redactor(editorSettings)

    var pwdLengthValidation = attachValidation(minLengthV(6), 'too-short' ,'password')
    var emailValidation = attachValidation(emailV(), 'invalid' ,'email')

    var samePassword = mkValidation($('#ex-password').changes().combineLatest($('#ex-password2').changes(), asArgs), matchingValuesV())
    samePassword.subscribe(toggleEffect($(".passwords-do-not-match")))
    samePassword.subscribe(toggleClassEffect($('#ex-password2'), "has-error"))

    var usernameAvailableValidator = createAjaxValidator(OnTrail.rest.usernameV);
    var usernameExistsValidation = mkServerValidation($('#ex-username').changes(), '/rest/v1/username-available/', usernameAvailableValidator).validation
    usernameExistsValidation.subscribe(toggleEffect($(".user-exists")))
    usernameExistsValidation.subscribe(toggleClassEffect($('#ex-username'), "has-error"))

    var registerValidations = _.flatten([_.map(['username', 'password'], require), pwdLengthValidation, samePassword, emailValidation, usernameExistsValidation])
    combine(registerValidations).subscribe(toggleClassEffect($('#register-user'), "disabled"))

//    var menuOffsetTop = $('#menu').offset().top
//    var fixMenuPosition = function() {
//      $('#menu').css($(window).scrollTop() > menuOffsetTop ? { 'position': 'fixed', top: '0', margin: '0 auto', padding: '0' } : { 'position': 'relative' })
//      $('#menu ul').css( { margin: $(window).scrollTop() > menuOffsetTop ? '0' : '1em  0' } )
//      $('aside').css($(window).scrollTop() > menuOffsetTop ? { 'position': 'fixed', top: '44px', marginLeft: '706px' } : { 'position': 'relative', top: 'auto', marginLeft: '0' })
//    }


    // initiate current page
    currentPages.connect()
  })
})()

