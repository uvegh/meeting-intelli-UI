import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { viewportWidth, viewportHeight } = body || {};
    console.log('Generating PDF for meeting with id:', id, 'with viewport:', viewportWidth, viewportHeight);
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/meetings/${id}/pdf`,
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

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="meeting-${id}-${new Date().toISOString().split('T')[0]}.pdf"`,
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