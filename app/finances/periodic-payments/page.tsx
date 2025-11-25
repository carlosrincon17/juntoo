import { getPeriodicPayments } from "@/app/actions/periodic-payments"
import PeriodicPaymentsView from "./components/periodic-payments-view"

export const dynamic = 'force-dynamic'

export default async function PeriodicPaymentsPage() {
    const payments = await getPeriodicPayments()

    return (
        <div className="p-6">
            <PeriodicPaymentsView payments={payments} />
        </div>
    )
}
