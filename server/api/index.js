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
  await new Promise((resolve, reject) => {
    dbs.test.connect((err, client, done) => {
      if (err) throw(`failed to connect to the database, ${err}`, 400)
      client.query('select * from pg_admin', (err, result) => {
        done()
        if (err)
          return console.error('error', err)
        c.body = result
        resolve()
      })
    })
  })

}
