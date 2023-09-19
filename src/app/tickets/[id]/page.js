import Error from "@/components/Error"
import TicketButtons from "@/components/TicketButtons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { getTicket, setResolved } from "@/lib/tickets"
import { AlertCircle, CornerRightUp } from "lucide-react"
import Link from "next/link"
const dayjs = require('dayjs')
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)

export default async function TicketView ({ params }) {
    if(isNaN(Number(params.id))) {
        return <Error message="Invalid ticket ID." />
    }

    const data = await getTicket(params.id)

    if (!data.success) {
        return <Error message={data.message} />
    }

    return (
        <div className="grid place-content-center sm:mt-16 ">
            <Link href="/tickets" className="flex place-self-end text-xs items-end float-right text-right">view all tickets<CornerRightUp size={18} /></Link>
            <div className="mt-2 max-w-2xl grid sm:grid-cols-3 sm:border border-gray-300 rounded-lg shadow-lg">
                <div className="p-4 col-span-2">
                    <h1 className="text-2xl">{data.ticket.title}</h1>
                    <h3 className="text-xs">{dayjs(data.ticket.created_at).format('L LT')}</h3>
                    <p className="pt-2">{data.ticket.message}</p>
                </div>
                <div className="p-4 text-xs">
                    <p>Severity: {data.ticket.severity}</p>
                    <p>Requester: {data.ticket.requester}</p>
                    <p>Assignee: {data.ticket .assignee ? data.assignee : 'N/A'}</p>
                </div>
            </div>
            <TicketButtons data={data} />
        </div>
    )
}