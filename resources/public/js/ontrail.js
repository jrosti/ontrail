(function() {
  $(document).ready(function() {

    var ww = $(window).width(), sw = screen.width, orientation = window.orientation;

    // Fix: On iOS, screen.width is always the width of the device held in portrait mode.
    // Android, however, sets it to the width of the device in its current orientation.
    // This ends up breaking our detection on HD devices held in landscape mode, so we
    // do a little trick here to detect this condition and make things right.
    if (screen.width > screen.height
      &&	Math.abs(orientation) == 90)
      sw = screen.height;

    var mobile = (ww <= 480 || sw <= 480) || Modernizr.touch;

    var clickEvent = "click touchstart"

    $.ajaxSetup({ cache: false })

    var entries = $("#entries")
    var userList = $("#user-results")

    function selectionFormat(state) {
      if (!state.id) return state.toString();
      return state.text.toString();
    }

    var doPostExercise = function(url) {
      var renderSelection = _.compose(encodeURIComponent, selectionFormat)
      var sport = (!Modernizr.touch) ? $("#ex-sport").select2("data") : $("#ex-sport").val();
        var values = $('#add-exercise-form').serialize()
        + "&sport=" + renderSelection(sport)
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

    var postChangePassword = function() {
      return OnTrail.rest.postAsObservable("change-password", $('#change-password-form').serialize())
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
      return $(template(data)[0]).html()
    }

    var takeMax = function(renderer, left, str) {
      if (left.remaining == 0 || str === undefined) return left
      var max = left.remaining
      var isLast = str.length > max+3
      var data = left.data + renderer(isLast ? str.substring(0, max) + "..." : str)
      return { data: data, remaining: isLast ? 0 : (max-str.length) }
    }

    var renderLatest = function(el, tableEl) {
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
      return _.partial(function(elem, tableElem, data) {
        if (!data || !data.length || data.length == 0) return;
        var mappedData = _.map(data, function(item) { return _.extend(item, helpers)} )
        var content = _.map(mappedData, _.partial(render, ich.exerciseTemplate)).join("")
        $(content).appendTo(elem)

        var tableContent = _.map(mappedData, _.partial(render, ich.exerciseSummaryTemplate)).join("")
        $(tableContent).appendTo(tableElem)
      }, $(el), $(tableEl))
    }
    var renderSingleExercise = function(exercise, me) {
      renderUserMenu(exercise.user)
      var helpers = {
        deleteComment: function () {
          return function(text, render) {
            if (this.user !== me && exercise.user !== me) return ""
            this.deleteRel = (this.user === me ? "ex/" : "own/ex/") + exercise.id + (this.user === me ? "/own/comment/" : "/comment/") + this.id;
            return render(text)
          }
        }
      }
      $('#exercise').html(ich.singleExerciseTemplate(_.extend(exercise, helpers)))
      $('#comment-body').redactor(editorSettings)
    }
    var renderSports = function(data) {
      ich.sportsCreateTemplate({sports: _.filter(data, identity)}).appendTo($('#ex-sport'))
      if(!Modernizr.touch)
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

    var renderChangePassword = function(data) {
      $("#change-password-form")[0].reset()
      if (data.username) {
        $("#password-change-result").text("Salasanan vaihto onnistui!")
      } else {
        $("#password-change-result").text("Salasanan vaihto epäonnistui!")
      }
    }

    var monthNames = {
      monthName: function() {
        return DateLocale.FI.monthNames[ this.month ]
      }
    }

    // filters: {year: yyyy, month: mm, week: ww }
    var renderSummary = function(elem, summary) {
      var now = XDate.today();
      var maxYear = now.getFullYear()
      var utils = {
        hasNextYear: function() { return this.year != maxYear },
        nextYear: function() { return this.year + 1 },
        prevYear: function() { return this.year - 1 },
        kind: elem
      }

      if ($.isArray(summary)) {
        var hasSports = function(item) { return item.sports.length > 0 }
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
        var resex = [];
        for (var i in _.range(0, 7))
          if (exs[i] === undefined) resex[i] = []; else resex[i] = exs[i];
        exs = _.map(resex, function(item, index) {
          return {dayIndex: index, exs: item, "class": monday.clone().addDays(index).getMonth() == month ? "current" : "other-month"}
        })
        var monday = new XDate(summary.fromIsoDate)
        var sum = (summaryItem.exs.length > 0 ? summaryItem.summary : [])
        var result = {week: summaryItem.week, exs: exs, summaries: sum }
        return result
      }

      var date = new XDate(summary[0].from)
      var month = date.getMonth()
      var summaries =_.extend( {summary: _.map(summary, _.partial(toWeeklySummary, month)), month: month, year: date.getFullYear(), weeks: (summary.length*2) + 1}, monthNames)
      $(ich.hpkWeeklyContentTemplate(summaries)).appendTo($("#weeksummary"))
    }

    var renderDurationHint = function(duration) { $('#duration-hint').html(duration.time) }
    var renderDistanceHint = function(distance) { $('#distance-hint').html(distance.distance) }

    // logged in state handling
    var doLogin = function() { return OnTrail.rest.postAsObservable("login", $('#login-form').serialize()) }
    var logouts = $("#logout").onClickTouchAsObservable(clickEvent)
    var isEnter = function(event) { return event.keyCode == 13; }
    var loginEnters = $("#password").keyupAsObservable().where(isEnter)
    var loginRequests = $("#login").onClickTouchAsObservable(clickEvent).merge(loginEnters).selectAjax(doLogin)
    var logins = loginRequests.where(isSuccess).select(ajaxResponseData)
    var loginFails = loginRequests.where(_.compose(not, isSuccess)).select(ajaxResponseData)

    $("#gotoLogin").onClickTouchAsObservable(clickEvent).subscribe(function() {
      $("html, body").animate({ scrollTop: $("#login-wrapper").offset().top - 110 }, 1000)
    })

    var registerUsers = $('#register-user').onClickTouchAsObservable(clickEvent).select(target).where(_.compose(not, _hasClass("disabled"))).selectAjax(postRegisterUser)
      .doAction(function() {  $('#register-form')[0].reset() })
      .where(isSuccess).select(ajaxResponseData)

    // change password
    var changePasswords = $('#change-password').onClickTouchAsObservable(clickEvent).select(target).where(_.compose(not, _hasClass("disabled")))
      .selectAjax(postChangePassword).where(isSuccess).select(ajaxResponseData)
    changePasswords.subscribeArgs(renderChangePassword)

    // create session
    var sessions = OnTrail.session.create(logins.merge(registerUsers).merge(changePasswords), logouts.merge(loginFails))
    var loggedIns = sessions.where(identity)

    // toggle logged-in and logged-out
    sessions.subscribe(function(userId) { $('body').toggleClass('logged-in', !!userId).toggleClass('logged-out', !userId) })
    loggedIns.subscribe(function(userId) {
      $('.username').html(userId)
    })

    function renderNewContent(el, countEl, tableEl) {
      return function(content) {
        var items = asArgs(content)
        if (asArgs(content).length > 0) {
          var newComments = _(items).filter(_prop("newComments")).map(_prop("newComments")).reduce(function(a, b) { return a + b })
          $(countEl).text(newComments).show()
          $(el).html("")
          renderLatest(el, tableEl)(items)
        } else {
          $(countEl).hide()
          $(el).html("<article>Ei uusia kommentteja</article>")
        }
      }
    }

    loggedIns.selectAjax(OnTrail.rest.profile).subscribe(function(profile) {
      _.map(["goals", "synopsis", "resthr", "maxhr", "aerk", "anaerk"], function(field) { $('#' + field).val(profile[field]) })
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
    var clickedLinks = $("body").onClickTouchAsObservable(clickEvent, "a").select(targetLink).publish()
    clickedLinks.connect()
    var clickedArticles = clickedLinks.where(function(elem) { return $(elem).hasClass('more')}).select(parentArticle)

    var isArticleLoaded = function(el) { var $el = $(el); return $el.hasClass('full') || $el.hasClass('preview')}
    clickedArticles.where(isArticleLoaded).subscribe(function(el) { $(el).toggleClass('full').toggleClass('preview') })

    // delete
    var deleteClicks = clickedLinks.combineWithLatestOf(sessions)
      .whereArgs(function(elem, user) { return $(elem).hasClass('delete') && user && $(elem).attr("data-user") == user})
      .select(function(el) { return attr("rel", el).split("/") })
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
      .select(function(el) { return attr("rel", el).split("/") })
    deleteCommentClicks.selectMany(confirmDeleteComment).selectArgs(first).selectAjax(deleteExerciseOrComment).where(isSuccess).select(ajaxResponseData)
      .combineWithLatestOf(sessions).subscribeArgs(renderSingleExercise)

    // toggle pages when pageLink is clicked
    var pageAndArgs = _.compose(splitM, _.partial(attr, 'rel'))
    var pageLinks = clickedLinks.where(function(elem) { return $(elem).hasClass('pageLink')})
    var initialPage = function(user) {
      var address = $.address.value()
      if (address && address != "") return splitM($.address.value())
      return (user && ["user", user]) || "latest"
    }
    var currentPages = sessions.select(initialPage).merge(pageLinks.selectArgs(pageAndArgs)).merge(registerUsers.select(always("profile"))).publish()

    currentPages.whereArgs(partialEquals("register")).subscribe(function() {
      $("html, body").animate({ scrollTop: $("#content-wrapper").offset().top - 110 }, 1000)
    })

    var findUser = function(inArgs, currentUser, pos) {
      var args = asArgs(inArgs)
      var userPos = _(args).indexOf("user")
      if (userPos >= 0 && userPos+1 < args.length)
        return args[userPos+1]
      var position = (pos || 0)
      if (args && args.length >= position && _(["user", "tagsummary", "weeksummary", "summary"]).find(partialEquals(args[position-1])))
        return (args.length > position) ? args[position] : currentUser
      return currentUser
    }
    var _findUser = function(pos) { return function(args, currentUser) { return findUser(args, currentUser, pos )} }

    var appendUser = function(args, currentUser, pos) {
      return (args.length > (pos || 0)) ? args : args.concat(currentUser)
    }
    var _appendUser = function(pos) { return function(args, currentUser) { return appendUser(args, currentUser, pos )} }


    // filtering
    var setFilter = function( filter ) { $("body").attr("data-filter", filter) }
    var filters = currentPages.whereArgs(partialEqualsAny(["summary", "tagsummary"])).combineWithLatestOf(sessions).selectArgs(_appendUser(1)).subscribeArgs(function() {
      if (arguments.length == 3) setFilter("byyear")
      else if (arguments.length == 4) setFilter("bymonth")
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
      $.address.value(pages.join("/"))
    }
    currentPages.merge(backPresses).subscribeArgs(showPage)

    clickedLinks.where(_.compose(partialEqualsAny(["summary-view", "list-view"]), _attr("id"))).select(_attr("id"))
        .subscribe(function(id) { $("body").attr("data-list-type", id.substr(0, id.length - 5))})


    function renderUserMenu(user) { $("#user-header").html(ich.userHeaderTemplate({"data": user})) }

    // update current user in the menu bar
    var currentPageLinkUsers = currentPages.distinctUntilChanged().combineWithLatestOf(sessions).selectArgs(_findUser(1));
    sessions.merge(currentPageLinkUsers).subscribeArgs(renderUserMenu)

    var userTagPages = currentPages.whereArgs(partialEqualsAny(["user", "tags"])).distinctUntilChanged()
    userTagPages.combineWithLatestOf(sessions).selectArgs(_appendUser(1)).selectArgs(function() {
      var args = Array.prototype.slice.call(arguments)
      return asObject.apply(asObject, _.flatten([{}, args]))
    }).doAction(function() {
        $('*[role=content] *[role=table-entries]').html("")
      }).scrollWith(OnTrail.rest.exercises, $("#content-entries"), $("*[role=content]")).subscribe(renderLatest("#content-entries", "*[role=content] *[role=table-entries]"))
    var exPages = currentPages.whereArgs(partialEquals("ex")).doAction(function() { $('#exercise').html("<div class='loading'><img src='/img/loading.gif'/></div>")}).selectAjax(OnTrail.rest.details)
    exPages.combineWithLatestOf(sessions).subscribeArgs(renderSingleExercise)

    // initiate loading and search
    var latestScroll = $("#search").valueAsObservable().merge(currentPages.whereArgs(partialEquals("latest")).select(always("")))
      .doAction(function() {
        entries.html("")
        $('*[role=latest] *[role=table-entries]').html("")
      })
      .selectArgs(function(query) {
        if (query === "")
          return OnTrail.pager.create(OnTrail.rest.latest, $("*[role=latest]"))
        else
          return OnTrail.rest.searchResults(query)
      })
      .switchLatest()
    latestScroll.subscribe(renderLatest(entries, '*[role=latest] *[role=table-entries]'))

    var weeklyScroll = currentPages.whereArgs(partialEquals("weeksummary"))
      .doAction(function() { $("#weeksummary").html("") })
      .combineWithLatestOf(sessions)
      .selectArgs(function(pg, user) {
        var targetUser = user
        if (pg.length == 2) {
           targetUser = pg[1]
        }
        return OnTrail.pager.create(_.partial(OnTrail.rest.weeksummary, targetUser), $("#weeksummary"))
      }).switchLatest()
    weeklyScroll.subscribe(renderWeeklySummary)

    var formatToolTip = function(distance, duration, pace) {
      return (distance !== "" ? distance + ", " : "") + (pace !== "" ? pace + "<br/>" : "<br/>") + (duration !== "" ? duration : "")
    }

    $("#weeksummary").onAsObservable("hover", ".sport").subscribe(function(el) {
      var e = $(el.target)
      if (el.type === "mouseenter") {
        e.tooltip({content: function() {
          var distance = e.attr("data-distance").replace(" ", "&nbsp;")
          var duration = e.attr("data-duration").replace(" ", "&nbsp;")
          var pace = e.attr("data-pace").replace(" ", "&nbsp;")
          return e.attr("data-sport") + ", " + formatToolTip(distance, duration, pace)
        }, "items": "[data-sport]", show: false, hide: false})
        e.tooltip("open")
      } else if (el.type === "mouseleave") {
        e.tooltip("close")
      }
      return true;
    })

    // initiate summary loading after login
    var summaries = currentPages.whereArgs(partialEquals("summary")).combineWithLatestOf(sessions).selectArgs(_appendUser(1)).selectArgs(tail).selectAjax(OnTrail.rest.summary)
    summaries.subscribe(_.partial(renderSummary, "summary"))

    var tagSummaries = currentPages.whereArgs(partialEquals("tagsummary")).combineWithLatestOf(sessions).selectArgs(_appendUser(1)).selectArgs(tail).selectAjax(OnTrail.rest.tagsummary)
    tagSummaries.subscribe(_.partial(renderSummary, "tagsummary"))

    // user search scroll
    var usersScroll = $("#search-users").valueAsObservable().merge(currentPages.whereArgs(partialEquals("users")).select(always("")))
      .doAction(function() { userList.html("") })
      .selectArgs(function(query) {
          if (query === "")
          return OnTrail.pager.create(OnTrail.rest.users, userList)
        else
          return OnTrail.pager.create(_.partial(OnTrail.rest.searchUsers, query), userList)
      })
      .switchLatest()
    usersScroll.subscribe(renderUserList)

    var onPageLoad = rx.empty().startWith("")
    onPageLoad.selectAjax(OnTrail.rest.sports).subscribe(renderSports)
    loggedIns.selectAjax(OnTrail.rest.allTags).subscribe(renderTags)

    onPageLoad.selectAjax(OnTrail.rest.activeUsers).subscribe(renderActiveUsersList)

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
    var addExercises = $('#add-exercise').onClickTouchAsObservable(clickEvent).select(target).where(_.compose(not, _hasClass("disabled"))).combineWithLatestOf(sessions).selectArgs(second).where(exists).selectAjax(postAddExercise).where(isSuccess).select(ajaxResponseData)
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
      if (!Modernizr.touch)
        $("#ex-sport").select2("data", [ex.sport])
      else {
        $("#ex-sport").val( ex.sport || "Juoksu" ).attr('selected',true);
      }
      if (ex.tags && ex.tags.length > 0)
        $("#ex-tags").select2("data", ex.tags)
    }

    var renderProfileUpdate = function(args) {
      var result = _.reduce(_.map([["synopsis", args.synopsis], ["leposyke", args.resthr], ["maksimisyke", args.maxhr],
        ["anaerobinen kynnys", args.aerk], ["anaerobinen kynnys", args.anaerk]],
        function(val) {
          if (val[1]) {
            return " " + val[0] + ": " + val[1] + " "
          } else {
            return ""
          }}),
        function(fst,snd) { return fst + snd })
      $("#profile-result").html("Profiili päivitetty tiedoilla: " + result)
    }

    var renderAddExercise = function() {
      resetEditor()
      $("[role='addex']").attr('data-mode', 'add')
    }
    $('.pageLink[rel="addex"]').onClickTouchAsObservable(clickEvent).subscribe(renderAddExercise)

    var asExercise = function(__, exercise) { return ["ex", exercise] }
    var editExercise = currentPages.whereArgs(function(page, subPage) { return page === "addex" && subPage })
    editExercise.selectArgs(asExercise).selectAjax(OnTrail.rest.details).subscribe(renderEditExercise)

    // muokkauksen submit
    var updateExercises = $('#edit-exercise').onClickTouchAsObservable(clickEvent)
      .combineWithLatestOf(editExercise).selectArgs(_.compose(second, second)).selectAjax(postEditExercise).where(isSuccess).select(ajaxResponseData)
    updateExercises.subscribe(showExercise)

    // update user profile
    var updateProfiles = $('#update-profile').onClickTouchAsObservable(clickEvent)
      .selectAjax(postProfile).where(isSuccess).select(ajaxResponseData)
    updateProfiles.subscribeArgs(renderProfileUpdate)

    var renderMarkAllRead = function(args) {
      renderNewContent("#unread-entries", "#new-comments-count", "*[role=new-comments] *[role=table-entries]")([])
      renderNewContent("#unread-own-entries", "#new-own-comments-count", "*[role=new-own-comments] *[role=table-entries]")([])
    }

    var markAllRead = $('#mark-all-read').onClickTouchAsObservable(clickEvent)
      .selectAjax(OnTrail.rest.markAllRead).subscribe(renderMarkAllRead)

    // Lisää kommentti
    var addComments = $('#exercise').onClickTouchAsObservable(clickEvent).select(target).where(function(el) { return el.id === "add-comment"})
      .combineWithLatestOf(exPages).selectArgs(second).select(id).selectAjax(postComment).where(isSuccess).select(ajaxResponseData)
    addComments.combineWithLatestOf(sessions).subscribeArgs(renderSingleExercise)

    _.forEach($(".pageLink"), function(elem) { $(elem).attr('href', "javascript:nothing()") })

    var attachValidation = function(validator, error, field) {
      var validation = mkValidation($('#ex-' + field).changes(), validator)
      validation.subscribe(toggleEffect($("." + field + "-" + error)))
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

    var timeValidation = mkServerValidation($('#ex-duration').changes().throttle(300), '/rest/v1/parse-time/', serverTimeValidator).validation.repeat()
    timeValidation.subscribe(toggleEffect($(".invalid-duration")))

    var distanceValidation = mkServerValidation($('#ex-distance').changes().throttle(300), '/rest/v1/parse-distance/', serverDistanceValidator).validation.repeat()

    var titleValidation = require("title")
    titleValidation.subscribe(toggleClassEffect($("#ex-title"), 'has-error'))

    var durationReqValidation = require("duration")
    combine([durationReqValidation, timeValidation]).subscribe(toggleClassEffect($("#ex-duration"), 'has-error'))

    var validations = _.flatten([titleValidation, durationReqValidation, timeValidation, distanceValidation])
    combine(validations).subscribe(toggleClassEffect($('#add-exercise'), "disabled"))

    $('#ex-continuous-date').continuousCalendar({isPopup: true, selectToday: true, weeksBefore: 520, weeksAfter: 1, startField: $('#ex-date'), locale: DateLocale.FI })

    var editorSettings = {
      buttons: ['html', '|', 'formatting', '|', 'bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'outdent', 'indent', '|',
        'image', 'table', 'link', '|', 'fontcolor', 'backcolor', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'horizontalrule'],
      minHeight: 200
    }
    $('#ex-body').redactor(editorSettings)

    var menuOffsetTop = $('#header-wrapper').offset().top + 52
    var menuOffsetWidth = $('#header-wrapper').width()
    var menuOffsetMargin = parseInt($('#header-wrapper').css("margin-left"))
    var sideMenuOffsetRight = $('#sidemenu').position().left
    var sideMenuOffsetWidth = $('#sidemenu').width()

    var fixMenuPosition = function(isLoggedIn) {
      var headerHeight = $('#header-login-wrapper').height() + 46 // plus content margin
      if ($(window).scrollTop() > menuOffsetTop) {
        $('#header-wrapper').css({ position: 'fixed', top: '-50px', width: menuOffsetWidth, 'margin-left': menuOffsetMargin, "z-index": 1000 })
        $('#content-wrapper').addClass("scroll-overflow")
        $(isLoggedIn ? '#content' : "#features-wrapper" ).css({"margin-top": (isLoggedIn ? 187 : 152)})
      } else {
        $('#header-wrapper,#content,#features-wrapper').removeAttr("style")
        $('#content-wrapper').removeClass("scroll-overflow")
      }

      if ($(window).scrollTop() > headerHeight) {
        $('#sidemenu').css({ 'position': 'fixed', top: 180, right: sideMenuOffsetRight, width: sideMenuOffsetWidth, "margin-left": "24px" } )
        $('#sidemenu').removeAttr("class")
      } else {
        $('#sidemenu').removeAttr("style")
        $('#sidemenu').addClass("3u")
      }
    }

    var updatePassword = mkValidation($('#ch-password').changes().combineLatest($('#ch-password2').changes(), asArgs), matchingValuesV())
    var requirePassword = mkValidation($('#ch-password').changes(), requiredV())
    var pwdChangeLengthValidation = mkValidation($('#ch-password').changes(),  minLengthV(6))
    pwdChangeLengthValidation.subscribe(toggleEffect($(".ch-password-too-short")))
    pwdChangeLengthValidation.subscribe(toggleClassEffect($('#ch-password'), "has-error"))
    updatePassword.subscribe(toggleEffect($(".ch-passwords-do-not-match")))
    updatePassword.subscribe(toggleClassEffect($('#ch-password2'), "has-error"))
    var changePasswordValidations = [updatePassword, requirePassword, pwdChangeLengthValidation]
    combine(changePasswordValidations).subscribe(toggleClassEffect($('#change-password'), "disabled"))

    var passwordRequiredValidation = require("password")
    var pwdLengthValidation = attachValidation(minLengthV(6), 'too-short' ,'password')
    combine([passwordRequiredValidation, pwdLengthValidation]).subscribe(toggleClassEffect($('#ex-password'), "has-error"))

    var emailValidation = attachValidation(emailV(), 'invalid' ,'email')
    emailValidation.subscribe(toggleClassEffect($("#ex-email"), "has-error"))

    var samePassword = mkValidation($('#ex-password').changes().combineLatest($('#ex-password2').changes(), asArgs), matchingValuesV())
    samePassword.subscribe(toggleEffect($(".passwords-do-not-match")))
    combine([samePassword, pwdLengthValidation]).subscribe(toggleClassEffect($('#ex-password2'), "has-error"))

    var usernameRequiredValidation = require('username')
    var usernameAvailableValidator = createAjaxValidator(OnTrail.rest.usernameV);
    var usernameExistsValidation = mkServerValidation($('#ex-username').changes(), '/rest/v1/username-available/', usernameAvailableValidator).validation
    usernameExistsValidation.subscribe(toggleEffect($(".user-exists")))
    combine([usernameExistsValidation, usernameRequiredValidation]).subscribe(toggleClassEffect($('#ex-username'), "has-error"))

    var registerValidations = _.flatten([usernameRequiredValidation, passwordRequiredValidation, pwdLengthValidation, samePassword, emailValidation, usernameExistsValidation])
    combine(registerValidations).subscribe(toggleClassEffect($('#register-user'), "disabled"))

    var exPagesWithComments = $("body").onClickTouchAsObservable(clickEvent, "a[data-new-comments]").selectMany(loggedIns).where(identity)

    var tabIsInFocus = rx.interval(3000).select(function() { return $("body").hasClass("visible") && document.hasFocus() }).where(identity).publish()
    tabIsInFocus.connect()

    var loggedInPoller = loggedIns.merge(tabIsInFocus.selectMany(loggedIns).where(identity).sample(60000)).merge(exPagesWithComments).publish()
    loggedInPoller.connect()

    loggedInPoller.startWith(0).selectAjax(OnTrail.rest.newComments).doAction(function() {
      $("*[role=new-comments] *[role=table-entries]").html("")
    }).subscribe(renderNewContent("#unread-entries", "#new-comments-count", "*[role=new-comments] *[role=table-entries]"))
    loggedInPoller.startWith(0).selectAjax(OnTrail.rest.newOwnComments).doAction(function() {
        $("*[role=new-own-comments] *[role=table-entries]").html("")
      }).subscribe(renderNewContent("#unread-own-entries", "#new-own-comments-count", "*[role=new-own-comments] *[role=table-entries]"))

    // run our function on load
    if (!mobile) {

      // and run it again every time you scroll
      $(window).scrollAsObservable().startWith(0).selectMany(sessions).select(function(val) { return exists(val) ? true : false }).subscribe(fixMenuPosition)
    }

    // initiate current page
    currentPages.connect()
  })
})()
