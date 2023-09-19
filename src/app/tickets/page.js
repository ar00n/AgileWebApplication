import TicketTable from "@/components/TicketTable"
import { getTickets } from "@/lib/tickets"

export default async function Tickets() {
    const data = await getTickets(1, 10)

    if (!data.success) {
      return <a>Error: {data.message}</a>
    }

    return (
        <TicketTable data={data.tickets} />
    )
}