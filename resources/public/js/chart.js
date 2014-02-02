
function addGraph(dataGenerator) {
  nv.addGraph({
    generate: function () {
      var width = 700,
        height = 300;

      var chart = nv.models.multiBarChart()
          .barColor(d3.scale.category20().range())
          .margin({bottom: 100})
          .transitionDuration(300)
          .delay(0)
          .rotateLabels(45)
          .groupSpacing(0.1)

      chart.yAxis
        .tickFormat(d3.format('.1f'))

      chart.xAxis
        .axisLabel("Vauhti")
        .showMaxMin(true)
        .tickFormat(d3.format('.2f'))

      d3.select("#paceHistogram")
        .attr('width', width)
        .attr('height', height)
        .datum(dataGenerator())
        .transition()
        .call(chart);

      return chart;
    },
    callback: function (graph) {
      window.onresize = function () {
      }
    }
  })
}


function weeklyChartConfig(containerId, data) {
  nv.addGraph({
    generate: function () {
      var width = 700,
          height = 300;
      var chart;
      chart = nv.models.multiBarChart()
        .stacked(true)
        .margin({bottom: 50})
        .transitionDuration(300)
      ;

      chart.options({delay: 800});
      chart.multibar
        .hideable(true);

      chart.xAxis
        .axisLabel("Viikkonumero")
        .showMaxMin(true)
        .tickFormat(d3.format(',0f'));

      chart.yAxis
        .tickFormat(d3.format(',.1f'));

      d3.select(containerId)
        .attr('width', width)
        .attr('height', height)
        .datum(data)
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    }
  })
}

/*(defn pacetominkm [cpace]
  (let [kmh (/ cpace 1000.0)
minkm (/ 60.0 kmh)
min (int minkm)
s (int (* 60.0 (- minkm min)))]
(str min "." (format "%02d" s) " min/km")))*/
function genValues(paces, vals) {
  return function() {
    var xy = [];
    var toMinkm = function(pace) {
      var kmh = pace / 1000.0
      var minkm = 60 / kmh
      var mins = Math.floor(minkm)
      var secs = Math.round((minkm - mins) * 60.0)/100
      return mins + secs
    }
    for (var i = 15; i < vals.length - 2; i++) {
      xy.push({x: toMinkm(paces[i]), y: (vals[i] - vals[i - 1])/1000})
    }

    return [
      {
        values: xy,
        key: "Vauhtiskaala",
        color: "#ff7f0e"
      }
    ];
  }
}

function getSportSums(key, filter, sums) {
  var values = _.map(sums, function(v) {
    var sportSummary = _.filter(v.summary, filter)
    var distance = sportSummary.length === 1 ? sportSummary[0].tdistance / 1000 : 0
    return {x: v.week, y: distance}
  })
  var total = _.reduce(values, function(total, obj) {
    return obj.y > 0 ? total + obj.y : total
  }, 0)
  return {key: key, values: values, total: total}
}

function weeklySummaryGraph(elemId, sums) {
  var sports = _.filter(_.uniq(_.flatten(_.map(sums, function(summary) {
    return _.map(summary.summary, function(item) {
      return item.sport
    })
  }))), function(val) { return val !== "Kaikki" })
  var dataSets = []
  _.each(sports, function(sport) {
    sportSum = getSportSums(sport, function(val) {
      return val.sport === sport
    }, sums)
    if (sportSum.total > 0) {
      dataSets.push(sportSum)
    }
  })
  weeklyChartConfig("#weekly-sums", dataSets)

}