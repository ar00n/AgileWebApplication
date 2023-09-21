const LoremIpsum = require("lorem-ipsum").LoremIpsum

var knexClient = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: './data.db',
    },
    useNullAsDefault: true
  });

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 10,
        min: 4
    }
});

const users = [
    { username: 'aaron', name: "Aaron S", password: 'q584NcNFrMSzT7', is_admin: true },
    { username: 'john', name: "John Led", password: '3LLt7b2uiCNRUB', is_admin: true },
    { username: 'davidf', name: "David Finder", password: 'bzQPH49gKXZSAN', is_admin: false },
    { username: 'alfied', name: "Alfie Dops", password: 'PtPRy9njx3imGP', is_admin: false },
    { username: 'lopwd', name: "Lop Word Days", password: '4LRSLoFFZGkULy', is_admin: false },
    { username: 'cobine', name: "Coby Nine", password: 'aV96g2QCz6JHXM', is_admin: false },
    { username: 'poles', name: "Pole Sid", password: 'Q4ZXw8N995MQF7', is_admin: false },
    { username: 'qtif', name: "Quark Tile", password: 'GvCUuZ335Z8eEZ', is_admin: false },
    { username: 'npdal', name: "Neri Pol Dale", password: 'DeiGMTq62frpYu', is_admin: false },
    { username: 'defas', name: "Dean Faso", password: 'Gqt2toP5gLBG5m', is_admin: false },
]

let tickets = [
]

for (let i = 0; i < 20; i++) {
    tickets.push({
        severity: Math.floor(Math.random() * 5) + 1,
        requester: users[Math.floor(Math.random() * users.length)].username,
        assignee: Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)].username : null,
        title: lorem.generateSentences(1),
        message: lorem.generateParagraphs(1),
        created_at: Date.now() - Math.floor(Math.random() * 1000000001),
        resolved: Math.random() > 0.8 ? true : false
    })
}

async function createTables() {
    console.log("Attempting to create database file.")
    try {
        await knexClient.schema
            .createTable('users', (table) => {
                table.string('username').notNullable().unique().primary();
                table.string('name').notNullable()
                table.string('password').notNullable();
                table.boolean('is_admin').defaultTo(false)
            })
            .createTable('user_sessions', (table) => {
                table.string('username').notNullable()
                table.foreign('username').references('users.username');
                table.string('token').notNullable().unique().primary();
                table.timestamp('created_at').notNullable();
                table.timestamp('expires_at').notNullable();
            })
            .createTable('tickets', (table) => {
                table.increments('id').primary()
                table.integer('severity').notNullable()
                table.string('requester').notNullable()
                table.foreign('requester').references('users.username')
                table.string('assignee')
                table.foreign('assignee').references('users.username')
                table.string('title').notNullable()
                table.string('message').notNullable()
                table.boolean('resolved').defaultTo(false)
                table.timestamp('created_at').notNullable()
            })
        
        for await (const user of users) {
            await knexClient('users').insert(user)
        }
        for await (const ticket of tickets) {
            await knexClient('tickets').insert(ticket)
        }

        console.log("Created.")
        process.exit()
    } catch (e) {
        if (e.message.includes('already exists')) {
            console.log("Database file already exists.")
            process.exit()
        } else {
            throw new Error(e)
        }
    }
}

createTables()
