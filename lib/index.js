/* global Snap */
'use strict';

const {assign}        = Object;
const hexagon         = require('./hexagon');
const hexagonalButton = require('./hexagonalButton');
const hexagonalMenu   = require('./hexagonalMenu');

Snap.plugin(function(Snap, Element, Paper) {
    assign(Paper.prototype, {
        hexagon,
        hexagonalButton,
        hexagonalMenu
    });
});
