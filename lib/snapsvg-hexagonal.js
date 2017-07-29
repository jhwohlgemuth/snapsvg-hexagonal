/* global Snap mina */
'use strict';

const {debounce} = require('./common');

Snap.plugin(function(Snap, Element, Paper) {
    var NO_USER_SELECT = {style: '-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:none;'};
    function preventDefault(e) {e.preventDefault();}
    function translateX(value) {return {transform: 'translateX(' + value + ')'};}
    function clone(obj) {return JSON.parse(JSON.stringify(obj));}
    function extend(a, b) {Object.keys(b).forEach(function(key) {a[key] = b[key];});return a;}
    function isTouch() {return !!('ontouchstart' in window) || (window.navigator.msMaxTouchPoints > 0);}
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
        x0 = x0 ? x0 : 0;
        y0 = y0 ? y0 : 0;
        var SIDE = side;
        const NUMBER_OF_SIDES = 6;
        const ADJACENT_ANGLE = Math.PI / NUMBER_OF_SIDES;
        var ALPHA = SIDE * sin(ADJACENT_ANGLE);
        var BETA = SIDE * cos(ADJACENT_ANGLE);
        var X = [0, BETA, BETA * 2, BETA * 2, BETA, 0];
        var Y = [ALPHA, 0, ALPHA, ALPHA + SIDE, ALPHA * 2 + SIDE, ALPHA + SIDE];
        var pts = X.map(function(x, i) {return [X[i] + x0, Y[i] + y0];});
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
        var SIDE = options.sideLength;
        var FONT_SIZE = SIDE / 2;
        const FONT_ADJUSTMENT_FACTOR = 4;
        const FONT_SCALING_FACTOR = 0.7;
        const NUMBER_OF_SIDES = 6;
        var ADJACENT_ANGLE = Math.PI / NUMBER_OF_SIDES;
        var ALPHA = SIDE * Math.sin(ADJACENT_ANGLE);
        var BETA = SIDE * Math.cos(ADJACENT_ANGLE);
        var x0 = options.x ? options.x : 0;
        var y0 = options.y ? options.y : 0;
        var W = options.width;
        var H = SIDE + ALPHA;
        var w = W - BETA;
        var cX = Math.ceil(W / 2) + FONT_SIZE;
        var cY = (H / 2) + (FONT_SIZE / FONT_ADJUSTMENT_FACTOR);
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
        var pts = X.map(function(x, i) {return [X[i] + x0, Y[i] + y0];});
        var bar = this.polygon(pts).attr(defaultValues);
        var button = this.group(bar, title, subTitle);
        button.addClass('hexabar menu-item');
        button.attr(NO_USER_SELECT);
        if (isTouch()) {
            button.addClass('touch');
        }
        button.hoverAnimationDisabled = false;
        button.title = title;
        button.subTitle = subTitle;
        button.height = H;
        button.width = W;
        button.bar = bar;
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
        var onHoverOut = function() {
            button.blur();
        };
        button.enableHoverAnimation = function() {
            button.hoverAnimationDisabled = false;
            button.hover(onHoverIn, onHoverOut);
            return button;
        };
        button.disableHoverAnimation = function() {
            button.hoverAnimationDisabled = true;
            button.unhover(onHoverIn, onHoverOut);
            return button;
        };
        button.enable = function() {
            button
                .removeClass('active')
                .removeClass('disabled')
                .attr({opacity: 1})
                .enableHoverAnimation()
                .blur();
        };
        button.disable = function() {
            button.bar.node.style.cursor = 'default';
            button.title.node.style.cursor = 'default';
            button.subTitle.node.style.cursor = 'default';
            let opacity = 0.8;
            button
                .addClass('disabled')
                .attr('opacity', opacity)
                .disableHoverAnimation();
        };
        button.focus = function() {
            extend(button.bar.node.style, extend(clone(defaultValues), hoverValues));
            button.bar.node.style.cursor = 'pointer';
            button.title.node.style.cursor = 'pointer';
            button.title.node.style.fill = hoverValues.stroke;
            button.subTitle.node.style.cursor = 'pointer';
            button.subTitle.node.style.fill = hoverValues.stroke;
            return button;
        };
        button.blur = function() {
            extend(button.bar.node.style, defaultValues);
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
            var thisButton = button;
            thisButton.isActive = true;
            thisButton.addClass('active');
            thisButton.submenu = [];
            thisButton.disableHoverAnimation();
            var index = thisButton.index;
            var x0 = menuWidth - BETA;
            var y0 = ALPHA + index * (H + gutter + 2 * BORDER);
            items[thisButton.index].submenu.forEach(function(item, index) {
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
                var options = {
                    menu: paper,
                    parent: thisButton,
                    target: item
                };
                var eventName = 'click:' + thisButton.index + ':';
                function triggerEvents() {
                    trigger('click:child', options);
                    trigger(eventName + 'child', options);
                    trigger(eventName + index, options);
                }
                setTimeout(function() {
                    item.node.oncontextmenu = preventDefault;
                    item.node.onclick = triggerEvents;
                    item.node.ontouchstart = triggerEvents;
                    item.attr('opacity', 1);
                    Snap.animate(0, -menuWidth, function(value) {item.attr(translateX(value));}, DURATION, mina.easein, function() {
                        if (items[index].submenu && (index === (items[index].submenu.length - 1))) {
                            trigger('show:submenu', options);
                        }
                    });
                }, DURATION * index);
            });
            buttons.filter(function(e, i) {return i !== thisButton.index;}).forEach(function(button) {
                var start = menuWidth;
                var stop = menuItemWidth + gutter + BORDER;
                Snap.animate(start, stop, function(value) {button.attr(translateX(value));}, DURATION, mina.linear, function() {
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
                Snap.animate(menuWidth, 0, function(value) {button.attr(translateX(value));}, _duration, mina.backout, function() {
                    if (index === (items.length - 1)) {
                        paper.visible = false;
                        trigger('hide', {menu: paper});
                    } else if (index === 0) {
                        trigger('before:hide', {menu: paper});
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
            isVisible: function() {return paper.visible;},
            on:        function(event, handler) {paper.node.addEventListener(event, handler);},
            off:       function(event, handler) {paper.node.removeEventListener(event, handler);},
            buttons:   buttons,
            toggle:    debounce(toggleMenu, DURATION * DURATION_SCALING_FACTOR, true),
            reset:     resetMenu
        };
    };
});
