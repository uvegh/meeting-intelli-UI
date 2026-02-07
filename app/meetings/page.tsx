'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Meeting, ChartData } from '@/lib/types';
import MeetingCard from '@/components/MeetingCard';

import PrintButton from '@/components/PrintButton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import MeetingChart from '@/components/MeetingChart';
import { meetingsApi } from '@/lib/api';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const isPrintMode = searchParams.get('print') === 'true';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meetingsData, statsData] = await Promise.all([
          meetingsApi.getAll(),
          meetingsApi.getStatistics(),
        ]);
        setMeetings(meetingsData);
        setChartData(statsData.byMonth);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-64 w-full" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8" data-pdf-ready={!loading}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meetings Dashboard</h1>
            <p className="text-muted-foreground mt-1">AI-powered meeting management</p>
          </div>
          
          {!isPrintMode && (
            <div className="flex gap-3">
              <PrintButton type="list" />
              <Button className='border border-primary bg-linear-to-r text-white from-blue-500 to-purple-600' asChild>
                <Link href="/meetings/new">
                  <Plus className="w-4 h-4 mr-2 text-white " />
                  New Meeting
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Meetings by Month</h2>
          <MeetingChart data={chartData} />
        </div>

        {/* Meetings Grid */}
        {meetings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No meetings found</p>
            <Button asChild>
              <Link href="/meetings/new">Create your first meeting</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}