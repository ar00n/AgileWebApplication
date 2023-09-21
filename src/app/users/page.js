export const dynamic = 'force-dynamic'

import AlertBox from "@/components/AlertBox"
import UserTable from "@/components/UserTable"
import { getUserProfiles } from "@/lib/user"

export default async function Users() {
    const data = await getUserProfiles()

    if (!data.success) {
      return (
        <div className="absolute w-full grid place-content-center">
          <AlertBox result={data} />
        </div>
      )
    }

    return (
        <UserTable data={data.users} />
    )
}