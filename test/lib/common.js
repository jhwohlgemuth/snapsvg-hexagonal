/* global menu */
'use strict';

const {join} = require('path');
const nightmare = require('nightmare');
nightmare.Promise = require('bluebird');

const enoughTime = 500;// ms
const thirdButton = '.hexagonalButton.menu-item:nth-of-type(3)';

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
    return (nightmare) => {
        nightmare.screenshot(createFilePath(name));
    };
}
function captureScreenshots(url, name) {
    let toggle = () => menu.toggle();
    let reset = () => menu.reset();
    let show = true;
    let waitTimeout = 600;
    let SCREEN_WIDTH = 700;
    let SCREEN_HEIGHT = 700;
    let i = 1;
    let browser = nightmare({show, waitTimeout})
        .goto(url)
        .viewport(SCREEN_WIDTH, SCREEN_HEIGHT)
        .use(screenshotPlugin(`${name}_initial`));
    return browser
        .evaluate(toggle)
        .wait(enoughTime)
        .use(screenshotPlugin(`${name}-${i++}`))
        .mouseover(thirdButton)
        .use(screenshotPlugin(`${name}-${i++}`))
        .wait(enoughTime)
        .click(thirdButton)
        .wait(enoughTime)
        .use(screenshotPlugin(`${name}-${i++}`))
        .click(thirdButton)
        .wait(enoughTime)
        .use(screenshotPlugin(`${name}-${i++}`))
        .evaluate(toggle)
        .wait(enoughTime)
        .use(screenshotPlugin(`${name}-${i++}`))
        .end();
}
