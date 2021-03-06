
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

function weeklyChartConfig(containerId, data, yTitle) {
  nv.addGraph({
    generate: function () {
      var width = 700,
        height = 300;
      var chart;
      chart = nv.models.multiBarChart()
        .stacked(true)
        .margin({left: 80, bottom: 50})
        .showXAxis(true)
        .showYAxis(true)
        .transitionDuration(300)
      ;

      chart.options({delay: 800});
      chart.multibar
        .hideable(true);

      chart.xAxis
        .axisLabel("Viikkonumero")
        .tickFormat(d3.format(',0f'))

      chart.yAxis
        .axisLabel(yTitle)
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

function getSportSums(key, filter, dataExtract, sums) {
  var values = _.map(sums, function(v) {
    var sportSummary = _.filter(v.summary, filter)
    var yData = dataExtract(sportSummary)
    return {x: v.week, y: yData}
  })
  var total = _.reduce(values, function(total, obj) {
    return obj.y > 0 ? total + obj.y : total
  }, 0)
  return {key: key, values: values, total: total}
}

function weeklySummaryGraph(elemId, sums, config) {
  var sports = _.filter(_.uniq(_.flatten(_.map(sums, function(summary) {
    return _.map(summary.summary, function(item) {
      return item.sport
    })
  }))), function(val) { return val !== "Kaikki" })

  var distanceExtract = function(sportSummary) {
    return sportSummary.length === 1 ? sportSummary[0].tdistance / 1000 : 0
  }

  var durationExtract = function(sportSummary) {
    return sportSummary.length === 1 ? sportSummary[0].tduration / (100 * 60 * 60) : 0
  }

  var dataSets = []
  _.each(sports, function(sport) {

    var sportFilter = function(val) {
      return val.sport === sport
    }

    var dataExtractFun = config && config.duration !== undefined ? durationExtract  : distanceExtract

    sportSum = getSportSums(sport, sportFilter, dataExtractFun, sums)
    if (sportSum.total > 0) {
      dataSets.push(sportSum)
    }
  })
  weeklyChartConfig(elemId, dataSets, config.title)
}
