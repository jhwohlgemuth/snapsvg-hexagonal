'use strict';

const {captureScreenshots} = require('./common');

let PORT = 1337;
let URL = `http://localhost:${PORT}/test/demo/index.html`;
let prefix = 'snapshot';

captureScreenshots(URL, prefix);
