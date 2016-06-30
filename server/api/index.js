const pgp = require('pg-promise')()

global.dbs = {}

exports.handleConnect = async function (c) {
  const uri = c.request.body.uri
  if (!uri)
    throw('database uri should not be empty!', 400)
  dbs[uri] = pgp(uri)
  const data = await dbs[uri].any(` SELECT table_schema,string_agg(table_name, ',') as tables FROM information_schema.tables GROUP BY table_schema;`)
  console.log(data)
  c.body = data
}

exports.handleQuery = async function (c) {
  const { uri, query } = c.request.body
  if (!dbs[uri])
    dbs[uri] = pgp(uri)
  const data = await dbs[uri].any(query)
  console.log('data', data)
  c.body = data
}
