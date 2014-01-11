/**
 * Created by jro on 10/22/13.
 */

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
      xy.push({x: toMinkm(paces[i+1]), y: (vals[i] - vals[i -1 ])/1000})
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
