"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { AlertCircle } from "lucide-react"

export default function DestructiveConfirm({children, action, onConfirmClick, ...props}) {
    const [open, setOpen] = useState(false)

    function handleClick(e) {
        e.stopPropagation()

        setOpen(true)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex place-self-center items-center text-red-600">
                            <AlertCircle stroke="red" className="h-6 w-6 mr-1" />
                            Warning!
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            You are about to {action}
                        </DialogDescription>
                    </DialogHeader>
                    <Button type="submit" variant="destructive" className="place-self-center max-w-max" onClick={() => {setOpen(false); onConfirmClick()}}>Confirm</Button>
                </DialogContent>
            </Dialog>
            <div {...props} onClick={handleClick}>
                {children}
            </div>
        </>
    )
}