'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { meetingsApi } from '@/lib/api';
import { Meeting } from '@/lib/types';
import ActionItemsTable from '@/components/ActionItemsTable';
import PrintButton from '@/components/PrintButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Users, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function MeetingDetailPage({ params }: { params: { id: string } }) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const isPrintMode = searchParams.get('print') === 'true';
  const {id}=useParams();
  useEffect(() => {
  
    const fetchMeeting = async () => {
      try {
        const data = await meetingsApi.getById(id);
        setMeeting(data);
      } catch (error) {
        console.error('Failed to fetch meeting:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  },[id]);

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
            <CardDescription>The meeting you&apos;re looking for doesn &apos;t exist.</CardDescription>
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
        {/* Header */}
        <div className="mb-6">
          {!isPrintMode && (
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/meetings">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to meetings
              </Link>
            </Button>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight break-words">{meeting.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground text-sm">
                <span className="inline-flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(meeting.meetingDate), 'MMMM d, yyyy')}
                </span>
                <span className="inline-flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {meeting.attendees}
                </span>
              </div>
            </div>

            {!isPrintMode && <PrintButton type="detail" meetingId={ String(id)} />}
          </div>
        </div>

        {/* AI Summary */}
        {meeting?.summary && (
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