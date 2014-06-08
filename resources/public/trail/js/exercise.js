var $ = require("jquery")
var _ = require("lodash")

function header(exercise) {
  function title() {
    return $('<div class="title">')
      .append($("<h1>").text(exercise.caption))
      .append($("<h3>").text(exercise.description))
  }

  function author(author) {
    return $('<div id="author">')
      .append($('<span class="icon-user-woman">'))
      .append(author.firstName + " " + author.lastName)
  }

  function overview() {
    return $('<div id="overview">')
      .append($('<div id="distance">')
        .append($('<span class="flaticon-running30">'))
        .append(" " + exercise.distance + " ")
        .append($('<span class="flaticon-stopwatch7">'))
        .append(" " + exercise.duration))
  }

  return $('<header>')
            .append($('<div class="overlay">'))
            .append(title())
            .append(author(exercise.author))
            .append(overview())
}

function storyPart(part) {

  if (part.divider) {
    return [$('<div class="divider">').text(part.divider),
            $('<img>', {"class": "sidebar left", "src": part.image})]
  }

  if (part.quote) return $("<section>").append($("<blockquote>").append(part.quote))
  if (part.text) return $("<section>").append(part.text)

  if (part.image) {
    var caption = part.caption || ""
    var author = part.author ? " Kuva: " + part.author : ""
    return $('<section class="image">')
      .append($('<figure>')
        .append($('<img>', {"src": part.image}))
      .append($("<figcaption>").text(caption + author)))
  }

  if (part.video) {
    var caption = part.caption || ""
    var author = part.author ? " Kuva: " + part.author : ""
    return $('<section class="video">')
      .append($('<figure>')
        .append($('<embed>', {"src": part.video, "width": "800", "height": "480", "type": part.contentType, "allowfullscreen": true}))
      .append($("<figcaption>").text(caption + author)))
  }

  return ""
}


function story(parts) {
  return _(parts).map(storyPart).flatten().value()
}

exports.render = function render(exUrl) {
  console.log("execing ajax")
  var ex = $.ajax(exUrl).done(function(exercise) {
    $("title").text(exercise.author.blogName)
    $("#header").replaceWith(header(exercise))
    $(".content").html("").append(story(exercise.story))
  }).error(function(err) {
    console.log("vituiks meni", err)
  })

}
