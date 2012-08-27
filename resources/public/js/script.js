
(function() {

  var getSummary = function(user) {
    return $.ajaxAsObservable({ url: "http://localhost:8080/summary/" + user })
  }

  var drawSummary = function(data) {
    debug(data)
  }

  var summaryRequests = $('#user').changeAsObservable().select(function(event) { return event.target.value }).selectAjax(getSummary)
  summaryRequests.where(isSuccess).select(ajaxResponseData).subscribe(drawSummary)

})()





