// 1次元セルオートマトンを扱うクラス
var CellularAutomaton = function(initCells, rule) {

    // 初期化
    this.cells = initCells;
    this.rule = rule;
    this.length = initCells.length;

    // 基本的にはthis.cells[i]を返すが、両端を処理して空間をループさせる
    this.getItem = function(i) {
	return this.cells[ (i+this.length) % this.length ];
    }

    // this.cellsをもとに次のステップにおけるcellを生成
    this.update = function() {
	this.cells = this.cells.map(function(_, i) {
	    neighborCode = 4*this.getItem(i-1) + 2*this.getItem(i) + this.getItem(i+1);
	    return Math.floor(this.rule / 2**neighborCode) % 2;
	}, this);
    }
}
