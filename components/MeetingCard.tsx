import Link from 'next/link';
import { Meeting } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface MeetingCardProps {
  meeting: Meeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const actionItemCount = meeting.actionItems?.length || 0;

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="line-clamp-2">{meeting.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {meeting.summary || meeting.notes}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 shrink-0" />
              <span>{format(new Date(meeting.meetingDate), 'MMM d, yyyy')}</span>
            </div>

            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 hrink-0" />
              <span className="truncate">{meeting.attendees}</span>
            </div>

            {actionItemCount > 0 && (
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 shrink-0 text-primary" />
                <Badge variant="secondary">
                  {actionItemCount} action {actionItemCount === 1 ? 'item' : 'items'}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// import Link from 'next/link';
// import { Meeting } from '@/lib/types';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Calendar, Users, CheckCircle } from 'lucide-react';
// import { format } from 'date-fns';

// interface MeetingCardProps {
//   meeting: Meeting;
// }

// export default function MeetingCard({ meeting }: MeetingCardProps) {
//   const actionItemCount = meeting.actionItems?.length || 0;

//   return (
//     <Link href={`/meetings/${meeting.id}`}>
//       <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full meeting-card">
//         <CardHeader>
//           <CardTitle className="line-clamp-2">{meeting?.title}</CardTitle>
//           <CardDescription className="line-clamp-2">
//             {meeting?.summary || meeting?.notes}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2 text-sm text-muted-foreground">
//             <div className="flex items-center">
//               <Calendar className="w-4 h-4 mr-2 shrink-0" />
//               <span>{format(new Date(meeting?.meetingDate), 'MMM d, yyyy')}</span>
//             </div>

//             <div className="flex items-center">
//               <Users className="w-4 h-4 mr-2 shrink-0" />
//               <span className="truncate">{meeting.attendees}</span>
//             </div>

//             {actionItemCount > 0 && (
//               <div className="flex items-center">
//                 <CheckCircle className="w-4 h-4 mr-2 shrink-0 text-primary" />
//                 <Badge variant="secondary">
//                   {actionItemCount} action {actionItemCount === 1 ? 'item' : 'items'}
//                 </Badge>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }