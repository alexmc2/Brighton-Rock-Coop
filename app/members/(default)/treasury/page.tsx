import { Metadata } from 'next';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/members/ui/tabs';
import MonthlyBookkeeping from './monthly-bookkeeping';
import AnnualAccounts from './annual-accounts';
import AnnualBudgeting from './annual-budgeting';
import ExpenseClaims from './expense-claims';

export const metadata: Metadata = {
  title: 'Treasury - Brighton Rock Housing Co-op',
  description: 'Manage co-op finances and budgeting',
};

export default function TreasuryPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold flex items-center gap-3">
          Treasury 💷
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Manage co-op finances, budgeting, and expense claims
        </p>
      </div>

      <Tabs defaultValue="bookkeeping" className="space-y-6">
        <div className="mb-4 sm:mb-0">
          <TabsList className="w-full h-full grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <TabsTrigger
              value="bookkeeping"
              className="text-sm whitespace-normal h-14 sm:h-10 px-2 py-1.5 data-[state=active]:text-slate-900"
            >
              Monthly Bookkeeping
            </TabsTrigger>
            <TabsTrigger
              value="accounts"
              className="text-sm whitespace-normal h-14 sm:h-10 px-2 py-1.5 data-[state=active]:text-slate-900"
            >
              Annual Accounts
            </TabsTrigger>
            <TabsTrigger
              value="budgeting"
              className="text-sm whitespace-normal h-14 sm:h-10 px-2 py-1.5 data-[state=active]:text-slate-900"
            >
              Annual Budgeting
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="text-sm whitespace-normal h-14 sm:h-10 px-2 py-1.5 data-[state=active]:text-slate-900"
            >
              Expense Claims
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bookkeeping" className="mt-6">
          <MonthlyBookkeeping />
        </TabsContent>

        <TabsContent value="accounts" className="mt-6">
          <AnnualAccounts />
        </TabsContent>

        <TabsContent value="budgeting" className="mt-6">
          <AnnualBudgeting />
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <ExpenseClaims />
        </TabsContent>
      </Tabs>
    </div>
  );
}
