/* global menu */
'use strict';

const {join} = require('path');
const {bold, green} = require('chalk');
const puppeteer = require('puppeteer');

const width = 640;
const height = 480;
const enoughTime = 1000;// ms
const thirdButton = '.hexagonalButton.menu-item:nth-of-type(3)';

let getPath = name => ({path: createFilePath(name)});
let toggle = () => menu.toggle();
let reset = () => menu.reset();

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
function captureScreenshots(options) {
    let {url, prefix} = options;
    let actions = [toggle, toggle, toggle];
    return (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        let perform = fn => page.evaluate(fn);
        let screenshot = name => page.screenshot(getPath(name));
        let wait = duration => page.waitFor(duration);
        await page.goto(url);
        await page.setViewport({width, height});
        await screenshot(`${prefix}-initial`);
        let i = 1;
        for (let action of actions) {
            await perform(action);
            await wait(enoughTime)
            await screenshot(`${prefix}-${i++}`);
        }
        await page.click(thirdButton);
        await wait(10 * enoughTime);
        await screenshot(`${prefix}-${i++}`);
        await page.click(thirdButton);
        await wait(10 * enoughTime);
        await screenshot(`${prefix}-${i++}`);
        await page.click(thirdButton);
        await wait(10 * enoughTime);
        await screenshot(`${prefix}-${i++}`);
        await perform(reset);
        await wait(enoughTime);
        await screenshot(`${prefix}-${i++}`);
        await perform(toggle);
        await wait(enoughTime);
        await screenshot(`${prefix}-${i++}`);
        browser.close();
        return 'Capture Complete';
    })();
}
