
(function() {
  $(document).ready(function() {
    var source = $("#summary-entry-template").html();
    var entryTemplate = Handlebars.compile(source);

    var getSummary = function(user) {
      return $.ajaxAsObservable({ url: "http://localhost:8080/summary/" + user })
    }

    var doLogin = function() {
      console.log($('#login-form').serialize())
      return $.ajaxAsObservable({ type: 'POST', url: "http://localhost:8080/login", data: $('#login-form').serialize() })
    }


    var drawSummary = function(data) {
      var content = _.map(data, entryTemplate).reduce(function(a, b) { return a+b })
      debug(data, content)
      $('#summary-entries').html(content)
    }

    var logins = $("#login").clickAsObservable().selectAjax(doLogin)
    logins.subscribe(debug)

    var summaryRequests = logins.where(isSuccess).select(ajaxResponseData).select(function(data) { return data.user }).selectAjax(getSummary)
    summaryRequests.where(isSuccess).select(ajaxResponseData).subscribe(drawSummary)

  })

})()





