'use strict';

const {cos, sin, PI} = Math;
const {zip} = require('./common');

/**
 * @function hexagon
 * @description Create an SVG hexagon (6-sided polygon)
 * @param {number} side Length of hexagon side in pixels
 * @param {number} [x=0] Initial x position of hexagon
 * @param {number} [y=0] Initial y position of hexagon
 * @returns {function} SVG polygon
 * @example <caption>Create a hexagon</caption>
 * let paper = Snap('svg');
 * paper.attr({height: 500, width 500});
 * let hex = paper.hexagon(50, 100, 100);
**/
module.exports = function(side, x, y) {
    x = x || 0;
    y = y || 0;
    const NUMBER_OF_SIDES = 6;
    const ADJACENT_ANGLE = PI / NUMBER_OF_SIDES;
    const α = side * sin(ADJACENT_ANGLE);
    const β = side * cos(ADJACENT_ANGLE);
    const X = [0, β, β * 2, β * 2, β, 0].map(val => (val + x));
    const Y = [α, 0, α, α + side, α * 2 + side, α + side].map(val => (val + y));
    let points = zip(X, Y);
    return this
        .addClass('hexagon')
        .polygon(points);
};
