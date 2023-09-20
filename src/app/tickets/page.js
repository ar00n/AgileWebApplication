import AlertBox from "@/components/AlertBox"
import TicketTable from "@/components/TicketTable"
import { getTickets } from "@/lib/tickets"

export default async function Tickets() {
    const data = await getTickets()

    if (!data.success) {
      return (
        <div className="absolute w-full grid place-content-center">
          <AlertBox result={data} />
        </div>
      )
    }

    return (
        <TicketTable data={data.tickets} />
    )
}