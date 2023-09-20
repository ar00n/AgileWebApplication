import AssigneeEdit from "@/components/AssigneeEdit"
import AlertBox from "@/components/AlertBox"
import TicketButtons from "@/components/TicketButtons"
import { getTicket } from "@/lib/tickets"
import { Check, CornerRightUp, X } from "lucide-react"
import Link from "next/link"
const dayjs = require('dayjs')
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)

export default async function TicketView ({ params }) {
    if(isNaN(Number(params.id))) {
        return <div className="absolute w-full grid place-content-center"><AlertBox message="Invalid ticket ID." /></div>
    } 

    const data = await getTicket(params.id)

    if (!data.success) {
        return <div className="absolute w-full grid place-content-center"><AlertBox result={data} /></div>
    }

    return (
        <div className="grid place-content-center sm:mt-16 ">
            <div className="flex">
                {
                    data.ticket.resolved
                    ? <><Check stroke="green" /><p className="text-green-600">Resolved</p></>
                    : <><X stroke="red" /><p className="text-red-500">Unresolved</p></>
                }
                <Link href="/tickets" className="flex text-xs items-end ml-auto">view all tickets<CornerRightUp size={18} /></Link>
            </div>
            <div className="mt-2 max-w-2xl grid sm:grid-cols-3 sm:border border-gray-300 rounded-lg shadow-lg">
                <div className="p-4 col-span-2">
                    <h1 className="text-2xl">{data.ticket.title}</h1>
                    <h3 className="text-xs">{dayjs(data.ticket.created_at).format('L LT')}</h3>
                    <p className="pt-2">{data.ticket.message}</p>
                </div>
                <div className="p-4 text-xs space-y-1">
                    <p>Severity: {data.ticket.severity}</p>
                    <p>Requester: {data.ticket.requester}</p>
                    <AssigneeEdit ticketId={data.ticket.id} assignee={data.ticket.assignee} />
                </div>
            </div>
            <TicketButtons data={data} />
        </div>
    )
}