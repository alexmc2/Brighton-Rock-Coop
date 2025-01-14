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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/members/ui/table';
import { Receipt, Plus, Clock, XCircle, CheckCircle } from 'lucide-react';
import NewExpenseClaimModal from './new-expense-claim-modal';

type ExpenseClaim = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'rejected';
  submittedBy: string;
};

const MOCK_CLAIMS: ExpenseClaim[] = [
  {
    id: '1',
    date: '2024-12-15',
    description: 'Maintenance Garden - Winter bulbs and compost',
    amount: 42.5,
    status: 'pending',
    submittedBy: 'Rachel',
  },
  {
    id: '2',
    date: '2024-12-12',
    description: 'House 399 - Replacement oven and installation',
    amount: 449.99,
    status: 'paid',
    submittedBy: 'Rob',
  },
  {
    id: '3',
    date: '2024-12-10',
    description: 'Computer - Printer cartridges for treasury',
    amount: 28.99,
    status: 'paid',
    submittedBy: 'Annie',
  },
  {
    id: '4',
    date: '2024-12-08',
    description: 'House 395 - Living room TV for common area',
    amount: 299.99,
    status: 'pending',
    submittedBy: 'Nayna',
  },
  {
    id: '5',
    date: '2024-12-05',
    description: 'Bees - Winter feeding supplies',
    amount: 22.5,
    status: 'paid',
    submittedBy: 'Paul',
  },
  {
    id: '6',
    date: '2024-12-01',
    description: 'House 397 - Cleaning supplies and equipment',
    amount: 85.75,
    status: 'paid',
    submittedBy: 'Ray',
  },
];

export default function ExpenseClaims() {
  const [claims] = useState<ExpenseClaim[]>(MOCK_CLAIMS);

  const getStatusIcon = (status: ExpenseClaim['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: ExpenseClaim['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'paid':
        return 'Paid';
      case 'rejected':
        return 'Rejected';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg lg:text-xl text-slate-800 dark:text-slate-100 font-semibold">
              Expense Claims
            </CardTitle>
            <div className="flex space-x-2">
              <NewExpenseClaimModal />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Card className="bg-slate-50 dark:bg-slate-900 border-none mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-slate-800 dark:text-slate-100">
                Expense Claims Process
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300">
              Submit expense claims with receipts for co-op related purchases using
              the correct category. Claims will be processed by the treasury team
              within 7 days.
            </CardContent>
          </Card>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[800px] sm:min-w-full inline-block align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm w-[100px]">Date</TableHead>
                    <TableHead className="text-sm min-w-[200px]">Description</TableHead>
                    <TableHead className="text-sm w-[100px]">Amount</TableHead>
                    <TableHead className="text-sm w-[100px]">Submitted By</TableHead>
                    <TableHead className="text-sm w-[100px]">Status</TableHead>
                    <TableHead className="text-right text-sm w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="text-sm">
                        {new Date(claim.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {claim.description}
                      </TableCell>
                      <TableCell className="text-sm">
                        £{claim.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {claim.submittedBy}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(claim.status)}
                          <span className="text-sm">
                            {getStatusText(claim.status)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-sm whitespace-nowrap">
                          <Receipt className="w-4 h-4 mr-2" />
                          View Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
