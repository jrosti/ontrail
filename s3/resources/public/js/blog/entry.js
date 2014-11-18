var $ = require("jquery")
var _ = require("lodash")
var ð = require("../util/dom")
var ƒ = require("../util/functional")
var Rx = require("rx")
var moment = require("moment")
require("rx-jquery")
require("../util/rx-extensions")

window.jQuery = $
window.MediumEditor = MediumEditor
$.fn.MediumEditor = MediumEditor
window.moment = moment
require("livestamp")
require("medium-editor-insert-plugin")
require("medium-editor-insert-images")


var MediumEditor = require("medium-editor")

var editorOpts = {
  cleanPastedHTML: true,
  placeholder: "Kerro jotain lenkistäsi ...",
  buttonLabels: 'fontawesome'
}

var titleEditorOpts = {
  cleanPastedHTML: true,
  disableReturn: true,
  disableDoubleReturn: true,
  firstHeader: 'h1',
  secondHeader: 'h2',
  disableToolbar: true,
  placeholder: "Naseva otsikko lenkillesi!"
}

var entryIdRegex = /\/(edit|entry)\/(.*)/
var entryId = (entryIdRegex.exec(document.location.pathname) || [undefined, undefined, undefined])[2]

function iconFor(sport) {
  return allSports.find(function(item) { return item.label == sport} ).icon
}

function populate(fromEditMode) {
  var entryStream = Rx.Observable.from(['', '/draft']).flatMap(function(extraPath) {
    return $.getJSONAsObservable("/trail/rest/blog/" + entryId + extraPath).catchException()
  }).retry(1).map(ƒ.attrF("data")).take(1).publish()
  entryStream.subscribe(function(entry) {
    var date = moment.unix(entry.date)
    $("#page-title").text(entry.title)
    $("#ex-title").text(entry.title)
    $("#ex-body").html(entry.body)
    $("#ex-date").attr("data-timestamp", entry.date).livestamp(date)
    if (fromEditMode) {
      $("#ex-sport").val(entry.sport)
    }
    if (entry.sport)
      $("#distance-logo").toggleClass(iconFor(entry.sport)).show()
    if (entry.distance) {
      $("#distance-text").text(entry.distance).show()
    }
    if (entry.time) {
      $("#time-text").text(entry.time).show()
      $("#time-logo").show()
    }
    if (!fromEditMode) {
      $("#author-fullname").text(entry.user)
      $("#author-image").attr('style', "background-image: url(" + entry.avatar + ");")
    }
  })
  entryStream.connect()

  return entryStream
}

function edit() {
  function _zipObj(keys) {
    return function() {
      var arr = []
      for (var i = 0; i < arguments.length; i++)
        arr[i] = arguments[i]
      return _.zipObject(keys, arr)
    }
  }

  var titles = $("#ex-title").onAsObservable('input').throttledEventTarget(300).map(ð.text).startWith("")
  var bodies = $("#ex-body").onAsObservable('input').throttledEventTarget(300).map(ð.html).startWith("")
  var distance = $("#ex-distance").onAsObservable('change').map(ƒ.attrF("target")).map(ð.val).startWith("")
  var time = $("#ex-time").onAsObservable('change').map(ƒ.attrF("target")).map(ð.val).map(function(time) { time + "000"}).startWith("")
  var sport = $("#ex-sport").onAsObservable('change').map(ƒ.attrF("target")).map(ð.val).startWith("")
  var date = $("#ex-date").onAsObservable('change').map(ƒ.attrF("target")).map(ð.attrF('data-timestamp')).startWith("")

  var draft = entryId ? populate(true) : $.postAsObservable("/trail/rest/blog/draft", {}).map(ƒ.attrF("data"))

  var drafts =
    draft.flatMapLatest(function(blogPost) {
      return Rx.Observable.combineLatest([titles, bodies, distance, time, sport, date], _zipObj(["title", "body", "distance", "time", "sport", "date"]))
        .map(function(values) { return _.merge({}, blogPost, values) })
    }).distinctUntilChanged().skip(1)

    draft.take(1).subscribe(function (dr) {
        var titleEditor = new MediumEditor("#ex-title", titleEditorOpts) // instantiate content editor
        var contentEditor = new MediumEditor(".editable", editorOpts) // instantiate content editor

        $('.editable').mediumInsert({
          editor: contentEditor,
          addons: {
            images: {
              imagesUploadScript: '/file-upload/put'
            }
          }
        });
    })

  return { drafts: drafts, allSports: allSports }
}

var allSports = _([
  { "Beach volley": "flaticon-volleyball3" },
  { "Crossfit": "flaticon-weightlift" },
  { "Crosstrainer": "flaticon-person212" },
  { "Cyclocross": "flaticon-time13" },
  { "Golf": "flaticon-golf22" },
  { "Hiihto": "flaticon-ski2" },
  { "Jalkapallo": "flaticon-soccer43" },
  { "Jooga": "flaticon-guru1" },
  { "Jumppa": "flaticon-jump7" },
  { "Juoksu": "flaticon-running30" },
  { "Jääkiekko": "flaticon-ice57" },
  { "Kahvakuula": "flaticon-biceps" },
  { "Kamppailulaji": "flaticon-martial2" },
  { "Kaukalopallo": "flaticon-ice46" },
  { "Kickbike": "flaticon-regular2" },
  { "Kiipeily": "flaticon-climbing6" },
  { "Koripallo": "flaticon-basketball3" },
  { "Kuntopiiri": "flaticon-flexions" },
  { "Kuntopyörä": "flaticon-bicycle14" },
  { "Kuntosali": "flaticon-barbell" },
  { "Kävely": "flaticon-walking17" },
  { "Laskettelu": "flaticon-skiing7" },
  { "Lentopallo": "flaticon-person39" },
  { "Leuanveto": "flaticon-pulling" },
  { "Luistelu": "flaticon-ice49" },
  { "Luisteluhiihto": "flaticon-ski2" },
  { "Lumikenkäily": "flaticon-walking17" },
  { "Lumilautailu": "flaticon-extreme1" },
  { "Maantiepyöräily": "flaticon-time13" },
  { "Maastojuoksu": "flaticon-mountain23" },
  { "Maastopyöräily": "flaticon-mountain24" },
  { "Melonta": "flaticon-padding" },
  { "Nyrkkeily": "flaticon-female139" },
  { "Perinteinen hiihto": "flaticon-ski2" },
  { "Pilates": "flaticon-leg1" },
  { "Potkukelkkailu": "flaticon-trekking" },
  { "Pumppi": "flaticon-dumbbell21" },
  { "Pyöräily": "flaticon-regular2" },
  { "Ratsastus": "flaticon-silhouette2" },
  { "Ringette": "flaticon-ice46" },
  { "Rullahiihto": "flaticon-ski2" },
  { "Rullaluistelu": "flaticon-skater1" },
  { "Salibandy": "flaticon-hockey2" },
  { "Sauvakävely": "flaticon-trekking" },
  { "Seikkailu-urheilu": "flaticon-compass" },
  { "Sisäsoutu": "flaticon-person209" },
  { "Soutu": "flaticon-person209" },
  { "Spinning": "flaticon-bicycle14" },
  { "Squash": "flaticon-squash" },
  { "Sulkapallo": "flaticon-man36" },
  { "Suunnistus": "flaticon-map49" },
  { "Sähly": "flaticon-hockey2" },
  { "Tanssi": "flaticon-american36" },
  { "Telinevoimistelu": "flaticon-individual3" },
  { "Tennis": "flaticon-person17" },
  { "Triathlon": "flaticon-mountain24" },
  { "Uinti": "flaticon-swimming20" },
  { "Vaellus": "flaticon-hiking" },
  { "Venyttely": "flaticon-man252" },
  { "Vesijuoksu": "flaticon-swimming20" },
  { "Yleisurheilu": "flaticon-jumping2" }
]).map(function(sport) {
  var key = _.keys(sport)[0]
  return {
    label: key,
    icon: sport[key],
    value: key
  }
})

function renderEntries(el, draft, entries) {
  $(el).append(_(entries.blogs).map(function(entry) {
    var excerptText = $(entry.body).filter("p").text().substring(0,140)
    var hasExcerpt = excerptText != ""
    var hasTitle = entry.title && entry.title != ""
    var titleText = hasTitle ? entry.title : (draft ? "Harjoituksen otsikko on vielä hakusessa" : excerptText)

    var $title = $("<h3>", { "class": hasTitle ? "" : "generated" }).text(titleText)
    var $excerpt = $("<p>",  { "class": hasExcerpt ? "" : "generated" }).text( (excerptText != "" || !draft) ? excerptText : "Lenkkisi kaipaa kuvausta")
    var $sport = (entry.sport ? $("<span>", {"class": iconFor(entry.sport)}).text(entry.distance? " " + entry.distance : "") : "")
    var $time = (entry.time ? $("<span>", {"class": "flaticon-stopwatch7"}).text(entry.time ? " " + entry.time : "") : "")
    var $user = $("<h5>").append($("<span>", {"class": "author"}).text(entry.user)).append($sport).append($time)
    return $("<div>", {"class": "entry-preview pure-u-1", "data-sid": draft ? entry.id : entry.sid}).append($title).append($excerpt).append($user)
  }).value())
}


var elementBottomIsAlmostVisible = function($el, margin) {
    if (!$el.is(':visible')) return false;

    // Toim.huom. $(window).height() näyttäis olevan rikki jquery 1.8.1:ssä...
    var viewportBottom = $(window).scrollTop() + window.innerHeight
    var loadingPoint = $el.offset().top + $el.outerHeight()

    return (viewportBottom  + margin) >= loadingPoint
}

var pager = function(fromUrl) {
    return fromUrl.scan( {page: 0},
      function(val, url) { var pg = val.page + 1; return {page: pg, url: url } })
      .map(function(item) { return item.url + "page=" + item.page })
}

function entries(el, drafts) {
  require("../app/user").requiredAuths()

  var url = drafts ? "/trail/rest/blog/list/drafts?" : "/trail/rest/blog/list/all?"
  var $el = $("#blog-posts")

  var ajaxReady = $el.onAsObservable("blog-update").throttle(100)
  var shouldUpdate = ajaxReady.merge($(window).onAsObservable('scroll').throttle(100)).filter(_.partial(elementBottomIsAlmostVisible, $el, 100))
  var pages = ajaxReady.startWith("").zip(shouldUpdate.startWith(""), _.identity)

  var entries = pager(pages.map(function() { return url })).flatMap(function(url) {
    return $.getJSONAsObservable(url)
  })

  entries.map(ƒ.attrF("data")).subscribe(function(entries) {
    renderEntries($el, drafts, entries)
    if (entries.blogs.length > 0)
      $el.trigger("blog-update")
  }, function() { $el.trigger("blog-update") })

  return entries
}

exports.entries = entries
exports.edit = edit
exports.populate = populate


