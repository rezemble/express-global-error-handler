module.exports = (
  app,
  handler = (err, req, res, next) => next(err),
  modes = ['all', 'get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'use']
) => modes.map(key => [key, app[key].bind(app)]).forEach(
  ([key, orig]) => app[key] = (...args) => orig(...args.map(arg => typeof arg === 'function' ? arg.length === 4 ? arg : async (...argv) => {
    try {
      await arg(...argv)
    } catch(error) {
      return handler(error, ...argv)
    }
  } : arg)))