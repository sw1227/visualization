// Conway's Game of Life を扱うクラス
var GameOfLife = function(initCells, rule={"survival": [2,3], "birth": [3]}) {

    // 初期化
    this.cells = initCells;
    this.rule = rule;
    this.shape = [initCells.length, initCells[0].length];

    // 基本的にはthis.cells[i][j]を返すが、両端を処理して空間をループさせる
    this.getItem = function(i, j) {
	r = (i+this.shape[0]) % this.shape[0];
	c = (j+this.shape[1]) % this.shape[1];
	return this.cells[r][c];
    }

    // this.cellsをもとに次のステップにおけるcellを生成
    this.update = function() {
	this.cells = this.cells.map(function(row, i) {
	    return row.map(function(cell, j) {
		// (i, j)の周囲8近傍のindexたち
		neighbors = [[i-1, j-1], [i-1, j], [i-1, j+1],
			     [i  , j-1],           [i  , j+1],
			     [i+1, j-1], [i+1, j], [i+1, j+1]];

		// 周囲8近傍中の「生」の数
		var count = neighbors.filter(function(n) {
		    return this.getItem(n[0], n[1]) == 1;
		}, this).length;

		// 環境に応じて誕生/生存/死滅
		if (this.rule.birth.indexOf(count) >= 0)
		    return 1; // 誕生
		if ( (cell==1) && (this.rule.survival.indexOf(count)>=0) )
		    return 1; // 生存
		return 0; // 死滅

	    }, this);
	}, this);
    }
}
