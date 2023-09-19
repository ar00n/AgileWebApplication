"use client"
 
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from "react-hook-form"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { verifySession } from '@/lib/user'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { createTicket } from '@/lib/tickets'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import Error from '@/components/Error'
 
const formSchema = z.object({
  title: z.string().min(0).max(32),
  severity: z.number().min(1).max(5),
  message: z.string().min(0).max(512)
})

export default function CreateTicketForm () {
    const [result, setResult] = useState({})
    const [loggedIn, setLoggedIn] = useState(null)
    const router = useRouter();

    useEffect(() => {
        verifySession().then(res => {
            setLoggedIn(res.success)
        })
    }, [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          severity: 5,
          message: "",
        },
    })

    if (loggedIn == null) {
        return
    }

    if (loggedIn == false) {
        return <Error message="Not logged in." />
    }

    async function onSubmit(values) {
        const res = await createTicket(values)
        setResult(res)
        if (res.success) {
            setTimeout(() => router.push(`/tickets/${res.ticket}`), 2000) 
        }
    }

    return (
        <div className="p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="severity"
                    render={({ field: { value, onChange } }) => (
                        <FormItem>
                            <FormLabel>Severity: {value}</FormLabel>
                            <FormControl>
                                <Slider defaultValue={[5]} max={5} min={1} step={1} inverted={true} x={value} onValueChange={(e) => {onChange(e[0])}} />
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
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea placeholder="shadcn" {...field} />
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
                        <Alert variant={result.success ? 'success' : 'destructive'}>
                            {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
                            <AlertDescription>
                            {result.message}
                            </AlertDescription>
                        </Alert>
                        : ''
                    }
                    <Button type="submit">Create</Button>
                </form>
            </Form>
        </div>
    )
}