# trailpack-autoreload

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

This Trailpack will automatically reload your Trails application on code
changes. It listens for changes in `api/` and `config/`.


## Install

```sh
$ npm install --save trailpack-autoreload
```

## Configure

```js
// config/main.js
module.exports = {
  packs: [
    // ... other trailpacks
    require('trailpack-autoreload')
  ]
}
```

This trailpack offers significant performance advantages over other solutions
such as nodemon, which restarts the entire node process. This trailpack detects
the file(s) in which the change occured, evicts those modules from the
require cache, and reloads the Trails application (via `app.start()`).

The synchronous node `require` statement incurs non-negligible boot-time
overhead. We avoid these costs by evicting only the affected module(s).

[npm-image]: https://img.shields.io/npm/v/trailpack-autoreload.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-autoreload
[ci-image]: https://img.shields.io/travis//trailpack-autoreload/master.svg?style=flat-square
[ci-url]: https://travis-ci.org//trailpack-autoreload
[daviddm-image]: http://img.shields.io/david//trailpack-autoreload.svg?style=flat-square
[daviddm-url]: https://david-dm.org//trailpack-autoreload
[codeclimate-image]: https://img.shields.io/codeclimate/github//trailpack-autoreload.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github//trailpack-autoreload

