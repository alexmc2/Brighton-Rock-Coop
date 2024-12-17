'use client';

import { useState } from 'react';
import { Button } from '@/components/members/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/members/ui/dialog';
import { Input } from '@/components/members/ui/input';
import { Label } from '@/components/members/ui/label';
import { Textarea } from '@/components/members/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/members/ui/select';
import { Plus, Upload } from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'House 399',
  'House 397',
  'House 395',
  'Maintenance Garden',
  'Allotment',
  'Bees',
  'Maintenance',
  'Secretary and PPS',
  'Insurance',
  'Donations',
  'Bank Charges',
  'Computer',
  'Contingency',
  'Training',
  'Investments',
  'Shop',
  'Other',
];

// Rest of the component remains the same
export default function NewExpenseClaimModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text-sm">
          <Plus className="w-4 h-4 mr-2" />
          New Expense Claim
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] text-sm">
        <DialogHeader>
          <DialogTitle className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
            Submit New Expense Claim
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm text-slate-700 dark:text-slate-300"
            >
              Expense Category
            </Label>
            <Select>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select expense category" />
              </SelectTrigger>
              <SelectContent className="text-sm max-h-[200px]">
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className="text-sm text-slate-700 dark:text-slate-300"
            >
              Amount (£)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm text-slate-700 dark:text-slate-300"
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the expense..."
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-slate-700 dark:text-slate-300">
              Receipt Upload
            </Label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <Button variant="outline" className="w-full text-sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Receipt
              </Button>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-sm">
              Submit Claim
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
