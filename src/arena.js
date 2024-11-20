export class Arena {
  constructor(w, h) {
    this.matrix = [];
    while (h--) {
      this.matrix.push(new Array(w).fill(null));
    }
    this.onMerge = null;
  }

  sweep() {
    let rowCount = 0;
    outer: for (let y = this.matrix.length - 1; y > 0; --y) {
      for (let x = 0; x < this.matrix[y].length; ++x) {
        if (this.matrix[y][x] === null) {
          continue outer;
        }
      }
      const row = this.matrix.splice(y, 1)[0].fill(null);
      this.matrix.unshift(row);
      ++y;
      rowCount++;
    }
    return rowCount;
  }

  collide(player) {
    const [m, o] = [player.tetromino.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 &&
          (this.matrix[y + o.y] &&
            this.matrix[y + o.y][x + o.x]) !== null) {
          return true;
        }
      }
    }
    return false;
  }

  merge(player) {
    player.tetromino.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.matrix[y + player.pos.y][x + player.pos.x] = {
            gradient: player.tetromino.gradient
          };
        }
      });
    });
    if (this.onMerge) {
      this.onMerge();
    }
  }
}
