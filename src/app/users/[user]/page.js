import AlertBox from "@/components/AlertBox";
import UserButtons from "@/components/UserButtons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getUserProfile } from "@/lib/user";
import { CornerRightUp, ShieldCheck, User } from "lucide-react";

export default async function UserProfile({params}) {
    // if(isNaN(Number(params.id))) {
    //     return <div className="absolute w-full grid place-content-center"><AlertBox message="Invalid ticket ID." /></div>
    // } 

    const res = await getUserProfile(params.user)

    if (!res.success) {
        return <div className="absolute w-full grid place-content-center"><AlertBox result={res} /></div>
    }

    return (
        <div className="grid place-content-center sm:mt-16 ">
            <div className="flex">
                {/* {
                    data.ticket.resolved
                    ? <><Check stroke="green" /><p className="text-green-600">Resolved</p></>
                    : <><X stroke="red" /><p className="text-red-500">Unresolved</p></>
                } */}
                <a href="/users" className="flex text-xs items-end ml-auto">view all users<CornerRightUp size={18} /></a>
            </div>
            <div className="mt-2 max-w-2xl grid sm:grid-cols-3 sm:border border-gray-300 rounded-lg shadow-lg">
                <div className="p-4 col-span-2">
                    <div className="flex">
                        <Avatar>
                            <AvatarFallback>{res.user.name.match(/\b(\w)/g).join('')}</AvatarFallback>
                        </Avatar>
                        <h1 className="flex ml-2 text-2xl self-center items-center">{res.user.name}
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        {
                                            res.user.is_admin
                                            ? <ShieldCheck className="ml-1" size={24} stroke="#176f9b" fill="lightblue" />
                                            : <User className="ml-1" size={24} stroke="#176f9b" fill="lightblue" />
                                        }
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>{res.user.is_admin ? 'Admin' : 'User'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </h1>
                    </div>
                    {/* <h3 className="text-xs">{dayjs(data.ticket.created_at).format('L LT')}</h3> */}
                    <p className="pt-2 text-md">@{res.user.username}</p>
                </div>
                <div className="p-4 text-xs space-y-1">
                    {/* <p>Severity: {data.ticket.severity}</p>
                    <p>Requester: {data.ticket.requester}</p> */}
                </div>
            </div>
            <div className="pt-2 px-1 grid place-items-end">
                <UserButtons user={res.user} />
            </div>
        </div>
    )
}