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
                table.string('username').unique().primary();
                table.string('name')
                table.string('password');
            })
            .createTable('user_sessions', (table) => {
                table.string('username')
                table.foreign('username').references('users.username');
                table.string('token');
                table.timestamp('created_at');
                table.timestamp('expires_at');
            })
            .createTable('tickets', (table) => {
                table.increments('id').primary()
                table.integer('severity');
                table.string('requester').notNullable()
                table.foreign('requester').references('users.username');
                table.string('assignee')
                table.string('title')
                table.string('message')

                table.timestamp('created_at');
            })
        
        await knexClient('users').insert({ username: 'aaron', password: 'bob12345678' });
        
        console.log("hi?")
    } catch (e) {
        if (e.message.includes('already exists')) {
            console.log("Database file already exists.")
        } else {
            throw new Error(e)
        }
    }
}

createTables()
