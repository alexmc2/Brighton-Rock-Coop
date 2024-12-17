import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Secretary - Brighton Rock Housing Co-op',
  description: 'Manage meetings, minutes, and communications',
}

export default function SecretaryPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Secretary 📋</h1>
      </div>

      {/* Placeholder content */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-sm p-6">
        <div className="text-slate-800 dark:text-slate-100">
          Secretary management features coming soon...
        </div>
      </div>
    </div>
  )
} 