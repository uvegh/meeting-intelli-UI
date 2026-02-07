'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { ArrowLeft, Loader2, Plus, Sparkles } from 'lucide-react';
import { meetingsApi } from '@/lib/api';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  meetingDate: z.string().min(1, 'Meeting date is required'),
  attendees: z.string().min(1, 'At least one attendee is required').max(500, 'Too many attendees'),
  notes: z.string().min(10, 'Notes must be at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewMeetingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      meetingDate: new Date().toISOString().slice(0, 16),
      attendees: '',
      notes: '',
    },
  });

  
  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {
      const meeting = await meetingsApi.create(data);
console.log('Created meeting:', meeting);
      toast.success('Meeting created successfully', {
        description: 'AI is extracting action items from your notes...',
      });

      router.push(`/meetings/${meeting.id}`);
    } catch (error) {
      console.error('Failed to create meeting:', error);
      toast.error('Failed to create meeting', {
        description: 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/meetings">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to meetings
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Create New Meeting</CardTitle>
            <CardDescription className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              AI will automatically extract action items from your notes
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
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating meeting...
                      </>
                    ) : (
                          <Button className='border border-primary bg-linear-to-r text-white from-blue-500 to-purple-600' asChild>
                <div className=' cursor-pointer flex items-center justify-center w-full'>

             
                  {/* <Plus className="w-4 h-4 mr-2 text-white " /> */}
                  Create Meeting
                     </div>

              </Button>
                    
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/meetings">Cancel</Link>
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