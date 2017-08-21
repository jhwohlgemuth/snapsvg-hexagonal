'use strict';

const fs = require('fs');
const {join} = require('path');
const {promisify} = require('bluebird');
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const {toMatchImageSnapshot} = require('jest-image-snapshot');
expect.extend({toMatchImageSnapshot});

let screenshotDirectory = join(__dirname, 'lib', 'screenshots');
let hasPngExtension = name => (name.split('').slice(-1 * '.png'.length).join('') === '.png');

describe('Snap.svg Hexagonal Plugin', function() {
    it('can toggle open, open sub-menus, and toggle closed', () => {
        return readdir(screenshotDirectory)
            .filter(hasPngExtension)
            .map(name => join(screenshotDirectory, name))
            .map(path => readFile(path))
            .each(image => expect(image).toMatchImageSnapshot({threshold: 1000}));
    });
});
