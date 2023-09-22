import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

export default function AlertBox ({ result, ...props }) {
  return (
        <Alert variant={result.success ? 'success' : 'destructive'} className="h-auto w-64 mt-16" {...props}>
            {
                result.success
                  ? <CheckCircle2 stroke="green" className="h-4 w-4" />
                  : <AlertCircle className="h-4 w-4" />
            }
            <AlertTitle>{result.success ? ' Success' : 'Error'}</AlertTitle>
            <AlertDescription>
            {result.message}
            </AlertDescription>
        </Alert>
  )
}
