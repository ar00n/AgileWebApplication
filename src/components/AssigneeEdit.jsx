'use client'

import { PencilLine } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { setAssignee } from '@/lib/tickets'
import AlertBox from './AlertBox'

const formSchema = z.object({
  assignee: z.string().min(2).max(32)
})

export default function AssigneeEdit ({ ticketId, assignee }) {
  const [result, setResult] = useState()
  const [open, setOpen] = useState()
  const [displayedAssignee, setDisplayedAssignee] = useState(assignee)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignee: ''
    }
  })

  async function onSubmit (values) {
    const res = await setAssignee(ticketId, values.assignee)
    if (res.success) {
      setDisplayedAssignee(values.assignee)
      setOpen(false)
    } else {
      setResult(res)
    }
  }

  async function onRemoveSubmit (e) {
    e.preventDefault()
    const res = await setAssignee(ticketId, null)

    if (res.success) {
      setDisplayedAssignee(null)
      setOpen(false)
    } else {
      setResult(res)
    }
  }

  return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p className="flex">Assignee: {displayedAssignee || 'N/A'} <PencilLine size={18} stroke="gray" className="hover:stroke-black ml-1" /></p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Set Assignee</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="assignee"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder={displayedAssignee} {...field} />
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
                    <Button onClick={(e) => onRemoveSubmit(e)} variant="destructive">Remove Assignee</Button>
                    <Button type="submit" className="float-right">Set Assignee</Button>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
  )
}
