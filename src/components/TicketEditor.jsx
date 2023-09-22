'use client'

import React, { useState } from 'react'

import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { editTicket } from '@/lib/tickets'
import AlertBox from '@/components/AlertBox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

const formSchema = z.object({
  title: z.string().min(1).max(64),
  requester: z.string().min(2).max(32),
  severity: z.number().min(1).max(5),
  message: z.string().min(0).max(512)
})

export default function TicketEditor ({ ticket, ...props }) {
  const [result, setResult] = useState()
  const [open, setOpen] = useState()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ticket.title,
      requester: ticket.requester,
      severity: ticket.severity,
      message: ticket.message
    }
  })

  async function onSubmit (values) {
    const res = await editTicket(ticket.id, values)
    setResult(res)
    if (res.success) {
      setTimeout(() => location.reload(), 1000)
    }
  }

  return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild {...props}>
                <Button>Edit</Button>
            </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            Edit Ticket
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="requester"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Requester</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Requester" {...field} />
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
                                        <Slider defaultValue={[ticket.severity]} max={5} min={1} step={1} inverted={true} x={value} onValueChange={(e) => { onChange(e[0]) }} />
                                    </FormControl>
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
                                        <Textarea placeholder="Message" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            {
                                result
                                  ? <AlertBox result={result} />
                                  : ''
                            }
                            <Button type="submit" className="float-right">Confirm</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
  )
}
