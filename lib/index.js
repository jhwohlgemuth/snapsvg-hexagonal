'use strict';

const hexagon         = require('./hexagon');
const hexagonalButton = require('./hexagonalButton');
const hexagonalMenu   = require('./hexagonalMenu');

module.exports = function(Snap, Element, Paper) {
    Object.assign(Paper.prototype, {
        hexagon,
        hexagonalButton,
        hexagonalMenu
    });
};
