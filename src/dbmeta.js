export const psql = {
  dataType: [
    'serial', 'integer', 'smallint', 'text', 'varchar', 'char', 'boolean', 'timestamptz', 'json', 'jsonb',
    'smallserial', 'bigint', 'bigserial', 'bit', 'varbit',
    'timestamp', 'time', 'timetz', 'date', 'interval',
    'real', 'double precision', 'money', 'numeric', 'uuid',
    'point', 'inet', 'macaddr', 'line'
  ],
  dataTypeHasLength: [
    'char', 'varchar', 'bit', 'varbit'
  ],
}
