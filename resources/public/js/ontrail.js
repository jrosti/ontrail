(function () {
  $(document).ready(function () {
    FastClick.attach(document.body);

    var ww = $(window).width(), sw = screen.width, orientation = window.orientation;

    // Fix: On iOS, screen.width is always the width of the device held in portrait mode.
    // Android, however, sets it to the width of the device in its current orientation.
    // This ends up breaking our detection on HD devices held in landscape mode, so we
    // do a little trick here to detect this condition and make things right.
    if (screen.width > screen.height && Math.abs(orientation) == 90) {
      sw = screen.height
    }

    var mobile = (ww <= 480 || sw <= 480) || Modernizr.touch

    if (mobile) {
      $('#sportFilter').hide()
    }

    var enableWebSocket = true

    var isEnter = function (event) {
      return event.keyCode == 13;
    }

    $.ajaxSetup({ cache: false })
      
    var $spinnerElement = "#content-spinner"

    function actionButtonAsStream(btn, _selector, _action) {
      var action, selector, button
      if (arguments.length == 3) {
        action = _action
        selector = _selector
      } else if (arguments.length == 2) {
        action = _selector
      }
      var actionStream = $(btn).onAsObservable("click", selector).select(targetLink).where(_.compose(not, _hasClass("disabled")))
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


    var $userList = $("#user-results")
    var $groupsList = $("#groups-content")

    function selectionFormat(state) {
      if (!state.id) return state.toString();
      return state.text.toString();
    }

    var doPostExercise = function (url) {
      var renderSelection = _.compose(encodeURIComponent, selectionFormat)
      var sport = (!Modernizr.touch) ? $("#ex-sport").select2("data") : $("#ex-sport").val();
      var values = $('#add-exercise-form').serialize()
        + "&sport=" + renderSelection(sport)
        + "&body=" + encodeURIComponent($('#ex-body').editable('getHTML'))
        + "&tags=" + _.filter(_.flatten(["", _.map($("#ex-tags").select2("data"), renderSelection)])).join(",")

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
      var content = $('#comment-body').editable('getHTML');

      if (content.trim() != "") {
        var values = "body=" + encodeURIComponent($('#comment-body').editable('getHTML'))
        return OnTrail.rest.postAsObservable("ex/" + exercise + "/comment", values)
      } else {
        return Rx.Observable.returnValue({ jqXHR: { status: 500 }})
      }

    }

    var postRegisterUser = function () {
      return OnTrail.rest.postAsObservable("register", $('#register-form').serialize())
    }

    var postJoinOrLeaveGroup = function (group, action) {
      return OnTrail.rest.postAsObservable("groups/" + group + "/" + action, {})
    }

    var confirmDelete = function (dialog, type, id) {
      return $(dialog).modalAsObservable({}).take(1).where(partialEquals("delete")).select(always([type, id]))

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
        var content = _.map(mappedData, _.partial(render, ich.exerciseTemplate)).join("").trim()

        $(content).appendTo(elem)

        var tableContent = _.map(mappedData, _.partial(render, ich.exerciseSummaryTemplate)).join("").trim()
        $(tableContent).appendTo(tableElem)
      }
    }
    var renderReadCount = function(id) {
      if (!keen) {
        return;
      }
      keen.count(id, function(res) {
        if (res && res.result > 0) {
          $('[data-id=' + id + '] > p.count').html("Luettu " + res.result + " kertaa")
        }
      })
    }

    var renderSingleExercise = function (exercise, me) {
      if (keen) {
        keen.view(exercise.id, exercise.user, me)
      }

      renderUserMenuFromUsername(exercise.user)
      renderReadCount(exercise.id)
      var helpers = {
        now: function() {
          return moment().format("DD.MM.YYYY HH:mm");
        },
        me: me,
        "my-avatar": $("#profile-avatar").attr("src"),
        deleteComment: function () {
          return function (text, render) {
            if (this.user !== me && exercise.user !== me) return ""
            this.deleteRel = (this.user === me ? "ex/" : "own/ex/") + exercise.id + (this.user === me ? "/own/comment/" : "/comment/") + this.id;
            return render(text)
          }
        }
      }
      $('#exercise').html(ich.singleExerciseTemplate(_.extend(exercise, helpers)))

      $("#comment-body").editable()

      $('#scrollBottom').click(function () {
        $("html, body").animate({ scrollTop: $('#content-wrapper')[0].clientHeight - 500}, 500)
      })

    }
    var renderSports = function (data) {
      $('#ex-sport, #filter-sport').html(ich.sportsCreateTemplate({sports: _.filter(data, identity)}))

      if (!Modernizr.touch) {
        $('#ex-sport, #filter-sport').select2({formatSelection: selectionFormat})
        $("#filter-sport").val("Juoksu").attr('selected', true)
        $("#filter-sport").select2("data", {id: "Juoksu", text: "Juoksu"})
      } else {
        $('#ex-sport, #filter-sport').css("display", "initial")
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
      ich.usersCreateTemplate({users: data}).appendTo($userList)
    }
    var renderGroupList = function (data) {
      ich.groupsTemplate({groups: data}).appendTo($groupsList)
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
      $('#weekly-graph-container').hide()
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
      } else if ($.isArray(summary.results)) { //render weekly summary
        var sum = _.extend(summary, utils)
        $('#weekly-graph-container').show()
        weeklySummaryGraph("#weekly-sums", sum.results, {title: "Matka (km)"})
        weeklySummaryGraph("#weekly-sums-time", sum.results, {title: "Aika (h)", duration: true})

        var filteredResults = _.filter(sum.results, function(val) {
          return val.summary[0].tduration > 0
        }).reverse()

        sum.results = filteredResults
        $("#" + elem + "-entries").html(ich.hpkWeeklySummaryContentTemplate(sum))
      } else {
        var sum = _.extend({ year: now.getFullYear() }, addFilter(summary), utils)
        $("#" + elem + "-entries").html(ich.hpkContentTemplate(sum))
      }
      if (sum.kind === "summary") {
        sum = _.extend({hasWeekly: true}, sum)
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
            var day = monday.clone().addDays(index).getDate();
            return {day: day, dayIndex: index, exs: item, "class": monday.clone().addDays(index).getMonth() == month ? "current" : "other-month"}
        })
        var monday = new XDate(summary.fromIsoDate)
        var sum = (summaryItem.exs.length > 0 ? summaryItem.summary : [])
        var result = {week: summaryItem.week, exs: exs, summaries: sum, from: summaryItem.from, to: summaryItem.to, user: summaryItem.user }
        return result
      }

      var date = new XDate(summary[0].from)
      var month = date.getMonth()
      var summaries = _.extend({summary: _.map(summary, _.partial(toWeeklySummary, month)), month: month,
        year: date.getFullYear(), weeks: (summary.length * 2) + 1}, monthNames)
      $(ich.hpkWeeklyContentTemplate(summaries)).appendTo($("#weeksummary"))

      $(document).ready(function(){
        $('.tooltipped').tooltip();
      });

    }

    var renderHint = function (kind, item) {
      $("#" + kind + "-hint").html(item[kind])
    }

    // logged in state handling
    var doLogin = function () {
      $('#login-form').submit(function(event){event.preventDefault();})
      return OnTrail.rest.postAsObservable("login", $('#login-form').serialize())
    }
    var logouts = $(".logout").onAsObservable("click")

    var loginEnters = $("#password").keyupAsObservable().where(isEnter)
    var loginRequests = $("#login").onAsObservable("click").merge(loginEnters).selectAjax(doLogin)
    var logins = loginRequests.where(isSuccess).select(ajaxResponseData)

    var loginFails = loginRequests.where(_.compose(not, isSuccess)).select(ajaxResponseData)

    $("#gotoLogin").onAsObservable("click").subscribe(function () {
      $("html, body").animate({ scrollTop: $("#login-wrapper").offset().top - 110 }, 1000)
    })

    var registerUsers = ajaxActionButtonAsStream('#register-user', postRegisterUser).doAction(function () {
      $('#register-form')[0].reset()
    })

    // change password
    var changePasswords = ajaxActionButtonAsStream('#change-password', postChangePassword)
    changePasswords.subscribeArgs(renderChangePassword)


    var isLoggedUser = function(v) {
      return !!v && v !== "null"
    }
    // create session
    var sessions = OnTrail.session.create(logins.merge(registerUsers).merge(changePasswords), logouts.merge(loginFails))
    var loggedIns = sessions.where(isLoggedUser)

    // toggle logged-in and logged-out3
    sessions.subscribe(function (userId) {
      $('body').toggleClass('logged-in', isLoggedUser(userId)).toggleClass('logged-out', !isLoggedUser(userId))
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

    function renderUpdateElemCount(elem, newComments) {
      if (newComments > 0)
        $(elem).text(newComments).show()
      else
        $(elem).hide()
    }

    function renderUpdateTitleWithComments(newComments) {
      if (newComments > 0) {
        document.title = "(" + newComments + ")" + " ontrail.net"
      } else {
        document.title = "ontrail.net"
      }
    }

    function renderOwnCommentCount(result) {
      renderUpdateTitleWithComments(result.count)
      renderUpdateElemCount('.new-own-comments-count', result.count)
    }

    function renderCommentCount(result) {
      renderUpdateElemCount('.new-comments-count', result.count)
    }

    var webSocket
    var $messages = $('#messages')
    var webSocketPollerActive = false
    var lastPongEpoch = new Date().getTime()
    var webSocketRetriesCount = 0

    if (!("WebSocket" in window)) {
      $('#chatSection').hide()
    }

    var closeWebSocket = function() {
      if (enableWebSocket && "WebSocket" in window && webSocket) {
        try {
          webSocket.onclose = function () {}
          webSocket.close()
          webSocketPollerActive = false
          webSocket === undefined
        } catch(err) {
        }
      }
    }

    var openWebSocket = function (userId) {
      webSocketPollerActive = true
      if (enableWebSocket && "WebSocket" in window && webSocket === undefined ||
          (webSocket && (webSocket.readyState === undefined || webSocket.readyState > 1))) {
        webSocket = new WebSocket('ws://' + location.hostname + ":" + location.port + '/rest/v1/async')

        $messages.empty()

        var onMessage = Rx.Observable.create(function (observer) {
          var next = function () {
            observer.onNext("")
          }

          webSocket.onmessage = function(event) {
            var message = JSON.parse(event.data)

            if (message.action && message.action === "server" && message.message === "pong") {
              lastPongEpoch = new Date().getTime();
              return
            }

            if (message.action && message.action.indexOf("kommentoi") === 0) {
              next()
            }

            if (message.user == "Ontrail") {
              return;
            }

            message.timestamp = moment().format("DD.MM.YYYY HH:mm")
            if (message.otherUser) {
              message.description = message.action.replace(message.otherUser, "<a rel=\"user/" + message.otherUser + "\" class=\"pageLink\">" + message.otherUser + "</a>")
            } else {
              message.description = message.action
            }

            var templateMsg = ich.chatMessageTemplate(message)
            $messages.prepend(templateMsg)
          }
          return nothing()
        })
        var commentPublished = onMessage.publish()
        commentPublished.connect()
        commentPublished.throttle(1500).selectAjax(OnTrail.rest.newCommentCountAll).subscribe(renderCommentCount)
        commentPublished.throttle(3500).selectAjax(OnTrail.rest.newCommentCountOwn).subscribe(renderOwnCommentCount)
      }
    }


    var pingInterval = 4000, openWhenPingMissedIn = 15000, maxReopenCount = 20

    setInterval(function() {
      if (webSocketPollerActive && webSocketRetriesCount < maxReopenCount) {
        if (new Date().getTime() - lastPongEpoch > openWhenPingMissedIn) {
          closeWebSocket()
          openWebSocket()
          webSocketRetriesCount++
          lastPongEpoch = new Date().getTime()
        }
        try {
          if (webSocket && webSocket.readyState === 1)
            webSocket.send(JSON.stringify({action: "server", message: "ping"}))
        } catch (err) {
        }
      }
    }, pingInterval)

    logouts.subscribe(closeWebSocket)
    loggedIns.subscribe(openWebSocket)

    // open single entries
    var parentArticle = function (el) {
      return $(el).closest('article')
    }
    var clickedLinks = $("body").onAsObservable("click", "a").select(targetLink).publish()
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
    var isOpenEvent = function(el) {
    }
    clickedArticles.combineWithLatestOf(sessions).subscribeArgs(function (el, viewer) {
      try {
        var $el = $(el)
        if ($el.hasClass('full')) {
          var id = $el.attr('data-id')
          var owner = $el.attr('data-article-owner')
          if (keen) {
            keen.view(id, owner, viewer)
          }
          renderReadCount(id)
        }
      } catch(e) {
      }
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

    var windowLinks = clickedLinks.where(function (elem) {
      return $(elem).hasClass('windowLink')
    }).select(function (el) {
        return attr("rel", el)
    })
    windowLinks.subscribeArgs(function(url) {
      window.open('#' + url, 'ontrail', 'width=830,height=800')
    })

    var windowLinks = clickedLinks.where(function (elem) {
      return $(elem).hasClass('imagePopup')
    }).select(function (el) {
      return attr("rel", el)
    })
    windowLinks.subscribeArgs(function(url) {
      var $dialog = $("#dialog")
      var $image = $('#image')
      $image.attr('src', url);
      $image.load(function(){

        $dialog.dialog({
          modal: true,
          resizable: false,
          draggable: false,
          width: "auto",
          title: url
        });
      });
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
      return ["latest"]
    }

    // back button handling
    var backPresses = Rx.Observable.create(function (observer) {
      var next = function () {
        observer.onNext(decodeURIComponent($.address.value()))
      }
      $.address.init(next).change(next)
      return nothing()
    }).select(splitM)

    $("#mobile-back").onAsObservable("click").subscribe(function() {
      history.go(-1)
    })

    var currentPages = sessions.selectArgs(initialPage).merge(pageLinks.selectArgs(pageAndArgs)).merge(registerUsers.select(always("profile"))).merge(backPresses)
        .select(function (pages) {
          if (pages === undefined || pages.length < 1 || pages[0] == "")
              return ["latest"]
          return pages
        })
        .publish()

    currentPages.whereArgs(partialEquals("register")).subscribe(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000)
    })

      var tops = currentPages.whereArgs(partialEquals("tops")).distinctUntilChanged().selectArgs(pairsAsAssocMap)
      tops.where(function(args) { return args.tops === "hours" }).selectAjax(OnTrail.rest.topHours).subscribe(function(data) {
	  data.title = "tuntiahmatit"
	  $("#top-list").html(ich.topHoursTemplate(data))
      })
      var sportSelector = { runs: "Juoksu", swims: "Uinti", byfoot: "Byfoot", bywheel: "Bywheel", skis: "Hiihtolajit", rowing: "Soudut", pullups: "Leuanveto", stretches: "Venyttely"}
      var titles = {"Juoksu": "juoksukunkut", "Uinti": "vesipedot", "Byfoot": "jaloittelijat", "Bywheel": "pyöräilijät", "Hiihtolajit" : "hiihtelijät", "Soudut": "soutajat", "Venyttely" : "venyttelijät"};
      tops.where(function(args) { return args.tops != "hours" && args.tops != "most-read" && args.tops != "pullups"})
          .select(function(args) { return sportSelector[args.tops]})
	  .selectAjax(OnTrail.rest.topSports).subscribe(function(data) {
	      data.title = titles[data.sport]
	      $("#top-list").html(ich.topHoursTemplate(data))
          })
      tops.where(function(args) { return args.tops == "pullups" })
	  .select(function(args) { return sportSelector[args.tops] })
          .selectAjax(OnTrail.rest.topSports).subscribe(function(data) {
	      $("#top-list").html(ich.topPullupsTemplate(data))
	  })
      tops.where(function(args) { return args.tops === "most-read" }).selectAjax(OnTrail.rest.mostRead).subscribe(function(data) {
	  $("#top-list").html(ich.listsTemplate({result: data}))
      })

    var userprofilePages = currentPages.whereArgs(partialEquals("userprofile")).selectArgs(pairsAsAssocMap)
    userprofilePages.selectAjax(OnTrail.rest.s3list).subscribe(function(data) {
      $("#file-list").html(ich.fileListTemplate(data.data))
    })

    var $scrollTopTarget = $('html, body')
    var $body = $('body')

    function scrollToPosition(idx, requiredPosition) {
      try {
        var currentScrollTop = $(document).scrollTop()
        if (requiredPosition - currentScrollTop > 50 && idx < 30) {
          $scrollTopTarget.animate({scrollTop: requiredPosition}, 700).promise().done(function() {
            scrollToPosition(idx + 1, requiredPosition)
          })
        }
      } catch (err) {}
    }

    function scrollPositionMemo(args) {
      try {
        var pos = $(document).scrollTop()
        var memoizePositionOnPages = ['latest', 'user', 'tags', 'sport', 'group', 'weeksummary']
        var prevPage = $body.attr('data-last-page')
        var scrollTo = parseInt($body.attr('data-page-pos-' + args[0]))
        $body.attr('data-page-pos-' + prevPage, pos)
        $body.attr('data-last-page', args[0])
        if (scrollTo &&
            _.contains(memoizePositionOnPages, args[0]) &&
            (prevPage === "ex" || (prevPage === "user" && args[0] === "weeksummary"))) {
          scrollToPosition(0, scrollTo)
        } else {
          $scrollTopTarget.scrollTop(0)
        }
      } catch(err) {
      }
    }

    currentPages.subscribe(scrollPositionMemo)

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
      else if (arguments.length == 5) setFilter("byyear")
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
      $("#current-user-container").html(ich.userDetailTemplate(user))
    }

    function renderUserMenuFromUsername(username) {
      OnTrail.rest.profile(username).take(1).select(_attr("data")).subscribe(renderUserMenu)
    }

    // update current user in the menu bar
    var currentPageLinkUsers = currentPages.distinctUntilChanged()
        .where(function(page) { return (page && page.length > 0 && ((page[0] || "") != "ex")) })
        .combineWithLatestOf(sessions).selectArgs(_findUser(1));
    sessions.merge(currentPageLinkUsers)
        .where(function(page) { return (initialPage()[0] || "") != "ex"})
        .switchMap(OnTrail.rest.profile)
        .select(_attr("data"))
        .subscribeArgs(renderUserMenu)

    var userTagPages = currentPages.whereArgs(partialEqualsAny(["user", "tags", "sport", "group"])).distinctUntilChanged()

    userTagPages.selectArgs(pairsAsAssocMap).doAction(function () {
        $("#table-entries").html("")
      }).throttle(30).scrollWith(OnTrail.rest.exercises, $("#content-entries"), $("*[role=content]"))
      .takeUntil(currentPages.whereArgs(_.compose(not, partialEqualsAny(["user", "tags", "sport", "group"])))).repeat()
      .subscribe(renderLatest("#content-entries", "#table-entries"))

    var renderPageDetail = function (args) {
      $('#header-content').html("")

      if (!isSuccess(args)) {
        return
      }

      if (args.data.action == "group") {
        if (args.data.target == "Marrasputki") {
          ich.marrasputkiTemplate(args.data).appendTo($('#header-content'))
        } else if (args.data.target == "lvhaaste2014") {
          ich.lvhaaste2014Template(args.data).appendTo($('#header-content'))
        } else if (args.data.target == "RunnersHigh") {
          ich.runnersHighTemplate(args.data).appendTo($('#header-content'))
        } else if (args.data.target == "Suosikit") {
          ich.favGroupTemplate(args.data).appendTo($('#header-content'))
        } else if (args.data.target == "Huippuhuhtikuu") {
          ich.elevationGroupTemplate(args.data).appendTo($('#header-content'))
        } else {
          ich.groupDetailTemplate(args.data).appendTo($('#header-content'))
        }
      } else {
        ich.otherDetailTemplate(args.data).appendTo($('#header-content'))
        if (args.data && args.data.stats && args.data.stats.paceHist && args.data.stats.paceHist.length > 1) {
          $('body').addClass("pace")
          addGraph(genValues(args.data.stats.paceHistBins, args.data.stats.paceHist))
        }
      }
    }

    currentPages.subscribe(function() {
      $('body').removeClass("pace")
    })


    userTagPages.selectArgs(function() {
      var args = Array.prototype.slice.call(arguments)
      var pairs = partition(args, 2)
      return _.extend({action: args[0]}, _.zipObject(pairs))
    }).throttle(101).selectAjax(OnTrail.rest.pageDetail)
      .takeUntil(currentPages.whereArgs(_.compose(not, partialEqualsAny(["user", "tags", "sport", "group"]))))
      .repeat().subscribeArgs(renderPageDetail)

    var $raceReports2013 = $('#raceReports2013')
    $($raceReports2013).hide()

    var exPages = currentPages.whereArgs(partialEquals("ex")).spinnerAction('#exercise').throttle(101)
    exPages.selectAjax(OnTrail.rest.details).combineWithLatestOf(sessions).subscribeArgs(renderSingleExercise)
    exPages.throttle(300).selectAjax(OnTrail.rest.newCommentCountOwn).subscribe(renderOwnCommentCount)
    exPages.throttle(150).selectAjax(OnTrail.rest.newCommentCountAll).subscribe(renderCommentCount)

    var renderActiveUsersList = function (data) {
      $("#active-users").html(ich.activeUsersTemplate({"users": data}))
    }

    // initiate loading and search
    var latestScroll = $("#search").changes().throttle(600).skip(1).merge(currentPages.whereArgs(partialEquals("latest")).select(always("")))
      .doAction(function () {
        $("#content-entries").html("")
        spinner($spinnerElement)()
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
        var now = XDate.today()
        var year = now.getFullYear()
        var month = now.getMonth()
        var maxYear = now.getFullYear()

        if (pg.length >= 2) {
          targetUser = pg[1]
        }
        if (pg.length == 4) { // url scheme weeksummary/User/year/month
          year = parseInt(pg[2])
          month = parseInt(pg[3])
        }
        var nextYear = year === now.getFullYear() ? year : year + 1
        var nextMonth = year === now.getFullYear() - 1 ? now.getMonth() : (year === now.getFullYear() ? now.getMonth() : 11)


          $('#weeklyNavigate').html(ich.weeklyNavigateTemplate({user: targetUser,
                                                              year: year,
                                                              hasNextYear: function () {
                                                                return this.year != maxYear
                                                              },
                                                              prevYear: year - 1, prevMonth: 11,
                                                              nextYear: nextYear, nextMonth: nextMonth}))
        return OnTrail.pager.create(_.partial(OnTrail.rest.weeksummary, targetUser, year, month), $("#weeksummary"))
      })
      .switchLatest()
    weeklyScroll.takeUntil(currentPages.whereArgs(_.compose(not, partialEquals("weeksummary")))).repeat().subscribe(renderWeeklySummary)

    // initiate summary loading after login
    var summaries = currentPages.whereArgs(partialEquals("summary")).spinnerAction("#summary-entries").throttle(101).selectArgs(tail).selectAjax(OnTrail.rest.summary)
    summaries.subscribe(_.partial(renderSummary, "summary"))

    var tagSummaries = currentPages.whereArgs(partialEquals("tagsummary")).spinnerAction("#tagsummary-entries").throttle(101).selectArgs(tail).selectAjax(OnTrail.rest.tagsummary)
    tagSummaries.subscribe(_.partial(renderSummary, "tagsummary"))

    // user search scroll
    var usersScroll = $("#search-users").changes().skip(1).merge(currentPages.whereArgs(partialEquals("users")).select(always("")))
      .doAction(function () {
        $userList.html("")
      })
      .selectArgs(function (query) {
        if (query === "")
          return OnTrail.pager.create(OnTrail.rest.users, $userList)
        else
          return OnTrail.pager.create(_.partial(OnTrail.rest.searchUsers, query), $userList)
      })
      .switchLatest()
    usersScroll.takeUntil(currentPages.whereArgs(_.compose(not, partialEquals("users")))).repeat().subscribe(renderUserList)

    // group list scroll
    var groupsScroll = currentPages.whereArgs(partialEquals("groups")).merge(joinsAndLeaves)
      .doAction(function () {
        $groupsList.html("")
      })
      .selectArgs(function (query) {
        return OnTrail.pager.create(OnTrail.rest.groups, $groupsList)
      }).switchLatest()
    groupsScroll.takeUntil(currentPages.whereArgs(_.compose(not, partialEquals("groups")))).repeat().subscribe(renderGroupList)

    // Lisää lenkki
    var resetEditor = function () {
      $("#add-exercise-form label").removeClass("active")
      $("#add-exercise-form .reset").val('')
      if (!Modernizr.touch) {
        $("#ex-sport").select2("data", {id: "Juoksu", text: "Juoksu"})
        $("#ex-tags").select2("data", [])
        $("#ex-date").val(moment().format("DD.MM.YYYY"))
      } else {
        $("#ex-date").val(moment().format("YYYY-MM-DD"))
        $("label[for=\"ex-date\"]").addClass("active")
      }
      $("#time-hint, #distance-hint").html("")
      var autoSavedText = localStorage.getItem("ex-body")
      var text = (autoSavedText && autoSavedText.length > 15) ? autoSavedText : "<p>\n<br>\n</p>"
      $("#ex-body").editable()

      $("#ex-title, #ex-duration").blur()
      $("#ex-title").focus()
    }

    var showExercise = function (ex) {
      showPage("ex", ex.id);
      renderSingleExercise(ex)
    }

    var doClearAutoSave = function() {
      try {
        localStorage.setItem("ex-body", "<p>\n<br>\n</p>")
      } catch(err) {
      }
      $("#ex-body").editable("setHTML", "<p>\n<br>\n</p>")
    }

    var addExercises = actionButtonAsStream('#add-exercise-form', 'a.addExercise',function (instream) {
      return instream.combineWithLatestOf(sessions).selectArgs(second).where(exists).selectAjax(postAddExercise)
    }).where(isSuccess).select(ajaxResponseData)

    addExercises.subscribe(showExercise)
    addExercises.subscribe(doClearAutoSave)

    currentPages.whereArgs(partialEquals("addex")).subscribeArgs(function (page, exid) {
      if (exid === undefined) resetEditor()
    })

    // muokkaa lenkkiä:
    var renderEditExercise = function (ex) {
      $("[role='addex']").attr('data-mode', 'edit')
      _.map(["title", "duration", "distance", "avghr", "detailRepeats", "detailVolume", "detailElevation"], function (field) {
        $('#ex-' + field).val(ex[field]).keyup()
        if ((ex[field] || "") != "") {
          $("label[for=\"ex-" + field + "\"]").addClass('active')
        } else {
          $("label[for=\"ex-" + field + "\"]").removeClass('active')
        }
      })
      $("#ex-date").attr('value', Modernizr.touch ? moment(ex.date, "DD.MM.YYYY").format("YYYY-MM-DD") : ex.date)
      $("label[for=\"ex-date\"]").addClass('active')
      $("#ex-body").editable()
      $("#ex-body").editable("setHTML", ex.body)
      if (!Modernizr.touch)
        $("#ex-sport").select2("data", [ex.sport])
      else {
        $("#ex-sport").val(ex.sport || "Juoksu").attr('selected', true)
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
    $('.pageLink[rel="addex"]').onAsObservable("click").subscribe(renderAddExercise)

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
    updateExercises.subscribe(doClearAutoSave)

    // update user profile
    var updateProfiles = $('#update-profile').onAsObservable("click")
      .selectAjax(postProfile).where(isSuccess).select(ajaxResponseData)
    updateProfiles.subscribeArgs(renderProfileUpdate)

    var renderMarkAllRead = function (args) {
      $(".new-comments-count").hide()
      $(".new-own-comments-count").hide()
      document.title = 'ontrail.net'
    }

    var markAllRead = $('#mark-all-read').onAsObservable("click")
      .selectAjax(OnTrail.rest.markAllRead).subscribe(renderMarkAllRead)

    // Lisää kommentti
    var addComments = actionButtonAsStream('#exercise', "a.addComment",function (clickStream) {
      return clickStream.select(_attr("data-id")).selectAjax(postComment)
    }).where(isSuccess).select(ajaxResponseData)
    addComments.combineWithLatestOf(sessions).throttle(101).subscribeArgs(renderSingleExercise)

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

    if (!Modernizr.touch) {
      var picker = new Pikaday({
        field: document.getElementById('ex-date'),
        format: "DD.MM.YYYY"
      });
    } else {
      $("#ex-date").attr("type", "date")
    }

    var editorSettings = {
      buttons: ['html', '|', 'formatting', '|', 'bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'outdent', 'indent', '|',
        'image', 'table', 'link', '|', 'fontcolor', 'backcolor', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'horizontalrule'],
      minHeight: 200,
      setCodeTextarea: function (code) {
        this.$el.val(code).trigger('change')
      }
    }
//    $('#ex-body').redactor(editorSettings)

    loggedIns.selectAjax(OnTrail.rest.loggedIns).subscribe(function (loggedIn) {
      var profile = loggedIn.profile
      _.map(["goals", "synopsis", "resthr", "maxhr", "aerk", "anaerk"], function (field) {
        $('#' + field).val(profile[field])
        if ((profile[field] || "") != "") {
          $("label[for=\"" + field + "\"]").addClass("active")
        }
      })
      $('#profile-email').text(loggedIn.email)
      $('#profile-avatar').attr("src", loggedIn.avatarUrl)
      renderTags(loggedIn.ownTags)
      renderSports(loggedIn.sports)
      $('.ownGroupsDropDown').html(ich.ownGroupsTemplate({user: loggedIn.user, 'groups': loggedIn.ownGroups}))
    })


    var oldPasswordMatchV = createAjaxValidator(OnTrail.rest.passwordV)
    var oldPasswordMatch = mkServerValidation($('#ch-old-password').changes().throttle(300).combineWithLatestOf(loggedIns).skip(1), '/rest/v1/login', oldPasswordMatchV).validation.repeat()
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

    var exPagesWithComments = $("body").onAsObservable("click", "a[data-new-comments]").selectMany(loggedIns).where(identity)

    var tabIsInFocus = rx.interval(3000).select(function () {
      return $("body").hasClass("visible") && document.hasFocus()
    }).where(identity).publish()
    tabIsInFocus.connect()

    var loggedInPoller = loggedIns.merge(tabIsInFocus.selectMany(loggedIns).where(identity).sample(5000000)).merge(exPagesWithComments).publish()
    loggedInPoller.connect()

    var commentsTicker = loggedInPoller.startWith(0).selectAjax(OnTrail.rest.newCommentCountAll)
    commentsTicker.subscribe(renderCommentCount)
    var ownCommentsTicker = loggedInPoller.startWith(0).selectAjax(OnTrail.rest.newCommentCountOwn)
    ownCommentsTicker.subscribe(renderOwnCommentCount)

    var commentPages = currentPages.whereArgs(partialEquals("new-comments"))
    commentPages.selectAjax(OnTrail.rest.newComments).subscribe(renderNewComments)
    commentPages.selectAjax(OnTrail.rest.newCommentCountAll).subscribe(renderCommentCount)

    var ownCommentPages = currentPages.whereArgs(partialEquals("new-own-comments"))
    ownCommentPages.selectAjax(OnTrail.rest.newOwnComments).subscribe(renderNewComments)
    ownCommentPages.selectAjax(OnTrail.rest.newCommentCountOwn).subscribe(renderOwnCommentCount)

    ownCommentPages.combineLatest(ownCommentsTicker, second)
      .takeUntil(currentPages.whereArgs(_.compose(not, partialEquals("new-own-comments")))).repeat().subscribe(renderNewComments)

    var mostCommentsPages = currentPages.whereArgs(partialEquals("most-comments")).throttle(101).selectAjax(OnTrail.rest.mostComments)
    mostCommentsPages.takeUntil(currentPages.whereArgs(_.compose(not, partialEquals("most-comments")))).repeat().subscribe(renderNewComments)

    $("#mobile-menu").sideNav({
      "menuWidth": 300,
      "edge": "left",
      closeOnClick: true
    })

    var togglePairAction = function (a, b) {
      return function () {
        a.hide()
        b.show()
      }
    }

    $(".filter-menu").onAsObservable("click").subscribe(function() {
      $("body").addClass("filter")
      showPage("sport", "Juoksu")
    })

    currentPages.where(function(page) { return page[0] != "sport"}).subscribe(function(pg) {
      $("body").removeClass("filter")
      $("body").removeClass("pace")
    })

    $("#filter-close").onAsObservable("click").subscribe(function() {
      $("body").removeClass("filter")
      $("body").removeClass("pace")
    })

    var activeUsers = ["-James-", "20660", "Anttu", "BirdiBlu", "Bråoddvar", "Duckbill", "Elwood", "Emo", "Epunäiti", "Esteri", "Ewanator", "Fransa", "Geoeläin", "Haapis", "Hazel", "Heidi", "Hejkki", "Hietsu", "HiiNokka", "Holle", "Hopo", "Hähi", "Imatran Voima", "Jagge", "JH", "JohannaLP", "Jokiv", "Jukkis", "Justiina_", "Juupe", "Jörö", "KapteeniSolisluu", "Kerttu", "Keura", "Koskaanenjuokse", "Lanttu", "Larry", "LauraIsabella", "Leena51", "Lynx", "MariP", "Massa-Matti", "Nandi", "Niina", "Osku", "Pantse", "Pasi_P", "Peksu", "Peppi", "Pohjan Tähti", "Pumppi60", "Päivi", "SannaK", "Sehnsucht", "Silu", "Sirpakka", "Sissi von Vuorenpeikko", "Soironen", "Sope", "Suski", "TaijaO", "Tapsajussi", "Tasku67", "Tatteus", "Tero", "Tiiti54", "Triina", "Tuomas", "Turri", "Ursa Minor", "Vilivilperi", "admin", "anatooli", "arddy", "berniboy", "ejex", "erz", "ese", "hannikainen", "herba63", "isi", "jamaatta", "jamo57", "jarmila", "jatossu", "jennirinne", "jogo3000", "jyri", "kalervo1", "kalman", "kata", "kettis", "kirva", "kriish", "maja", "mala", "mana", "meusi", "miguel horsehead", "miklai", "muhola", "mummi", "niilos mc", "oikakati", "oskuman", "ousi", "pellervo", "peta", "pietro", "plouh", "poko", "rampako", "rauman", "ritaatti", "rote", "saarja", "saavape", "sakke 2", "sammatti", "sanina", "sava", "ski", "tatteus", "tiinu", "tuomasnu", "wicca"]

    // anonymous users get a restricted view of the sports choices
    var defaultSports = ["Juoksu", "Pyöräily", "Uinti", "Perinteinen hiihto", "Luisteluhiihto"]
    var renderFilterValues = function () {
      if (!Modernizr.touch) {
        var startPicker = new Pikaday({
          field: document.getElementById('filter-start-date'),
          format: "DD.MM.YYYY"
        });

        var endPicker = new Pikaday({
          field: document.getElementById('filter-stop-date'),
          format: "DD.MM.YYYY"
        });

        $('#filter-users').select2({
          tags: activeUsers,
          tokenSeparators: [","],
          formatSelection: selectionFormat
        })
      } else {
        $('#filter-users').css('display', 'initial')
        $("#filter-start-date").attr("type", "date").parent().removeClass("input-field")
        $("#filter-stop-date").attr("type", "date").parent().removeClass("input-field")
      }

      $("#filter-sort").material_select()
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

      var kmhToInternal = function (value) {
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

    $('#show-filter').onAsObservable("click").subscribe(togglePairAction($('#search-form'), $('#filter-form')))
    $('#show-search').onAsObservable("click").subscribe(togglePairAction($('#filter-form'), $('#search-form')))
    $('#filter-render').onAsObservable("click").subscribe(renderFilter)
    $('#filter-reset-start').onAsObservable("click").subscribe(function () {

      $("#filter-start-date").attr('value', "1.1.1970")
      $("#filter-start-date").trigger("cal:changed")
    })
    $('#filter-reset-stop').onAsObservable("click").subscribe(function () {
      $("#filter-stop-date").attr('value', "")
      $("#filter-stop-date").trigger("cal:changed")
    })

    $("#ex-numeric-details").hide()
    $("#toggle-numeric-details").toggle(function () {
      $("#ex-numeric-details").show()
    }, function () {
      $("#ex-numeric-details").hide()
    })

    // initiate current page
    currentPages.connect()
  })
})()
