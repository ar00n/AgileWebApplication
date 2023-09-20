"use client"

import { deleteTicket, setResolved } from "@/lib/tickets";
import { Button } from "./ui/button";
import { useState } from "react";
import AlertBox from "./AlertBox";
import ShowAdmin from "./ShowAdmin";
import DestructiveConfirm from "./DestructiveConfirm";
import TicketEditor from "./TicketEditor";

export default function TicketButtons({data}) {
    const [result, setResult] = useState()

    async function handleResolve(resolved) {
        const res = await setResolved(data.ticket.id, resolved)

        if (res.success) {
            location.reload()
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
                data.ticket.resolved
                ? <Button onClick={() => handleResolve(false)}>Un-resolve</Button>
                : <Button onClick={() => handleResolve(true)}>Resolve</Button>
            }
            <TicketEditor ticket={data.ticket} className="ml-1" />
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