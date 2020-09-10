
const React = require('react');
const Button = require('./Button.react');
const {useMemo, useEffect, useState} = React;
const config = require('./config');

function Main(props) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const [mode, setMode] = useState('red');
  const [modeTabVisible, setModeTabVisible] = useState(true);
  const [grid, setGrid] = useState(initGrid(config.gridWidth, config.gridHeight));

  // handle screen rotation
  useEffect(() => {
    if (
      (windowWidth > windowHeight && config.gridWidth < config.gridHeight)
      ||
      (windowWidth < windowHeight && config.gridWidth > config.gridHeight)
    ) {
      const tempWidth = config.gridWidth;
      config.gridWidth = config.gridHeight;
      config.gridHeight = tempWidth;
      setGrid(initGrid(config.gridWidth, config.gridHeight));
    }
  }, [windowWidth, windowHeight]);

  // handle switching modes
  useEffect(() => {
    const settings = config[mode];
    setGrid(initGrid(config.gridWidth, config.gridHeight));
    const interval = setInterval(() => {
      setGrid(grid => stepGrid(grid, mode));
    }, settings.msPerTick);
    return () => clearInterval(interval);
  }, [mode]);

  // re-render when grid or mode changes
  useEffect(() => {
    render(grid, mode);
  }, [grid, mode]);

  return (
    <div id="canvasWrapper"
      style={{
        height: '100%',
        width: '100%',
        margin: 'auto',
        position: 'relative',
      }}
      onClick={() => setModeTabVisible(!modeTabVisible)}
    >
      {!modeTabVisible ? null :
        <div
          style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            height: '40px',
          }}
        >
          {config.modes.map(m => (
            <Button
              key={m + "_button"}
              style={{
                backgroundColor: m,
                height: 40,
                width: 48,
              }}
              label={'   '}
              disabled={mode == m}
              onClick={() => setMode(m)}
            />))
          }
        </div>
      }
      <canvas
        id="canvas"
        width={windowWidth} height={windowHeight}
      />
    </div>
  );
}

function stepGrid(grid, mode) {
  const settings = config[mode];
  const width = grid.length;
  const height = grid[0].length;
  const {getNumAliveNeighbors} = settings;
  const nextGrid = [];
  for (let x = 0; x < width; x++) {
    const nextCol = [];
    for (let y = 0; y < height; y++) {
      const alive = grid[x][y];
      const numAliveNeighbors = getNumAliveNeighbors(grid, x, y);
      let nextAlive = settings.computeNextVal(alive, numAliveNeighbors, settings);

      // Noise
      nextAlive = settings.noiseFn(
        x, y, width, height,
        settings.noiseRate, nextAlive,
      );
      nextCol.push(Math.max(0, nextAlive));
    }
    nextGrid.push(nextCol);
  }

  return nextGrid;
}

function render(grid, mode) {
  const canvas = document.getElementById('canvas');
  if (canvas == null) return;
  const ctx = canvas.getContext('2d');

  const settings = config[mode];

  const width = grid.length;
  const height = grid[0].length;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  ctx.fillStyle = settings.backgroundColor;
  ctx.fillRect(0, 0, windowWidth, windowHeight);

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] == 0) continue;
      ctx.fillStyle = settings.color(grid[x][y]);
      ctx.globalAlpha = grid[x][y] / settings.maxVal;
      ctx.fillRect(
        Math.floor(x * windowWidth / width),
        Math.floor(y * windowHeight / height),
        Math.ceil(1 * windowWidth / width),
        Math.ceil(1 * windowHeight / height),
      );
      ctx.globalAlpha = 1;
    }
  }
}

function initGrid(width, height) {
  const grid = [];
  for (let x = 0; x < width; x++) {
    const row = [];
    for (let y = 0; y < height; y++) {
      row.push(0);
    }
    grid.push(row);
  }
  return grid;
}

module.exports = Main;
