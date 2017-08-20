/* global scene */
'use strict';

const {bold, green} = require('chalk');
const {captureScreenshots} = require('./common');

const PORT = 1337;
let url = `http://localhost:${PORT}/test/demo/index.html`;
let prefix = 'test';

/* eslint-disable no-console */
captureScreenshots({url, prefix}).then(msg => console.log(bold(green('✔ ') + bold(msg))));
/* eslint-enable no-console */
