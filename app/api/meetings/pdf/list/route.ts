
import { NextResponse } from 'next/server';

export async function POST(request:Request) {
  try {
    const body =await request.json();
    const { viewportWidth, viewportHeight } = body || {};
  
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/meetings/pdf/list`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         body: JSON.stringify({
          viewportWidth,
          viewportHeight,
        }),
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error('Failed to generate PDF');

    }
      console.log('Generating PDF for meetings overview with viewport:', viewportWidth, viewportHeight);
console.log('PDF generation response:', response);
    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="meetings-overview-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}