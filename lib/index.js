'use strict';

const hexagon         = require('./hexagon');
const hexagonalButton = require('./hexagonalButton');
const hexagonalMenu   = require('./hexagonalMenu');

module.exports = (Snap, Element, Paper) => {
    Object.assign(Paper.prototype, {
        hexagon,
        hexagonalButton,
        hexagonalMenu
    });
};
