import Link from 'next/link'

export default function Home () {
  return (
    <main className="flex flex-col items-center justify-between p-24">

      <div className="">
        <h1 className="text-5xl mb-4">TicketCut 2.0</h1>
        <p>A demonstration ticketing website made for a university assignment.</p>
        <br></br>
        <p>Please <Link href="/login"><u>login</u></Link> or <Link href="/register"><u>register</u></Link></p>
      </div>

    </main>
  )
}
