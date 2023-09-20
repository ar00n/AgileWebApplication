"use client"
 
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from "react-hook-form"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { login, getSessionUser, register } from '@/lib/user'
import AlertBox from '@/components/AlertBox'
 
const formSchema = z.object({
  username: z.string().min(2).max(32),
  name: z.string().min(2).max(32),
  password: z.string().min(8).max(32)
})

export default function RegisterForm () {
    const [result, setResult] = useState()
    const router = useRouter();

    useEffect(() => {
        getSessionUser().then(res => {
            if (res.success) {
                router.push('/')
            }
        })
    }, [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          name: "",
          password: ""
        },
    })

    async function onSubmit(values) {
        const res = await register(values.username, values.name, values.password)
        setResult(res)
        if (res.success) {
            setTimeout(() => window.location.href = '/login', 1500) 
        }
    }

    return (
        <div className='p-6'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="jdoe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    {
                        result ?
                        <AlertBox result={result} />
                        : ''
                    }
                    <Button type="submit">Register</Button>
                </form>
            </Form>
        </div>
    )
}