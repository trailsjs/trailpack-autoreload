'use strict'

const Trailpack = require('trailpack')
const chokidar = require('chokidar')
const path = require('path')

module.exports = class AutoreloadTrailpack extends Trailpack {

  /**
   * TODO document method
   */
  validate () {
    return this.app.config.main.paths.root
  }

  /**
   * TODO document method
   */
  configure () {

  }

  /**
   * TODO document method
   */
  initialize () {
    if (process.env.NODE_ENV == 'production') {
      this.app.log.warn('Not running "autoreload" trailpack in production mode')
      return
    }

    this.watcher = chokidar.watch([ 'api', 'config' ], {
      cwd: this.app.config.main.paths.root,
      ignoreInitial: true,
      interval: 200
    })

    this.watcher
      .on('change', path => this.reloadApp(path))
      .on('add', path => this.reloadApp(path))
      .on('unlink', path => this.reloadApp(path))
  }

  unload () {
    this.watcher.close()
  }

  reloadApp (path) {
    this.app.log.info(`File ${path} changed. Reloading.`)

    return this.app.stop()
      .then(() => this.app.start())
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}

