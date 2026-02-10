// import Link from 'next/link';
// import { Meeting } from '@/lib/types';
// import MeetingCard from '@/components/MeetingCard';
// import MeetingChart from '@/components/MeetingChart';
// import PrintButton from '@/components/PrintButton';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';

// // Fetch meetings directly on server
// async function getMeetings(): Promise<Meeting[]> {
//   try {
//     const response = await fetch(
//       `${process.env.BACKEND_API_URL}/api/meetings`,
//       {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         cache: 'no-store', // Always get fresh data
//       }
//     );

//     if (!response.ok) {
//       console.error('Failed to fetch meetings');
//       return [];
//     }

//     const data = await response.json();
//     return data.data || [];
//   } catch (error) {
//     console.error('Failed to fetch meetings:', error);
//     return [];
//   }
// }

// // Server Component (async)
// export default async function MeetingsPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ print?: string }>;
// }) {
//   // Fetch meetings
//   const meetings = await getMeetings();
//   const isPrintMode =  (await searchParams)?.print === 'true';

//   // Calcate chart data on server
//   const chartData = meetings?.reduce((acc, meeting) => {
//     const date = new Date(meeting?.meetingDate);
//     const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
//     const existing = acc.find(item => item?.month === monthKey);
//     if (existing) {
//       existing.count += 1;
//     } else {
//       acc.push({ month: monthKey, count: 1 });
//     }
//     return acc;
//   }, [] as { month: string; count: number }[]);

//   return (
//     <div className="min-h-screen  bg-background py-8" data-pdf-ready="true">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
//         {/* Header */}
//         <div className="flex flex-colsm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Meetings Dashboard</h1>
//             <p className="text-muted-foreground mt-1">AI-powered meeting management</p>
//           </div>
          
//           {!isPrintMode && (
//             <div className="flex gap-3">
//               <PrintButton type="list" />
//               <Button 
//                 className="bg-linear-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700" 
//                 asChild
//               >
//                 <Link href="/meetings/new">
//                   <Plus className="w-4 h-4 mr-2" />
//                   New Meeting
//                 </Link>
//               </Button>
//             </div>
//           )}
//         </div>

//         {meetings.length > 0 ? (
//           <>
//             {/* Charts */}
//             <MeetingChart data={chartData}  />
            
//             {/* Meetings Grid */}
//             <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {meetings.map((meeting) => (
//                 <MeetingCard key={meeting.id} meeting={meeting} />
//               ))}
//             </div>
//           </>
//         ) : (
//           <div className="text-center py-32">
//             <div className="max-w-md mx-auto">
//               <h3 className="text-xl font-semibold mb-2">No meetings yet</h3>
//               <p className="text-muted-foreground mb-6">Create your first meeting to get started!</p>
//               <Button 
//                 asChild 
//                 size="lg"
//                 className="bg-linear-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
//               >
//                 <Link href="/meetings/new">
//                   <Plus className="w-4 h-4 mr-2" />
//                   Create Meeting
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { meetingsApi } from '@/lib/api';
import MeetingCard from '@/components/MeetingCard';
import MeetingChart from '@/components/MeetingChart';
import ActionItemsChart from '@/components/ActionItemsChart'; 
import PrintButton from '@/components/PrintButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Meeting } from '@/lib/types';

async function getMeetings() {
  return await meetingsApi.getAll();
}

export default async function MeetingsPage({ 
  searchParams 
}: { 
  searchParams: { print?: string } 
}) {

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

    const data = await response?.json();
    return data?.data || [];
  } catch (error) {
    console.error('Failed to fetch meetings:', error);
    return [];
  }
}
  const meetings = await getMeetings();
  const isPrintMode = searchParams?.print === 'true';

  // Calculate chart data
  const chartData = meetings.reduce((acc, meeting) => {
    const month = meeting.meetingDate.substring(0, 7); // YYYY-MM
    const existing = acc.find((d) => d.month === month);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ month, count: 1 });
    }
    return acc;
  }, [] as { month: string; count: number }[]);

  // Calculate action items by priority
  const actionItemsData = meetings.reduce((acc, meeting) => {
    meeting.actionItems?.forEach((item) => {
      const priority = item.priority || 'Medium';
      acc[priority] = (acc[priority] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto px-4 py-8" data-pdf-ready="true">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Meetings Dashboard</h1>
          <p className="text-muted-foreground mt-2">AI-powered meeting management</p>
        </div>
        {!isPrintMode && (
          <div className="flex gap-2">
            <PrintButton type="list" />
            <Button asChild>
              <Link href="/meetings/new">
                <Plus className="w-4 h-4 mr-2" />
                New Meeting
              </Link>
            </Button>
          </div>
        )}
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="chart-container">
          <h2 className="text-xl font-semibold mb-4">Meetings by Month</h2>
          <MeetingChart data={chartData} />
        </div>
        <div className="chart-container">
          <h2 className="text-xl font-semibold mb-4">Action Items by Priority</h2>
          <ActionItemsChart data={actionItemsData} />
        </div>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting?.id} meeting={meeting} />
        ))}
      </div>
    </div>
  );
}