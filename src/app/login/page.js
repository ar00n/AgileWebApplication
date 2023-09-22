'use client'

import React, { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login, getSessionUser } from '@/lib/user'
import AlertBox from '@/components/AlertBox'

const formSchema = z.object({
  username: z.string().min(2).max(32),
  password: z.string().min(8).max(32)
})

export default function LoginForm () {
  const [result, setResult] = useState()
  const [loggedIn, setLoggedIn] = useState()

  useEffect(() => {
    getSessionUser().then(res => {
      setLoggedIn(res.success)
      if (res.success) {
        setTimeout(() => (window.location.href = '/'), 1500)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  async function onSubmit (values) {
    const res = await login(values.username, values.password)
    setResult(res)
    if (res.success) {
      setTimeout(() => (window.location.href = '/'), 1500)
    }
  }

  if (loggedIn === undefined) {
    return
  }

  return loggedIn && result == null
    ? <div className="absolute w-full grid place-content-center">
                <AlertBox result={{ success: false, message: 'Already logged in.' }} />
                </div>
    : <div className='p-6'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="username"
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
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
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
                        <Button type="submit">Login</Button>
                    </form>
                </Form>
            </div>
}
