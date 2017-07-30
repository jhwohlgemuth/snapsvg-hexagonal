'use strict';

const {debounce, isEmpty, isTouch, range, zip} = require('../lib/common');

jest.useFakeTimers();

describe('Common utilities', function() {
    it('can debounce function calls', () => {
        let wait = 100;
        let fn = jest.fn();
        let debounced = debounce(fn, wait, true);
        range(3).forEach(() => debounced());
        expect(fn).toHaveBeenCalledTimes(1);
        jest.runTimersToTime(wait + 1);
    });
    it('can determine if a collection is empty', () => {
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
            [1, 2, 3],
            [''],
            [0],
            [null],
            [undefined]
        ].forEach(val => expect(isEmpty(val)).not.toBeTruthy());
    });
    it('can determine if device is touch', () => {
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
