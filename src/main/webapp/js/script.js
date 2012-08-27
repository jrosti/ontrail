
(function() {
  $('#user').changeAsObservable().select(function(event) { return event.target.value }).subscribe(function(data) { console.log("hello world", data) })
})()





