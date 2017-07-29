/* global Snap mina */
'use strict';

const {assign} = Object;
const {ceil, cos, sin, PI} = Math;
const {debounce, isTouch, zip} = require('./common');
const hexagon = require('./hexagon');

const NO_USER_SELECT = {style: '-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:none;'};

Snap.plugin(function(Snap, Element, Paper) {
    let preventDefault = e => e.preventDefault();
    let translateX = val => ({transform: `translateX(${val})`});
    Paper.prototype.hexagon = hexagon;
    /**
     * @function hexabar
     * @description Create a hexagonally-shaped bar SVG.
     * Used internally by [hexamenu]{@link module:hexagonal~hexamenu}
     * @param {object} options Options to configure hexabar
     * @param {number} options.sideLength Length of hexagonal side in pixels
     * @param {number} options.x x position
     * @param {number} options.y y position
     * @param {number} options.width Bar width (in pixels)
     * @param {number} options.level Level of nesting
     * @param {string} options.title Title text
     * @param {string} options.subtitle Sub-title text
     * @returns {function} SVG hexabar
    **/
    Paper.prototype.hexabar = function(options) {
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
            .addClass('hexabar menu-item')
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
    /**
     * @function hexamenu
     * @description Create a vertical menu with animations and events
     * @param {object[]} items Menu items
     * @param {object} options Options to configure
     * @param {number} options.sideLength Length of hexagonal side in pixels
     * @param {number} options.width Item width
     * @param {number} [options.duration=100] Duration for hide and show animations (in milliseconds)
     * @returns {function} hexamenu
     * @example <caption>Create a menu</caption>
     * var paper = Snap('svg');
     * paper.attr({height: '100%', width: '100%'});
     * var options = {
     *     sideLength: 30,
     *     width: 210
     * };
     * var items = [
     *     {title: 'FRUITS', submenu: [
     *         {title: 'Apple'},
     *         {title: 'Pear'},
     *         {title: 'Banana'}
     *     ]},
     *     {title: 'VEGETABLES', submenu: [
     *         {title: 'Broccoli'},
     *         {title: 'Carrot'},
     *         {title: 'Spinach'}
     *     ]},
     *     {title: 'MEATS', submenu: [
     *         {title: 'Chicken'},
     *         {title: 'Beef'},
     *         {title: 'Pork', subtitle: 'The other white meat'}
     *     ]}
     * ];
     * var menu = paper.hexamenu(items, options);
     * @example <caption>Add event listeners to the menu</caption>
     * menu.on('before:show', function(e) {
     *     //triggered before show animation
     * });
     * menu.on('show', function(e) {
     *     //triggered after show animation is complete
     * });
     * menu.on('before:hide', function(e) {
     *     //triggered before hide animation starts
     * });
     * menu.on('hide', function(e) {
     *     //triggered after hide animation is complete
     * });
     * menu.on('before:reset', function(e) {
     *     //triggered before reset animation starts
     * });
     * menu.on('reset', function(e) {
     *     //triggered after reset animation is complete
     * });
     * @example <caption>Add event listeners to buttons</caption>
     * //All event names with numbers are the zero-indexed numbers of the associated buttons
     * menu.on('click:0', function(e) {
     *     //triggered when the 'FRUITS' button is clicked
     * });
     * //Access passed event options via e.detail
     * menu.on('click:child', function(e) {
     *     //triggered when any child item is clicked
     *     console.log(e.detail.target.title.attr('text'));
     * });
     * menu.on('click:2:child', function(e) {
     *     //triggered when any child of 'MEATS' is clicked
     * });
     * menu.on('click:1:0', function(e) {
     *     //triggered when 'Broccoli' is clicked
     * });
    **/
    Paper.prototype.hexamenu = function(items, options) {
        var paper = this;
        paper.visible = false;
        var buttons = [];
        var DURATION = options.duration ? options.duration : 100;
        var BORDER = 1;
        var SIDE = options.sideLength;
        var width = options.width;
        var gutter = 4;
        const NUMBER_OF_SIDES = 6;
        var ADJACENT_ANGLE = Math.PI / NUMBER_OF_SIDES;
        var SQRT_2 = Math.sqrt(2);
        var α = SIDE * Math.sin(ADJACENT_ANGLE);//vertical diagonal height
        var β = SIDE * Math.cos(ADJACENT_ANGLE); //horizontal diagonal width
        var H = SIDE + α;
        var menuItemWidth = width + β + (2 * gutter) + (2 * BORDER);
        var menuWidth = menuItemWidth + β + (2 * gutter);
        function rowHeight(m) {return m > 0 ? m * (SIDE + SQRT_2 * gutter) + (m - 1) * α : -α;}
        var onClick = function(e) {
            e.preventDefault();
            var thisButton = buttons[this.index];
            trigger('click:' + thisButton.index, {
                menu: paper,
                parent: null,
                target: thisButton
            });
            if (thisButton.isActive) {
                resetMenu.bind(paper)();
            } else if (thisButton.hasSubmenu) {
                thisButton.blur();
                showSubmenuFor(thisButton);
            }
        };
        function createButtons() {
            buttons = items.map(function(button, index) {
                var hasSubmenu = Array.isArray(items[index].submenu) && items[index].submenu.length > 0;
                button.sideLength = SIDE;
                button.width = width;
                button.x = 0 - menuItemWidth;
                button.y = α + index * (H + gutter + 2 * BORDER);
                button.level = hasSubmenu ? 0 : 0;
                return paper.hexabar(button);
            });
            return buttons;
        }
        function setupMenu() {
            createButtons().forEach(function(button, index) {
                button.submenu = [];
                button.index = index;
                button.hasSubmenu = Array.isArray(items[index].submenu) && items[index].submenu.length > 0;
                button.node.onblur = preventDefault;
                button.node.oncontextmenu = preventDefault;
                enableInteraction(button);
            });
        }
        function resetMenu() {
            trigger('before:reset', {menu: paper});
            buttons.forEach(function(button) {
                if (button.submenu.length > 0) {
                    button.submenu.forEach(function(item) {item.remove();});
                    button.submenu = [];
                }
                button.isActive = false;
                var start = paper.visible ? menuWidth : -menuWidth;
                var stop = paper.visible ? menuWidth : -menuWidth;
                let DURATION = 50;
                Snap.animate(start, stop, function(value) {button.attr(translateX(value));}, DURATION, mina.linear, function() {
                    button.enable();
                    enableInteraction(button);
                    if (button.index === (buttons.length - 1)) {trigger('reset', {menu: paper});}
                });
            });
        }
        function showMenu(duration) {
            if (!paper.visible) {
                buttons.forEach(function(button, index) {
                    setTimeout(function() {
                        Snap.animate(0, menuWidth, function(value) {button.attr(translateX(value));}, duration, mina.easein, function() {
                            if (index === (items.length - 1)) {
                                paper.visible = true;
                                trigger('show', {menu: paper});
                            } else if (index === 0) {
                                trigger('before:show', {menu: paper});
                            }
                        }
                        );
                    }, ((duration / 2) * index));
                });
            }
        }
        function showSubmenuFor(button) {
            let thisButton = assign(button, {
                isActive: true,
                submenu: []
            });
            thisButton
                .addClass('active')
                .disableHoverAnimation();
            let index = thisButton.index;
            let x0 = menuWidth - β;
            let y0 = α + index * (H + gutter + 2 * BORDER);
            items[thisButton.index].submenu.forEach((item, index) => {
                thisButton.submenu.push(paper.hexabar({
                    title: item.title,
                    subtitle: item.subtitle,
                    sideLength: SIDE,
                    width: width,
                    x: x0 + 0 * BORDER + 0 * β - (2 * gutter) + menuWidth,
                    y: y0 + rowHeight(index + 1),
                    level: 0
                }).attr('opacity', 0));
            });
            let DURATION = 50;
            thisButton.submenu.forEach(function(item, index) {
                item.index = index;
                let options = {
                    menu: paper,
                    parent: thisButton,
                    target: item
                };
                let eventName = `click:${thisButton.index}:`;
                let triggerEvents = () => {
                    trigger('click:child', options);
                    trigger(eventName + 'child', options);
                    trigger(eventName + index, options);
                };
                setTimeout(() => {
                    assign(item.node, {
                        oncontextmenu: preventDefault,
                        onclick: triggerEvents,
                        ontouchstart: triggerEvents
                    });
                    item.attr('opacity', 1);
                    Snap.animate(0, -menuWidth, val => item.attr(translateX(val)), DURATION, mina.easein, () => {
                        if (items[index].submenu && (index === (items[index].submenu.length - 1))) {
                            trigger('show:submenu', options);
                        }
                    });
                }, DURATION * index);
            });
            buttons.filter((e, i) => (i !== thisButton.index)).forEach(button => {
                let start = menuWidth;
                let stop = menuItemWidth + gutter + BORDER;
                Snap.animate(start, stop, val => button.attr(translateX(val)), DURATION, mina.linear, () => {
                    button.disable();
                    disableInteraction(button);
                });
            });
        }
        function enableInteraction(button) {
            button.node.onclick = onClick.bind(button);
            button.node.ontouchstart = onClick.bind(button);
            button.node.onmousedown = button.focus;
        }
        function disableInteraction(button) {
            button.node.onclick = preventDefault;
            button.node.ontouchstart = preventDefault;
            button.node.onmousedown = preventDefault;
        }
        function hideMenu(duration) {
            var _duration;
            buttons.slice(0).reverse().forEach(function(button, index) {
                _duration = duration + ((duration / 2) * index);
                Snap.animate(menuWidth, 0, function(value) {button.attr(translateX(value));}, _duration, mina.backout, () => {
                    let menu = paper;
                    if (index === (items.length - 1)) {
                        paper.visible = false;
                        trigger('hide', {menu});
                    } else if (index === 0) {
                        trigger('before:hide', {menu});
                    }
                }
                );
            });
        }
        function closeMenu(duration) {
            resetMenu.bind(paper)();
            hideMenu.bind(paper)(duration);
        }
        function toggleMenu() {
            if (paper.visible) {
                closeMenu.bind(paper)(DURATION);
            } else {
                showMenu.bind(paper)(DURATION);
            }
        }
        function trigger(name, options) {
            var event;
            if (window.CustomEvent) {
                event = new CustomEvent(name, {detail: options});
            } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(name, true, true, options);
            }
            paper.node.dispatchEvent(event);
        }
        setupMenu();
        const DURATION_SCALING_FACTOR = 2.5;
        return {
            isVisible: () => paper.visible,
            on:        (event, handler) => paper.node.addEventListener(event, handler),
            off:       (event, handler) => paper.node.removeEventListener(event, handler),
            buttons:   buttons,
            toggle:    debounce(toggleMenu, DURATION * DURATION_SCALING_FACTOR, true),
            reset:     resetMenu
        };
    };
});
