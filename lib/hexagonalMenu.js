/* global Snap mina */
'use strict';

const {assign} = Object;
const {cos, sin, sqrt, PI} = Math;
const {debounce, isEmpty} = require('./common');

const BORDER = 1;
const GUTTER = 4;
const NUMBER_OF_SIDES = 6;
const ADJACENT_ANGLE = PI / NUMBER_OF_SIDES;
const DEBOUNCE_SCALING_FACTOR = 2.5;

let preventDefault = e => e.preventDefault();
let translateX = item => val => item.attr({transform: `translateX(${val})`});

/**
 * @function hexagonalMenu
 * @description Create a vertical menu with animations and events
 * @param {object[]} items Menu items
 * @param {object} options Options to configure
 * @param {number} options.sideLength Length of hexagonal side in pixels
 * @param {number} options.width Item width
 * @param {number} [options.duration=100] Duration for hide and show animations (in milliseconds)
 * @returns {function} hexagonalMenu
 * @example <caption>Create a menu</caption>
 * let paper = Snap('svg');
 * let height = '100%';
 * let width = '100%';
 * paper.attr({height, width});
 * let options = {
 *     sideLength: 30,
 *     width: 210
 * };
 * let items = [
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
 * let menu = paper.hexagonalMenu(items, options);
 * @example <caption>Add event listeners to the menu</caption>
 * menu.on('before:show', e => {
 *     //triggered before show animation
 * });
 * menu.on('show', e => {
 *     //triggered after show animation is complete
 * });
 * menu.on('before:hide', e => {
 *     //triggered before hide animation starts
 * });
 * menu.on('hide', e => {
 *     //triggered after hide animation is complete
 * });
 * menu.on('before:reset', e => {
 *     //triggered before reset animation starts
 * });
 * menu.on('reset', e => {
 *     //triggered after reset animation is complete
 * });
 * @example <caption>Add event listeners to buttons</caption>
 * //All event names with numbers are the zero-indexed numbers of the associated buttons
 * menu.on('click:0', e => {
 *     //triggered when the 'FRUITS' button is clicked
 * });
 * //Access passed event options via e.detail
 * menu.on('click:child', e => {
 *     //triggered when any child item is clicked
 *     console.log(e.detail.target.title.attr('text'));
 * });
 * menu.on('click:2:child', e => {
 *     //triggered when any child of 'MEATS' is clicked
 * });
 * menu.on('click:1:0', e => {
 *     //triggered when 'Broccoli' is clicked
 * });
**/
module.exports = function(items, options) {
    let visible = false;
    let paper = assign(this, {visible});
    let isVisible = () => paper.visible;
    let {duration, sideLength, width} = options;
    let buttons = [];
    const DURATION = duration || 100;
    let α = sideLength * sin(ADJACENT_ANGLE);// vertical diagonal height
    let β = sideLength * cos(ADJACENT_ANGLE);// horizontal diagonal width
    let H = sideLength + α;
    let menuItemWidth = width + β + (2 * GUTTER) + (2 * BORDER);
    let menuWidth = menuItemWidth + β + (2 * GUTTER);
    let onClick = button => e => {
        e.preventDefault();
        let menu = paper;
        let parent = null;
        let target = buttons[button.index];
        let {index, isActive, hasSubmenu} = target;
        trigger('click:' + index, {menu, parent, target});
        if (isActive) {
            reset.bind(paper)();
        } else if (hasSubmenu) {
            target.blur();
            showSubmenuFor(target);
        }
    };
    function rowHeight(m) {
        return m > 0 ? m * (sideLength + sqrt(2) * GUTTER) + (m - 1) * α : -α;
    }
    function createButtons() {
        buttons = items.map(function(button, index) {
            var hasSubmenu = Array.isArray(items[index].submenu) && items[index].submenu.length > 0;
            button.sideLength = sideLength;
            button.width = width;
            button.x = 0 - menuItemWidth;
            button.y = α + index * (H + GUTTER + 2 * BORDER);
            button.level = hasSubmenu ? 0 : 0;
            return paper.hexagonalButton(button);
        });
        return buttons;
    }
    function setupMenu() {
        createButtons().forEach((button, index) => {
            let submenu = [];
            let hasSubmenu = !isEmpty(items[index].submenu);
            assign(button.node, {
                onblur:        preventDefault,
                oncontextmenu: preventDefault
            });
            enableInteraction(assign(button, {index, submenu, hasSubmenu}));
        });
    }
    function reset() {
        let DURATION = 50;
        let menu = paper;
        trigger('before:reset', {menu});
        buttons.forEach(button => {
            if (button.submenu.length > 0) {
                button.submenu.forEach(item => item.remove());
                button.submenu = [];
            }
            button.isActive = false;
            var start = paper.visible ? menuWidth : -menuWidth;
            var stop = paper.visible ? menuWidth : -menuWidth;
            Snap.animate(start, stop, translateX(button), DURATION, mina.linear, () => {
                enableInteraction(button.enable());
                if (button.index === (buttons.length - 1)) {trigger('reset', {menu});}
            });
        });
    }
    function showMenu(duration) {
        if (!paper.visible) {
            buttons.forEach(function(button, index) {
                setTimeout(function() {
                    Snap.animate(0, menuWidth, translateX(button), duration, mina.easein, () => {
                        let menu = paper;
                        if (index === (items.length - 1)) {
                            paper.visible = true;
                            trigger('show', {menu});
                        } else if (index === 0) {
                            trigger('before:show', {menu});
                        }
                    });
                }, ((duration / 2) * index));
            });
        }
    }
    function showSubmenuFor(button) {
        let DURATION = 50;
        let thisButton = assign(button, {
            isActive: true,
            submenu: []
        });
        let {index} = thisButton;
        let {submenu} = items[index];
        let x0 = menuWidth - β;
        let y0 = α + index * (H + GUTTER + 2 * BORDER);
        thisButton.addClass('active').disableHoverAnimation();
        thisButton.submenu = submenu.map((item, i) => {
            let {title, subtitle} = item;
            let x = x0 + 0 * BORDER + 0 * β - (2 * GUTTER) + menuWidth;
            let y = y0 + rowHeight(i + 1);
            let level = 0;
            let opacity = 0;
            return paper
                .hexagonalButton({x, y, title, subtitle, sideLength, width, level})
                .attr({opacity});
        });
        thisButton.submenu.forEach((item, i) => {
            item.index = i;
            let options = {
                menu: paper,
                parent: thisButton,
                target: item
            };
            let eventName = `click:${index}:`;
            let triggerEvents = () => {
                trigger('click:child', options);
                trigger(eventName + 'child', options);
                trigger(eventName + i, options);
            };
            setTimeout(() => {
                let opacity = 1;
                assign(item.node, {
                    onclick:       triggerEvents,
                    ontouchstart:  triggerEvents,
                    oncontextmenu: preventDefault
                });
                item.attr({opacity});
                Snap.animate(0, -menuWidth, translateX(item), DURATION, mina.easein, () => {
                    if (items[i].submenu && (i === (items[i].submenu.length - 1))) {
                        trigger('show:submenu', options);
                    }
                });
            }, DURATION * i);
        });
        buttons.filter((e, i) => (i !== index)).forEach(button => {
            let start = menuWidth;
            let stop = menuItemWidth + GUTTER + BORDER;
            Snap.animate(start, stop, translateX(button), DURATION, mina.linear, () => {
                disableInteraction(button.disable());
            });
        });
    }
    function enableInteraction(button) {
        assign(button.node, {
            onclick:      onClick(button),
            ontouchstart: onClick(button),
            onmousedown:  button.focus
        });
    }
    function disableInteraction(button) {
        assign(button.node, {
            onclick:      preventDefault,
            ontouchstart: preventDefault,
            onmousedown:  preventDefault
        });
    }
    function hideMenu(duration) {
        buttons.slice(0).reverse().forEach((button, i) => {
            let _duration = duration + ((duration / 2) * i);
            Snap.animate(menuWidth, 0, translateX(button), _duration, mina.backout, () => {
                let menu = paper;
                if (i === (items.length - 1)) {
                    paper.visible = false;
                    trigger('hide', {menu});
                } else if (i === 0) {
                    trigger('before:hide', {menu});
                }
            });
        });
    }
    function closeMenu(duration) {
        reset.bind(paper)();
        hideMenu.bind(paper)(duration);
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
    let on = (event, handler) => paper.node.addEventListener(event, handler);
    let off = (event, handler) => paper.node.removeEventListener(event, handler);
    let toggleMenu = () => (isVisible() ? closeMenu : showMenu).bind(paper)(DURATION);
    let toggle = debounce(toggleMenu, DURATION * DEBOUNCE_SCALING_FACTOR, true);
    //
    // Setup menu and return API
    //
    setupMenu();
    return {on, off, buttons, isVisible, reset, toggle};
};
