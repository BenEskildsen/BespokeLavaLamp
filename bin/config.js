'use strict';

var config = {
  gridWidth: 50,
  gridHeight: 70,

  modes: ['red', 'green', 'yellow'],

  // mode-specific settings:
  red: {
    msPerTick: 100,
    liveMin: 2, // if alive, must have at least this many live neighbors to stay alive
    liveMax: 3, // if alive, must have at most this many live neighbors to stay alive
    deadMin: 3, // if dead, must have at least this many live neighbors to become alive
    deadMax: 3, // if dead, must have at most this many live neighbors to become alive
    noiseRate: 0.4,
    backgroundColor: 'black',
    color: function color(val) {
      return 'red';
    },
    maxVal: 1,
    decayRate: 0.01,
    noiseFn: function noiseFn(x, y, width, height, noiseRate, nextAlive) {
      if (y == height - 1 && Math.random() < noiseRate || y == height - 2 && Math.random() < noiseRate / 2) {
        return 1;
      }
      return nextAlive;
    },
    computeNextVal: function computeNextVal(val, numAliveNeighbors, settings) {
      var nextVal = val;
      if (val == 1) {
        nextVal = numAliveNeighbors < settings.liveMin || numAliveNeighbors > settings.liveMax ? val - settings.decayRate : 1;
      } else {
        nextVal = numAliveNeighbors < settings.deadMin || numAliveNeighbors > settings.deadMax ? val - settings.decayRate : 1;
      }
      return nextVal;
    },
    getNumAliveNeighbors: function getNumAliveNeighbors(grid, x, y) {
      var sum = 0;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (i == 0 && j == 0) continue;
          if (x + i >= grid.length || y + j >= grid[x].length) continue;
          if (x + i < 0 || y + j < 0) continue;
          sum += grid[x + i][y + j] == 1 ? 1 : 0;
        }
      }
      return sum;
    }
  },

  green: {
    msPerTick: 100,
    liveMin: 2, // if alive, must have at least this many live neighbors to stay alive
    liveMax: 5, // if alive, must have at most this many live neighbors to stay alive
    deadMin: 3, // if dead, must have at least this many live neighbors to become alive
    deadMax: 3, // if dead, must have at most this many live neighbors to become alive
    noiseRate: 0.2,
    backgroundColor: 'black',
    color: function color(val) {
      return val > 50 ? "#D2691E" : '#6B8E23';
    },
    decayRate: 0.06,
    maxVal: 1,
    noiseFn: function noiseFn(x, y, width, height, noiseRate, nextAlive) {
      if (y == height - 1 && Math.random() < noiseRate
      // y == 2 && Math.random() < noiseRate / 2
      ) {
          return 1;
        }
      return nextAlive;
    },
    computeNextVal: function computeNextVal(val, numAliveNeighbors, settings) {
      var nextVal = val;
      if (val >= 1 && val <= 250) {
        var liveMax = val < 50 ? settings.liveMax : settings.liveMax + 3;
        nextVal = numAliveNeighbors < settings.liveMin || numAliveNeighbors > settings.liveMax ? Math.min(val - settings.decayRate, 0.99) : val + 1;
      } else {
        nextVal = numAliveNeighbors < settings.deadMin || numAliveNeighbors > settings.deadMax ? Math.min(0.99, val - settings.decayRate) : 1;
      }
      return nextVal;
    },
    getNumAliveNeighbors: function getNumAliveNeighbors(grid, x, y) {
      var sum = 0;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (i == 0 && j == 0) continue;
          if (x + i >= grid.length || y + j >= grid[x].length) continue;
          if (x + i < 0 || y + j < 0) continue;
          // sum += grid[x + i][y + j] == 1 ? 1 : 0;
          var val = grid[x + i][y + j];
          if (val > 1) {
            val = 1;
          }
          sum += val;
        }
      }
      return sum;
    }
  },

  yellow: {
    msPerTick: 10,
    liveMin: 3, // if alive, must have at least this many live neighbors to stay alive
    liveMax: 3, // if alive, must have at most this many live neighbors to stay alive
    deadMin: 1, // if dead, must have at least this many live neighbors to become alive
    deadMax: 1, // if dead, must have at most this many live neighbors to become alive
    noiseRate: 0.0002,
    backgroundColor: 'black',
    color: function color(val) {
      return 'yellow';
    },
    maxVal: 1,
    decayRate: 0.005,
    noiseFn: function noiseFn(x, y, width, height, noiseRate, nextAlive) {
      if (y == 0 && Math.random() < noiseRate) {
        return 1;
      }
      return nextAlive;
    },
    computeNextVal: function computeNextVal(val, numAliveNeighbors, settings) {
      var nextVal = val - settings.decayRate;
      if (val == 0) {
        var prob = 0.6;
        nextVal = numAliveNeighbors == 1 && Math.random() < prob ? 1 : 0;
      }
      return nextVal;
    },
    getNumAliveNeighbors: function getNumAliveNeighbors(grid, x, y) {
      var sum = 0;
      for (var i = -1; i <= 1; i++) {
        var j = -1;
        if (x + i >= grid.length || y + j >= grid[x].length) continue;
        if (x + i < 0 || y + j < 0) continue;
        sum += grid[x + i][y + j] == 1 ? 1 : 0;
      }
      for (var _i = -1; _i <= 1; _i++) {
        var _j = 0;
        if (_i == 0) continue;
        if (x + _i >= grid.length || y + _j >= grid[x].length) continue;
        if (x + _i < 0 || y + _j < 0) continue;
        sum += grid[x + _i][y + _j] == 1 ? 0.33 : 0;
      }
      return sum;
    }
  }

};

window.config = config;
module.exports = config;