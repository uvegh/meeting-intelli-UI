'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import PrintButton from '@/components/PrintButton';
import { meetingsApi } from '@/lib/api';
import useMeetingContext from '@/hooks/MeetingContext';
// ← Consumes context

export default function MeetingActions() {
// Gets meeting from context - no props needed!
    const { meeting } = useMeetingContext();
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();
const {delete: deleteMeeting} = meetingsApi;
    const handleDelete = async () => {
        if(!meeting||!meeting?.id) throw new Error('No meeting found in context');     
        setDeleting(true);
        try {
            await deleteMeeting(meeting.id);
            toast.success('Meeting deleted');
            router.push('/meetings');
            router.refresh();
        } catch (error) {
            toast.error('Failed to delete meeting');
            
            setDeleting(false);
            console.log('Error deleting meeting:', error);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <PrintButton type="detail" meetingId={meeting.id} />

            <Button variant="outline" asChild>
                <Link href={`/meetings/${meeting.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                </Link>
            </Button>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={deleting}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete &quot;{meeting.title}&quot; and all
                            associated AI summaries and action items.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? 'Deleting...' : 'Delete Meeting'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}