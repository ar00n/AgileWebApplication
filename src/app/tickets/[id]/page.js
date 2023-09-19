import { getTicket } from "@/lib/tickets"
const dayjs = require('dayjs')
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)

export default async function TicketView ({ params }) {
    if(isNaN(Number(params.id))) {
        return <a>Invalid ticket ID.</a>
    }

    const data = await getTicket(params.id)

    if (!data.success) {
        return <a>{data.message}</a>
    }

    return (
        <div>
            <h1 className="text-2xl">{data.ticket.title}</h1>
            <h3 className="text-xs">{dayjs(data.ticket.created_at).format('L LT')}</h3>
            <p className="pt-2">{data.ticket.message}</p>

            <p>Severity: {data.ticket.severity}</p>
            <p>Requester: {data.ticket.requester}</p>
            <p>Assignee: {data.ticket .assignee ? data.assignee : 'N/A'}</p>
        </div>
    )
}