"use client"

import { AlertCircle, CheckCircle2, PencilLine } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { setAssignee } from "@/lib/tickets";
import AlertBox from "./AlertBox";

const formSchema = z.object({
    assignee: z.string().min(2).max(32)
})

export default function AssigneeEdit({ticketId, assignee}) {
    const [result, setResult] = useState()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            assignee: ""
        },
    })

    async function onSubmit(values) {
        console.log(values)
        const res = await setAssignee(ticketId, values.assignee)
        setResult(res)


    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <p className="flex">Assignee: {assignee ? assignee : 'N/A'} <PencilLine size={18} stroke="gray" className="hover:stroke-black ml-1" /></p>
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
                            <Input {...field} />
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
                    <Button type="submit" className="float-right">Set Assignee</Button>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
    )
}