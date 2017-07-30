'use strict';

const {now} = Date;

module.exports = {
    debounce,
    isEmpty,
    isTouch,
    range,
    zip
};

function debounce(func, wait, immediate) {
    var timeout;
    var args;
    var context;
    var timestamp;
    var result;
    var later = function() {
        var last = now() - timestamp;
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            }
        }
    };
    return function() {
        context = this;
        args = arguments;
        timestamp = now();
        var callNow = immediate && !timeout;
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
}
function isEmpty(collection) {
    Array.isArray(collection) ? collection.length === 0 : true;
}
function isTouch() {
    return !!('ontouchstart' in window) || (window.navigator.msMaxTouchPoints > 0);
}
function range(n) {
    return (new Array(n)).fill(0).map((val, index) => index);
}
function zip(a, b) {
    return range(a.length).map((val, index) => ([a[index], b[index]]));
}
