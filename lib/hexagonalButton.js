'use strict';

const {assign} = Object;
const {ceil, cos, sin, PI} = Math;
const {isTouch, zip} = require('./common');

const NO_USER_SELECT = {style: '-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:none;'};
/**
 * @function hexagonalButton
 * @description Create a hexagonally-shaped bar SVG.
 * Used internally by [hexagonalMenu]{@link module:hexagonal~hexagonalMenu}
 * @param {object} options Options to configure hexagonalButton
 * @param {number} options.sideLength Length of hexagonal side in pixels
 * @param {number} [options.x=0] x position
 * @param {number} [options.y=0] y position
 * @param {number} options.width Bar width (in pixels)
 * @param {number} options.level Level of nesting
 * @param {string} options.title Title text
 * @param {string} options.subtitle Sub-title text
 * @returns {function} SVG hexagonal button
**/
module.exports = function(options) {
    let {sideLength, reverse, width, x, y} = options;
    x = x || 0;
    y = y || 0;
    const defaultValues = {
        fill: '#222',
        stroke: '#222',
        strokeWidth: '1px'
    };
    const hoverValues = {
        cursor: 'pointer',
        fill: '#FFF',
        stroke: '#333'
    };
    const FONT_ADJUSTMENT_FACTOR = 4;
    const FONT_SCALING_FACTOR = 0.7;
    const NUMBER_OF_SIDES = 6;
    const ADJACENT_ANGLE = PI / NUMBER_OF_SIDES;
    let α = sideLength * sin(ADJACENT_ANGLE);
    let β = sideLength * cos(ADJACENT_ANGLE);
    let fontSize = sideLength / 2;
    let height = sideLength + α;
    let w = width - β;
    let cX = ceil(width / 2) + fontSize;
    let cY = (height / 2) + (fontSize / FONT_ADJUSTMENT_FACTOR);
    let X;
    let Y;
    if (reverse) {
        X = [0, β + w, β * 2 + w, β * 2 + w, β + 0, 0];
        Y = [0, 0, α, α + sideLength, α + sideLength, 0 + sideLength];
    } else {
        X = [0, β + 0, β * 2 + w, β * 2 + w, β + w, 0];
        Y = [α, 0, 0, 0 + sideLength, α + sideLength, α + sideLength];
    }
    let points = zip(
        X.map(val => (val + x)),
        Y.map(val => (val + y))
    );
    let {fill} = hoverValues;
    let title = this
        .text(x, y, options.title)
        .addClass('menu-item-title')
        .attr({
            x: '+=' + cX,
            y: '+=' + cY,
            fill,
            fontSize,
            textAnchor: 'middle'
        });
    let subTitle = this
        .text(x, y, options.subtitle)
        .addClass('menu-item-subtitle')
        .attr({
            x: x + β,
            y: '+=' + (cY + (fontSize / 2)),
            fill,
            fontSize: fontSize * FONT_SCALING_FACTOR,
            textAnchor: 'middle',
            opacity: 0
        });
    let bar = this.polygon(points).attr(defaultValues);
    let button = assign(this.group(bar, title, subTitle), {
        bar,
        width,
        height,
        title,
        subTitle,
        hoverAnimationDisabled: false
    });
    button
        .addClass('hexagonalButton menu-item')
        .attr(NO_USER_SELECT);
    if (isTouch()) {
        button.addClass('touch');
    }
    var onHoverIn = function() {
        if (!(button.hasClass('disabled') || button.hasClass('active'))) {
            button.focus();
        }
        if (!button.hoverAnimationDisabled && subTitle.attr('text').length > 0) {
            let scalingFactor = 0.8;
            title.animate({
                fontSize: fontSize * scalingFactor,
                y: (y + cY) - (fontSize / FONT_ADJUSTMENT_FACTOR)
            }, 100);
            subTitle.animate({
                opacity: 1,
                x: x + cX
            }, 100);
        }
    };
    var onHoverOut = () => {
        button.blur();
    };
    button.enableHoverAnimation = () => {
        button.hoverAnimationDisabled = false;
        button.hover(onHoverIn, onHoverOut);
        return button;
    };
    button.disableHoverAnimation = () => {
        button.hoverAnimationDisabled = true;
        button.unhover(onHoverIn, onHoverOut);
        return button;
    };
    button.enable = () => {
        let opacity = 1;
        button
            .removeClass('active')
            .removeClass('disabled')
            .attr({opacity})
            .enableHoverAnimation()
            .blur();
    };
    button.disable = () => {
        let opacity = 0.8;
        let cursor = 'default';
        ['bar', 'title', 'subTitle'].forEach(element => {
            assign(button[element].node.style, {cursor});
        });
        button
            .addClass('disabled')
            .attr({opacity})
            .disableHoverAnimation();
    };
    button.focus = () => {
        assign(button.bar.node.style, assign({}, defaultValues, hoverValues));
        let cursor = 'pointer';
        let {stroke} = hoverValues;
        ['bar', 'title', 'subTitle'].forEach(element => {
            assign(button[element].node.style, {cursor});
        });
        button.title.node.style.fill = stroke;
        button.subTitle.node.style.fill = stroke;
        return button;
    };
    button.blur = () => {
        let opacity = 0;
        assign(button.bar.node.style, defaultValues);
        button.title.node.style.fill = '#FFF';
        if (!button.hoverAnimationDisabled && subTitle.attr('text').length > 0) {
            button.title.animate({
                fontSize,
                y: y + cY
            }, 100);
            button.subTitle.animate({
                opacity,
                x: x + β
            }, 100);
        }
        return button;
    };
    button.enableHoverAnimation();
    return button;
};
