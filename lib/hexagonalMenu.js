/* global Snap mina */
'use strict';

const {assign}   = Object;
const {debounce} = require('./common');

let preventDefault = e => e.preventDefault();
let translateX = val => ({transform: `translateX(${val})`});

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
 * paper.attr({height: '100%', width: '100%'});
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
 * menu.on('before:show', function(e) {
 *     //triggered before show animation
 * });
 * menu.on('show', e => {
 *     //triggered after show animation is complete
 * });
 * menu.on('before:hide', function(e) {
 *     //triggered before hide animation starts
 * });
 * menu.on('hide', e => {
 *     //triggered after hide animation is complete
 * });
 * menu.on('before:reset', function(e) {
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
    let paper = this;
    paper.visible = false;
    let buttons = [];
    let DURATION = options.duration ? options.duration : 100;
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
            return paper.hexagonalButton(button);
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
            thisButton.submenu.push(paper.hexagonalButton({
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
