'use strict';

jest.useFakeTimers();

const Snap = require('snapsvg');
const {mockHexagonalMenu} = require('./mocks');
const HexagonalMenu = require('../lib/hexagonalMenu');

Object.assign(HexagonalMenu.prototype, mockHexagonalMenu);

let items = [
    {title: 'CHOICE ONE'},
    {title: 'CHOICE TWO'},
    {title: 'CHOICE THREE'},
    {title: 'CHOICE FOUR'},
    {title: 'CHOICE FIVE'},
    {title: 'CHOICE SIX', subtitle: 'this button is special'}
];
let sideLength = 10;
let width = 100;
let options = {sideLength, width};

describe('Hexagonal Menu', function() {
    let menu;
    beforeEach(() => {
        window.Snap = Snap;
        menu = new HexagonalMenu(items, options);
    });
    afterEach(() => {
        window.Snap = undefined;
    });
    it('can be created in the hidden state', () => {
        expect(menu.isVisible()).toBeFalsy();
        menu.buttons.forEach((button, index) => {
            let {sideLength, x, y} = button;
            expect(sideLength).toEqual(sideLength);
            expect({x, y}).toMatchSnapshot();
            expect(button.index).toEqual(index);
        });
    });
    it('can set titles and subtitles', () => {
        menu.buttons.forEach(button => {
            let {title} = button;
            expect(title).toMatchSnapshot();
        });
        let buttonWithSubtitle = menu.buttons.filter(button => (button.subtitle !== undefined));
        expect(buttonWithSubtitle[0].subtitle).toEqual(items[items.length - 1].subtitle);
    });
    it('can toggle visibility', () => {
        expect(menu.isVisible()).toBeFalsy();
        menu.toggle();
        jest.runTimersToTime(1000 * 1000);
        expect(menu.isVisible()).toBeTruthy();
        menu.toggle();
        jest.runTimersToTime(1000 * 1000);
    });
    it('can be reset', function() {
        menu.toggle();
        jest.runTimersToTime(1000 * 100);
        menu.buttons.forEach(button => {
            expect(button.isActive).toEqual(undefined);
        });
        menu.reset();
        jest.runTimersToTime(100);
        menu.buttons.forEach(button => {
            expect(button.isActive).toEqual(false);
        });
    });
});
