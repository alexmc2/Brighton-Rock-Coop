// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/members/ui/button';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '@/components/members/ui/card';
// import {
//   Alert,
//   AlertTitle,
//   AlertDescription,
// } from '@/components/members/ui/alert';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/members/ui/table';
// import { FileSpreadsheet, Calendar, AlertCircle } from 'lucide-react';

// export default function AnnualAccounts() {
//   const [selectedYear] = useState('2024');
//   const yearEndDate = '31/12/2024';
//   const fcaDeadline = '31/07/2025';

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <CardTitle className="text-lg lg:text-xl text-slate-800 dark:text-slate-100 font-semibold">
//               Annual Returns & Accounts {selectedYear}
//             </CardTitle>
//             <div className="flex flex-wrap gap-2">
//               <Button variant="outline" className="text-sm">
//                 <Calendar className="w-4 h-4 mr-2" />
//                 Set Reminders
//               </Button>
//               <Button className="text-sm">
//                 <FileSpreadsheet className="w-4 h-4 mr-2" />
//                 Download Templates
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <Alert variant="warning">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle className="text-sm font-semibold">
//               Important Deadlines
//             </AlertTitle>
//             <AlertDescription className="text-sm text-slate-600 dark:text-slate-300">
//               FCA returns must be submitted by {fcaDeadline} (within 7 months of
//               the financial year end {yearEndDate})
//             </AlertDescription>
//           </Alert>

//           <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
//               <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
//                 Previous Year Assets
//               </div>
//               <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
//                 £10,809
//               </div>
//             </div>
//             <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
//               <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
//                 Previous Year Turnover
//               </div>
//               <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
//                 £32,133
//               </div>
//             </div>
//             <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
//               <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
//                 Members
//               </div>
//               <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
//                 12
//               </div>
//             </div>
//             <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
//               <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
//                 Return Status
//               </div>
//               <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
//                 Upcoming
//               </div>
//             </div>
//           </div>

// <Table>
//   <TableHeader>
//     <TableRow>
//       <TableHead className="text-sm">Document</TableHead>
//       <TableHead className="text-sm">Status</TableHead>
//       <TableHead className="text-sm">Deadline</TableHead>
//       <TableHead className="text-right text-sm">Actions</TableHead>
//     </TableRow>
//   </TableHeader>
//   <TableBody>
//     <TableRow>
//       <TableCell className="text-sm">AR30 Annual Return</TableCell>
//       <TableCell>
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//           Not Started
//         </span>
//       </TableCell>
//       <TableCell className="text-sm">{fcaDeadline}</TableCell>
//       <TableCell className="text-right">
//         <Button variant="ghost" size="sm" className="text-sm">
//           <FileSpreadsheet className="w-4 h-4 mr-2" />
//           Prepare
//         </Button>
//       </TableCell>
//     </TableRow>
//     <TableRow>
//       <TableCell className="text-sm">Annual Accounts</TableCell>
//       <TableCell>
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//           Not Started
//         </span>
//       </TableCell>
//       <TableCell className="text-sm">{fcaDeadline}</TableCell>
//       <TableCell className="text-right">
//         <Button variant="ghost" size="sm" className="text-sm">
//           <FileSpreadsheet className="w-4 h-4 mr-2" />
//           Prepare
//         </Button>
//       </TableCell>
//     </TableRow>
//   </TableBody>
// </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// annual-accounts.tsx
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
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/members/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/members/ui/table';
import { FileSpreadsheet, Calendar, AlertCircle } from 'lucide-react';

export default function AnnualAccounts() {
  const [selectedYear] = useState('2024');
  const yearEndDate = '31/12/2024';
  const fcaDeadline = '31/07/2025';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg lg:text-xl text-slate-800 dark:text-slate-100 font-semibold">
              Annual Returns & Accounts {selectedYear}
            </CardTitle>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Set Reminders
              </Button>
              <Button className="w-full sm:w-auto text-sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Templates
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm font-semibold">
              Important Deadlines
            </AlertTitle>
            <AlertDescription className="text-sm text-slate-600 dark:text-slate-300">
              FCA returns must be submitted by {fcaDeadline} (within 7 months of
              the financial year end {yearEndDate})
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Previous Year Assets
              </div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                £10,809
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Previous Year Turnover
              </div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                £32,133
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Members
              </div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                12
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Return Status
              </div>
              <div className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500">
                Upcoming
              </div>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-full inline-block align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm">Document</TableHead>
                    <TableHead className="text-sm">Status</TableHead>
                    <TableHead className="text-sm">Deadline</TableHead>
                    <TableHead className="text-right text-sm">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-sm">
                      AR30 Annual Return
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500">
                        Not Started
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{fcaDeadline}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-sm">
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Prepare
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm">Annual Accounts</TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500">
                        Not Started
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{fcaDeadline}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-sm">
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Prepare
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
