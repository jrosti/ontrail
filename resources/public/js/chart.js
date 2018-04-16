var charts = (function () {

  function chartData(labels, distances, cumulative)  {
    return {
      type: "bar",
      data: {
        labels: labels,
        datasets : [
          {
            label: "% hitaammin",
            type:'line',
            pointHoverRadius: 8,
            data: cumulative,
            fill: false,
            borderColor: '#FF4081',
            backgroundColor: '#FF4081',
            pointBorderColor: '#FF4081',
            pointBackgroundColor: '#FF4081',
            pointHoverBackgroundColor: '#FF4081',
            pointHoverBorderColor: '#FF4081',
            yAxisID: 'y-axis-2'
          },
          {
            type: 'bar',
            backgroundColor: "rgba(48, 63, 159, 0.4)",
            borderColor: "rgba(48, 63, 159, 0.4)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(48, 63, 159, 0.3)",
            hoverBorderColor: "rgba(48, 63, 159, 0.3)",
            label: 'Matka vauhdilla',
            data : distances,
            yAxisID: 'y-axis-1'
          }

        ]
      },
      options: {
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              drawOnChartArea: false
          },
            labels: {
              show: true
            }
          }],
          yAxes: [{
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            gridLines: {
              display: false,
              drawOnChartArea: false
            },
            labels: {
              show: true
            }
          }, {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              display: false,
              drawOnChartArea: true
            },
            labels: {
              show: true
            }
          }]
        }
      }
    }
  }

  function renderPaceHistogram(parentId, stats) {
    $('#pace-histogram').remove();
    $(parentId).append('<canvas id="pace-histogram" width="600" height="300"><canvas>');
    var ctx =  document.getElementById('pace-histogram')
    var bins = []
    var distances = []
    var cumulative = []
    var toMinkm = function(pace) {
      var kmh = pace / 1000.0
      var minkm = 60 / kmh
      var mins = Math.floor(minkm)
      var secs = Math.round((minkm - mins) * 60.0) / 100
      return (mins + secs).toFixed(2)
    }
    var total = _.max(stats.paceHist)
    var width = 1
    for (var i = width; i < stats.paceHist.length; i+=width) {
      var cumulativePoint = stats.paceHist[i]/total
      if (cumulativePoint > 0.01 && (cumulativePoint <= 0.9999 || stats.paceHistBins[i] < 13000)) {
        bins.push(toMinkm(stats.paceHistBins[i]) + "/km")
        distances.push(Math.round((stats.paceHist[i] - stats.paceHist[i - width]) / 100)/10)
        cumulative.push(Math.round(cumulativePoint*100))
      }
    }
    new Chart(ctx, chartData(bins, distances, cumulative));
  }

  return { renderPaceHistogram: renderPaceHistogram}
})()

/*
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
*/