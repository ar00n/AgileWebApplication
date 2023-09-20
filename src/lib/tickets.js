'use server'

import { getUser, getSessionUser } from "./user";

const { knexClient } = require("./database");

export async function getTickets() {
    if(!(await getSessionUser()).success) {
        return {success: false, message: "Not logged in."}
    }

    try {
        const res = await knexClient.from('tickets')
            .orderBy('created_at', 'desc')
        
        return {success: true, tickets: res}
    } catch (e) {
        return {success: false, message: e.message}
    }
}

export async function getTicket(id) {
    if(!(await getSessionUser()).success) {
        return {success: false, message: "Not logged in."}
    }

    try {
        const res = await knexClient.from('tickets')
            .where({id: id})
            .first()

        if (!res) {
            return {success: false, message: "Ticket not found."}
        } else {
            return {success: true, ticket: res}
        }
    } catch (e) {
        return {success: false, message: e.message}
    }
}

export async function createTicket({severity, title, message}) {
    const { success: sessionCheck, username } = await getSessionUser()
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

export async function deleteTicket(id) {
    if(!(await getSessionUser())?.isAdmin) {
        return {success: false, message: "Only admins can delete tickets."}
    }

    try {
        const res = await knexClient.from('tickets')
            .where({id: id})
            .first()
            .del()

        if (!res) {
            return {success: false, message: "Ticket not found."}
        } else {
            return {success: true, message: "Ticket deleted."}
        }
    } catch (e) {
        return {success: false, message: e.message}
    }
}

export async function setResolved(id, resolved) {
    if(!(await getSessionUser()).success) {
        return {success: false, message: "Not logged in."}
    }

    try {
        const res = await knexClient.from('tickets')
            .where({id: id})
            .first()
            .update({resolved: resolved})

        if (!res) {
            return {success: false, message: "Ticket not found."}
        } else {
            return {success: true}
        }
    } catch (e) {
        return {success: false, message: e.message}
    }
}

export async function setAssignee(id, assignee) {
    if(!(await getSessionUser()).success) {
        return {success: false, message: "Not logged in."}
    }

    if (assignee !== null) {
        try {
            await getUser(assignee)
        } catch (e) {
            return {success: false, message: e.message}
        }
    }

    try {
        const res = await knexClient.from('tickets')
            .where({id: id})
            .first()
            .update({assignee: assignee})
 
        if (!res) {
            return {success: false, message: "Ticket not found."}
        } else {
            return {success: true}
        }
    } catch (e) {
        return {success: false, message: e.message}
    }
}