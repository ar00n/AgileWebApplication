import Error from "@/components/Error"
import TicketTable from "@/components/TicketTable"
import { getTickets } from "@/lib/tickets"

export default async function Tickets() {
    const data = await getTickets()

    if (!data.success) {
      return <Error message={data.message} />
    }

    return (
        <TicketTable data={data.tickets} />
    )
}