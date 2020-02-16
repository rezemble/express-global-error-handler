# express-global-error-handler

### installation
`yarn add express-global-error-handler`
or
`npm i express-global-error-handler`

### usage
```js
const express = require('express')
const app = express()

const geh = require('express-global-error-handler')

// bind the error handler to the express instance
// will receive all unhandled errors thrown from any route handler
geh(app, (err, req, res, next) => {
	console.error('some error')
	res.status(500).send({
		error: err.message,
		stack: err.stack,
	})
})

// produce some errors:
app.use(async (req, res) => {
	// foo is undefined - will throw ReferenceError
	res.send(foo())
	// since this is an async function,
	// it would usually produce an UnhandledPromiseRejectionWarning
	// but any rejection will be caught by the global error handler
})

app.listen(8080)
```

### usage with express-style error handler
```js
const express = require('express')
const app = express()

const geh = require('express-global-error-handler')

// use the default handler to forward all errors (including promise rejections)
geh(app)

// produce some errors:
app.use(async (req, res) => {
	// foo is undefined - will throw ReferenceError
	res.send(foo())
})

// the express default error handler will receive all async errors
app.use((err, req, res, next) => {
	console.error('some error')
	res.status(500).send({
		error: err.message,
		stack: err.stack,
	})
})

app.listen(8080)
```


### api
`(app: express, handler: function?, modes?: <String>)`
- `app` is the express instance to use (or a `router`)
- `handler` is the error handling function (defaults to `(err, req, res, next) => next(err)`)
- `modes` is an optional array of express methods to override (defaults to `['all', 'get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'use']`)