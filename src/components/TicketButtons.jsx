"use client"

import { deleteTicket, setResolved } from "@/lib/tickets";
import { Button } from "./ui/button";
import { useState } from "react";
import AlertBox from "./AlertBox";
import ShowAdmin from "./ShowAdmin";
import DestructiveConfirm from "./DestructiveConfirm";

export default function TicketButtons({data}) {
    const [resolvedState, setResolvedState] = useState(data.ticket.resolved)
    const [result, setResult] = useState()

    async function handleResolve(resolved) {
        const res = await setResolved(data.ticket.id, resolved)

        if (res.success) {
            setResolvedState(resolved)
        } else {
            setResult(res)
        }
    }

    async function handleDelete() {
        const res = await deleteTicket(data.ticket.id)
        setResult(res)

        if (res.success) {
            setTimeout(() => window.location.href = '/tickets', 1500) 
        }
    }

    return (
        <>
        <div className="pt-2 flex px-1">
            {
                resolvedState
                ? <Button onClick={() => handleResolve(false)}>Un-resolve</Button>
                : <Button onClick={() => handleResolve(true)}>Resolve</Button>
            }
            <Button className="ml-1">Edit</Button>
            <ShowAdmin>
                <DestructiveConfirm className="ml-auto" action="delete this ticket." onConfirmClick={() => handleDelete()}>
                    <Button variant="destructive">Delete</Button>
                </DestructiveConfirm>
            </ShowAdmin>
        </div>
        {
            result
            ? <AlertBox result={result} className="place-self-center mt-4" />
            : ''
        }
        </>
    )
}