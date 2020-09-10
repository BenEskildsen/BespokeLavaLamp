'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var React = require('react');
var Button = require('./Button.react');
var useMemo = React.useMemo,
    useEffect = React.useEffect,
    useState = React.useState;

var config = require('./config');

function Main(props) {
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  var _useState = useState('red'),
      _useState2 = _slicedToArray(_useState, 2),
      mode = _useState2[0],
      setMode = _useState2[1];

  var _useState3 = useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      modeTabVisible = _useState4[0],
      setModeTabVisible = _useState4[1];

  var _useState5 = useState(initGrid(config.gridWidth, config.gridHeight)),
      _useState6 = _slicedToArray(_useState5, 2),
      grid = _useState6[0],
      setGrid = _useState6[1];

  // handle screen rotation


  useEffect(function () {
    if (windowWidth > windowHeight && config.gridWidth < config.gridHeight || windowWidth < windowHeight && config.gridWidth > config.gridHeight) {
      var tempWidth = config.gridWidth;
      config.gridWidth = config.gridHeight;
      config.gridHeight = tempWidth;
      setGrid(initGrid(config.gridWidth, config.gridHeight));
    }
  }, [windowWidth, windowHeight]);

  // handle switching modes
  useEffect(function () {
    var settings = config[mode];
    setGrid(initGrid(config.gridWidth, config.gridHeight));
    var interval = setInterval(function () {
      setGrid(function (grid) {
        return stepGrid(grid, mode);
      });
    }, settings.msPerTick);
    return function () {
      return clearInterval(interval);
    };
  }, [mode]);

  // re-render when grid or mode changes
  useEffect(function () {
    render(grid, mode);
  }, [grid, mode]);

  return React.createElement(
    'div',
    { id: 'canvasWrapper',
      style: {
        height: '100%',
        width: '100%',
        margin: 'auto',
        position: 'relative'
      },
      onClick: function onClick() {
        return setModeTabVisible(!modeTabVisible);
      }
    },
    !modeTabVisible ? null : React.createElement(
      'div',
      {
        style: {
          position: 'absolute',
          top: '6px',
          left: '6px',
          height: '40px'
        }
      },
      config.modes.map(function (m) {
        return React.createElement(Button, {
          key: m + "_button",
          style: {
            backgroundColor: m,
            height: 40,
            width: 48
          },
          label: '   ',
          disabled: mode == m,
          onClick: function onClick() {
            return setMode(m);
          }
        });
      })
    ),
    React.createElement('canvas', {
      id: 'canvas',
      width: windowWidth, height: windowHeight
    })
  );
}

function stepGrid(grid, mode) {
  var settings = config[mode];
  var width = grid.length;
  var height = grid[0].length;
  var getNumAliveNeighbors = settings.getNumAliveNeighbors;

  var nextGrid = [];
  for (var x = 0; x < width; x++) {
    var nextCol = [];
    for (var y = 0; y < height; y++) {
      var alive = grid[x][y];
      var numAliveNeighbors = getNumAliveNeighbors(grid, x, y);
      var nextAlive = settings.computeNextVal(alive, numAliveNeighbors, settings);

      // Noise
      nextAlive = settings.noiseFn(x, y, width, height, settings.noiseRate, nextAlive);
      nextCol.push(Math.max(0, nextAlive));
    }
    nextGrid.push(nextCol);
  }

  return nextGrid;
}

function render(grid, mode) {
  var canvas = document.getElementById('canvas');
  if (canvas == null) return;
  var ctx = canvas.getContext('2d');

  var settings = config[mode];

  var width = grid.length;
  var height = grid[0].length;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  ctx.fillStyle = settings.backgroundColor;
  ctx.fillRect(0, 0, windowWidth, windowHeight);

  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      if (grid[x][y] == 0) continue;
      ctx.fillStyle = settings.color(grid[x][y]);
      ctx.globalAlpha = grid[x][y] / settings.maxVal;
      ctx.fillRect(Math.floor(x * windowWidth / width), Math.floor(y * windowHeight / height), Math.ceil(1 * windowWidth / width), Math.ceil(1 * windowHeight / height));
      ctx.globalAlpha = 1;
    }
  }
}

function initGrid(width, height) {
  var grid = [];
  for (var x = 0; x < width; x++) {
    var row = [];
    for (var y = 0; y < height; y++) {
      row.push(0);
    }
    grid.push(row);
  }
  return grid;
}

module.exports = Main;