/* global menu */
'use strict';

const {join} = require('path');
const {bold, green} = require('chalk');
const nightmare = require('nightmare');
nightmare.Promise = require('bluebird');

const enoughTime = 400;// ms
const thirdButton = '.hexagonalButton.menu-item:nth-of-type(3)';

module.exports = {
    createFilePath,
    captureScreenshots
};

function createFilePath(name, ext) {
    ext = ext ? ext : '.png';
    var filePath = join(__dirname, 'screenshots', name);
    filePath += ext;
    return filePath;
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
        .screenshot(createFilePath(`${name}_initial`))
        .evaluate(toggle)
        .wait(enoughTime)
        .screenshot(createFilePath(`${name}-${i++}`))
        .mouseover(thirdButton)
        .screenshot(createFilePath(`${name}-${i++}`))
        .wait(enoughTime)
        .click(thirdButton)
        .wait(enoughTime)
        .screenshot(createFilePath(`${name}-${i++}`))
        .click(thirdButton)
        .wait(enoughTime)
        .screenshot(createFilePath(`${name}-${i++}`))
        .evaluate(toggle)
        .wait(enoughTime)
        .screenshot(createFilePath(`${name}-${i++}`))
        .end()
        .then(() => {
            console.log(bold(green('✔ ') + bold('Capture complete')));
            return nightmare.end();
        })
        .catch(() => {});
}
