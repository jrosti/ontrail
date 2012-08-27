
(function() {
  $(document).ready(function() {
    var source = $("#summary-entry-template").html();
    var entryTemplate = Handlebars.compile(source);

    var getSummary = function(user) {
      return $.ajaxAsObservable({ url: "http://localhost:8080/summary/" + user })
    }

    var drawSummary = function(data) {
      var content = _.map(data, entryTemplate).reduce(function(a, b) { return a+b })
      debug(data, content)
      $('#summary-entries').html(content)

    }

    var summaryRequests = $('#user').changeAsObservable().select(function(event) { return event.target.value }).selectAjax(getSummary)
    summaryRequests.where(isSuccess).select(ajaxResponseData).subscribe(drawSummary)

  })

})()





