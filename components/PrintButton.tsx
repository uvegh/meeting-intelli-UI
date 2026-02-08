'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Printer, Loader2 } from 'lucide-react';

interface PrintButtonProps {
  type: 'list' | 'detail';
  meetingId?: string;
}

export default function PrintButton({ type, meetingId }: PrintButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    setLoading(true);

    try {
      const endpoint =
        type === 'list'
          ? '/api/meetings/pdf/list'
          : `/api/meetings/${meetingId}/pdf`;

      const response = await fetch(endpoint, {
        method: 'POST',
      });

      if (!response.ok) {
        console.log('PDF generation failed:', response);
        throw new Error('PDF generation failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        type === 'list'
          ? `meetings-overview-${new Date().toISOString().split('T')[0]}.pdf`
          : `meeting-${meetingId}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF generated successfully', {
        description: 'Your PDF has been downloaded.',
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('PDF generation failed', {
        description: 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePrint} disabled={loading} variant="outline">
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Printer className="w-4 h-4 mr-2" />
          Print PDF
        </>
      )}
    </Button>
  );
}