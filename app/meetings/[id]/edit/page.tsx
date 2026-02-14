'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { meetingsApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  meetingDate: z.string().min(1, 'Meeting date is required'),
  attendees: z.string().min(1, 'At least one attendee is required').max(500, 'Too many attendees'),
  notes: z.string().min(10, 'Notes must be at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditMeetingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
const { id } = useParams();
    const idString = String(id);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      meetingDate: '',
      attendees: '',
      notes: '',
    },
  });

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const meeting = await meetingsApi.getById(idString);
        
        // Format date for datetime-local input
        const formattedDate = new Date(meeting.meetingDate).toISOString().slice(0, 16);
        
        form.reset({
          title: meeting.title,
          meetingDate: formattedDate,
          attendees: meeting.attendees,
          notes: meeting.notes,
        });
      } catch (error) {
        console.error('Failed to fetch meeting:', error);
        toast.error('Failed to load meeting');
        router.push('/meetings');
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [  idString, form, router]);

  const onSubmit = async (data: FormValues) => {
    setSaving(true);

    try {
      await meetingsApi.update(idString, data);

      toast.success('Meeting updated successfully', {
        description: 'AI is re-analyzing your notes...',
      });

      router.push(`/meetings/${idString}`);
    } catch (error) {
      console.error('Failed to update meeting:', error);
      toast.error('Failed to update meeting', {
        description: 'Please try again later.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/meetings/${idString}`}>  
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to meeting
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Edit Meeting</CardTitle>
            <CardDescription className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              AI will re-analyze your notes and update action items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Q1 Planning Meeting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meetingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="attendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attendees</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith, Sarah Johnson, Mike Chen" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of attendee names
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

    <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What was discussed? Include action items like 'John will prepare the report by Friday'"
                          className="min-h-50"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include action items with assignees and deadlines for AI extraction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button type="submit" disabled={saving} className="flex-1  bg-linear-to-r  text-white from-blue-500 to-purple-600">
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating meeting...
                      </>
                    ) : (
                      'Update Meeting'
                    )}
                  </Button>
                  <Button  type="button" variant="outline" asChild>
                    <Link href={`/meetings/${idString}`}>Cancel</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}