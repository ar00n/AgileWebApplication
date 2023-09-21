'use server'

const argon2 = require('argon2');
var crypto = require("crypto");

import { cookies } from 'next/headers'

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
        return {success: false, message: "Not logged in."}
    }

    try {
        const res = await knexClient.from('users')
            .where('username', username)
            .select('username', 'name', 'is_admin')
            .first()

        if(!res) {
            return {success: false, message: "User does not exist."}
        }

        return {success: true, user: res}
    } catch (e) {
        return {success: false, message: e.message}
    }
}

export async function getUserProfiles() {
    if(!(await getSessionUser()).success) {
        return {success: false, message: "Not logged in."}
    }

    try {
        const res = await knexClient.from('users')
            .select('username', 'name', 'is_admin')

        if(!res) {
            return {success: false, message: "Users do not exist."}
        }

        return {success: true, users: res}
    } catch (e) {
        return {success: false, message: e.message}
    }
}

export async function login(username, password) {
    let user;
    try {
        user = await getUser(username)

        if (await argon2.verify(user.passwordHash, password)) {
            await createSession(user.username)
            return {success: true, message: 'Successful login.'}
        } else {
            return {success: false, message: 'Incorrect password.'}
        }
    } catch (e) {
        return {success: false, message: e.message}
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

        return {success: true, message: "Account created."}
    } catch (e) {
        if (e.code == "SQLITE_CONSTRAINT")
            return {success: false, message: "Username already exists."}

        return {success: false, message: e.code}
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
            return {success: false, message: "User session does not exist."}
        }

        cookies().delete('session_username')
        cookies().delete('session_token')

        return {success: true, message: "Logged out."}
    } else {
        return {success: false, message: "No session cookies found."}
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
            return {success: false, message: "User session does not exist."}
        }

        if (Date.now() > res.expires_at) {
            return {success: false, message: "User session has expired."}
        } else {
            return {success: true, message: "User session is valid.", username: res.username, isAdmin: res.is_admin}
        }
    } else {
        return {success: false, message: "No session cookies found."}
    }
}

export async function setAdmin(username, admin) {
    if(!(await getSessionUser())?.isAdmin) {
        return {success: false, message: "Only admins can set roles."}
    }

    try {
        const res = await knexClient.from('users')
            .where({username: username})
            .first()
            .update({is_admin: admin})

        if (!res) {
            return {success: false, message: "User not found."}
        } else {
            return {success: true}
        }
    } catch (e) {
        return {success: false, message: e.message}
    }
}