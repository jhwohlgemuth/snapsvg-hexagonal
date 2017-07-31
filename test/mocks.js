'use strict';

let addClass = jest.fn().mockReturnThis();
let removeClass = jest.fn().mockReturnThis();
let attr = jest.fn().mockReturnThis();
let group = jest.fn().mockReturnThis();
let hover = jest.fn().mockReturnThis();
let unhover = jest.fn().mockReturnThis();
let polygon = jest.fn().mockReturnThis();
let text = jest.fn().mockReturnThis();

let mockHexagon = {addClass, polygon};
let mockHexagonalButton = {
    addClass,
    removeClass,
    attr,
    group,
    hover,
    unhover,
    text,
    polygon
};

module.exports = {
    mockHexagon,
    mockHexagonalButton
};
