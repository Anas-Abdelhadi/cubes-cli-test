!(function () {
  var script = document.querySelector('[type="systemjs-importmap"]'),
    hashPromise = new Promise(function (resolve) {
      fetch(script.src).then(function (r) {
        r.json().then(function (r) {
          //inject('runtime', r.hash, function() {
          resolve(r.hash)
          //})
        })
      })
    })
  System.baseUrl = (script && script.src.substr(0, script.src.lastIndexOf('/') + 1)) || ''
  /*Custom function to load `default` export */
  System.load = function (moduleName, parentURL) {
    return new Promise(function (success, failure) {
      System.import(moduleName, parentURL)
        .then(function (_module) {
          var m = _module.default || _module
          Object.keys(m).forEach(function (k) {
            var o = m[k],
              t = typeof o
            if (o != null && o.prototype && (t === 'function' || t === 'object') && '__MN__' in o.prototype) o.prototype.__MN__ = moduleName
          })
          m.n = moduleName
          success(m)
        })
        .catch(function (e) {
          failure(e)
        })
    })
  }
  /*Custom function to inject chunks and then load modules */
  System.ready = function (globals, modules, chunks, callback, context) {
    ready(function () {
      var i = -1,
        modulesLoader = function (m) {
          return System.load(m)
        },
        modulesExport = function (m, i) {
          context[modules[i]] = m
        },
        globalsLoader = function () {
          if (globals[++i])
            modulesLoader(globals[i]).then(function (g) {
              context[globals[i]] = { ...context[globals[i]], ...g }
              globalsLoader()
            })
          else {
            Promise.all(modules.map(modulesLoader)).then(function (modules) {
              context && modules.map(modulesExport)
              callback.apply(null, modules)
            })
          }
        }
      globalsLoader()
    }, chunks)
  }
  var callbacks = [],
    d = document,
    remainingChunks = 0,
    interval

  function check() {
    if (!interval) {
      interval = setInterval(function () {
        if (!remainingChunks) {
          clearInterval(interval)
          for (var callback; (callback = callbacks.pop()); ) callback()
        }
      })
    }
  }
  function ready(callback, chunks) {
    hashPromise.then(function (hash) {
      chunks &&
        chunks.forEach(function (chunkId) {
          inject(chunkId, hash)
        })
      if (!remainingChunks) callback()
      else {
        callbacks.push(callback)
        check()
      }
    })
  }

  function inject(chunkId, hash, callback) {
    var script = d.createElement('script'),
      exists = d.getElementById((script.id = 'b-' + chunkId))
    if (!exists) {
      remainingChunks++
      script.src = System.baseUrl + chunkId + '.' + hash + '.js'
      script.onload = function () {
        --remainingChunks
        callback && callback()
      }
      script.onerror = function () {
        --remainingChunks
        console.error('chunk load failed ' + chunkId)
      }
      d.head.appendChild(script)
    }
  }
})()
