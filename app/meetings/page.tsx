import Link from 'next/link';
import { Meeting } from '@/lib/types';
import MeetingCard from '@/components/MeetingCard';
import MeetingChart from '@/components/MeetingChart';
import PrintButton from '@/components/PrintButton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Fetch meetings directly on server
async function getMeetings(): Promise<Meeting[]> {
  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/meetings`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Always get fresh data
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch meetings');
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch meetings:', error);
    return [];
  }
}

// Server Component (async)
export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ print?: string }>;
}) {
  // Fetch data on server
  const meetings = await getMeetings();
  const isPrintMode =  (await searchParams)?.print === 'true';

  // Calculate chart data on server
  const chartData = meetings.reduce((acc, meeting) => {
    const date = new Date(meeting?.meetingDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const existing = acc.find(item => item.month === monthKey);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ month: monthKey, count: 1 });
    }
    return acc;
  }, [] as { month: string; count: number }[]);

  return (
    <div className="min-h-screen bg-background py-8" data-pdf-ready="true">
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
              <Button 
                className="bg-linear-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700" 
                asChild
              >
                <Link href="/meetings/new">
                  <Plus className="w-4 h-4 mr-2" />
                  New Meeting
                </Link>
              </Button>
            </div>
          )}
        </div>

        {meetings.length > 0 ? (
          <>
            {/* Charts */}
            <MeetingChart data={chartData}  />
            
            {/* Meetings Grid */}
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {meetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-32">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">No meetings yet</h3>
              <p className="text-muted-foreground mb-6">Create your first meeting to get started!</p>
              <Button 
                asChild 
                size="lg"
                className="bg-linear-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
              >
                <Link href="/meetings/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Meeting
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}