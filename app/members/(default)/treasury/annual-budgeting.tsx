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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/members/ui/table';
import { Progress } from '@/components/members/ui/progress';
import { FileSpreadsheet, AlertTriangle } from 'lucide-react';

export default function AnnualBudgeting() {
  const [selectedYear] = useState(new Date().getFullYear().toString());

  return (
    <div className="space-y-6">
      {/* Budget Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg lg:text-xl text-slate-800 dark:text-slate-100 font-semibold">
              Annual Budget {selectedYear}/{parseInt(selectedYear) + 1}
            </CardTitle>
            <Button variant="outline" className="w-full sm:w-auto text-sm">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Download Budget Spreadsheet
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Total Budget
              </div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                £32,133.00
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Spent to Date
              </div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                £24,099.75
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Remaining
              </div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                £8,033.25
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="proposals" className="space-y-6">
        <div className="mb-4 sm:mb-0">
          <TabsList className="w-full h-full grid grid-cols-2 sm:grid-cols-3 gap-1">
            <TabsTrigger
              value="proposals"
              className="text-sm whitespace-normal h-14 sm:h-10 px-2 py-1.5 data-[state=active]:text-slate-900"
            >
              Budget Proposals
            </TabsTrigger>
            <TabsTrigger
              value="tracking"
              className="text-sm whitespace-normal h-14 sm:h-10 px-2 py-1.5 data-[state=active]:text-slate-900"
            >
              Budget Tracking
            </TabsTrigger>
            <TabsTrigger
              value="anomalies"
              className="text-sm whitespace-normal h-14 sm:h-10 px-2 py-1.5 data-[state=active]:text-slate-900"
            >
              Anomaly Reports
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Budget Proposals Tab */}
        <TabsContent value="proposals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium text-slate-800 dark:text-slate-100">
                Budget Proposals for AGM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm">Proposal</TableHead>
                      <TableHead className="text-sm">Total Amount</TableHead>
                      <TableHead className="text-sm">Key Changes</TableHead>
                      <TableHead className="text-sm">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-sm">
                        Proposal A - Conservative
                      </TableCell>
                      <TableCell className="text-sm">£32,133</TableCell>
                      <TableCell className="text-sm">
                        Maintain current budget levels
                      </TableCell>
                      <TableCell>
                        <span className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
                          Draft
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">
                        Proposal B - Growth
                      </TableCell>
                      <TableCell className="text-sm">£35,000</TableCell>
                      <TableCell className="text-sm">
                        Increased maintenance and contingency funds
                      </TableCell>
                      <TableCell>
                        <span className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-500">
                          Ready for AGM
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Tracking Tab */}
        <TabsContent value="tracking" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium text-slate-800 dark:text-slate-100">
                Budget vs Actual Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Rent to PFP */}
              <div className="space-y-6 text-sm">
                {/* Rent to PFP */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Rent to PFP
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £17,038 / £28,080
                    </span>
                  </div>
                  <Progress value={61} />
                </div>

                {/* Voids Bills */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Voids Bills
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £0 / £450
                    </span>
                  </div>
                  <Progress
                    value={0}
                    className="bg-slate-200 dark:bg-slate-800"
                  />
                </div>

                {/* Council Tax */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Council Tax
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £4,902 / £7,014
                    </span>
                  </div>
                  <Progress value={70} />
                </div>

                {/* House 399 */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      House 399
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £28 / £700
                    </span>
                  </div>
                  <Progress
                    value={4}
                    className="bg-emerald-200 dark:bg-emerald-800"
                  />
                </div>

                {/* House 397 */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      House 397
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £698 / £700
                    </span>
                  </div>
                  <Progress value={99} className="bg-red-200 dark:bg-red-800" />
                </div>

                {/* House 395 */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      House 395
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £212 / £700
                    </span>
                  </div>
                  <Progress
                    value={30}
                    className="bg-emerald-200 dark:bg-emerald-800"
                  />
                </div>

                {/* Maintenance Garden */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Maintenance Garden
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £426 / £550
                    </span>
                  </div>
                  <Progress
                    value={77}
                    className="bg-amber-200 dark:bg-amber-800"
                  />
                </div>

                {/* Allotment */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Allotment
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £0 / £0
                    </span>
                  </div>
                  <Progress
                    value={0}
                    className="bg-slate-200 dark:bg-slate-800"
                  />
                </div>

                {/* Bees */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Bees
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £212 / £250
                    </span>
                  </div>
                  <Progress
                    value={85}
                    className="bg-yellow-200 dark:bg-yellow-800"
                  />
                </div>

                {/* Maintenance */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Maintenance
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £138 / £350
                    </span>
                  </div>
                  <Progress
                    value={39}
                    className="bg-blue-200 dark:bg-blue-800"
                  />
                </div>

                {/* Secretary and PPS */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Secretary and PPS
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £12 / £150
                    </span>
                  </div>
                  <Progress
                    value={8}
                    className="bg-emerald-200 dark:bg-emerald-800"
                  />
                </div>

                {/* Insurance */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Insurance
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £0 / £280
                    </span>
                  </div>
                  <Progress
                    value={0}
                    className="bg-slate-200 dark:bg-slate-800"
                  />
                </div>

                {/* Donations */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Donations
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £0 / £0
                    </span>
                  </div>
                  <Progress
                    value={0}
                    className="bg-slate-200 dark:bg-slate-800"
                  />
                </div>

                {/* Bank Charges */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Bank Charges
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £0 / £0
                    </span>
                  </div>
                  <Progress
                    value={0}
                    className="bg-slate-200 dark:bg-slate-800"
                  />
                </div>

                {/* Computer */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Computer
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £0 / £0
                    </span>
                  </div>
                  <Progress
                    value={0}
                    className="bg-slate-200 dark:bg-slate-800"
                  />
                </div>

                {/* Contingency */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Contingency
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £0 / £1,000
                    </span>
                  </div>
                  <Progress
                    value={0}
                    className="bg-slate-200 dark:bg-slate-800"
                  />
                </div>

                {/* Training */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Training
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £0 / £250
                    </span>
                  </div>
                  <Progress
                    value={0}
                    className="bg-slate-200 dark:bg-slate-800"
                  />
                </div>

                {/* Investments */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Investments
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £0 / £0
                    </span>
                  </div>
                  <Progress
                    value={0}
                    className="bg-slate-200 dark:bg-slate-800"
                  />
                </div>

                {/* Misc */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Misc
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £0 / £0
                    </span>
                  </div>
                  <Progress
                    value={0}
                    className="bg-slate-200 dark:bg-slate-800"
                  />
                </div>

                {/* Shop */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Shop
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      £316 / £0
                    </span>
                  </div>
                  <Progress
                    value={100}
                    className="bg-red-200 dark:bg-red-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anomaly Reports Tab */}
        <TabsContent value="anomalies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium text-slate-800 dark:text-slate-100">
                Budget Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                    <h3 className="font-semibold text-amber-900 dark:text-amber-500">
                      Maintenance Budget Alert
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-amber-800 dark:text-amber-400">
                    Maintenance spending is at 80% of budget with 3 months
                    remaining in the financial year. This will need to be
                    discussed at the next general meeting.
                  </p>
                </div>

                <Button variant="outline" className="w-full text-sm">
                  Generate Report for General Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
