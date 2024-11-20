export class Player {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.tetromino = null;
    this.score = 0;
  }

  reset(tetromino) {
    this.tetromino = tetromino;
    this.pos.y = 0;
    this.pos.x = Math.floor(12 / 2) - Math.floor(this.tetromino.matrix[0].length / 2);
  }

  rotate(dir) {
    const matrix = this.tetromino.matrix;
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [
          matrix[x][y],
          matrix[y][x],
        ] = [
          matrix[y][x],
          matrix[x][y],
        ];
      }
    }
    if (dir > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  }
}
