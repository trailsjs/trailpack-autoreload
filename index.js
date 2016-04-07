'use strict'

const util = require('util')
const path = require('path')
const chokidar = require('chokidar')
const Trailpack = require('trailpack')

function assignConfigDefaults (config) {
  if (!config) {
    config = { }
  }
  if (!config.env) {
    config.env = { }
  }
  if (!config.env[process.env.NODE_ENV]) {
    config.env[process.env.NODE_ENV] = { }
  }
  if (!config.main) {
    config.main = { }
  }
  if (!config.main.packs) {
    config.main.packs = [ ]
  }
  if (!config.main.paths) {
    config.main.paths = { }
  }
  if (!config.main.maxListeners) {
    config.main.maxListeners = 128
  }
  if (!config.log) {
    config.log = { }
  }

  if (!config.main.paths.root) {
    config.main.paths.root = path.resolve(process.cwd())
  }

  if (!config.main.paths.temp) {
    config.main.paths.temp = path.resolve(process.cwd(), '.tmp')
  }

  return config
}

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
      this.log.warn('Not running "autoreload" trailpack in production mode')
      return
    }

    this.watcher = chokidar.watch([ 'api/**/*.js', 'config/**/*.js' ], {
      cwd: this.app.config.main.paths.root,
      ignoreInitial: true
    })

    this.watcher
      .on('change', file => this.reloadApp(file))
      .on('add', file => this.reloadApp(file))
      .on('unlink', file => this.reloadApp(file))

    this.once('repl:started', () => {
      const server = this.packs.repl.server
      server.defineCommand('reload', () => this.reloadApp())
    })
  }

  unload () {
    this.watcher.close()
    delete this.watcher
  }

  reloadApp (file) {
    const root = this.app.config.main.paths.root
    let app
    if (!file) {
      file = root
    }
    else {
      this.log.info(`File ${file} changed. Reloading.`)
    }

    this.evict(require.cache[require.resolve(path.resolve(root, file))])

   
    try {
      app = require(root)
    }
    catch (e) {
      this.log.error(e.message)
      this.log.error(util.inspect(e).toString().split('\n').slice(0, 3).join('\n'))
      this.log.error('Trails will reload when this problem is fixed.')
      this.log.info('Reload canceled. Application is running.')
      return
    }

    return this.app.stop()
      .then(() => {
        this.app.config = assignConfigDefaults(app.config)
        return this.app.start(app)
      })
      .then(app => {
        if (file === root) {
          this.log.info('App reloaded via REPL command')
        }
        else {
          this.log.info('App reloaded with changes in', file)
        }
      })
  }

  /**
   * Evict a branch of modules from the require cache so that subsequent
   * requires will load from the file system.
   */
  evict (mod) {
    if (!mod || !mod.id || !require.cache[mod.id]) {
      return
    }
    if (mod.parent !== null) {
      this.evict(mod.parent)
    }

    this.log.silly('Evicting module from require.cache', mod.id)
    delete require.cache[mod.id]
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}

