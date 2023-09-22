'use server'

import Knex from 'knex'

export const knexClient = Knex({
  client: 'sqlite3',
  connection: {
    filename: './data.db'
  },
  useNullAsDefault: true
})
