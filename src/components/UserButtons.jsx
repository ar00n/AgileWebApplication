"use client"

import { setAdmin } from "@/lib/user"
import DestructiveConfirm from "./DestructiveConfirm"
import ShowAdmin from "./ShowAdmin"
import { Button } from "./ui/button"
import { useState } from "react"
import AlertBox from "./AlertBox"

export default function UserButtons({user}) {
    const [res, setRes] = useState()

    async function handleAdmin() {
        const res = await setAdmin(user.username, !user.is_admin)

        if (res.success) {
            location.reload()
        } else {
            setRes(res)
        }
    }
    
    return (
        <>
        <ShowAdmin>
            <DestructiveConfirm action={user.is_admin ? 'remove Admin from this user.' : 'make this user an Admin.'} onConfirmClick={() => handleAdmin()}>
                <Button variant="destructive">{user.is_admin ? 'Remove Admin' : 'Make Admin'}</Button>
            </DestructiveConfirm>
        </ShowAdmin>
        {
            res && !res.success
            ? <AlertBox result={res} className="place-self-center mt-4" />
            : ''
        }
        </>
    )
}