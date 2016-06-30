
export const getTable = function ({ dispatch, state }, table) {
  fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uri: state.currentCon,
      query: `select * from "${table}"`,
    }),
  })
    .then(res => res.json())
    .then(json => dispatch('GET_TABLE_ROW', table, json))
    .catch(e => console.log(`failed to get data from table ${table}, ${e}`))
}
