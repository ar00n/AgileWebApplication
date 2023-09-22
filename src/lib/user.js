'use server'

const argon2 = require('argon2');
var crypto = require("crypto");

import { cookies } from 'next/headers'
import { logEvent } from './logging';

const { knexClient } = require("./database");

export async function getUser(username) {
    const res = await knexClient.from('users')
        .where('username', username)
        .select('username', 'passwordHash')
        .first()

    if(res == null) {
        throw new Error("User does not exist.")
    }

    return res
}

export async function getUserProfile(username) {
    if(!(await getSessionUser()).success) {
        return logEvent({success: false, action:"getUserProfile",  message: "Not logged in."}, username)
    }

    try {
        const res = await knexClient.from('users')
            .where('username', username)
            .select('username', 'name', 'is_admin')
            .first()

        if(!res) {
            return logEvent({success: false, action:"getUserProfile", message: "User does not exist."}, username)
        }

        return logEvent({success: true, action:"getUserProfile", user: res}, username)
    } catch (e) {
        return logEvent({success: false, action:"getUserProfile", message: e.message}, username)
    }
}

export async function getUserProfiles() {
    if(!(await getSessionUser()).success) {
        return logEvent({success: false, action: 'getUserProfiles', message: "Not logged in."})
    }

    try {
        const res = await knexClient.from('users')
            .select('username', 'name', 'is_admin')

        if(!res) {
            return logEvent({success: false, action: 'getUserProfiles', message: "Users do not exist."})
        }

        return logEvent({success: true, action: 'getUserProfiles', users: res})
    } catch (e) {
        return logEvent({success: false, message: e.message})
    }
}

export async function login(username, password) {
    let user;
    try {
        user = await getUser(username)

        if (await argon2.verify(user.passwordHash, password)) {
            await createSession(user.username)
            return logEvent({success: true, action: 'login', message: 'Successful login.'}, username)
        } else {
            return logEvent({success: false, action: 'login', message: 'Incorrect password.'}, username)
        }
    } catch (e) {
        return logEvent({success: false, action: 'login', message: e.message}, username)
    }
}

export async function register(username, name, password) {
    try {
        await knexClient('users')
            .insert({
                username: username,
                name: name,
                passwordHash: await argon2.hash(password),
            })

        return logEvent({success: true, action: 'register', message: "Account created."}, username)
    } catch (e) {
        if (e.code == "SQLITE_CONSTRAINT")
            return logEvent({success: false, action: 'register', message: "Username already exists."}, username)

        return logEvent({success: false, action: 'register', message: e.code}, username)
    }
}

export async function logout() {
    const cookieStore = cookies()
    const username = cookieStore.get('session_username')
    const token = cookieStore.get('session_token')

    if (username && token) {
        const res = await knexClient.from('user_sessions')
            .where('username', username.value)
            .where('token', token.value)
            .del()

        if (!res) {
            return logEvent({success: false, action: 'logout', message: "User session does not exist."})
        }

        cookies().delete('session_username')
        cookies().delete('session_token')

        return logEvent({success: true, action: 'logout', message: "Logged out."})
    } else {
        return logEvent({success: false, action: 'logout', message: "No session cookies found."})
    }
}

async function createSession(username) {
    const token = crypto.randomBytes(128).toString('hex');

    const oneDay = 24 * 60 * 60 * 1000
    const timeNow = Date.now()
    const expires = timeNow + oneDay

    await knexClient('user_sessions')
    .insert({
        username: username,
        token: token,
        created_at: Date.now(),
        expires_at: expires
    })

    cookies().set('session_username', username, {expires: expires })
    cookies().set('session_token', token, {expires: expires })
    
    logEvent({success: true, action: 'createSession', message: 'Created session.'}, username)
}

export async function getSessionUser() {
    const cookieStore = cookies()
    const username = cookieStore.get('session_username')
    const token = cookieStore.get('session_token')

    if (username && token) {
        const res = await knexClient.from('user_sessions')
            .where('user_sessions.token', token.value)
            .where('user_sessions.username', username.value)
            .join('users', {'user_sessions.username': 'users.username'})

            .first()

        if (!res) {
            return logEvent({success: false, action: 'getSessionUser', message: "User session does not exist."})
        }

        if (Date.now() > res.expires_at) {
            return logEvent({success: false, action: 'getSessionUser', message: "User session has expired."})
        } else {
            return {success: true, action: 'getSessionUser', message: "User session is valid.", username: res.username, isAdmin: res.is_admin}
        }
    } else {
        return logEvent({success: false, action: 'getSessionUser', message: "No session cookies found."})
    }
}

export async function setAdmin(username, admin) {
    if(!(await getSessionUser())?.isAdmin) {
        return logEvent({success: false, action: 'setAdmin', message: "Only admins can set roles."}, username)
    }

    try {
        const res = await knexClient.from('users')
            .where({username: username})
            .first()
            .update({is_admin: admin})

        if (!res) {
            return logEvent({success: false, action: 'setAdmin', message: "User not found."}, username)
        } else {
            return logEvent({success: true, action: 'setAdmin', user: username}, username)
        }
    } catch (e) {
        return logEvent({success: false, action: 'setAdmin', message: e.message}, username)
    }
}