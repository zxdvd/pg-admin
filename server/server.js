const fs = require('fs')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const pgp = require('pg-promise')()
const webpack = require('webpack')

const config = require('./config')
const webpackConfig = require('../webpack.config.js')

global.dbs = {}

const app = new Koa()


const compiler = webpack(webpackConfig)

const devMiddleware = (compiler, options) => {
  const middleware = require('webpack-dev-middleware')(compiler, options)
  return async (c, next) => {
    await middleware(c.req, {
      end: (content) => {
        c.body = content
      },
      setHeader: c.set.bind(c)
    }, next)
  }
}

app.use(devMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(bodyParser())

app.use(async (c, next) => {
  if (c.request.url.startsWith('/api/')) {
    const { uri, query } = c.request.body
    if (!dbs[uri])
      dbs[uri] = pgp(uri)
    c.body = await dbs[uri].any(query)
  } else {
    await next()
  }
})

//fallback all other requests to the index.html page
app.use((c, next) => {
  c.body =  fs.readFileSync('./src/index.html', 'utf-8')
})

app.listen(config.port || 3000)
