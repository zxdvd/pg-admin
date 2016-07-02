
export const query = function (uri, sql, {page = 1, pageSize = 20, noPagination} = {}) {
  if (!noPagination) {
    const offset = (page - 1) * pageSize
    sql = sql + ` limit ${pageSize} offset ${offset}`
  }
  return fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uri: uri,
        query: sql,
      }),
    })
      .then(res => res.json())
      .catch(e => console.log(`failed to get result of ${sql}, ${e}`))
}

export const getTableIndex = function (uri, table) {
  const sql = ` SELECT c.oid, c.relname, a.attname, a.attnum, i.indisprimary, i.indisunique
      FROM pg_index AS i, pg_class AS c, pg_attribute AS a
      WHERE i.indexrelid = c.oid
        AND i.indexrelid = a.attrelid
        AND i.indrelid = '${table}'::regclass
      ORDER BY c.oid,a.attnum;`
  return query(uri, sql, {noPagination: true})
}

//you can get columns from information_schema or by 'select * from TABLE where false'
//but pg_attribute has more information and is faster than information_schema
export const getTableColumn = function (uri, table) {
  const sql = `SELECT attname, format_type(atttypid, atttypmod) as column_type, attlen, attnum, attndims, attnotnull, atthasdef, def.adsrc as default_value
      FROM pg_attribute
      LEFT JOIN pg_attrdef def ON (pg_attribute.attrelid, pg_attribute.attnum) = (def.adrelid, def.adnum)
      WHERE attrelid = '${table}'::regclass
        AND attnum > 0
        AND not attisdropped
      ORDER BY attnum;`
  return query(uri, sql, {noPagination: true})
}
