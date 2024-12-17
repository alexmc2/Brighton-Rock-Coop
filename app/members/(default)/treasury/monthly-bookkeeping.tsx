'use client';

import { useState } from 'react';
import { Button } from '@/components/members/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/members/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/members/ui/tabs';
import { Upload } from 'lucide-react';

export default function MonthlyBookkeeping() {
  const [selectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  return (
    <div className="space-y-6">
      {/* Monthly Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl text-slate-800 dark:text-slate-100 font-semibold">
            Monthly Bookkeeping Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Opening Balance
              </div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                £10,809.00
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Total Income
              </div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                +£2,677.75
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Total Payments
              </div>
              <div className="text-lg font-bold text-red-600 dark:text-red-400">
                -£2,100.50
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Closing Balance
              </div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                £11,386.25
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="reconciliation" className="space-y-6">
        <div className="mb-4 sm:mb-0">
          <TabsList className="w-full h-full grid grid-cols-1 sm:grid-cols-3 gap-1">
            <TabsTrigger
              value="reconciliation"
              className="text-sm whitespace-normal h-14 sm:h-10 px-2 py-1.5 data-[state=active]:text-slate-900"
            >
              Bank Reconciliation
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="text-sm whitespace-normal h-14 sm:h-10 px-2 py-1.5 data-[state=active]:text-slate-900"
            >
              Transaction Categories
            </TabsTrigger>
            <TabsTrigger
              value="updates"
              className="text-sm whitespace-normal h-14 sm:h-10 px-2 py-1.5 data-[state=active]:text-slate-900"
            >
              Monthly Updates
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Bank Reconciliation Tab */}
        <TabsContent value="reconciliation" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-md font-medium text-slate-800 dark:text-slate-100">
                  Bank Statement Reconciliation
                </CardTitle>
                <Button className="w-full sm:w-auto text-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Statement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    Reconciliation Checklist
                  </h3>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Download latest bank statement
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Match transactions with co-op records
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Verify opening balance matches previous month
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Check for any unexplained discrepancies
                    </li>
                  </ul>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      Recent Transactions
                    </h3>
                  </div>
                  <div className="p-4 text-sm text-slate-600 dark:text-slate-300">
                    Transaction list will be displayed here...
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium text-slate-800 dark:text-slate-100">
                Transaction Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-100">
                      Income Categories
                    </h3>
                    <ul className="space-y-2">
                      <li>Rent</li>
                      <li>Shop</li>
                      <li>Other</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-100">
                      Expense Categories
                    </h3>
                    <ul className="space-y-2">
                      <li>Rent to PFP</li>
                      <li>Voids Bills</li>
                      <li>Council Tax</li>
                      <li>House 399</li>
                      <li>House 397</li>
                      <li>House 395</li>
                      <li>Maintenance Garden</li>
                      <li>Allotment</li>
                      <li>Bees</li>
                      <li>Maintenance</li>
                      <li>Secretary and PPS</li>
                      <li>Insurance</li>
                      <li>Donations</li>
                      <li>Bank Charges</li>
                      <li>Computer</li>
                      <li>Contingency</li>
                      <li>Training</li>
                      <li>Investments</li>
                      <li>Shop</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Updates Tab */}
        <TabsContent value="updates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium text-slate-800 dark:text-slate-100">
                Monthly Update Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-100">
                    Email Preview
                  </h3>
                  <div className="prose dark:prose-invert max-w-none text-sm">
                    <p>Dear Co-op Members,</p>
                    <p>Here is the treasury report for {selectedMonth}:</p>
                    <ul>
                      <li>Opening Balance: £10,809.00</li>
                      <li>Total Income: £2,677.75</li>
                      <li>Total Payments: £2,100.50</li>
                      <li>Closing Balance: £11,386.25</li>
                    </ul>
                    <p>
                      All transactions have been reconciled with the bank
                      statement.
                    </p>
                  </div>
                </div>
                <Button className="text-sm">Send Update Email</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
