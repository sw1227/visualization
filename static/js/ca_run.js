var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = 500 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var rule = 90;
d3.select("#rule")
    .attr("value", rule);

var numCells = 40;
var cellSize = width / numCells;

// 中央だけ1のArrayから始める
var initCells = new Array(numCells).fill(0);
initCells[Math.floor(numCells/2)] = 1;

// 定義はca.js
var ca = new CellularAutomaton(initCells, rule);

var svg = d3.select("svg#svg-ca")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// セルを描画
for(var r=0; r*cellSize<height; r++){
    svg.append("g")
	.attr("class", "row")
	.selectAll("rect")
	.data(ca.cells)
      .enter().append("rect")
	.attr("x", function(d, i) { return i * cellSize; })
	.attr("y", r*cellSize)
	.attr("width", cellSize)
	.attr("height", cellSize)
	.attr("fill", function(d) { return d==1 ? "#777": "#fff"; });
    ca.update();
}

// 一番上の行（初期状態）はクリックで値を設定できるようにする
svg.select(".row").selectAll("rect")
    .on("click", function(d, i) {
	initCells[i] = 1 - d;
	redraw(initCells, rule, 0);
    });

// ルールを変更したら描画し直す
d3.select("#rule").on("input", function() {
    rule = +this.value;
    redraw(initCells, rule, 500);
});

// ルールや初期状態に変更があった時に描画し直すための関数
function redraw(initCells, rule, duration=0) {
    var ca = new CellularAutomaton(initCells, rule);
    
    for(var r=0; r*cellSize<height; r++){
	svg.selectAll(".row").filter(function(d, i) { return i==r; })
	    .selectAll("rect")
	    .data(ca.cells)
	  .transition().duration(duration)
	    .attr("fill", function(d) { return d==1 ? "#777": "#fff"; });
	ca.update();
    }
}
