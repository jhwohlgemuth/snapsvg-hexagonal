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
function screenshotPlugin(name) {
    return function(nightmare) {
        nightmare.screenshot(createFilePath(name));
    };
}
function captureScreenshots(url, name) {
    let toggle = () => menu.toggle();
    let show = false;
    let waitTimeout = 500;
    let SCREEN_WIDTH = 700;
    let SCREEN_HEIGHT = 700;
    let i = 1;
    let browser = nightmare({show, waitTimeout})
        .goto(url)
        .viewport(SCREEN_WIDTH, SCREEN_HEIGHT)
        .use(screenshotPlugin(`${name}_initial`));
    return browser
        .evaluate(toggle)
        .wait(300)
        .use(screenshotPlugin(`${name}-${i++}`))
        .evaluate(toggle)
        .wait(300)
        .use(screenshotPlugin(`${name}-${i++}`))
        .end();
}
