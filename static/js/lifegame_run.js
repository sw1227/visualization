var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = 500 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var shape = [20, 20];// 行数・列数
var rectSize = Math.min(height/shape[0], width/shape[1]);// セルは領域に収まる正方形にする


////////////////////
// 初期配置の作成 //
////////////////////

// patternを(dy, dx)だけ平行移動させたもので初期化された2D Arrayを生成
//  (pattern: 「生」のセルの座標[y, x]のArray)
function createInitCells(pattern, dy, dx) {
    var zeros = new Array(shape[0]).fill(0).map(function() {
	return new Array(shape[1]).fill(0);
    });
    pattern.forEach(function(d) {
	zeros[ d[0] + dy ][ d[1] + dx ] = 1;
    });
    return zeros;
}

// 長寿型として知られるR-pentomino
var RPentomino = [[2, 1], [1, 2], [2, 2], [3, 2], [1, 3]];
var initCells = createInitCells(RPentomino, 10, 10);


////////////////////
// 初期配置の描画 //
////////////////////

// ライフゲームの作成：定義はlifegame.js
var lifegame = new GameOfLife(initCells);

var svg = d3.select("svg#svg-lifegame")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// セルを描画
svg.selectAll("g.raw")
    .data(lifegame.cells)
  .enter().append("g")
    .attr("class", "raw")
    .attr("transform", function(d, i) { return "translate(0," + i*rectSize + ")"; })
    .selectAll("rect")
    .data(function(d) { return d; })
  .enter().append("rect")
    .attr("x", function(d, i) { return i*rectSize; })
    .attr("width", rectSize)
    .attr("height", rectSize)
    .attr("fill", function(d) { return d==1 ? "#777" : "#fff"; });


////////////////////
// アニメーション //
////////////////////
var interval = 200; // animationの間隔[msec]
var step = 0;

// Animate
d3.interval(function() {
    // セルのupdate
    lifegame.update();
    draw(lifegame.cells);

    // ステップの表示を更新
    step += 1;
    d3.select("p.step").transition().delay(interval/4).text("step = " + step)

}, interval);

// データ更新時に描画し直すための関数
function draw(data) {
    svg.selectAll("g.raw")
	.data(data)
      .selectAll("rect")
	.data(function(d) { return d; })
      .transition().delay(0).duration(interval/2)
        .attr("fill", function(d) { return d==1 ? "#777" : "#fff"; });
}
