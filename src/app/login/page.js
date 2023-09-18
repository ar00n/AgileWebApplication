"use client"
 
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from "react-hook-form"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { login, verifySession } from '@/lib/user'
 
const formSchema = z.object({
  username: z.string().min(2).max(32),
  password: z.string().min(8).max(32)
})

export default function LoginForm () {
    const [result, setResult] = useState({})
    const router = useRouter();

    useEffect(() => {
        verifySession().then(res => {
            if (res.success) {
                router.push('/')
            }
        })
    }, [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          password: ""
        },
    })

    async function onSubmit(values) {
        const res = await login(values.username, values.password)
        setResult(res)
        if (res.success) {
            setTimeout(() => router.push('/'), 2000) 
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                        This is your public display name.
                    </FormDescription>
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
                        <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                        This is your public display name.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                {
                    result.success != null ?
                    <Alert variant={result.success ? 'success' : 'destructive'}>{result.message}</Alert>
                    : ''
                }
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}