(function () {
  $(document).ready(function () {

    var ww = $(window).width(), sw = screen.width, orientation = window.orientation;

    // Fix: On iOS, screen.width is always the width of the device held in portrait mode.
    // Android, however, sets it to the width of the device in its current orientation.
    // This ends up breaking our detection on HD devices held in landscape mode, so we
    // do a little trick here to detect this condition and make things right.
    if (screen.width > screen.height && Math.abs(orientation) == 90)
      sw = screen.height;

    var mobile = (ww <= 480 || sw <= 480) || Modernizr.touch;

    var clickEvent = "click touchstart"

    if (mobile) {
      $('#sportFilter').hide()
    }

    // rx.ontrail: onClickTouchAsObservable should handle doubles on AppleWekKit. FIX.
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)) {
      var clickEvent = "touchstart"
    }

    $.ajaxSetup({ cache: false })

    var spinnerElement = "#content-spinner"

    function actionButtonAsStream(btn, _selector, _action) {
      var action, selector, button
      if (arguments.length == 3) {
        action = _action
        selector = _selector
      } else if (arguments.length == 2) {
        action = _selector
      }
      var actionStream = $(btn).onClickTouchAsObservable(clickEvent, selector).select(targetLink).where(_.compose(not, _hasClass("disabled")))
        .doAction(function (elem) {
          button = $(elem);
          button.addClass('disabled')
        })
      return action(actionStream).doAction(function () {
        button.removeClass('disabled')
      })
    }

    function ajaxActionButtonAsStream(btn, ajaxAction) {
      return actionButtonAsStream(btn,function (instream) {
        return instream.selectAjax(ajaxAction)
      }).where(isSuccess).select(ajaxResponseData)
    }


    var userList = $("#user-results")
    var groupsList = $("#groups-content")

    function selectionFormat(state) {
      if (!state.id) return state.toString();
      return state.text.toString();
    }

    var doPostExercise = function (url) {
      var renderSelection = _.compose(encodeURIComponent, selectionFormat)
      var sport = (!Modernizr.touch) ? $("#ex-sport").select2("data") : $("#ex-sport").val();
      var values = $('#add-exercise-form').serialize()
        + "&sport=" + renderSelection(sport)
        + "&body=" + encodeURIComponent($('#ex-body').getCode())
        + "&tags=" + _.filter(_.flatten(["", _.map($("#ex-tags").select2("data"), renderSelection)])).join(",")
      localStorage.setItem("ex-body", "<p>\n<br>\n</p>")
      $("#ex-body").setCode("<p>\n<br>\n</p>")
      return OnTrail.rest.postAsObservable(url, values)
    }

    var postAddExercise = function (user) {
      return doPostExercise("ex/" + user)
    }

    var postEditExercise = function (exercise) {
      return doPostExercise("update/" + exercise)
    }

    var postProfile = function () {
      return OnTrail.rest.postAsObservable("profile", $('#profile-form').serialize())
    }

    var postChangePassword = function () {
      return OnTrail.rest.postAsObservable("change-password", $('#change-password-form').serialize())
    }

    var postComment = function (exercise) {
      var values = "body=" + encodeURIComponent($('#comment-body').getCode())
      return OnTrail.rest.postAsObservable("ex/" + exercise + "/comment", values)
    }

    var postRegisterUser = function () {
      return OnTrail.rest.postAsObservable("register", $('#register-form').serialize())
    }

    var postJoinOrLeaveGroup = function (group, action) {
      return OnTrail.rest.postAsObservable("groups/" + group + "/" + action, {})
    }

    var confirmDelete = function (dialog, type, id) {
      return $(dialog).dialogAsObservable({
        resizable: false,
        modal: true
      }, [
        {id: "cancel", name: "Peruuta"},
        {id: "delete", name: "Poista!"}
      ]).take(1).where(partialEquals("delete")).select(always([type, id]))

    }

    var confirmDeleteEx = _.partial(confirmDelete, "#dialog-delete-ex-confirm")
    var confirmDeleteComment = _.partial(confirmDelete, "#dialog-delete-comment-confirm")

    var deleteExerciseOrComment = function () {
      return OnTrail.rest.deleteAsObservable.apply(OnTrail.rest, arguments);
    }

    var render = function (template, data) {
      return $(template(data)[0]).html()
    }

    var renderLatest = function (el, tableEl) {
      var helpers = {
        trunc: function () {
          return function (text, render) {
            var body = $('<div></div>').html(this.body)
            var text = body.text()
            var truncOn = 100
            var more = text.length > truncOn ? "..." : ""
            return "<p>" + body.text().substring(0, truncOn - 1) + more + "</p>"
          }
        }
      }
      return function (data) {
        var elem = $(el)
        var tableElem = $(tableEl)
        if (!data || !data.length || data.length == 0) {
          return
        }
        var mappedData = _.map(data, function (item) {
          return _.extend(item, helpers)
        })
        var content = _.map(mappedData, _.partial(render, ich.exerciseTemplate)).join("")
        $(content).appendTo(elem)

        var tableContent = _.map(mappedData, _.partial(render, ich.exerciseSummaryTemplate)).join("")
        $(tableContent).appendTo(tableElem)
      }
    }
    var renderSingleExercise = function (exercise, me) {
      renderUserMenu(exercise.user)
      var helpers = {
        deleteComment: function () {
          return function (text, render) {
            if (this.user !== me && exercise.user !== me) return ""
            this.deleteRel = (this.user === me ? "ex/" : "own/ex/") + exercise.id + (this.user === me ? "/own/comment/" : "/comment/") + this.id;
            return render(text)
          }
        }
      }
      $('#exercise').html(ich.singleExerciseTemplate(_.extend(exercise, helpers)))
      $('#comment-body').redactor(editorSettings)
      $('#scrollBottom').click(function () {
        $("html, body").animate({ scrollTop: $('#content-wrapper')[0].clientHeight - 500}, 500)

      })

    }
    var renderSports = function (data) {
      ich.sportsCreateTemplate({sports: _.filter(data, identity)}).appendTo($('#ex-sport'))
      ich.sportsCreateTemplate({sports: _.filter(data, identity)}).appendTo($('#filter-sport'))
      if (!Modernizr.touch) {
        $('#ex-sport').select2({formatSelection: selectionFormat})
        $('#filter-sport').select2({formatSelection: selectionFormat})
      }
    }
    var renderTags = function (data) {
      $('#ex-tags').select2({
        tags: data,
        tokenSeparators: [",", ";"],
        formatSelection: selectionFormat
      })
    }

    var renderUserList = function (data) {
      ich.usersCreateTemplate({users: data}).appendTo(userList)
    }
    var renderGroupList = function (data) {
      ich.groupsTemplate({groups: data}).appendTo(groupsList)
    }

    var renderChangePassword = function (data) {
      $("#change-password-form")[0].reset()
      if (data.username) {
        $("#password-change-result").text("Salasanan vaihto onnistui!")
      } else {
        $("#password-change-result").text("Salasanan vaihto epäonnistui!")
      }
    }

    var monthNames = {
      monthName: function () {
        return DateLocale.FI.monthNames[ this.month ]
      }
    }

    // filters: {year: yyyy, month: mm, week: ww }
    var renderSummary = function (elem, summary) {
      var now = XDate.today();
      var maxYear = now.getFullYear()
      var utils = {
        hasNextYear: function () {
          return this.year != maxYear
        },
        nextYear: function () {
          return this.year + 1
        },
        prevYear: function () {
          return this.year - 1
        },
        kind: elem
      }

      function addFilter(summary) {
        if (!summary.year) return summary
        month = (summary.month >= 0 || false) ? (summary.month + 1) + "." + summary.year : summary.year + ""
        nextMonth = (summary.month >= 0 || false) ? (summary.month == 11 ? "1." + (summary.year + 1) : ( (summary.month + 2) + "." + summary.year)) : (summary.year + 1) + ""
        summary.sports = _.map(summary.sports, function (item) {
          return _.extend(item, {sportsFilter: "lte_creationDate/" + nextMonth + "/gte_creationDate/" + month })
        })
        return summary
      }

      if ($.isArray(summary)) {
        var hasSports = function (item) {
          return item.sports.length > 0
        }
        var extendWithMonthName = function (item) {
          return _.extend(addFilter(item), monthNames)
        }
        var sums = _.map(_.filter(summary, hasSports), extendWithMonthName)
        var sum = _.extend({ year: (summary[0].year) }, { months: sums, "user": summary[0].user }, utils)
        $("#" + elem + "-entries").html(ich.hpkMonthContentTemplate(sum))
      } else {
        var sum = _.extend({ year: now.getFullYear() }, addFilter(summary), utils)
        $("#" + elem + "-entries").html(ich.hpkContentTemplate(sum))
      }
      $("#" + elem + "-header").html(ich.hpkHeaderTemplate(sum))
    }

    // filters: {year: yyyy, month: mm, week: ww }
    var renderWeeklySummary = function (summary) {
      function toWeeklySummary(month, summaryItem) {
        var monday = new XDate(summaryItem.from)
        var exs = _.groupBy(summaryItem.exs, _attr("dayIndex"))
        var resex = [];
        for (var i in _.range(0, 7))
          if (exs[i] === undefined) resex[i] = []; else resex[i] = exs[i];
        exs = _.map(resex, function (item, index) {
          return {dayIndex: index, exs: item, "class": monday.clone().addDays(index).getMonth() == month ? "current" : "other-month"}
        })
        var monday = new XDate(summary.fromIsoDate)
        var sum = (summaryItem.exs.length > 0 ? summaryItem.summary : [])
        var result = {week: summaryItem.week, exs: exs, summaries: sum }
        return result
      }

      var date = new XDate(summary[0].from)
      var month = date.getMonth()
      var summaries = _.extend({summary: _.map(summary, _.partial(toWeeklySummary, month)), month: month,
        year: date.getFullYear(), weeks: (summary.length * 2) + 1}, monthNames)
      $(ich.hpkWeeklyContentTemplate(summaries)).appendTo($("#weeksummary"))
    }

    var renderHint = function (kind, item) {
      $("#" + kind + "-hint").html(item[kind])
    }

    // logged in state handling
    var doLogin = function () {
      return OnTrail.rest.postAsObservable("login", $('#login-form').serialize())
    }
    var logouts = $("#logout").onClickTouchAsObservable(clickEvent)
    var isEnter = function (event) {
      return event.keyCode == 13;
    }
    var loginEnters = $("#password").keyupAsObservable().where(isEnter)
    var loginRequests = $("#login").onClickTouchAsObservable(clickEvent).merge(loginEnters).selectAjax(doLogin)
    var logins = loginRequests.where(isSuccess).select(ajaxResponseData)
    var loginFails = loginRequests.where(_.compose(not, isSuccess)).select(ajaxResponseData)

    $("#gotoLogin").onClickTouchAsObservable(clickEvent).subscribe(function () {
      $("html, body").animate({ scrollTop: $("#login-wrapper").offset().top - 110 }, 1000)
    })

    var registerUsers = ajaxActionButtonAsStream('#register-user', postRegisterUser).doAction(function () {
      $('#register-form')[0].reset()
    })

    // change password
    var changePasswords = ajaxActionButtonAsStream('#change-password', postChangePassword)
    changePasswords.subscribeArgs(renderChangePassword)

    // create session
    var sessions = OnTrail.session.create(logins.merge(registerUsers).merge(changePasswords), logouts.merge(loginFails))
    var loggedIns = sessions.where(identity)

    // toggle logged-in and logged-out
    sessions.subscribe(function (userId) {
      $('body').toggleClass('logged-in', !!userId).toggleClass('logged-out', !userId)
    })
    loggedIns.subscribe(function (userId) {
      function appendUser(_, _el) {
        var el = $(_el)
        var rel = el.attr("rel")
        el.attr("rel", rel.split("/")[0] + "/" + userId)
      }

      $('.username').html(userId)
      $('*[data-user]').map(appendUser)
    })

    function renderNewComments(content) {
      var items = asArgs(content)
      $("#content-entries").html(items.length > 0 ? "" : "<article>Ei uusia kommentteja</article>")
      $("#table-entries").html(items.length > 0 ? "" : "<tr><td>Ei uusia kommentteja</td></tr>")
      if (items.length > 0)
        renderLatest("#content-entries", "#table-entries")(items)
    }

    function renderCommentCount(elem) {
      return function (content) {
        var newComments = _(asArgs(content)).filter(_prop("newComments")).map(_prop("newComments")).reduce(function (a, b) {
          return a + b
        })
        if (newComments > 0)
          $(elem).text(newComments).show()
        else
          $(elem).hide()
      }
    }

    // open single entries
    var parentArticle = function (el) {
      return $(el).closest('article')
    }
    var clickedLinks = $("body").onClickTouchAsObservable(clickEvent, "a").select(targetLink).publish()
    clickedLinks.connect()
    var clickedArticles = clickedLinks.where(function (elem) {
      return $(elem).hasClass('more')
    }).select(parentArticle)

    var isArticleLoaded = function (el) {
      var $el = $(el);
      return $el.hasClass('full') || $el.hasClass('preview')
    }
    clickedArticles.where(isArticleLoaded).subscribe(function (el) {
      $(el).toggleClass('full').toggleClass('preview')
    })

    // delete
    var deleteClicks = clickedLinks.combineWithLatestOf(sessions)
      .whereArgs(function (elem, user) {
        return $(elem).hasClass('delete') && user && $(elem).attr("data-user") == user
      })
      .select(function (el) {
        return attr("rel", el).split("/")
      })
    deleteClicks.selectMany(confirmDeleteEx).selectArgs(first)
      .selectAjax(deleteExerciseOrComment).where(isSuccess).select(ajaxResponseData).subscribe(function (data) {
        $("*[data-id='" + data.id + "']").remove()
      })

    // share
    var shareClicks = clickedLinks.where(function (elem) {
      return $(elem).hasClass('share')
    }).select(function (el) {
        return attr("rel", el)
    })

    shareClicks.subscribeArgs(function (url) {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent("http://ontrail.net/#" + url), 'facebook-share-dialog', 'width=626,height=436')
    })

    var windowLinks = clickedLinks.where(function (elem) {
      return $(elem).hasClass('windowLink')
    }).select(function (el) {
        return attr("rel", el)
    })
    windowLinks.subscribeArgs(function(url) {
      window.open('#' + url, 'ontrail', 'width=830,height=800')
    })

    // show own delete buttons
    sessions.subscribe(function (user) {
      $('#logged-in-styles').replaceWith(ich.loggedInStylesTemplate({'user': user }))
    })

    // delete comments
    var deleteCommentClicks = clickedLinks
      .whereArgs(function (elem) {
        return $(elem).hasClass('delete-comment')
      })
      .select(function (el) {
        return attr("rel", el).split("/")
      })
    deleteCommentClicks.selectMany(confirmDeleteComment).selectArgs(first).selectAjax(deleteExerciseOrComment).where(isSuccess).select(ajaxResponseData)
      .combineWithLatestOf(sessions).throttle(101).subscribeArgs(renderSingleExercise)

    // join groups
    var joinAndLeaveClicks = clickedLinks.whereArgs(function (elem) {
      return $(elem).is('.join,.leave')
    }).publish()
    joinAndLeaveClicks.connect()
    var joinsAndLeaves = joinAndLeaveClicks.select(function (el) {
      return attr("rel", el).split("/")
    }).selectAjax(postJoinOrLeaveGroup).where(isSuccess)

    joinAndLeaveClicks.subscribe(function (elem) {
      console.log(parentArticle(elem), $(elem).is('.join') ? "joined" : "not-joined")
      parentArticle(elem).attr("class", $(elem).is('.join') ? "joined" : "not-joined")
    })

    // toggle pages when pageLink is clicked
    var pageAndArgs = _.compose(splitM, _.partial(attr, 'rel'))
    var pageLinks = clickedLinks.where(function (elem) {
      return $(elem).hasClass('pageLink')
    })

    var initialPage = function (user) {
      var address = $.address.value()
      if (address && address != "") return splitM(address)
      return (user && ["user", user]) || "latest"
    }

    // back button handling
    var backPresses = Rx.Observable.create(function (observer) {
      var next = function () {
        observer.onNext(decodeURIComponent($.address.value()))
      }
      $.address.init(next).change(next)
      return nothing()
    }).select(splitM)

    var currentPages = sessions.selectArgs(initialPage).merge(pageLinks.selectArgs(pageAndArgs)).merge(registerUsers.select(always("profile"))).merge(backPresses).publish()

    currentPages.whereArgs(partialEquals("register")).subscribe(function () {
      $("html, body").animate({ scrollTop: $("#content-wrapper").offset().top - 110 }, 1000)
    })
    currentPages.subscribe(function () {
      $('html, body').scrollTop(0)
    })
    var findUser = function (inArgs, currentUser, pos) {
      var args = asArgs(inArgs)
      var userPos = _(args).indexOf("user")
      if (userPos >= 0 && userPos + 1 < args.length)
        return args[userPos + 1]
      var position = (pos || 0)
      if (args && args.length >= position && _(["user", "tagsummary", "weeksummary", "summary"]).find(partialEquals(args[position - 1])))
        return (args.length > position) ? args[position] : currentUser
      return currentUser
    }
    var _findUser = function (pos) {
      return function (args, currentUser) {
        return findUser(args, currentUser, pos)
      }
    }

    // filtering
    var setFilter = function (filter) {
      $("body").attr("data-filter", filter)
    }
    var filters = currentPages.whereArgs(partialEqualsAny(["summary", "tagsummary"])).subscribeArgs(function () {
      if (arguments.length == 3) setFilter("byyear")
      else if (arguments.length == 4) setFilter("bymonth")
      else setFilter("")
    })

    var showPage = function () {
      var pages = _.argsToArray(arguments)
      $('body').attr('data-page', pages[0])
      $('#password').attr('value', '')
      $.address.value(pages.join("/"))
    }
    currentPages.subscribeArgs(showPage)

    clickedLinks.where(_.compose(partialEqualsAny(["summary-view", "list-view"]), _attr("id"))).select(_attr("id"))
      .subscribe(function (id) {
        $("body").attr("data-list-type", id.substr(0, id.length - 5))
      })

    function renderUserMenu(user) {
      $("#user-header").html(ich.userHeaderTemplate({"data": user}))
    }

    // update current user in the menu bar
    var currentPageLinkUsers = currentPages.distinctUntilChanged().combineWithLatestOf(sessions).selectArgs(_findUser(1));
    sessions.merge(currentPageLinkUsers).subscribeArgs(renderUserMenu)

    var userTagPages = currentPages.whereArgs(partialEqualsAny(["user", "tags", "sport", "group"])).distinctUntilChanged()
    userTagPages.selectArgs(pairsAsAssocMap).doAction(function () {
        $("#table-entries").html("")
      }).throttle(30).scrollWith(OnTrail.rest.exercises, $("#content-entries"), $("*[role=content]"))
      .takeUntil(currentPages.whereArgs(_.compose(not, partialEqualsAny(["user", "tags", "sport", "group"])))).repeat()
      .subscribe(renderLatest("#content-entries", "#table-entries"))

    var renderPageDetail = function (args) {
      $('#content-header').html("")
      if (args.data.action == "group" && args.data.target == "Marrasputki") {
        ich.marrasputkiTemplate(args.data).appendTo($('#content-header'))
      } else if (args.data.action == "group" && args.data.target == "lvhaaste2014") {
        ich.lvhaaste2014Template(args.data).appendTo($('#content-header'))
      } else if (args.data.action == "group" && args.data.target == "RunnersHigh") {
        ich.runnersHighTemplate(args.data).appendTo($('#content-header'))
      } else if (args.data.action == "group") {
        ich.groupDetailTemplate(args.data).appendTo($('#content-header'))
      } else if (args.data.action == "user") {
        ich.userDetailTemplate(args.data).appendTo($('#content-header'))
        $("#recordsDiv").hide()
        $("#toggleRecords").toggle(function () {
          $("#toggleRecords").text("Piilota juoksuennätykset")
          $("#recordsDiv").show()
        }, function () {
          $("#toggleRecords").text("Näytä juoksuennätykset")
          $("#recordsDiv").hide()
        })
      } else {
        ich.otherDetailTemplate(args.data).appendTo($('#content-header'))
      }
    }

    userTagPages.selectArgs(function() {
      var args = Array.prototype.slice.call(arguments)
      var pairs = partition(args, 2)
      return _.extend({action: args[0]}, _.zipObject(pairs))
    }).throttle(101).selectAjax(OnTrail.rest.pageDetail).subscribeArgs(renderPageDetail)

    var exPages = currentPages.whereArgs(partialEquals("ex")).spinnerAction('#exercise').throttle(101).selectAjax(OnTrail.rest.details)
    exPages.combineWithLatestOf(sessions).subscribeArgs(renderSingleExercise)

    var renderActiveUsersList = function (data) {
      $("#active-users").html(ich.activeUsersTemplate({"users": data}))
    }

    var systemPages = currentPages.whereArgs(partialEquals("systemstats"))
    systemPages.selectAjax(OnTrail.rest.system).subscribe(function (system) {
      _.map(system.systemstats, function updateStats(value, field) {
        $('#' + field).text(value)
      })
      renderActiveUsersList(system.activeUsers)
    })


    // initiate loading and search
    var latestScroll = $("#search").changes().throttle(300).skip(1).merge(currentPages.whereArgs(partialEquals("latest")).select(always("")))
      .doAction(function () {
        $("#content-entries").html("")
        spinner(spinnerElement)()
        $("#table-entries").html("")
      })
      .throttle(30)
      .selectArgs(function (query) {
        if (query === "") {
          $('#searchSummary').html("")
          $('#search').val("")
          return OnTrail.pager.create(OnTrail.rest.latest, $("*[role=content]"))
        } else
          return OnTrail.pager.create(_.partial(OnTrail.rest.searchResults, query), $("*[role=content]"))
      })
      .switchLatest()
    latestScroll.takeUntil(currentPages.whereArgs(_.compose(not, partialEquals("latest")))).repeat().subscribe(renderLatest($("#content-entries"), '#table-entries'))

    var weeklyScroll = currentPages.whereArgs(partialEquals("weeksummary"))
      .doAction(function () {
        $("#weeksummary").html("")
      })
      .combineWithLatestOf(sessions)
      .selectArgs(function (pg, user) {
        var targetUser = user
        var year = XDate.today().getFullYear()
        var month = XDate.today().getMonth()

        if (pg.length >= 2) {
          targetUser = pg[1]
        }
        if (pg.length == 4) {
          year = parseInt(pg[2])
          month = parseInt(pg[3])
        }
        return OnTrail.pager.create(_.partial(OnTrail.rest.weeksummary, targetUser, year, month), $("#weeksummary"))
      }).switchLatest()
    weeklyScroll.takeUntil(currentPages.whereArgs(_.compose(not, partialEquals("weeksummary")))).repeat().subscribe(renderWeeklySummary)

    var formatToolTip = function (distance, duration, pace) {
      return (distance !== "" ? distance + ", " : "") + (pace !== "" ? pace + "<br/>" : "<br/>") + (duration !== "" ? duration : "")
    }

    $("#weeksummary").onAsObservable("hover", ".sport").subscribe(function (el) {
      var e = $(el.target)
      if (el.type === "mouseenter") {
        e.tooltip({content: function () {
          var distance = e.attr("data-distance").replace(" ", "&nbsp;")
          var duration = e.attr("data-duration").replace(" ", "&nbsp;")
          var pace = e.attr("data-pace").replace(" ", "&nbsp;")
          var repeats = e.attr("data-repeats") !== undefined && e.attr("data-repeats") !== "" ? "<br/>" + e.attr("data-repeats") + "&nbsp;toistoa" : ""
          return e.attr("data-sport") + ", " + formatToolTip(distance, duration, pace) + repeats
        }, "items": "[data-sport]", show: false, hide: false})
        e.tooltip("open")
      } else if (el.type === "mouseleave") {
        e.tooltip("close")
      }
      return true;
    })

    // initiate summary loading after login
    var summaries = currentPages.whereArgs(partialEquals("summary")).spinnerAction("#summary-entries").throttle(101).selectArgs(tail).selectAjax(OnTrail.rest.summary)
    summaries.subscribe(_.partial(renderSummary, "summary"))

    var tagSummaries = currentPages.whereArgs(partialEquals("tagsummary")).spinnerAction("#tagsummary-entries").throttle(101).selectArgs(tail).selectAjax(OnTrail.rest.tagsummary)
    tagSummaries.subscribe(_.partial(renderSummary, "tagsummary"))

    // user search scroll
    var usersScroll = $("#search-users").changes().skip(1).merge(currentPages.whereArgs(partialEquals("users")).select(always("")))
      .doAction(function () {
        userList.html("")
      })
      .selectArgs(function (query) {
        if (query === "")
          return OnTrail.pager.create(OnTrail.rest.users, userList)
        else
          return OnTrail.pager.create(_.partial(OnTrail.rest.searchUsers, query), userList)
      })
      .switchLatest()
    usersScroll.takeUntil(currentPages.whereArgs(_.compose(not, partialEquals("users")))).repeat().subscribe(renderUserList)

    // group list scroll
    var groupsScroll = currentPages.whereArgs(partialEquals("groups")).merge(joinsAndLeaves)
      .doAction(function () {
        groupsList.html("")
      })
      .selectArgs(function (query) {
        return OnTrail.pager.create(OnTrail.rest.groups, groupsList)
      }).switchLatest()
    groupsScroll.takeUntil(currentPages.whereArgs(_.compose(not, partialEquals("groups")))).repeat().subscribe(renderGroupList)

    // Lisää lenkki
    var resetEditor = function () {
      $("#add-exercise-form .reset").attr('value', '')
      $("#ex-sport").select2("data", {id: "Juoksu", text: "Juoksu"})
      $("#ex-tags").select2("data", [])
      $("#time-hint, #distance-hint").html("")
      var autoSavedText = localStorage.getItem("ex-body")
      var text = (autoSavedText && autoSavedText.length > 15) ? autoSavedText : "<p>\n<br>\n</p>"
      $("#ex-body").setCode(text)
      $("#ex-title, #ex-duration").blur()
      $("#ex-title").focus()
    }

    var disable = function (args) {
      return this.doAction(function () {
        var dbg = _debug(category)
        dbg.apply(dbg, asArgs(arguments))
      })
    }

    var showExercise = function (ex) {
      showPage("ex", ex.id);
      renderSingleExercise(ex)
    }


    var addExercises = actionButtonAsStream('#add-exercise-form', 'a.addExercise',function (instream) {
      return instream.combineWithLatestOf(sessions).selectArgs(second).where(exists).selectAjax(postAddExercise)
    }).where(isSuccess).select(ajaxResponseData)
    addExercises.subscribe(showExercise)

    currentPages.whereArgs(partialEquals("addex")).subscribeArgs(function (page, exid) {
      if (exid === undefined) resetEditor()
    })

    // muokkaa lenkkiä:
    var renderEditExercise = function (ex) {
      $("[role='addex']").attr('data-mode', 'edit')
      _.map(["title", "duration", "distance", "avghr", "detailRepeats", "detailVolume", "detailElevation"], function (field) {
        $('#ex-' + field).val(ex[field]).keyup()
      })
      $("#ex-date").attr('value', ex.date)
      $("#ex-date").trigger("cal:changed")
      $("#ex-body").setCode(ex.body)
      if (!Modernizr.touch)
        $("#ex-sport").select2("data", [ex.sport])
      else {
        $("#ex-sport").val(ex.sport || "Juoksu").attr('selected', true);
      }
      if (ex.tags && ex.tags.length > 0)
        $("#ex-tags").select2("data", ex.tags)
    }

    var renderProfileUpdate = function (args) {
      var result = _.reduce(_.map([
        ["synopsis", args.synopsis],
        ["leposyke", args.resthr],
        ["maksimisyke", args.maxhr],
        ["anaerobinen kynnys", args.aerk],
        ["anaerobinen kynnys", args.anaerk]
      ],
        function (val) {
          if (val[1]) {
            return " " + val[0] + ": " + val[1] + " "
          } else {
            return ""
          }
        }),
        function (fst, snd) {
          return fst + snd
        })
      $("#profile-result").html("Profiili päivitetty tiedoilla: " + result)
    }

    var renderAddExercise = function () {
      resetEditor()
      $("[role='addex']").attr('data-mode', 'add')
    }
    $('.pageLink[rel="addex"]').onClickTouchAsObservable(clickEvent).subscribe(renderAddExercise)

    var asExercise = function (__, exercise) {
      return ["ex", exercise]
    }
    var editExercise = currentPages.whereArgs(function (page, subPage) {
      return page === "addex" && subPage
    })
    editExercise.selectArgs(asExercise).selectAjax(OnTrail.rest.details).subscribe(renderEditExercise)

    // muokkauksen submit
    var updateExercises = actionButtonAsStream('#add-exercise-form', 'a.editExercise',function (clickStream) {
      return clickStream.combineWithLatestOf(editExercise).selectArgs(_.compose(second, second)).selectAjax(postEditExercise)
    }).where(isSuccess).select(ajaxResponseData)
    updateExercises.subscribe(showExercise)

    // update user profile
    var updateProfiles = $('#update-profile').onClickTouchAsObservable(clickEvent)
      .selectAjax(postProfile).where(isSuccess).select(ajaxResponseData)
    updateProfiles.subscribeArgs(renderProfileUpdate)

    var renderMarkAllRead = function (args) {
      renderNewContent("#unread-entries", "#new-comments-count", "#table-entries")([])
      renderNewContent("#unread-own-entries", "#new-own-comments-count", "#table-entries")([])
    }

    var markAllRead = $('#mark-all-read').onClickTouchAsObservable(clickEvent)
      .selectAjax(OnTrail.rest.markAllRead).subscribe(renderMarkAllRead)

    // Lisää kommentti
    var addComments = actionButtonAsStream('#exercise', "a.addComment",function (clickStream) {
      return clickStream.select(_attr("data-id")).selectAjax(postComment)
    }).where(isSuccess).select(ajaxResponseData)
    addComments.combineWithLatestOf(sessions).throttle(300).subscribeArgs(renderSingleExercise)

    _.forEach($(".pageLink"), function (elem) {
      $(elem).attr('href', "javascript:nothing()")
    })

    var attachValidation = function (validator, error, field) {
      var validation = mkValidation($('#ex-' + field).changes(), validator)
      validation.subscribe(toggleEffect($("." + field + "-" + error)))
      return validation

    }

    // luo lenkki -validaatio
    var require = _.partial(attachValidation, requiredV(), "required");

    var serverSideValidator = function (kind) {
      return function (value) {
        if ($.trim(value) == "") return Rx.Observable.returnValue([])
        var request = OnTrail.rest.serverParseV(kind, value)
        request.where(isSuccess).select(ajaxResponseData).subscribeArgs(_.partial(renderHint, kind))
        return request.materialize()
          .select(convertToError)
          .dematerialize()
      }
    }

    var serverTimeValidator = _.partial(serverSideValidator, "time")
    var serverDistanceValidator = _.partial(serverSideValidator, "distance")

    var timeValidation = mkServerValidation($('#ex-duration').changes().throttle(300), '/rest/v1/parse-time/', serverTimeValidator).validation.repeat()
    timeValidation.subscribe(toggleEffect($(".invalid-duration")))
    var distanceValidation = mkServerValidation($('#ex-distance').changes().throttle(300), '/rest/v1/parse-distance/', serverDistanceValidator).validation.repeat()

    var titleValidation = require("title")
    titleValidation.subscribe(toggleClassEffect($("#ex-title"), 'has-error'))

    var durationReqValidation = require("duration")
    combine([durationReqValidation, timeValidation]).subscribe(toggleClassEffect($("#ex-duration"), 'has-error'))

    var validations = _.flatten([titleValidation, durationReqValidation, timeValidation, distanceValidation])
    combine(validations).subscribe(toggleClassEffect($('#add-exercise, #edit-exercise'), "disabled"))

    $('#ex-continuous-date').continuousCalendar({isPopup: true, selectToday: true, weeksBefore: 520, weeksAfter: 5, startField: $('#ex-date'), locale: DateLocale.FI })

    var editorSettings = {
      buttons: ['html', '|', 'formatting', '|', 'bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'outdent', 'indent', '|',
        'image', 'table', 'link', '|', 'fontcolor', 'backcolor', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'horizontalrule'],
      minHeight: 200,
      setCodeTextarea: function (code) {
        console.log("foo")
        this.$el.val(code).trigger('change')
      }
    }
    $('#ex-body').redactor(editorSettings)

    var menuOffsetTop = $('#header-wrapper').offset().top

    var fixMenuPosition = function (isLoggedIn) {
      var headerHeight = $('#header-login-wrapper').height() + 46 // plus content margin
      if ($(window).scrollTop() > menuOffsetTop) {
        var menuOffsetWidth = $('#header-wrapper').width()
        var menuOffsetMargin = parseInt($('#header-wrapper').css("margin-left"))
        $('#header-wrapper').css({ position: 'fixed', top: '-4px', width: menuOffsetWidth, 'margin-left': menuOffsetMargin, "z-index": 1000 })
        $('#content-wrapper').addClass("scroll-overflow")
        $('#content').css({"margin-top": (isLoggedIn ? 110 : 82)})
      } else {
        $('#header-wrapper,#content,#features-wrapper').removeAttr("style")
        $('#content-wrapper').removeClass("scroll-overflow")
      }

    }

    loggedIns.selectAjax(OnTrail.rest.loggedIns).subscribe(function (loggedIn) {
      var profile = loggedIn.profile
      _.map(["goals", "synopsis", "resthr", "maxhr", "aerk", "anaerk"], function (field) {
        $('#' + field).val(profile[field])
      })
      $('#profile-email').text(loggedIn.email)
      $('#profile-avatar').attr("src", loggedIn.avatarUrl)
      renderTags(loggedIn.ownTags)
      renderSports(loggedIn.sports)
      $('#ownGroupsDropDown').html(ich.ownGroupsTemplate({'groups': loggedIn.ownGroups}))
    })


    var oldPasswordMatchV = createAjaxValidator(OnTrail.rest.passwordV)
    var oldPasswordMatch = mkServerValidation($('#ch-old-password').changes().throttle(300).combineWithLatestOf(loggedIns), '/rest/v1/login', oldPasswordMatchV).validation.repeat()
    oldPasswordMatch.subscribe(toggleEffect($(".ch-old-password-doesnt-match")))
    oldPasswordMatch.subscribe(toggleClassEffect($('#ch-old-password'), "has-error"))

    var requirePassword = mkValidation($('#ch-password').changes(), requiredV("password-required"))
    var pwdChangeLengthValidation = mkValidation($('#ch-password').changes(), minLengthV(6, "password-too-short"))
    pwdChangeLengthValidation.subscribe(toggleEffect($(".ch-password-too-short")))
    pwdChangeLengthValidation.subscribe(toggleClassEffect($('#ch-password'), "has-error"))
    var updatePassword = mkValidation($('#ch-password').changes().combineLatest($('#ch-password2').changes(), asArgs), matchingValuesV("passwords-dont-match"))
    updatePassword.subscribe(toggleEffect($(".ch-passwords-do-not-match")))
    updatePassword.subscribe(toggleClassEffect($('#ch-password2'), "has-error"))
    var changePasswordValidations = [pwdChangeLengthValidation, updatePassword, requirePassword, oldPasswordMatch]
    combine(changePasswordValidations).subscribe(toggleClassEffect($('#change-password'), "disabled"))

    var passwordRequiredValidation = require("password")
    var pwdLengthValidation = attachValidation(minLengthV(6), 'too-short', 'password')
    combine([passwordRequiredValidation, pwdLengthValidation]).subscribe(toggleClassEffect($('#ex-password'), "has-error"))

    var emailValidation = attachValidation(emailV(), 'invalid', 'email')
    emailValidation.subscribe(toggleClassEffect($("#ex-email"), "has-error"))

    var samePassword = mkValidation($('#ex-password').changes().combineLatest($('#ex-password2').changes(), asArgs), matchingValuesV())
    samePassword.subscribe(toggleEffect($(".passwords-do-not-match")))
    combine([samePassword, pwdLengthValidation]).subscribe(toggleClassEffect($('#ex-password2'), "has-error"))

    var usernameRequiredValidation = require('username')
    var usernameAvailableValidator = createAjaxValidator(OnTrail.rest.usernameV);
    var usernameExistsValidation = mkServerValidation($('#ex-username').changes(), '/rest/v1/username-available/', usernameAvailableValidator).validation.repeat()
    usernameExistsValidation.subscribe(toggleEffect($(".user-exists")))
    combine([usernameExistsValidation, usernameRequiredValidation]).subscribe(toggleClassEffect($('#ex-username'), "has-error"))

    var registerValidations = _.flatten([usernameRequiredValidation, passwordRequiredValidation, pwdLengthValidation, samePassword, emailValidation, usernameExistsValidation])
    combine(registerValidations).subscribe(toggleClassEffect($('#register-user'), "disabled"))

    var exPagesWithComments = $("body").onClickTouchAsObservable(clickEvent, "a[data-new-comments]").selectMany(loggedIns).where(identity)

    var tabIsInFocus = rx.interval(3000).select(function () {
      return $("body").hasClass("visible") && document.hasFocus()
    }).where(identity).publish()
    tabIsInFocus.connect()

    var loggedInPoller = loggedIns.merge(tabIsInFocus.selectMany(loggedIns).where(identity).sample(30000)).merge(exPagesWithComments).publish()
    loggedInPoller.connect()

    var commentPages = currentPages.whereArgs(partialEquals("new-comments"))
    var commentsTicker = loggedInPoller.startWith(0).merge(commentPages).selectAjax(OnTrail.rest.newComments)
    commentsTicker.subscribe(renderCommentCount("#new-comments-count"))
    commentPages.combineLatest(commentsTicker, second)
      .takeUntil(currentPages.whereArgs(_.compose(not, partialEquals("new-comments")))).repeat().subscribe(renderNewComments)

    var ownCommentPages = currentPages.whereArgs(partialEquals("new-own-comments"))
    var ownCommentsTicker = loggedInPoller.startWith(0).merge(ownCommentPages).selectAjax(OnTrail.rest.newOwnComments)
    ownCommentsTicker.subscribe(renderCommentCount("#new-own-comments-count"))
    ownCommentPages.combineLatest(ownCommentsTicker, second)
      .takeUntil(currentPages.whereArgs(_.compose(not, partialEquals("new-own-comments")))).repeat().subscribe(renderNewComments)

    var mostCommentsPages = currentPages.whereArgs(partialEquals("most-comments")).throttle(101).selectAjax(OnTrail.rest.mostComments)
    mostCommentsPages.takeUntil(currentPages.whereArgs(_.compose(not, partialEquals("most-comments")))).repeat().subscribe(renderNewComments)

    // run our function on load
    if (!mobile) {
      // and run it again every time you scroll
      $(window).scrollAsObservable().startWith(0).selectMany(sessions).select(function (val) {
        return exists(val) ? true : false
      }).subscribe(fixMenuPosition)
    }

    $(document).onClickTouchAsObservable(clickEvent, ".dropdown .button, .dropdown button").subscribe(function (e) {
      var menu = $(e.target).closest(".dropdown")
      menu.find('.dropdown-slider').slideToggle('fast')
      menu.find('span.toggle').toggleClass('active')
      e.preventDefault()
    })

    // Close open dropdown slider/s by clicking elsewhwere on page
    $(document).onClickTouchAsObservable(clickEvent).subscribe(function (e) {
      var menu = $(e.target).closest(".dropdown")

      if (menu[0] == undefined || $(e.target).hasClass('ddm')) {
        $('.dropdown-slider').slideUp()
        $('span.toggle').removeClass('active')
      }
    })

    var togglePairAction = function (a, b) {
      return function () {
        a.hide()
        b.show()
      }
    }

    // A static user list generated using bit heavy mongodb offline query to suggest currently active users.
    // Must have a cached version of this in the server side. Chzn does not limit options, and
    // thus this affects only to the autocomplete feature of selecting users.
    var activeUsers = ["-James-", "20660", "Anttu", "BirdiBlu", "Bråoddvar", "Duckbill", "Elwood", "Emo", "Epunäiti", "Esteri", "Ewanator", "Fransa", "Geoeläin", "Haapis", "Hazel", "Heidi", "Hejkki", "Hietsu", "HiiNokka", "Holle", "Hopo", "Hähi", "Imatran Voima", "Jagge", "JH", "JohannaLP", "Jokiv", "Jukkis", "Justiina_", "Juupe", "Jörö", "KapteeniSolisluu", "Kerttu", "Keura", "Koskaanenjuokse", "Lanttu", "Larry", "LauraIsabella", "Leena51", "Lynx", "MariP", "Massa-Matti", "Nandi", "Niina", "Osku", "Pantse", "Pasi_P", "Peksu", "Peppi", "Pohjan Tähti", "Pumppi60", "Päivi", "SannaK", "Sehnsucht", "Silu", "Sirpakka", "Sissi von Vuorenpeikko", "Soironen", "Sope", "Suski", "TaijaO", "Tapsajussi", "Tasku67", "Tatteus", "Tero", "Tiiti54", "Triina", "Tuomas", "Turri", "Ursa Minor", "Vilivilperi", "admin", "anatooli", "arddy", "berniboy", "ejex", "erz", "ese", "hannikainen", "herba63", "isi", "jamaatta", "jamo57", "jarmila", "jatossu", "jennirinne", "jogo3000", "jyri", "kalervo1", "kalman", "kata", "kettis", "kirva", "kriish", "maja", "mala", "mana", "meusi", "miguel horsehead", "miklai", "muhola", "mummi", "niilos mc", "oikakati", "oskuman", "ousi", "pellervo", "peta", "pietro", "plouh", "poko", "rampako", "rauman", "ritaatti", "rote", "saarja", "saavape", "sakke 2", "sammatti", "sanina", "sava", "ski", "tatteus", "tiinu", "tuomasnu", "wicca"]
    // anonymous users get a restricted view of the sports choices
    var defaultSports = ["Juoksu", "Pyöräily", "Uinti", "Perinteinen hiihto", "Luisteluhiihto"]
    var renderFilterValues = function () {
      $('#filter-continuous-start-date').continuousCalendar({isPopup: true, selectToday: false, weeksBefore: 520, weeksAfter: 1, startField: $('#filter-start-date'), locale: DateLocale.FI })
      $('#filter-continuous-stop-date').continuousCalendar({isPopup: true, selectToday: false, weeksBefore: 520, weeksAfter: 1, startField: $('#filter-stop-date'), locale: DateLocale.FI })
      ich.sportsCreateTemplate({sports: _.filter(defaultSports, identity)}).appendTo($('#filter-sport'))
      $('#filter-users').select2({
        tags: activeUsers,
        tokenSeparators: [","],
        formatSelection: selectionFormat
      })
    }

    var onPageLoad = rx.empty().startWith("")
    onPageLoad.selectAjax(renderFilterValues)

    // Suodata / Filter -view
    var renderFilter = function () {
      var toCriteriaVal = function (comp, value, keyword) {
        if (value && value.length > 0) {
          return "/" + comp + "_" + keyword + "/" + value
        } else {
          return ""
        }
      }

      var kmhToInternal = function(value) {
        var kmh = parseFloat(value)
        if (!isNaN(kmh)) {
          return (1000 * kmh).toString()
        } else {
          return ""
        }
      }

      var toUrl = 'sport/' + $('#filter-sport').val()
      var users = _.filter(_.flatten(["", _.map($("#filter-users").select2("data"), selectionFormat)]))
      if (users.length > 0) {
        toUrl = toUrl + "/user/" + users.join(',')
      }
      toUrl = toUrl + toCriteriaVal('gte', $('#filter-minhr').val(), 'avghr')
      toUrl = toUrl + toCriteriaVal('lte', $('#filter-maxhr').val(), 'avghr')
      toUrl = toUrl + toCriteriaVal('gte', $('#filter-mindistance').val(), 'distance')
      toUrl = toUrl + toCriteriaVal('lte', $('#filter-maxdistance').val(), 'distance')
      toUrl = toUrl + toCriteriaVal('gte', kmhToInternal($('#filter-minpace').val()), 'pace')
      toUrl = toUrl + toCriteriaVal('lte', kmhToInternal($('#filter-maxpace').val()), 'pace')


      toUrl = toUrl + toCriteriaVal('gte', $('#filter-start-date')[0].value, 'creationDate')
      toUrl = toUrl + toCriteriaVal('lte', $('#filter-stop-date')[0].value, 'creationDate')

      toUrl = toUrl + "/sb/" + $('#filter-sort').val() + "/stats/true"
      $.address.value(toUrl)
    }

    $('#show-filter').onClickTouchAsObservable(clickEvent).subscribe(togglePairAction($('#search-form'), $('#filter-form')))
    $('#show-search').onClickTouchAsObservable(clickEvent).subscribe(togglePairAction($('#filter-form'), $('#search-form')))
    $('#filter-render').onClickTouchAsObservable(clickEvent).subscribe(renderFilter)
    $('#filter-reset-start').onClickTouchAsObservable(clickEvent).subscribe(function () {

      $("#filter-start-date").attr('value', "1.1.1970")
      $("#filter-start-date").trigger("cal:changed")
    })
    $('#filter-reset-stop').onClickTouchAsObservable(clickEvent).subscribe(function () {
      $("#filter-stop-date").attr('value', "")
      $("#filter-stop-date").trigger("cal:changed")
    })

    $("#ex-numeric-details").hide()
    $("#toggle-numeric-details").toggle(function () {
      $("#ex-numeric-details").show()
    }, function () {
      $("#ex-numeric-details").hide()
    })

    // Autosave the exercise XXX: this shoud be bound to onchange, but redactor
    // autosave, nor onchange event did not work.
    rx.interval(10000).subscribe(function () {
      var bodyText = $('#ex-body').getCode()
      console.log("autosave called")
      if (bodyText.length > 15) { // "empty" body contains <p>\n ... characters
        localStorage.setItem('ex-body', bodyText)
      }
    })
    // initiate current page
    currentPages.connect()
  })
})()
