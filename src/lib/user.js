'use server'

var crypto = require("crypto");

import { cookies } from 'next/headers'

const { knexClient } = require("./database");

export async function getUser(username) {
    const res = await knexClient.from('users')
        .where('username', username)
        .select('username', 'password')
        .first()

    if(res == null) {
        throw new Error("User does not exist.")
    }

    return res
}

export async function login(username, password) {
    let user;
    try {
        user = await getUser(username)
    } catch (e) {
        return {success: false, message: e.message}
    }

    if (password === user.password) {
        await createSession(user.username)
        return {success: true, message: 'Successful login.'}
    } else {
        return {success: false, message: 'Incorrect password.'}
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
        
        return {success: true, message: "Logged out."}
    } else {
        return {success: false, message: "No session cookies found."}
    }
}

export async function createSession(username) {
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

export async function verifySession() {
    const cookieStore = cookies()
    const username = cookieStore.get('session_username')
    const token = cookieStore.get('session_token')

    if (username && token) {
        const res = await knexClient.from('user_sessions')
            .where('username', username.value)
            .where('token', token.value)
            .first()

        if (!res) {
            return {success: false, message: "User session does not exist."}
        }

        if (Date.now() > res.expires_at) {
            return {success: false, message: "User session has expired."}
        } else {
            return {success: true, message: "User session is valid.", username: res.username}
        }
    } else {
        return {success: false, message: "No session cookies found."}
    }
}