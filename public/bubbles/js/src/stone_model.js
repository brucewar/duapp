(function () {
  function StoneModel(_row, _col, _scope) {
    this.row = _row;
    this.col = _col;
    this.scope = _scope;
    this.stoneArray = [];

    for (var c = this.col - 1; c >= 0; c--) {
      for (var r = 0; r < this.row; r += 2) {
        var rand = Math.floor(Math.random() * this.scope);
        if (r == 0) {
          this.stoneArray[r][c] = rand;
          this.stoneArray[r + 1][c] = rand;
        } else {
          if (Math.floor(Math.random() * 2) == 0) {
            this.stoneArray[r][c] = rand;
            this.stoneArray[r + 1][c] = rand;
          } else {
            var temp = this.stoneArray[r - 1][c];
            this.stoneArray[r - 1][c] = rand;
            this.stoneArray[r][c] = rand;
            this.stoneArray[r + 1][c] = temp;
          }
        }
      }
    }
  }

  StoneModel.prototype.findConnectedStone_ = function (row, col, arr, stones, stoneType) {
    if (stones[row][col] == stoneType) {
      stones[row][col] = -1;
      arr.push({'x': row, 'y': col});
      if (row - 1 >= 0) {
        this.findConnectedStone_(row - 1, col, arr, stones, stoneType);
      }
      if (row + 1 <= this.row - 1) {
        this.findConnectedStone_(row + 1, col, arr, stones, stoneType);
      }
      if (col - 1 >= 0) {
        this.findConnectedStone_(row, col - 1, arr, stones, stoneType);
      }
      if (col + 1 <= this.col - 1) {
        this.findConnectedStone_(row, col + 1, arr, stones, stoneType);
      }
    }
  };

  StoneModel.prototype.findConnectedStone = function (row, col) {
    var connected = [];
    if (row < 0 || row >= this.row) return connected;
    if (col < 0 || col >= this.col) return connected;
    if (this.stoneArray[row][col] == -1) {
      return connected;
    }
    var stones = [];
    for (var i = 0; i < this.stoneArray.length; i++) {
      var stone = [];
      for (var j = 0; j < this.stoneArray[i].length; j++) {
        stone.push(this.stoneArray[i][j])
      }
      stones.push(stone);
    }
    this.findConnectedStone_(row, col, connected, stones, stones[row][col]);
    return connected;
  };

  StoneModel.prototype.removeConnectedStone = function (row, col) {
    if (row < 0 || row >= this.row) return;
    if (col < 0 || col >= this.col) return;
    for (var i = row; i > 0; i--) {
      this.stoneArray[i][col] = this.stoneArray[i - 1][col];
    }
    this.stoneArray[i][col] = -1;
  };

  StoneModel.prototype.checkNullCol = function () {
    for (var i = this.col; i > 0; i--) {
      for (var j = 0; j < this.row; j++) {
        if (this.stoneArray[j][i] != -1) break;
      }
      if (j == this.row) {
        return i;
      }
    }
    return null;
  };

  StoneModel.prototype.updateAndMove = function (nullCol) {
    for (var i = 0; i < this.row; i++) {
      for (var j = nullCol; j > 0; j--) {
        this.stoneArray[i][j] = this.stoneArray[i][j - 1];
      }
      this.stoneArray[i][j] = -1;
    }
  };

  StoneModel.prototype.checkHasConnected = function () {
    for (var i = 0; i < this.row; i++) {
      for (var j = 0; j < this.col - 1; j++) {
        if (this.stoneArray[i][j] != -1 && this.stoneArray[i][j + 1] != -1 && this.stoneArray[i][j] == this.stoneArray[i][j + 1]) {
          return true;
        }
      }
    }
    for (var n = 0; n < this.col; n++) {
      for (var m = 0; m < this.row - 1; m++) {
        if (this.stoneArray[m][n] != -1 && this.stoneArray[m + 1][n] != -1 && this.stoneArray[m][n] == this.stoneArray[m + 1][n]) {
          return true;
        }
      }
    }
    return false;
  };

  return this.StoneModel = window.StoneModel = StoneModel;
})();