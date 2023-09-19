'use server'

import { verifySession } from "./user";

const { knexClient } = require("./database");

export async function getTickets(page, limit) {
    if(!(await verifySession()).success) {
        return {success: false, message: "Not logged in."}
    }

    const offset = (page - 1) * limit

    try {
        const res = await knexClient.from('tickets')
            .offset(offset)
            .limit(limit)
        
        return {success: true, tickets: res}
    } catch (e) {
        return {success: false, message: e.message}
    }
}

export async function getTicket(id) {
    if(!(await verifySession()).success) {
        return {success: false, message: "Not logged in."}
    }

    const res = await knexClient.from('tickets')
        .where({id: id})
        .first()

    if (!res) {
        return {success: false, message: "Ticket not found."}
    } else {
        return {success: true, ticket: res}
    }
}

export async function createTicket({severity, title, message}) {
    const { success: sessionCheck, username } = await verifySession()
    if (!sessionCheck) {
        return {success: false, message: "Not logged in."}
    }

    try {
        const res = await knexClient('tickets')
            .insert({
                severity: severity,
                requester: username,
                title: title,
                message: message,
                created_at: Date.now()
            })

        if (res) {
            return {success: true, message: 'Ticket created.', ticket: res[0]}
        } else {
            return {success: false, message: 'Failed to create ticket.'}
        }
    } catch (e) {
        return {success: false, message: e.message}
    }
}

// export async function deleteTicket(id) {
//     const { success: sessionCheck, username } = await verifySession()
//     if (!sessionCheck) {
//         return {success: false, message: "Not logged in."}
//     }

//     try {
//         const res = await knexClient('tickets')
//             .insert({
//                 severity: severity,
//                 requester: username,
//                 title: title,
//                 message: message,
//                 created_at: Date.now()
//             })

//         if (res) {
//             return {success: true, message: 'Ticket created.', ticket: res[0]}
//         } else {
//             return {success: false, message: 'Failed to create ticket.'}
//         }
//     } catch (e) {
//         return {success: false, message: e.message}
//     }
// }