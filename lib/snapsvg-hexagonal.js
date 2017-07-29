/* global Snap mina */
'use strict';

const {debounce, isTouch} = require('./common');

Snap.plugin(function(Snap, Element, Paper) {
    let NO_USER_SELECT = {style: '-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:none;'};
    let preventDefault = e => e.preventDefault();
    let translateX = val => ({transform: `translateX(${val})`});
    /**
     * @function hexagon
     * @description Create an SVG hexagon (6-sided polygon)
     * @param {number} side Length of hexagon side in pixels
     * @param {number} [x0=0] Initial x position of hexagon
     * @param {number} [y0=0] Initial y position of hexagon
     * @returns {function} SVG polygon
     * @example <caption>Create a hexagon</caption>
     * var paper = Snap('svg');
     * paper.attr({height: 500, width 500});
     * var hex = paper.hexagon(50, 100, 100);
    **/
    Paper.prototype.hexagon = function(side, x0, y0) {
        const {cos, sin} = Math;
        x0 = x0 || 0;
        y0 = y0 || 0;
        var SIDE = side;
        const NUMBER_OF_SIDES = 6;
        const ADJACENT_ANGLE = Math.PI / NUMBER_OF_SIDES;
        var ALPHA = SIDE * sin(ADJACENT_ANGLE);
        var BETA = SIDE * cos(ADJACENT_ANGLE);
        var X = [0, BETA, BETA * 2, BETA * 2, BETA, 0];
        var Y = [ALPHA, 0, ALPHA, ALPHA + SIDE, ALPHA * 2 + SIDE, ALPHA + SIDE];
        var pts = X.map((x, i) => ([X[i] + x0, Y[i] + y0]));
        return this.polygon(pts).addClass('hexagon');
    };
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
        var defaultValues = {
            fill: '#222',
            stroke: '#222',
            strokeWidth: '1px'
        };
        var hoverValues = {
            cursor: 'pointer',
            fill: '#FFF',
            stroke: '#333'
        };
        let SIDE = options.sideLength;
        var FONT_SIZE = SIDE / 2;
        const FONT_ADJUSTMENT_FACTOR = 4;
        const FONT_SCALING_FACTOR = 0.7;
        const NUMBER_OF_SIDES = 6;
        var ADJACENT_ANGLE = Math.PI / NUMBER_OF_SIDES;
        var ALPHA = SIDE * Math.sin(ADJACENT_ANGLE);
        var BETA = SIDE * Math.cos(ADJACENT_ANGLE);
        var x0 = options.x || 0;
        var y0 = options.y || 0;
        var {width} = options;
        var height = SIDE + ALPHA;
        var w = width - BETA;
        var cX = Math.ceil(width / 2) + FONT_SIZE;
        var cY = (height / 2) + (FONT_SIZE / FONT_ADJUSTMENT_FACTOR);
        var X;
        var Y;
        if (options.reverse) {
            X = [0, BETA + w, BETA * 2 + w, BETA * 2 + w, BETA + 0, 0];
            Y = [0, 0, ALPHA, ALPHA + SIDE, ALPHA + SIDE, 0 + SIDE];
        } else {
            X = [0, BETA + 0, BETA * 2 + w, BETA * 2 + w, BETA + w, 0];
            Y = [ALPHA, 0, 0, 0 + SIDE, ALPHA + SIDE, ALPHA + SIDE];
        }
        var title = this.text(x0, y0, options.title).addClass('menu-item-title').attr({
            x: '+=' + cX,
            y: '+=' + cY,
            fill: hoverValues.fill,
            fontSize: FONT_SIZE,
            textAnchor: 'middle'
        });
        var subTitle = this.text(x0, y0, options.subtitle).addClass('menu-item-subtitle').attr({
            x: x0 + BETA,
            y: '+=' + (cY + (FONT_SIZE / 2)),
            fill: hoverValues.fill,
            fontSize: FONT_SIZE * FONT_SCALING_FACTOR,
            textAnchor: 'middle',
            opacity: 0
        });
        var pts = X.map((x, i) => ([X[i] + x0, Y[i] + y0]));
        var bar = this.polygon(pts).attr(defaultValues);
        var button = Object.assign(this.group(bar, title, subTitle), {
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
                let FONT_SCALING_FACTOR = 0.8;
                title.animate({fontSize: FONT_SIZE * FONT_SCALING_FACTOR, y: (y0 + cY) - (FONT_SIZE / FONT_ADJUSTMENT_FACTOR)}, 100);
                subTitle.animate({opacity: 1, x: x0 + cX}, 100);
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
            [// cursors to disable
                'bar',
                'title',
                'subTitle'
            ].forEach(element => {
                Object.assign(button[element].node.style, {cursor});
            });
            button
                .addClass('disabled')
                .attr({opacity})
                .disableHoverAnimation();
        };
        button.focus = () => {
            Object.assign(button.bar.node.style, Object.assign({}, defaultValues, hoverValues));
            button.bar.node.style.cursor = 'pointer';
            button.title.node.style.cursor = 'pointer';
            button.title.node.style.fill = hoverValues.stroke;
            button.subTitle.node.style.cursor = 'pointer';
            button.subTitle.node.style.fill = hoverValues.stroke;
            return button;
        };
        button.blur = () => {
            Object.assign(button.bar.node.style, defaultValues);
            button.title.node.style.fill = '#FFF';
            if (!button.hoverAnimationDisabled && subTitle.attr('text').length > 0) {
                button.title.animate({fontSize: FONT_SIZE, y: (y0 + cY)}, 100);
                button.subTitle.animate({opacity: 0, x: x0 + BETA}, 100);
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
        var ALPHA = SIDE * Math.sin(ADJACENT_ANGLE);//vertical diagonal height
        var BETA = SIDE * Math.cos(ADJACENT_ANGLE); //horizontal diagonal width
        var H = SIDE + ALPHA;
        var menuItemWidth = width + BETA + (2 * gutter) + (2 * BORDER);
        var menuWidth = menuItemWidth + BETA + (2 * gutter);
        function rowHeight(m) {return m > 0 ? m * (SIDE + SQRT_2 * gutter) + (m - 1) * ALPHA : -ALPHA;}
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
                button.y = ALPHA + index * (H + gutter + 2 * BORDER);
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
            let thisButton = Object.assign(button, {
                isActive: true,
                submenu: []
            });
            thisButton
                .addClass('active')
                .disableHoverAnimation();
            let index = thisButton.index;
            let x0 = menuWidth - BETA;
            let y0 = ALPHA + index * (H + gutter + 2 * BORDER);
            items[thisButton.index].submenu.forEach((item, index) => {
                thisButton.submenu.push(paper.hexabar({
                    title: item.title,
                    subtitle: item.subtitle,
                    sideLength: SIDE,
                    width: width,
                    x: x0 + 0 * BORDER + 0 * BETA - (2 * gutter) + menuWidth,
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
                    Object.assign(item.node, {
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
