const Koa = require('koa')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')

const config = require('./config')
const api = require('./api')

const app = new Koa()

app.keys = config.keys

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())


router.post('/api/query', api.handleQuery)
router.post('/api/connect', api.handleConnect)


app.listen(config.port || 3000)
