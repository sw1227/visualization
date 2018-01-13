// 1次元セルオートマトンを扱うクラス
var CellularAutomaton = function(initCells, rule) {

    // 初期化
    this.cells = initCells;
    this.rule = rule;
    this.length = initCells.length;

    // this.cells[-1]やthis.cells[this.length]を処理して両端をループさせる
    this.index = function(i) {
	return (i+this.length) % this.length;
    }

    // this.cellsをもとに次のステップにおけるcellを生成
    this.update = function() {
	this.cells = new Array(this.length).fill(0).map(function(d, i) {
	    neighborCode =
		4 * this.cells[this.index(i-1)] +
		2 * this.cells[this.index(i)] +
		1 * this.cells[this.index(i+1)];
	    return Math.floor(this.rule / 2**neighborCode) % 2;
	}, this);
    }
}
