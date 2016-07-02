const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const pgp = require('pg-promise')()

const config = require('./config')

global.dbs = {}

const app = new Koa()

app.use(bodyParser())

app.use(async (c, next) => {
  const { uri, query } = c.request.body
  if (!dbs[uri])
    dbs[uri] = pgp(uri)
  c.body = await dbs[uri].any(query)
})


app.listen(config.port || 3000)
