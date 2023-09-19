import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function Error ({message}) {
    return (
        <div className="absolute w-full grid place-content-center">
            <Alert variant='destructive' className="h-auto w-64 mt-16">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                {message}
                </AlertDescription>
            </Alert>
        </div>
    )
}