'use strict';

const {mockHexagon} = require('./mocks');
const Hexagon = require('../lib/hexagon');

Object.assign(Hexagon.prototype, mockHexagon);

describe('Hexagon', function() {
    it('can be created with correct points', () => {
        let hexagon = new Hexagon(100, 10, 10);
        expect(hexagon.addClass.mock.calls).toMatchSnapshot();
        expect(hexagon.polygon.mock.calls).toMatchSnapshot();
        expect(hexagon).toEqual({});
    });
});
