
<p align="left">
    <a href="https://github.com/jhwohlgemuth/snapsvg-hexagonal"><img width="300px" alt="snapsvg-hexagonal" src="https://raw.githubusercontent.com/jhwohlgemuth/snapsvg-hexagonal/master/media/hexagonal.png"/></a>
</p>

[![Build Status](https://travis-ci.org/jhwohlgemuth/snapsvg-hexagonal.svg?branch=master)](https://travis-ci.org/jhwohlgemuth/snapsvg-hexagonal)
[![Build status](https://ci.appveyor.com/api/projects/status/j2scpcedrevwejvb?svg=true)](https://ci.appveyor.com/project/jhwohlgemuth/snapsvg-hexagonal)
[![Coverage Status](https://coveralls.io/repos/github/jhwohlgemuth/snapsvg-hexagonal/badge.svg?branch=master)](https://coveralls.io/github/jhwohlgemuth/snapsvg-hexagonal?branch=master)
[![bitHound Overall Score](https://www.bithound.io/github/jhwohlgemuth/snapsvg-hexagonal/badges/score.svg)](https://www.bithound.io/github/jhwohlgemuth/snapsvg-hexagonal)
[![Known Vulnerabilities](https://snyk.io/test/github/jhwohlgemuth/snapsvg-hexagonal/badge.svg)](https://snyk.io/test/github/jhwohlgemuth/snapsvg-hexagonal)

> [Snap.svg](http://snapsvg.io/) plugin for creating hexagonal UI elements.

<p align="left">
    <a href="https://github.com/jhwohlgemuth/snapsvg-hexagonal">
<img src="https://media.giphy.com/media/3o6vY7j5XZ5b2lOWys/giphy.gif"/></a>
</p>

Installation
------------

```bash
npm install snapsvg snapsvg-hexagonal
```

Usage
-----

**AMD (Require.js)**
> Add to [paths attrbute of requirejs config file](http://requirejs.org/docs/api.html#config-paths) and require in code

```js
// config.js
requirejs.config({
    paths: {
        snapsvg:   'path/to/node_modules/snapsvg/snapsvg',
        hexagonal: 'path/to/node_modules/snapsvg-hexagonal/dist/snapsvg-hexagonal'
    }
});

// main.js
define(function(require) {
    'use strict';

    const Snap = require('snapsvg');
    const hexagonal = require('hexagonal');
    Snap.plugin(hexagonal);
});
```

**Browser global**

```html
<!DOCTYPE html>
<html lang="en">
    <head>...</head>
    <body>
        <script src="path/to/node_modules/snapsvg/snapsvg.js"></script>
        <script src="path/to/node_modules/snapsvg-hexagonal/dist/snapsvg-hexagonal.js"></script>
        <script type="text/javascript">
            Snap.plugin('hexagonal');
            /* code code code */
        </script>
    </body>
</html>
```

Features
--------
> Under construction

Contributing
------------
> Please read the [contributing guide](.github/CONTRIBUTING.md)

Roadmap
-------
- Follow progress on [Trello](https://trello.com/b/MaTNvM8a/hexagonal)

Credits
-------
- Under construction

License
-------
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fjhwohlgemuth%2Fsnapsvg-hexagonal.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fjhwohlgemuth%2Fsnapsvg-hexagonal?ref=badge_large)
