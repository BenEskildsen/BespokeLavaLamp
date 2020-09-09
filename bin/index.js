'use strict';

var Main = require('./Main.react');
var React = require('react');
var ReactDOM = require('react-dom');

function renderUI() {
  ReactDOM.render(React.createElement(Main, null), document.getElementById('container'));
}

renderUI();