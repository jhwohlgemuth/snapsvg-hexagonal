'use strict';

const {mockHexagon} = require('./mocks');
const Hexagon = require('../lib/hexagon');

Object.assign(Hexagon.prototype, mockHexagon);

describe('Hexagon', function() {
    let hexagon;
    afterEach(() => {
        hexagon.addClass.mockClear();
        hexagon.polygon.mockClear();
    });
    it('can be created with default x and y', () => {
        hexagon = new Hexagon(100, 0, 0);
        expect(hexagon.addClass.mock.calls).toMatchSnapshot();
        expect(hexagon.polygon.mock.calls).toMatchSnapshot();
        expect(hexagon).toEqual({});
    });
    it('can be created with correct points', () => {
        hexagon = new Hexagon(100, 10, 10);
        expect(hexagon.addClass.mock.calls).toMatchSnapshot();
        expect(hexagon.polygon.mock.calls).toMatchSnapshot();
        expect(hexagon).toEqual({});
    });
});
