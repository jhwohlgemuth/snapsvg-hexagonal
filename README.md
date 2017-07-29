
<p align="left">
    <a href="https://github.com/jhwohlgemuth/voxelcss"><img width="300px" alt="voxelcss" src="https://raw.githubusercontent.com/jhwohlgemuth/voxelcss/master/media/voxelcss_with_letters.png"/></a>
</p>

> [Snap.svg](http://snapsvg.io/) plugin for creating hexagonal UI elements.

Installation
------------

```bash
npm install snapsvg snapsvg-hexagonal
```

> **Note:** The associated styles are [bundled with the JavaScript](https://github.com/jhwohlgemuth/voxelcss/blob/master/lib/index.js#L3) and [added into the head section at runtime](https://github.com/cheton/browserify-css#autoinject).

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
    const hexagonal = require('snapsvg-hexagonal');
});
```

Examples
--------
> Under construction

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
> Under construction
