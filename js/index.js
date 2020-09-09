// @flow

const Main = require('./Main.react');
const React = require('react');
const ReactDOM = require('react-dom');

function renderUI(): React.Node {
  ReactDOM.render(
    <Main />,
    document.getElementById('container'),
  );
}

renderUI();
