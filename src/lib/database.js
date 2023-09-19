"use server"

import Knex from 'knex'

export const knexClient = Knex({
    client: 'sqlite3',
    connection: {
      filename: './data.db',
    },
  });

async function createTables() {
    console.log("Attempting to create database file.")
    try {
        await knexClient.schema
            .createTable('users', (table) => {
                table.string('username').notNullable().unique().primary();
                table.string('name').notNullable()
                table.string('password').notNullable();
            })
            .createTable('user_sessions', (table) => {
                table.string('username').notNullable()
                table.foreign('username').references('users.username');
                table.string('token').notNullable().unique();
                table.timestamp('created_at').notNullable();
                table.timestamp('expires_at').notNullable();
            })
            .createTable('tickets', (table) => {
                table.increments('id').primary()
                table.integer('severity').notNullable();
                table.string('requester').notNullable()
                table.foreign('requester').references('users.username');
                table.string('assignee')
                table.string('title').notNullable()
                table.string('message').notNullable()
                table.boolean('resolved')
                table.timestamp('created_at').notNullable();
            })
        
        await knexClient('users').insert({ username: 'aaron', name: "Aaron S", password: 'bob12345678' });
    } catch (e) {
        if (e.message.includes('already exists')) {
            console.log("Database file already exists.")
        } else {
            throw new Error(e)
        }
    }
}

createTables()
