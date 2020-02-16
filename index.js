module.exports = (app, handler, modes = ['get', 'post', 'put', 'delete', 'use']) => {
  const raw = Object.fromEntries(modes.map(key => [key, app[key].bind(app)]))
  for (const [key, f] of Object.entries(raw)) {
    app[key] = (...args) => {
      if (args.length === 2) {
        const [route, f] = args
        raw[key](route, async (...args) => {
          if (args.length > 3) return f(...args)
          const [req, res, next] = args
          try {
            await f(...args)
          } catch(e) {
            return handler(e, req, res, next)
          }
        })
      } else {
        const [f] = args
        raw[key](async (...args) => {
          if (args.length > 3) return f(...args)
          const [req, res, next] = args
          try {
            await f(...args)
          } catch(e) {
            return handler(e, req, res, next)
          }
        })
      }
    }
  }
}