'use server'

import { logEvent } from "./logging";
import { getUser, getSessionUser } from "./user";

const { knexClient } = require("./database");

export async function getTickets() {
    if(!(await getSessionUser()).success) {
        return logEvent({success: false, action: 'getTickets', message: "Not logged in."})
    }

    try {
        const res = await knexClient.from('tickets')
            .orderBy('created_at', 'desc')
        
        return logEvent({success: true, action: 'getTickets', tickets: res})
    } catch (e) {
        return logEvent({success: false, action: 'getTickets', message: e.message})
    }
}

export async function getTicket(id) {
    if(!(await getSessionUser()).success) {
        return logEvent({success: false, action: 'getTicket', message: "Not logged in."}, id)
    }

    try {
        const res = await knexClient.from('tickets')
            .where({id: id})
            .first()

        if (!res) {
            return logEvent({success: false, action: 'getTicket', message: "Ticket not found."}, id)
        } else {
            return logEvent({success: true, action: 'getTicket', ticket: res}, id)
        }
    } catch (e) {
        return logEvent({success: false, action: 'getTicket', message: e.message}, id)
    }
}

export async function createTicket({severity, title, message}) {
    const { success: sessionCheck, username } = await getSessionUser()
    if (!sessionCheck) {
        return logEvent({success: false, action: 'createTicket', message: "Not logged in."})
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
            return logEvent({success: true, action: 'createTicket', message: 'Ticket created.', ticket: res[0]})
        } else {
            return logEvent({success: false, action: 'createTicket', message: 'Failed to create ticket.'})
        }
    } catch (e) {
        return logEvent({success: false, action: 'createTicket', message: e.message})
    }
}

export async function editTicket(id, values) {
    const { success: sessionCheck } = await getSessionUser()
    if (!sessionCheck) {
        return logEvent({success: false, action: 'editTicket', message: "Not logged in."}, id)
    }

    try {
        await getUser(values.requester)
    } catch (e) {
        return logEvent({success: false, action: 'editTicket', message: e.message}, id)
    }

    try {
        const res = await knexClient('tickets')
            .where({id: id})
            .update({
                severity: values.severity,
                requester: values.requester,
                title: values.title,
                message: values.message
            })

        if (res) {
            return logEvent({success: true, action: 'editTicket', message: 'Ticket modified.', ticket: res[0]}, id)
        } else {
            return logEvent({success: false, action: 'editTicket', message: 'Failed to create ticket.'}, id)
        }
    } catch (e) {
        return logEvent({success: false, action: 'editTicket', message: e.message}, id)
    }
}

export async function deleteTicket(id) {
    if(!(await getSessionUser())?.isAdmin) {
        return logEvent({success: false, action: 'deleteTicket', message: "Only admins can delete tickets."}, id)
    }

    try {
        const res = await knexClient.from('tickets')
            .where({id: id})
            .first()
            .del()

        if (!res) {
            return logEvent({success: false, action: 'deleteTicket', message: "Ticket not found."}, id)
        } else {
            return logEvent({success: true, action: 'deleteTicket', message: "Ticket deleted."}, id)
        }
    } catch (e) {
        return logEvent({success: false, action: 'deleteTicket', message: e.message}, id)
    }
}

export async function setResolved(id, resolved) {
    if(!(await getSessionUser()).success) {
        return logEvent({success: false, action: 'setResolved', message: "Not logged in."}, id)
    }

    try {
        const res = await knexClient.from('tickets')
            .where({id: id})
            .first()
            .update({resolved: resolved})

        if (!res) {
            return logEvent({success: false, action: 'setResolved', message: "Ticket not found."}, id)
        } else {
            return logEvent({success: true, action: 'setResolved'}, id)
        }
    } catch (e) {
        return logEvent({success: false, action: 'setResolved', message: e.message}, id)
    }
}

export async function setAssignee(id, assignee) {
    if(!(await getSessionUser()).success) {
        return logEvent({success: false, action: 'setAssignee', message: "Not logged in."}, {ticket: id, assignee})
    }

    if (assignee !== null) {
        try {
            await getUser(assignee)
        } catch (e) {
            return logEvent({success: false, action: 'setAssignee', message: e.message}, {ticket: id, assignee})
        }
    }

    try {
        const res = await knexClient.from('tickets')
            .where({id: id})
            .first()
            .update({assignee: assignee})
 
        if (!res) {
            return logEvent({success: false, action: 'setAssignee', message: "Ticket not found."}, {ticket: id, assignee})
        } else {
            return logEvent({success: true, action: 'setAssignee'}, {ticket: id, assignee})
        }
    } catch (e) {
        return logEvent({success: false, action: 'setAssignee', message: e.message}, {ticket: id, assignee})
    }
}