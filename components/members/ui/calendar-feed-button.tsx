'use client';

import { Button } from '@/components/ui/button';
import { Calendar, Copy } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/members/ui/alert-dialog';
import { useState, useEffect } from 'react';

export default function CalendarFeedButton() {
  const [copied, setCopied] = useState(false);
  const [feedUrl, setFeedUrl] = useState('');

  useEffect(() => {
    setFeedUrl(`${window.location.origin}/members/api/calendar`);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="flex items-center gap-2 dark:bg-coop-600 "
        >
          <Calendar className="h-4 w-4" />
          Subscribe to Calendar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Subscribe to Calendar</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="mt-2 flex items-center gap-2 rounded-md bg-muted p-3">
              <code className="text-sm">{feedUrl}</code>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy URL</span>
              </Button>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Google Calendar:</p>
              <ol className="list-decimal pl-4 text-sm">
                <li>Click + next to "Other calendars"</li>
                <li>Select "From URL" and paste the URL</li>
              </ol>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Apple Calendar:</p>
              <ol className="list-decimal pl-4 text-sm">
                <li>File {'>'} New Calendar Subscription</li>
                <li>Paste the URL and click Subscribe</li>
              </ol>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Done</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
