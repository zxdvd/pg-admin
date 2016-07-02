
export function getColumns (state) {
  return (state.tableInfo.columns || []).map(el => el.attname)
}

export function getPrimaryKey (state) {
  const pk =  (state.tableInfo.indexes || [])
      .filter(el => el.indisprimary)
      .map(el => el.attname)
  if (!pk.length)
    return null
  if (pk.length === 1)
    return pk[0]
  return pk
}
