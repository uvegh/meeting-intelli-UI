'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { meetingsApi } from '@/lib/api';
import { Meeting } from '@/lib/types';
import ActionItemsTable from '@/components/ActionItemsTable';
import PrintButton from '@/components/PrintButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Users, Sparkles, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface MeetingDetailPageProps {
  params: { id: string };
}

export default function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const searchParams = useSearchParams();

  const router = useRouter();
  const {id}= useParams();
  const isPrintMode = searchParams.get('print') === 'true';

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const data = await meetingsApi.getById( String(id));
        setMeeting(data);
      } catch (error) {
        console.error('Failed to fetch meeting:', error);
        toast.error('Failed to load meeting');
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id]);

  const handleDelete = async () => {
    if (!meeting) return;
    
    setDeleting(true);
    try {
      await meetingsApi.delete(String(id));
      toast.success('Meeting deleted successfully');
      router.push('/meetings');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete meeting:', error);
      toast.error('Failed to delete meeting', {
        description: 'Please try again later.',
      });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Meeting not found</CardTitle>
            <CardDescription>The meeting you&rsquo;re looking for doesn&rsquo;t exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/meetings">Back to meetings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8" data-pdf-ready={!loading}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        {!isPrintMode && (
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/meetings">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to meetings
            </Link>
          </Button>
        )}

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
            {/* Title and Meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold tracking-tight wrap-break-words">
                {meeting.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground text-sm">
                <span className="inline-flex items-center">
                  <Calendar className="w-4 h-4 mr-2 shrink-0" />
                  {format(new Date(meeting.meetingDate), 'MMMM d, yyyy')}
                </span>
                <span className="inline-flex items-center">
                  <Users className="w-4 h-4 mr-2 shrink-0" />
                  {meeting.attendees}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {!isPrintMode && (
              <div className="flex flex-wrap items-center gap-2">
                <PrintButton type="detail" meetingId={ String(id)} />
                
                <Button variant="outline" asChild>
                  <Link href={`/meetings/${id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className='cursor-pointer bg-red-300 text-destructive-foreground hover:bg-red-500'
                      variant="destructive" 
                      disabled={deleting}
                    >
                      <Trash2 className="w-4 h-4 mr-2 text-black cursor-pointer hover:animate-pulse" />
                      {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the meeting
                        &quot;{meeting.title}&quot; and all associated data including AI-generated 
                        summaries and action items.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={deleting} className='bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer'>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-400 text-destructive-foreground hover:bg-red-600 cursor-pointer"
                      >
                        {deleting ? 'Deleting...' : 'Delete Meeting'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>

        {/* AI Summary */}
        {meeting.summary && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                AI-Generated Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{meeting.summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Meeting Notes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Meeting Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {meeting.notes}
            </p>
          </CardContent>
        </Card>

        {/* Action Items */}
        {meeting.actionItems && meeting.actionItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>AI-Extracted Action Items</CardTitle>
              <CardDescription>
                Automatically extracted from meeting notes using Claude AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActionItemsTable actionItems={meeting.actionItems} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}