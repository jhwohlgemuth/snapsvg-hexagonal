/* global scene */
'use strict';

const {join} = require('path');
const nightmare = require('nightmare');
// nightmare.Promise = require('bluebird');

module.exports = {
    createFilePath,
    screenshotPlugin,
    captureScreenshots
};

function createFilePath(name, ext) {
    ext = ext ? ext : '.png';
    var filePath = join(__dirname, 'screenshots', name);
    filePath += ext;
    return filePath;
}
function screenshotPlugin(name, fn, element) {
    fn = fn || (() => {});
    return function(nightmare) {
        nightmare
            .evaluate(fn)
            .wait(500)
            .screenshot(createFilePath(name));
    };
}
function captureScreenshots(url, name) {
    let toggle = () => menu.toggle();
    let show = false;
    let openDevTools = {detach: true};
    let SCREEN_WIDTH = 700;
    let SCREEN_HEIGHT = 700;
    let i = 1;
    let browser = nightmare({show, openDevTools})
        .goto(url)
        .viewport(SCREEN_WIDTH, SCREEN_HEIGHT)
        .use(screenshotPlugin(`${name}_initial`));
    return browser
        .use(screenshotPlugin(`${name}-${i++}`, toggle))
        .use(screenshotPlugin(`${name}-${i++}`, toggle))
        .end();
}
