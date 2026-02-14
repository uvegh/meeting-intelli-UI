import { NextResponse } from 'next/server';

// GET    /api/meetings/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/meetings/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
     
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch meeting');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meeting' },
      { status: 500 }
    );
  }
}

// PUT    /api/meetings/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;    
   
    const body = await request.json();
 console.log("body from meeting",body);        
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/meetings/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update meeting');
    }

    // const data = await response.json();
    return NextResponse.json({
        success: true,
    });
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json(
      { error: 'Failed to update meeting' },
      { status: 500 }
    );
  }
}

//api/delete/meetings/[id]

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/meetings/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete meeting');
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json(
      { error: 'Failed to delete meeting' },
      { status: 500 }
    );
  }
}