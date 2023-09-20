"use client"

import Link from "next/link"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
  } from "@/components/ui/navigation-menu"
import { usePathname } from "next/navigation"
import { logout, getSessionUser } from "@/lib/user"
import { useEffect, useState } from "react"
import { User } from "lucide-react"
import { Button } from "./ui/button"

const pages = [
    {
        name: "Home",
        href: "/"
    },
    {
        name: "Tickets",
        href: "/tickets"
    },
]

function UserSection() {
    const [userResult, setUserResult] = useState({})

    useEffect(() => {
        if (userResult.success == null) {
            getSessionUser().then(res => setUserResult(res))
        }
    }, []);
    

    async function handleLogout() {
        const res = await logout()

        if (res.success) {
            setTimeout(() => window.location.href = '/', 1500) 
        }
    }

    if (userResult.username) {
        return (
            <NavigationMenuItem>
                <NavigationMenuTrigger>{userResult.username} <User /></NavigationMenuTrigger>
                <NavigationMenuContent>
                    <Button variant="destructive" onClick={() => handleLogout()}>Logout</Button>
                </NavigationMenuContent>
            </NavigationMenuItem>
        )
    } else if (userResult.success == false) {
        return (
            <div className="space-x-2">
                <Link href="/register"><Button variant="secondary">Register</Button></Link>
                <Link href="/login"><Button>Login</Button></Link>
            </div>
        )
    }
}

export default function Navbar() {
    const pathname = usePathname()

    return (
        <div className="p-2 w-full shadow-lg flex list-none">
            <div>
                <NavigationMenu>
                    <h1 className="text-xl mr-6 border border-gray-400 rounded-md p-2">TicketCut</h1>
                    {
                        pages.map(page =>
                            <NavigationMenuItem key={page.href}>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()} href={page.href}>
                                        <span className={page.href == pathname ? ' text-black' : ' text-gray-400 hover:text-black'}>
                                            {page.name}
                                        </span>
                                    </NavigationMenuLink>
                            </NavigationMenuItem>
                        )
                    }
                </NavigationMenu>
            </div>
            <div className="ml-auto">
                <NavigationMenu>
                    <UserSection />
                </NavigationMenu>
            </div>
        </div>
    )
}