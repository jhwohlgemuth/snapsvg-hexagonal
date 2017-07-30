'use strict';

const {range, zip} = require('../lib/common');

describe('Common utilities', function() {
    it('can create ranges', function() {
        expect(range(3)).toMatchSnapshot();
        expect(range(10)).toMatchSnapshot();
        expect(range(100)).toMatchSnapshot();
    });
    it('can zip two arrays', function() {
        let a = ['a', 'b', 'c'];
        let b = [1, 2, 3];
        expect(zip(a, b)).toMatchSnapshot();
    });
});
