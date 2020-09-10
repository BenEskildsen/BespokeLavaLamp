

const config = {
  gridWidth: 60, // 960
  gridHeight: 96, // 1536

  modes: ['red', 'saddlebrown', 'green', 'yellow'],

  // mode-specific settings:
  red: {
    msPerTick: 100,
    liveMin: 2, // if alive, must have at least this many live neighbors to stay alive
    liveMax: 3, // if alive, must have at most this many live neighbors to stay alive
    deadMin: 3, // if dead, must have at least this many live neighbors to become alive
    deadMax: 3, // if dead, must have at most this many live neighbors to become alive
    noiseRate: 0.4,
    backgroundColor: 'black',
    color: (val) => 'red',
    maxVal: 1,
    decayRate: 0.01,
    noiseFn: (x, y, width, height, noiseRate, nextAlive) => {
      if (
        y == height - 1 && Math.random() < noiseRate ||
        y == height - 2 && Math.random() < noiseRate / 2
      ) {
        return 1;
      }
      return nextAlive;
    },
    computeNextVal: (val, numAliveNeighbors, settings) => {
      let nextVal = val;
      if (val == 1) {
        nextVal = (
          numAliveNeighbors < settings.liveMin ||
          numAliveNeighbors > settings.liveMax
        ) ? val - settings.decayRate : 1;
      } else {
        nextVal = (
          numAliveNeighbors < settings.deadMin ||
          numAliveNeighbors > settings.deadMax
        ) ? val - settings.decayRate : 1;
      }
      return nextVal
    },
    getNumAliveNeighbors: (grid, x, y) => {
      let sum = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i == 0 && j == 0) continue;
          if (x + i >= grid.length || y + j >= grid[x].length) continue;
          if (x + i < 0 || y + j < 0) continue;
          sum += grid[x + i][y + j] == 1 ? 1 : 0;
        }
      }
      return sum;
    },
  },

  saddlebrown: {
    msPerTick: 100,
    liveMin: 2, // if alive, must have at least this many live neighbors to stay alive
    liveMax: 5, // if alive, must have at most this many live neighbors to stay alive
    deadMin: 3, // if dead, must have at least this many live neighbors to become alive
    deadMax: 3, // if dead, must have at most this many live neighbors to become alive
    noiseRate: 0.2,
    backgroundColor: 'black',
    color: (val) => {
      return val > 50 ? "#D2691E" : '#6B8E23';
    },
    decayRate: 0.06,
    maxVal: 1,
    noiseFn: (x, y, width, height, noiseRate, nextAlive) => {
      if (
        y == height - 1 && Math.random() < noiseRate
        // y == 2 && Math.random() < noiseRate / 2
      ) {
        return 1;
      }
      return nextAlive;
    },
    computeNextVal: (val, numAliveNeighbors, settings) => {
      let nextVal = val;
      if (val >= 1 && val <= 250) {
        const liveMax = val < 50 ? settings.liveMax : settings.liveMax + 3;
        nextVal = (
          numAliveNeighbors < settings.liveMin ||
          numAliveNeighbors > settings.liveMax
        ) ? Math.min(val - settings.decayRate, 0.99) : val + 1;
      } else {
        nextVal = (
          numAliveNeighbors < settings.deadMin ||
          numAliveNeighbors > settings.deadMax
        ) ? Math.min(0.99, val - settings.decayRate) : 1;
      }
      return nextVal;
    },
    getNumAliveNeighbors: (grid, x, y) => {
      let sum = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i == 0 && j == 0) continue;
          if (x + i >= grid.length || y + j >= grid[x].length) continue;
          if (x + i < 0 || y + j < 0) continue;
          // sum += grid[x + i][y + j] == 1 ? 1 : 0;
          let val = grid[x + i][y + j];
          if (val > 1) {
            val = 1;
          }
          sum += val;
        }
      }
      return sum;
    },
  },

  green: {
    msPerTick: 80,
    liveMin: 3, // if alive, must have at least this many live neighbors to stay alive
    liveMax: 8, // if alive, must have at most this many live neighbors to stay alive
    deadMin: 2, // if dead, must have at least this many live neighbors to become alive
    deadMax: 3, // if dead, must have at most this many live neighbors to become alive
    noiseRate: 0.2,
    backgroundColor: 'black',
    color: (val) => '#32CD32',
    maxVal: 1,
    decayRate: 0.05,
    noiseFn: (x, y, width, height, noiseRate, nextAlive) => {
      if (
        //(y < height * 0.66) && (
        y == 0 && Math.random() < noiseRate
        //y == 1 && Math.random() < noiseRate / 2
        ) {
        return 1;
      }
      return nextAlive;
    },
    computeNextVal: (val, numAliveNeighbors, settings) => {
      let nextVal = val;
      if (val == 1) {
        nextVal = (
          numAliveNeighbors < settings.liveMin ||
          numAliveNeighbors > settings.liveMax
        ) ? val - settings.decayRate : 1;
      } else {
        nextVal = (
          numAliveNeighbors < settings.deadMin ||
          numAliveNeighbors > settings.deadMax
        ) ? val - settings.decayRate : 1;
      }
      return nextVal
    },
    getNumAliveNeighbors: (grid, x, y) => {
      let sum = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i == 0 && j == 0) continue;
          if (x + i >= grid.length || y + j >= grid[x].length) continue;
          if (x + i < 0 || y + j < 0) continue;
          sum += grid[x + i][y + j] == 1 ? -1 * j : 0;
        }
      }
      return sum;
    },
  },

  yellow: {
    msPerTick: 10,
    liveMin: 3, // if alive, must have at least this many live neighbors to stay alive
    liveMax: 3, // if alive, must have at most this many live neighbors to stay alive
    deadMin: 1, // if dead, must have at least this many live neighbors to become alive
    deadMax: 1, // if dead, must have at most this many live neighbors to become alive
    noiseRate: 0.0002,
    backgroundColor: 'black',
    color: (val) => 'yellow',
    maxVal: 1,
    decayRate: 0.005,
    noiseFn: (x, y, width, height, noiseRate, nextAlive) => {
      if (
        y == 0 && Math.random() < noiseRate
      ) {
        return 1;
      }
      return nextAlive;
    },
    computeNextVal: (val, numAliveNeighbors, settings) => {
      let nextVal = val - settings.decayRate;
      if (val == 0) {
        const prob = 0.55;
        nextVal = (
          numAliveNeighbors == 1 && Math.random() < prob
        ) ? 1 : 0;
      }
      return nextVal
    },
    getNumAliveNeighbors: (grid, x, y) => {
      let sum = 0;
      for (let i = -1; i <= 1; i++) {
        let j = -1;
        if (x + i >= grid.length || y + j >= grid[x].length) continue;
        if (x + i < 0 || y + j < 0) continue;
        sum += grid[x + i][y + j] == 1 ? 1 : 0;
      }
      for (let i = -1; i <= 1; i++) {
        let j = 0;
        if (i == 0) continue;
        if (x + i >= grid.length || y + j >= grid[x].length) continue;
        if (x + i < 0 || y + j < 0) continue;
        sum += grid[x + i][y + j] == 1 ? 0.33 : 0;
      }
      return sum;
    },
  },

};

window.config = config;
module.exports = config;
