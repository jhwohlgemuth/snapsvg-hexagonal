'use strict';

const {mockHexagonalButton} = require('./mocks');
const HexagonalButton = require('../lib/hexagonalButton');

Object.assign(HexagonalButton.prototype, mockHexagonalButton);

describe('Hexagonal Button', function() {
    let button;
    let sideLength = 10;
    let width = 100;
    let level = 0;
    let title = 'Test Button';
    let subtitle = 'Ready for testing';
    beforeEach(() => {
        button = new HexagonalButton({sideLength, width, level, title, subtitle});
    });
    it('can be created with correct points', () => {
        expect(button).toMatchSnapshot();
        expect(button.addClass.mock.calls).toMatchSnapshot();
        expect(button.attr.mock.calls).toMatchSnapshot();
    });
    it('can enable and disable hover animation', function() {
        expect(button.hoverAnimationDisabled).toBeFalsy();
        button.disableHoverAnimation();
        expect(button.hoverAnimationDisabled).not.toBeFalsy();
        button.enableHoverAnimation();
        expect(button.hoverAnimationDisabled).toBeFalsy();
    });
});
