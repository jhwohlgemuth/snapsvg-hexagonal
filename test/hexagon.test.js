'use strict';

const Hexagon = require('../lib/hexagon');

let addClass = jest.fn().mockReturnThis();
let polygon = jest.fn().mockReturnThis();
Object.assign(Hexagon.prototype, {addClass, polygon});

describe('Hexagon', function() {
    afterEach(() => {
        addClass.mockReset();
        polygon.mockReset();
    });
    it('can be created with correct points', () => {
        let hexagon = new Hexagon(100, 10, 10);
        expect(addClass.mock.calls).toMatchSnapshot();
        expect(polygon.mock.calls).toMatchSnapshot();
        expect(hexagon).toEqual({});
    });
});
