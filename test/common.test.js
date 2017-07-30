'use strict';

const {isEmpty, isTouch, range, zip} = require('../lib/common');

describe('Common utilities', function() {
    it('can determine if a collection is empty', function() {
        expect(isEmpty([])).toBeTruthy();
        [// non-array objects are default true
            '',
            'some non-empty string',
            0,
            null,
            undefined,
            false,
            {}
        ].forEach(val => expect(isEmpty(val)).toBeTruthy());
        [// non-empty arrays are false
            [1, 2, 3, 4],
            [''],
            [0],
            [null],
            [undefined]
        ].forEach(val => expect(isEmpty(val)).not.toBeTruthy());
    });
    it('can determine if device is touch', function() {
        expect(isTouch()).toBeFalsy();
    });
    it('can create ranges', () => {
        expect(range(3)).toMatchSnapshot();
        expect(range(10)).toMatchSnapshot();
        expect(range(100)).toMatchSnapshot();
    });
    it('can zip two arrays', () => {
        let a = ['a', 'b', 'c'];
        let b = [1, 2, 3];
        expect(zip(a, b)).toMatchSnapshot();
    });
});
