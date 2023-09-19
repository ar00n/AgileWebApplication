"use client"

import { setResolved } from "@/lib/tickets";
import { Button } from "./ui/button";
import { useState } from "react";
import Error from "./Error";

export default function TicketButtons({data}) {
    const [resolvedState, setResolvedState] = useState(data.ticket.resolved)
    const [error, setError] = useState()

    async function handleResolve(resolved) {
        const res = await setResolved(data.ticket.id, resolved)

        if (res.success) {
            setResolvedState(resolved)
        } else {
            setError(res.message)
        }
    }

    return (
        <div className="pt-2 flex px-1">
            {
                resolvedState
                ? <Button onClick={() => handleResolve(false)}>Un-resolve</Button>
                : <Button onClick={() => handleResolve(true)}>Resolve</Button>
            }
            <Button className="ml-1">Edit</Button>                
            <Button className="ml-auto" variant="destructive">Delete</Button>
            {
                error
                ? <Error message={error} />
                : ''
            }
        </div>
    )
}