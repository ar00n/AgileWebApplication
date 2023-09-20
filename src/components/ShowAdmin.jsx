import { getSessionUser } from "@/lib/user";
import { useEffect, useState } from "react";

export default function ShowAdmin({children}) {
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        getSessionUser().then(res => setIsAdmin(res?.isAdmin))
    }, [])
    
    if(isAdmin) return children

    return
}